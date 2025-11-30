import { useState, useEffect } from "react";
import { Shield, X, AlertTriangle, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";

const threats = [
  {
    id: 1,
    type: "Toxic Comment",
    text: "You're so...",
    platform: "Instagram",
    severity: "high",
    delay: 1000,
  },
  {
    id: 2,
    type: "Scam Attempt",
    text: "Click here to claim...",
    platform: "WhatsApp",
    severity: "critical",
    delay: 2500,
  },
  {
    id: 3,
    type: "Phishing Link",
    text: "Verify your account at...",
    platform: "Email",
    severity: "critical",
    delay: 4000,
  },
  {
    id: 4,
    type: "Harmful Content",
    text: "Inappropriate image detected",
    platform: "Twitter",
    severity: "medium",
    delay: 5500,
  },
];

const InteractiveDemo = () => {
  const [blockedThreats, setBlockedThreats] = useState<number[]>([]);
  const [activeThreats, setActiveThreats] = useState<number[]>([]);

  useEffect(() => {
    threats.forEach((threat) => {
      // Show threat first
      setTimeout(() => {
        setActiveThreats((prev) => [...prev, threat.id]);
        
        // Block it after a short delay
        setTimeout(() => {
          setBlockedThreats((prev) => [...prev, threat.id]);
          setTimeout(() => {
            setActiveThreats((prev) => prev.filter((id) => id !== threat.id));
          }, 1000);
        }, 800);
      }, threat.delay);
    });

    // Reset animation
    const resetInterval = setInterval(() => {
      setBlockedThreats([]);
      setActiveThreats([]);
    }, 12000);

    return () => clearInterval(resetInterval);
  }, []);

  return (
    <section className="py-32 bg-gradient-feature relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            See SafeLaylar in Action
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Watch how we protect you in real-time, blocking threats before they reach you
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Browser Mockup */}
          <Card className="bg-card shadow-elevated border-border/50 overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-muted border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                <div className="w-3 h-3 rounded-full bg-secondary/60"></div>
                <div className="w-3 h-3 rounded-full bg-primary/60"></div>
              </div>
              <div className="flex-1 mx-4 bg-background rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="truncate">SafeLaylar Protected Browser</span>
              </div>
            </div>

            {/* Browser Content Area */}
            <div className="bg-background p-8 min-h-[500px] relative">
              {/* Social Feed Simulation */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="text-sm font-medium text-muted-foreground mb-6">
                  Social Media Feed
                </div>

                {/* Safe Content */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10"></div>
                    <div>
                      <div className="font-medium text-sm">Friend</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">
                    Had a great day at the park! 🌸
                  </p>
                </div>

                {/* Threat Detection Zone */}
                <div className="relative space-y-4">
                  {threats.map((threat) => (
                    <div
                      key={threat.id}
                      className={`transition-all duration-500 ${
                        activeThreats.includes(threat.id)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 absolute"
                      }`}
                    >
                      <div
                        className={`relative bg-card border rounded-xl p-4 space-y-3 shadow-subtle ${
                          blockedThreats.includes(threat.id)
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted"></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Suspicious Account</div>
                            <div className="text-xs text-muted-foreground">{threat.platform}</div>
                          </div>
                        </div>
                        <p className="text-sm text-foreground blur-sm">{threat.text}</p>

                        {/* Blocking Animation */}
                        {blockedThreats.includes(threat.id) && (
                          <div className="absolute inset-0 bg-destructive/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                              <Ban className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center text-white">
                              <div className="font-semibold mb-1">{threat.type} Blocked</div>
                              <div className="text-sm opacity-90">
                                SafeLaylar protected you
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* More Safe Content */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10"></div>
                    <div>
                      <div className="font-medium text-sm">Family Member</div>
                      <div className="text-xs text-muted-foreground">5 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">
                    Looking forward to dinner tonight! 🍽️
                  </p>
                </div>
              </div>

              {/* Live Protection Indicator */}
              <div className="absolute top-4 right-4">
                <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-2 flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-primary">
                    {blockedThreats.length} Threats Blocked
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Below Demo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-primary mb-2">
                {blockedThreats.length}/4
              </div>
              <div className="text-sm text-muted-foreground">Threats Blocked</div>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-secondary mb-2">0.8s</div>
              <div className="text-sm text-muted-foreground">Average Response</div>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-lavender mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Protection Rate</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
