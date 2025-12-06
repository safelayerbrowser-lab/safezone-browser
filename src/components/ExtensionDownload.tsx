import { useState } from "react";
import { Chrome, Globe, Monitor, Download, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const browsers = [
  {
    id: "chrome",
    name: "Chrome",
    icon: Chrome,
    available: true,
    downloadPath: "/extensions/chrome",
    instructions: [
      "Download the extension folder",
      "Open Chrome and go to chrome://extensions/",
      "Enable 'Developer mode' in the top right",
      "Click 'Load unpacked' and select the downloaded folder",
      "SafeLaylar will appear in your toolbar!",
    ],
  },
  {
    id: "firefox",
    name: "Firefox",
    icon: Globe,
    available: true,
    downloadPath: "/extensions/firefox",
    instructions: [
      "Download the extension folder",
      "Open Firefox and go to about:debugging",
      "Click 'This Firefox' in the sidebar",
      "Click 'Load Temporary Add-on...'",
      "Select any file in the downloaded folder",
    ],
  },
  {
    id: "safari",
    name: "Safari",
    icon: Monitor,
    available: true,
    downloadPath: "/extensions/safari",
    instructions: [
      "Download the Safari extension files",
      "Open Xcode and create a Safari Web Extension project",
      "Replace extension files with SafeLaylar files",
      "Build and run the extension",
      "Enable in Safari Preferences > Extensions",
    ],
  },
];

const ExtensionDownload = () => {
  const [selectedBrowser, setSelectedBrowser] = useState("chrome");
  const currentBrowser = browsers.find((b) => b.id === selectedBrowser)!;

  return (
    <section id="extensions" className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Browser Extension
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Install SafeLaylar directly in your browser for seamless protection across all websites
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-6 sm:p-8 bg-card border-border/50 shadow-elevated">
          <Tabs value={selectedBrowser} onValueChange={setSelectedBrowser}>
            <TabsList className="grid grid-cols-3 mb-8">
              {browsers.map((browser) => (
                <TabsTrigger
                  key={browser.id}
                  value={browser.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <browser.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{browser.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {browsers.map((browser) => (
              <TabsContent key={browser.id} value={browser.id} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <browser.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {browser.name} Extension
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Full protection for {browser.name} browser
                      </p>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={browser.downloadPath} download className="gap-2">
                      <Download className="w-4 h-4" />
                      Download for {browser.name}
                    </a>
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h4 className="font-medium text-foreground mb-4">Installation Steps</h4>
                  <ol className="space-y-3">
                    {browser.instructions.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
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
                    "Customizable settings",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Documentation link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <a
              href="/extensions/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View full installation documentation
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ExtensionDownload;
