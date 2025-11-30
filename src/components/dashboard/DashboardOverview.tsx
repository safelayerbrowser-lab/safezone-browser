import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardOverviewProps {
  userId: string;
}

const DashboardOverview = ({ userId }: DashboardOverviewProps) => {
  const [stats, setStats] = useState({
    totalBlocked: 0,
    criticalThreats: 0,
    safetyScore: 0,
    protectedAccounts: 0,
  });
  const [recentThreats, setRecentThreats] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    // Load threat logs
    const { data: threats } = await supabase
      .from("threat_logs")
      .select("*")
      .eq("user_id", userId)
      .order("blocked_at", { ascending: false })
      .limit(5);

    // Load protected accounts
    const { data: accounts } = await supabase
      .from("protected_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (threats) {
      const criticalCount = threats.filter((t) => t.severity === "critical").length;
      const safetyScore = Math.max(60, 100 - threats.length * 2);

      setStats({
        totalBlocked: threats.length,
        criticalThreats: criticalCount,
        safetyScore,
        protectedAccounts: accounts?.length || 0,
      });

      setRecentThreats(threats);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-destructive bg-destructive/10";
      case "high":
        return "text-secondary bg-secondary/10";
      case "medium":
        return "text-primary bg-primary/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">
              {stats.totalBlocked}
            </div>
            <div className="text-sm text-muted-foreground">Total Threats Blocked</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">
              {stats.criticalThreats}
            </div>
            <div className="text-sm text-muted-foreground">Critical Threats</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">
              {stats.safetyScore}%
            </div>
            <div className="text-sm text-muted-foreground">Safety Score</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-soft hover:shadow-elevated transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">
              {stats.protectedAccounts}
            </div>
            <div className="text-sm text-muted-foreground">Protected Accounts</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Recent Protection Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentThreats.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No threats detected yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                You're browsing safely!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${getSeverityColor(
                      threat.severity
                    )}`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-card-foreground">
                        {threat.threat_type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(threat.blocked_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {threat.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Source: {threat.threat_source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-warm border-border/50 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-1">
                Weekly Safety Report
              </h3>
              <p className="text-sm text-muted-foreground">
                Download your comprehensive safety analysis
              </p>
            </div>
            <Button className="shadow-soft">Download Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
