import { useState, useEffect } from "react";
import { Shield, Ban, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const threats = [
  { id: 1, type: "Toxic Comment", source: "Instagram", severity: "high" },
  { id: 2, type: "Phishing Link", source: "Email", severity: "critical" },
  { id: 3, type: "Scam Attempt", source: "WhatsApp", severity: "high" },
  { id: 4, type: "Harmful Content", source: "Twitter", severity: "medium" },
];

const InteractiveDemo = () => {
  const [blockedCount, setBlockedCount] = useState(0);
  const [activeThreat, setActiveThreat] = useState<number | null>(null);
  const [showBlocked, setShowBlocked] = useState<number | null>(null);

  useEffect(() => {
    let currentIndex = 0;
    
    const showThreat = () => {
      if (currentIndex >= threats.length) {
        currentIndex = 0;
        setBlockedCount(0);
      }
      
      const threat = threats[currentIndex];
      setActiveThreat(threat.id);
      
      setTimeout(() => {
        setShowBlocked(threat.id);
        setBlockedCount(prev => prev + 1);
        
        setTimeout(() => {
          setActiveThreat(null);
          setShowBlocked(null);
          currentIndex++;
        }, 1500);
      }, 1000);
    };

    showThreat();
    const interval = setInterval(showThreat, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground">
              Watch how SafeLaylar protects you in real-time
            </p>
          </motion.div>

          {/* Demo container */}
          <motion.div 
            className="relative bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Browser header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-muted/50 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-background rounded-lg text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Protected by SafeLaylar</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">Active</span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-8 min-h-[400px] flex items-center justify-center relative">
              {/* Background social feed simulation */}
              <div className="absolute inset-8 flex flex-col gap-4 opacity-30">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-2 w-40 bg-muted rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active threat detection */}
              <AnimatePresence mode="wait">
                {activeThreat && (
                  <motion.div
                    key={activeThreat}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="relative z-10 w-full max-w-md"
                  >
                    <div className={`p-6 rounded-2xl border-2 transition-colors ${
                      showBlocked 
                        ? 'bg-destructive/10 border-destructive/50' 
                        : 'bg-card border-warning/50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          showBlocked ? 'bg-destructive' : 'bg-warning'
                        }`}>
                          {showBlocked ? (
                            <Ban className="w-6 h-6 text-white" />
                          ) : (
                            <Shield className="w-6 h-6 text-white animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-foreground">
                            {showBlocked ? 'Threat Blocked!' : 'Threat Detected'}
                          </div>
                          <div className="text-muted-foreground text-sm mt-1">
                            {threats.find(t => t.id === activeThreat)?.type} • {threats.find(t => t.id === activeThreat)?.source}
                          </div>
                          {showBlocked && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 flex items-center gap-2 text-success text-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>You're protected</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats */}
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{blockedCount}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Blocked</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">100%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Protected</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">&lt;1s</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Response</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;