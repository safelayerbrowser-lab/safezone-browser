import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are SafeLaylar's AI Safety Advisor - a friendly, knowledgeable assistant dedicated to helping users stay safe online. You specialize in:

1. **Online Safety Education**: Explaining common threats like phishing, scams, grooming, and cyberbullying in simple terms
2. **Practical Tips**: Providing actionable advice for staying safe on social media, dating apps, messaging platforms, and browsing
3. **Threat Recognition**: Helping users identify warning signs of online threats
4. **Privacy Protection**: Advising on privacy settings, secure passwords, and protecting personal information
5. **Support Resources**: Directing users to appropriate resources if they've experienced online harm

Guidelines:
- Be warm, supportive, and non-judgmental
- Use simple, clear language appropriate for all ages
- Provide specific, actionable advice
- If someone describes experiencing abuse or harm, express empathy and suggest appropriate professional resources
- Never share harmful content or detailed instructions that could enable threats
- Keep responses concise but helpful (2-3 paragraphs max unless more detail is requested)
- Use emoji sparingly to keep a friendly tone 🛡️

You're here to empower users with knowledge and practical tools to protect themselves online.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, isDemo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Limit demo users to shorter conversations
    const messageLimit = isDemo ? 5 : 50;
    const limitedMessages = messages.slice(-messageLimit);

    console.log(`Processing chat request. Demo mode: ${isDemo}, Messages: ${limitedMessages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...limitedMessages,
        ],
        stream: true,
        max_tokens: isDemo ? 500 : 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Safety chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
