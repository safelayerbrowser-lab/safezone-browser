import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSettingsProps {
  userId: string;
}

const FilterSettings = ({ userId }: FilterSettingsProps) => {
  const [settings, setSettings] = useState({
    content_protection: true,
    anti_grooming: true,
    romance_scam_alerts: true,
    deepfake_detection: true,
    spyware_protection: true,
    sensitivity_level: "medium",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("filter_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setSettings({
        content_protection: data.content_protection,
        anti_grooming: data.anti_grooming,
        romance_scam_alerts: data.romance_scam_alerts,
        deepfake_detection: data.deepfake_detection,
        spyware_protection: data.spyware_protection,
        sensitivity_level: data.sensitivity_level,
      });
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("filter_settings")
      .update(settings)
      .eq("user_id", userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Your protection preferences have been updated",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card className="bg-card border-border/50 shadow-soft">
        <CardContent className="p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const protectionOptions = [
    {
      key: "content_protection",
      title: "Content Protection",
      description: "Filter explicit, degrading, and harmful content",
    },
    {
      key: "anti_grooming",
      title: "Anti-Grooming Engine",
      description: "Detect suspicious behavior patterns and grooming attempts",
    },
    {
      key: "romance_scam_alerts",
      title: "Romance Scam Alerts",
      description: "Identify manipulative behavior and scam-risk profiles",
    },
    {
      key: "deepfake_detection",
      title: "Deepfake Detection",
      description: "Alert when accessing manipulated media content",
    },
    {
      key: "spyware_protection",
      title: "Spyware & Phishing Protection",
      description: "Block unsafe links and malicious scripts",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Protection Filters</CardTitle>
          <CardDescription>
            Customize which types of threats SafeLaylar should protect you from
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {protectionOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-start justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex-1 pr-4">
                <Label htmlFor={option.key} className="text-base font-semibold cursor-pointer">
                  {option.title}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
              <Switch
                id={option.key}
                checked={settings[option.key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, [option.key]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Sensitivity Level</CardTitle>
          <CardDescription>
            Adjust how aggressively SafeLaylar filters content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.sensitivity_level}
            onValueChange={(value) =>
              setSettings({ ...settings, sensitivity_level: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div>
                  <div className="font-medium">Low Sensitivity</div>
                  <div className="text-xs text-muted-foreground">
                    Only block obvious threats
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div>
                  <div className="font-medium">Medium Sensitivity (Recommended)</div>
                  <div className="text-xs text-muted-foreground">
                    Balanced protection
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div>
                  <div className="font-medium">High Sensitivity</div>
                  <div className="text-xs text-muted-foreground">
                    Maximum protection, may have false positives
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} size="lg" className="px-8">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default FilterSettings;
