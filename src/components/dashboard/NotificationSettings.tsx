import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  userId: string;
}

const NotificationSettings = ({ userId }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState({
    email_critical_threats: true,
    email_daily_summary: false,
    email_weekly_summary: true,
    network_activity_alerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setSettings({
        email_critical_threats: data.email_critical_threats ?? true,
        email_daily_summary: data.email_daily_summary ?? false,
        email_weekly_summary: data.email_weekly_summary ?? true,
        network_activity_alerts: data.network_activity_alerts ?? true,
      });
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("notification_settings")
      .update(settings)
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    }
    setSaving(false);
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const notificationOptions = [
    {
      key: "email_critical_threats" as const,
      label: "Critical Threat Alerts",
      description: "Immediate email alerts when critical threats are blocked",
    },
    {
      key: "email_daily_summary" as const,
      label: "Daily Safety Summary",
      description: "Daily email with your protection activity and safety score",
    },
    {
      key: "email_weekly_summary" as const,
      label: "Weekly Safety Report",
      description: "Comprehensive weekly report of threats and protection stats",
    },
    {
      key: "network_activity_alerts" as const,
      label: "Safety Network Updates",
      description: "Notifications about your safety network connections",
    },
  ];

  if (loading) {
    return (
      <Card className="bg-card border-border/50 shadow-soft">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex-1 space-y-1">
                <Label htmlFor={option.key} className="text-base font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Switch
                id={option.key}
                checked={settings[option.key]}
                onCheckedChange={(checked) => updateSetting(option.key, checked)}
              />
            </div>
          ))}
        </div>

        <Button onClick={saveSettings} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;