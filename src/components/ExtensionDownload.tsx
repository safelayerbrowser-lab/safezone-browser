import { useState } from "react";
import { Smartphone, Apple, Chrome, Globe, Download, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const platforms = [
  {
    id: "android",
    name: "Android",
    icon: Smartphone,
    primary: true,
    downloadPath: "/install",
    instructions: [
      "Visit SafeLaylar website on your Android device",
      "Tap 'Add to Home Screen' in the browser menu",
      "Or download our standalone APK from the install page",
      "Enable all permissions for full protection",
      "SafeLaylar will run in the background!",
    ],
  },
  {
    id: "safari",
    name: "Safari (iOS)",
    icon: Apple,
    primary: true,
    downloadPath: "/extensions/safari",
    instructions: [
      "Download the Safari extension files",
      "Open Settings > Safari > Extensions",
      "Enable SafeLaylar extension",
      "Grant necessary permissions",
      "Start browsing safely!",
    ],
  },
  {
    id: "chrome",
    name: "Chrome",
    icon: Chrome,
    primary: false,
    downloadPath: "/extensions/chrome",
    instructions: [
      "Download the extension folder",
      "Open Chrome and go to chrome://extensions/",
      "Enable 'Developer mode' in the top right",
      "Click 'Load unpacked' and select the folder",
      "SafeLaylar will appear in your toolbar!",
    ],
  },
  {
    id: "firefox",
    name: "Firefox",
    icon: Globe,
    primary: false,
    downloadPath: "/extensions/firefox",
    instructions: [
      "Download the extension folder",
      "Open Firefox and go to about:debugging",
      "Click 'This Firefox' in the sidebar",
      "Click 'Load Temporary Add-on...'",
      "Select any file in the downloaded folder",
    ],
  },
];

const ExtensionDownload = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("android");
  const currentPlatform = platforms.find((p) => p.id === selectedPlatform)!;

  return (
    <section id="extensions" className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground mb-6">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Download SafeLaylar
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Available on Android (standalone app), iOS (Safari extension), and desktop browsers
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-6 sm:p-8 bg-card border-border/50 shadow-elevated">
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid grid-cols-4 mb-8 bg-muted">
              {platforms.map((platform) => (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                >
                  <platform.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{platform.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      platform.primary 
                        ? 'bg-gradient-to-br from-accent to-secondary' 
                        : 'bg-gradient-to-br from-primary to-secondary'
                    }`}>
                      <platform.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {platform.name}
                        </h3>
                        {platform.primary && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {platform.primary ? 'Recommended platform' : 'Desktop extension'}
                      </p>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <a href={platform.downloadPath} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h4 className="font-medium text-foreground mb-4">Installation Steps</h4>
                  <ol className="space-y-3">
                    {platform.instructions.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Features included */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Real-time content filtering",
                    "Anti-grooming protection",
                    "Phishing & scam detection",
                    "Privacy protection",
                    "Deepfake alerts",
                    "Weekly safety reports",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </section>
  );
};

export default ExtensionDownload;
