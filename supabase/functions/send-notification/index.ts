import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, threatType, severity, description } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's notification settings
    const { data: settings } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!settings) {
      return new Response(
        JSON.stringify({ error: "Notification settings not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if we should send notification for critical threats
    if (severity === "critical" && settings.email_critical_threats) {
      // Get user email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (!profile) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Email sending would be implemented here with Resend or similar service
      // For now, we'll just log the notification
      console.log("Critical threat notification for:", profile.email);
      console.log("Threat:", threatType, description);

      // If RESEND_API_KEY is configured, send email
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "SafeLaylar <notifications@safelaylar.com>",
              to: [profile.email],
              subject: `🛡️ Critical Threat Alert: ${threatType}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #ef4444;">Critical Threat Blocked</h1>
                  <p>We've detected and blocked a critical threat to your safety:</p>
                  <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h3 style="margin: 0 0 8px 0; color: #dc2626;">${threatType}</h3>
                    <p style="margin: 0; color: #7f1d1d;">${description}</p>
                  </div>
                  <p>Your safety score and detailed threat information are available in your dashboard.</p>
                  <a href="https://your-app-url.com/dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Dashboard</a>
                </div>
              `,
            }),
          });

          if (!response.ok) {
            console.error("Failed to send email:", await response.text());
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});