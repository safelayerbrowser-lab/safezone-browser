import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Your Safety at a Glance
          </h2>
          <p className="text-xl text-muted-foreground">
            Weekly reports show exactly how SafeLaylar protects you
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">This Week</span>
                </div>
                <div className="text-3xl font-bold text-card-foreground mb-1">247</div>
                <div className="text-sm text-muted-foreground">Threats Blocked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Detected</span>
                </div>
                <div className="text-3xl font-bold text-card-foreground mb-1">12</div>
                <div className="text-sm text-muted-foreground">Scam Attempts</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal/10 text-teal">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </div>
                <div className="text-3xl font-bold text-card-foreground mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Safety Score</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-coral/10 text-coral">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Trend</span>
                </div>
                <div className="text-3xl font-bold text-card-foreground mb-1">+15%</div>
                <div className="text-sm text-muted-foreground">Safer Browsing</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-card border-border/50 shadow-elevated animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-2xl">Recent Protection Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">Blocked harmful content</div>
                    <div className="text-sm text-muted-foreground">Instagram • 2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-secondary-foreground">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">Detected romance scam attempt</div>
                    <div className="text-sm text-muted-foreground">WhatsApp • 5 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">Blocked phishing link</div>
                    <div className="text-sm text-muted-foreground">Email • Yesterday</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
