import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Shield, X, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SafetyNetworkProps {
  userId: string;
}

const SafetyNetwork = ({ userId }: SafetyNetworkProps) => {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [email, setEmail] = useState("");
  const [connectionType, setConnectionType] = useState("friend");
  const [canViewScore, setCanViewScore] = useState(true);
  const [canViewThreats, setCanViewThreats] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConnections();
  }, [userId]);

  const loadConnections = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("safety_network")
      .select("*, profiles!safety_network_connected_user_id_fkey(email, full_name)")
      .eq("user_id", userId);
    
    setConnections(data || []);
    setLoading(false);
  };

  const addConnection = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Find user by email
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (!profile) {
      toast({
        title: "User not found",
        description: "No user found with that email address",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("safety_network").insert({
      user_id: userId,
      connected_user_id: profile.id,
      connection_type: connectionType,
      can_view_score: canViewScore,
      can_view_threats: canViewThreats,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request sent",
      description: "Connection request sent successfully",
    });
    setIsAddingConnection(false);
    setEmail("");
    loadConnections();
  };

  const updateConnectionStatus = async (connectionId: string, status: string) => {
    const { error } = await supabase
      .from("safety_network")
      .update({ status })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: status === "accepted" ? "Connection accepted" : "Connection declined",
    });
    loadConnections();
  };

  const removeConnection = async (connectionId: string) => {
    const { error } = await supabase
      .from("safety_network")
      .delete()
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connection removed",
    });
    loadConnections();
  };

  const updatePermissions = async (connectionId: string, field: string, value: boolean) => {
    const { error } = await supabase
      .from("safety_network")
      .update({ [field]: value })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
      return;
    }

    loadConnections();
  };

  return (
    <Card className="bg-card border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Safety Network
          </CardTitle>
          <Dialog open={isAddingConnection} onOpenChange={setIsAddingConnection}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Safety Network Connection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="viewScore">Allow viewing my safety score</Label>
                    <Switch
                      id="viewScore"
                      checked={canViewScore}
                      onCheckedChange={setCanViewScore}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="viewThreats">Allow viewing my threat logs</Label>
                    <Switch
                      id="viewThreats"
                      checked={canViewThreats}
                      onCheckedChange={setCanViewThreats}
                    />
                  </div>
                </div>
                <Button onClick={addConnection} className="w-full">
                  Send Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No connections yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add friends and family to share safety tips
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="p-4 rounded-xl border border-border bg-muted/30 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {connection.profiles?.full_name || connection.profiles?.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {connection.connection_type} • {connection.status}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          {connection.can_view_score ? (
                            <Eye className="w-3 h-3 text-primary" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">Score</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {connection.can_view_threats ? (
                            <Eye className="w-3 h-3 text-primary" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">Threats</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.status === "pending" && connection.user_id === userId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateConnectionStatus(connection.id, "accepted")}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeConnection(connection.id)}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SafetyNetwork;