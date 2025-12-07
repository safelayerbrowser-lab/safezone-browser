import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, AlertTriangle, BarChart3, FileText, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ChildConnection {
  id: string;
  child_user_id: string;
  status: string;
  can_view_score: boolean;
  can_view_threats: boolean;
  can_view_reports: boolean;
  child_email?: string;
  safety_score?: number;
  threats_blocked?: number;
}

interface ParentalDashboardProps {
  userId: string;
}

const ParentalDashboard = ({ userId }: ParentalDashboardProps) => {
  const [connections, setConnections] = useState<ChildConnection[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childThreats, setChildThreats] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, [userId]);

  const fetchConnections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("parental_connections")
      .select("*")
      .eq("parent_user_id", userId);

    if (data) {
      // Fetch child details for each connection
      const enrichedConnections = await Promise.all(
        data.map(async (conn) => {
          // Get child profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", conn.child_user_id)
            .single();

          // Get child's threat count
          const { count: threatCount } = await supabase
            .from("threat_logs")
            .select("*", { count: "exact", head: true })
            .eq("user_id", conn.child_user_id);

          return {
            ...conn,
            child_email: profile?.email || "Unknown",
            threats_blocked: threatCount || 0,
            safety_score: Math.max(100 - (threatCount || 0) * 5, 0),
          };
        })
      );

      setConnections(enrichedConnections);
    }
    setLoading(false);
  };

  const inviteChild = async () => {
    if (!inviteEmail.trim()) return;

    // Check if child exists
    const { data: childProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", inviteEmail)
      .single();

    if (!childProfile) {
      toast({
        title: "User not found",
        description: "The email address is not registered. Ask them to sign up first.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("parental_connections").insert({
      parent_user_id: userId,
      child_user_id: childProfile.id,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already connected",
          description: "This child is already in your monitoring list.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send invitation.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Invitation sent",
      description: `Monitoring request sent to ${inviteEmail}`,
    });
    setInviteEmail("");
    fetchConnections();
  };

  const removeConnection = async (connectionId: string) => {
    await supabase.from("parental_connections").delete().eq("id", connectionId);
    toast({ title: "Child removed from monitoring" });
    fetchConnections();
  };

  const togglePermission = async (connectionId: string, field: string, value: boolean) => {
    await supabase
      .from("parental_connections")
      .update({ [field]: value })
      .eq("id", connectionId);
    fetchConnections();
  };

  const viewChildThreats = async (childUserId: string) => {
    setSelectedChild(childUserId);
    const { data } = await supabase
      .from("threat_logs")
      .select("*")
      .eq("user_id", childUserId)
      .order("blocked_at", { ascending: false })
      .limit(20);

    setChildThreats(data || []);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-accent text-accent-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-secondary" />
            Parental Control Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor your children's online safety</p>
        </div>
      </div>

      {/* Add Child */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Add Child to Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter child's email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={inviteChild} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The child must have a SafeLaylar account. They will receive a notification to accept your monitoring request.
          </p>
        </CardContent>
      </Card>

      {/* Children List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : connections.length === 0 ? (
        <Card className="border-dashed border-2 border-border bg-muted/20">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No children connected</h3>
            <p className="text-muted-foreground">Add your child's email above to start monitoring their safety.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {connections.map((child) => (
            <Card key={child.id} className="border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Child Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg">
                      {child.child_email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{child.child_email}</h3>
                      <Badge
                        variant={child.status === "accepted" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {child.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  {child.status === "accepted" && (
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{child.safety_score}%</div>
                        <div className="text-xs text-muted-foreground">Safety Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{child.threats_blocked}</div>
                        <div className="text-xs text-muted-foreground">Threats Blocked</div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {child.status === "accepted" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewChildThreats(child.child_user_id)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Threats
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConnection(child.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Permissions */}
                {child.status === "accepted" && (
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">View Safety Score</span>
                      <Switch
                        checked={child.can_view_score}
                        onCheckedChange={(v) => togglePermission(child.id, "can_view_score", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">View Threats</span>
                      <Switch
                        checked={child.can_view_threats}
                        onCheckedChange={(v) => togglePermission(child.id, "can_view_threats", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">View Reports</span>
                      <Switch
                        checked={child.can_view_reports}
                        onCheckedChange={(v) => togglePermission(child.id, "can_view_reports", v)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Child Threats Modal */}
      {selectedChild && (
        <Card className="border-border/50 bg-card mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Threat History
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedChild(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent>
            {childThreats.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No threats recorded</p>
            ) : (
              <div className="space-y-3">
                {childThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground">{threat.threat_type}</div>
                      <div className="text-sm text-muted-foreground">{threat.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(threat.blocked_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentalDashboard;
