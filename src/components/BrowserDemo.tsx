import { useState } from "react";
import { Shield, Search, ChevronLeft, ChevronRight, RotateCcw, Lock, AlertTriangle, CheckCircle2, Ban, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DEMO_PAGES = {
  safe: {
    url: "social-media.com/feed",
    content: [
      { type: "safe", user: "Sarah", text: "Had an amazing day at the beach! 🏖️ #summer #goodvibes", avatar: "S" },
      { type: "safe", user: "Mom", text: "Don't forget dinner at 7pm tonight! Love you 💕", avatar: "M" },
      { type: "safe", user: "Alex", text: "Just finished reading the best book. Highly recommend!", avatar: "A" },
    ],
  },
  threats: {
    url: "suspicious-site.net/messages",
    content: [
      { type: "scam", user: "Unknown", text: "Congratulations! You've won $1,000,000! Click here to claim your prize NOW!", avatar: "?" },
      { type: "phishing", user: "BankSupport", text: "URGENT: Your account has been suspended. Verify immediately or lose access!", avatar: "B" },
      { type: "grooming", user: "NewFriend23", text: "Hey, you seem cool. How old are you really? Don't tell your parents about our chat 😉", avatar: "N" },
      { type: "toxic", user: "Troll99", text: "You're so stupid, nobody likes you. Just go away!", avatar: "T" },
    ],
  },
};

const THREAT_INFO: Record<string, { label: string; severity: string; color: string }> = {
  scam: { label: "Scam Detected", severity: "High", color: "text-destructive" },
  phishing: { label: "Phishing Attempt", severity: "Critical", color: "text-destructive" },
  grooming: { label: "Grooming Pattern", severity: "Critical", color: "text-destructive" },
  toxic: { label: "Toxic Content", severity: "Medium", color: "text-yellow-600" },
};

const BrowserDemo = () => {
  const [currentPage, setCurrentPage] = useState<"safe" | "threats">("threats");
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());

  const page = DEMO_PAGES[currentPage];
  const threatsOnPage = page.content.filter((item) => item.type !== "safe").length;

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealedItems);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedItems(newRevealed);
  };

  const switchPage = (page: "safe" | "threats") => {
    setCurrentPage(page);
    setRevealedItems(new Set());
    if (page === "threats" && protectionEnabled) {
      setBlockedCount((prev) => prev + DEMO_PAGES.threats.content.filter((c) => c.type !== "safe").length);
    }
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Eye className="w-8 h-8" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Try SafeLaylar Demo
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Experience how SafeLaylar protects you in real-time. Toggle protection on/off to see the difference.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Browser Window */}
          <Card className="overflow-hidden shadow-elevated border-border/50">
            {/* Browser Chrome */}
            <div className="bg-muted border-b border-border px-3 py-2">
              <div className="flex items-center gap-3">
                {/* Window controls */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* URL Bar */}
                <div className="flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 border border-border">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-sm text-muted-foreground truncate">
                    https://{page.url}
                  </span>
                </div>

                {/* SafeLaylar Badge */}
                <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary hidden sm:inline">
                    {blockedCount} blocked
                  </span>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={currentPage === "safe" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchPage("safe")}
                >
                  Safe Feed
                </Button>
                <Button
                  variant={currentPage === "threats" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchPage("threats")}
                >
                  Threat Examples
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Protection:</span>
                <Switch
                  checked={protectionEnabled}
                  onCheckedChange={setProtectionEnabled}
                />
                <span className={`text-sm font-medium ${protectionEnabled ? "text-primary" : "text-destructive"}`}>
                  {protectionEnabled ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-background p-6 min-h-[400px]">
              <div className="max-w-2xl mx-auto space-y-4">
                {page.content.map((item, index) => {
                  const isThreat = item.type !== "safe";
                  const isBlocked = isThreat && protectionEnabled && !revealedItems.has(index);
                  const threatInfo = THREAT_INFO[item.type];

                  return (
                    <div
                      key={index}
                      className={`relative rounded-xl border transition-all duration-300 ${
                        isBlocked
                          ? "border-destructive/50 bg-destructive/5"
                          : isThreat && !protectionEnabled
                          ? "border-destructive/30 bg-destructive/5"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Content */}
                      <div className={`p-4 ${isBlocked ? "blur-sm select-none" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                            {item.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{item.user}</span>
                              {isThreat && !protectionEnabled && (
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-destructive/10 ${threatInfo.color}`}>
                                  {threatInfo.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                          </div>
                        </div>
                      </div>

                      {/* Blocked Overlay */}
                      {isBlocked && (
                        <div className="absolute inset-0 rounded-xl bg-destructive/95 flex flex-col items-center justify-center text-white p-4">
                          <Ban className="w-8 h-8 mb-2" />
                          <span className="font-semibold mb-1">{threatInfo.label}</span>
                          <span className="text-sm opacity-90 mb-3">
                            Severity: {threatInfo.severity}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleReveal(index)}
                            className="text-xs"
                          >
                            <EyeOff className="w-3 h-3 mr-1" />
                            Show anyway (not recommended)
                          </Button>
                        </div>
                      )}

                      {/* Revealed threat indicator */}
                      {isThreat && revealedItems.has(index) && protectionEnabled && (
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => toggleReveal(index)}
                            className="text-xs h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Hide
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Bar */}
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                {protectionEnabled ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {currentPage === "threats"
                        ? `${threatsOnPage - revealedItems.size} threats blocked on this page`
                        : "Page is safe - no threats detected"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Protection disabled - threats visible</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Demo Info */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            This is a simulation showing how SafeLaylar filters harmful content. Install the real extension for full protection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrowserDemo;
