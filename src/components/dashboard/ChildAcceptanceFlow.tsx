import { useState, useEffect } from "react";
import { Shield, Check, X, Users, AlertTriangle, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PendingRequest {
  id: string;
  parent_user_id: string;
  parent_email?: string;
  can_view_score: boolean;
  can_view_threats: boolean;
  can_view_reports: boolean;
  created_at: string;
}

interface ActiveConnection {
  id: string;
  parent_user_id: string;
  parent_email?: string;
  can_view_score: boolean;
  can_view_threats: boolean;
  can_view_reports: boolean;
  status: string;
}

interface ChildAcceptanceFlowProps {
  userId: string;
}

const ChildAcceptanceFlow = ({ userId }: ChildAcceptanceFlowProps) => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    setLoading(true);

    // Fetch pending requests
    const { data: pending } = await supabase
      .from("parental_connections")
      .select("*")
      .eq("child_user_id", userId)
      .eq("status", "pending");

    // Fetch active connections
    const { data: active } = await supabase
      .from("parental_connections")
      .select("*")
      .eq("child_user_id", userId)
      .eq("status", "accepted");

    // Enrich with parent emails
    const enrichPending = await Promise.all(
      (pending || []).map(async (req) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", req.parent_user_id)
          .single();
        return { ...req, parent_email: profile?.email || "Unknown" };
      })
    );

    const enrichActive = await Promise.all(
      (active || []).map(async (conn) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", conn.parent_user_id)
          .single();
        return { ...conn, parent_email: profile?.email || "Unknown" };
      })
    );

    setPendingRequests(enrichPending);
    setActiveConnections(enrichActive);
    setLoading(false);
  };

  const acceptRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("parental_connections")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request accepted",
      description: "Your parent/guardian can now view your safety information.",
    });
    fetchRequests();
  };

  const declineRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("parental_connections")
      .delete()
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to decline request.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request declined",
      description: "The monitoring request has been declined.",
    });
    fetchRequests();
  };

  const revokeAccess = async (connectionId: string) => {
    const { error } = await supabase
      .from("parental_connections")
      .delete()
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to revoke access.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Access revoked",
      description: "Parental monitoring access has been removed.",
    });
    fetchRequests();
  };

  const updatePermission = async (connectionId: string, field: string, value: boolean) => {
    await supabase
      .from("parental_connections")
      .update({ [field]: value })
      .eq("id", connectionId);
    fetchRequests();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-secondary" />
          Family Safety Network
        </h2>
        <p className="text-muted-foreground">
          Manage who can view your safety information
        </p>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Requests
            <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
          </h3>
          
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-warning/30 bg-warning/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
                        {request.parent_email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{request.parent_email}</h4>
                        <p className="text-sm text-muted-foreground">
                          Wants to monitor your online safety
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => acceptRequest(request.id)}
                        className="bg-success hover:bg-success/90 text-success-foreground gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => declineRequest(request.id)}
                        className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  </div>

                  {/* Permission Preview */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      If you accept, they will be able to:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {request.can_view_score && (
                        <Badge variant="secondary" className="gap-1">
                          <Eye className="w-3 h-3" /> View Safety Score
                        </Badge>
                      )}
                      {request.can_view_threats && (
                        <Badge variant="secondary" className="gap-1">
                          <AlertTriangle className="w-3 h-3" /> View Threats
                        </Badge>
                      )}
                      {request.can_view_reports && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="w-3 h-3" /> View Reports
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Connections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          Active Connections
        </h3>

        {activeConnections.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-muted/20">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No active connections</h3>
              <p className="text-muted-foreground">
                No one is currently monitoring your safety information.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeConnections.map((connection) => (
              <Card key={connection.id} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
                        {connection.parent_email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{connection.parent_email}</h4>
                        <Badge variant="default" className="mt-1 bg-success text-success-foreground">
                          Connected
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => revokeAccess(connection.id)}
                      className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                      Revoke Access
                    </Button>
                  </div>

                  {/* Permission Controls */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Control what they can see:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">Safety Score</span>
                        <Switch
                          checked={connection.can_view_score}
                          onCheckedChange={(v) => updatePermission(connection.id, "can_view_score", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">Threat History</span>
                        <Switch
                          checked={connection.can_view_threats}
                          onCheckedChange={(v) => updatePermission(connection.id, "can_view_threats", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">Weekly Reports</span>
                        <Switch
                          checked={connection.can_view_reports}
                          onCheckedChange={(v) => updatePermission(connection.id, "can_view_reports", v)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Your Privacy Matters</h4>
              <p className="text-sm text-muted-foreground">
                You're always in control. You can revoke access or adjust permissions at any time.
                Connected guardians can only see the information you allow them to see.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildAcceptanceFlow;