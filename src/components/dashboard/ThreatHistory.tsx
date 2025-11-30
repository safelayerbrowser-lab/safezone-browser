import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThreatHistoryProps {
  userId: string;
}

const ThreatHistory = ({ userId }: ThreatHistoryProps) => {
  const [threats, setThreats] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreats();
  }, [userId, severityFilter]);

  const loadThreats = async () => {
    setLoading(true);
    let query = supabase
      .from("threat_logs")
      .select("*")
      .eq("user_id", userId)
      .order("blocked_at", { ascending: false });

    if (severityFilter !== "all") {
      query = query.eq("severity", severityFilter);
    }

    const { data } = await query;
    setThreats(data || []);
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-destructive/50 bg-destructive/5 text-destructive";
      case "high":
        return "border-secondary/50 bg-secondary/5 text-secondary";
      case "medium":
        return "border-primary/50 bg-primary/5 text-primary";
      default:
        return "border-border bg-muted/30 text-muted-foreground";
    }
  };

  return (
    <Card className="bg-card border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Threat History</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All threats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No threats found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {severityFilter !== "all"
                ? "Try changing the filter"
                : "You're browsing safely!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-soft ${getSeverityColor(
                  threat.severity
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-current/10">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{threat.threat_type}</div>
                      <div className="text-xs opacity-80 mt-1">
                        {threat.threat_source}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium uppercase tracking-wide mb-1">
                      {threat.severity}
                    </div>
                    <div className="text-xs opacity-70">
                      {new Date(threat.blocked_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-sm opacity-90 mt-3">{threat.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatHistory;
