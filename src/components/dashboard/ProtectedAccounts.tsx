import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Shield, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProtectedAccountsProps {
  userId: string;
}

const platforms = [
  "Instagram",
  "Facebook",
  "Twitter",
  "WhatsApp",
  "TikTok",
  "Snapchat",
  "LinkedIn",
  "Email",
];

const ProtectedAccounts = ({ userId }: ProtectedAccountsProps) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: "", account_name: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadAccounts();
  }, [userId]);

  const loadAccounts = async () => {
    const { data } = await supabase
      .from("protected_accounts")
      .select("*")
      .eq("user_id", userId)
      .order("connected_at", { ascending: false });

    setAccounts(data || []);
  };

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("protected_accounts").insert({
      user_id: userId,
      platform: newAccount.platform,
      account_name: newAccount.account_name,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add account",
      });
    } else {
      toast({
        title: "Account protected",
        description: `${newAccount.platform} account is now protected`,
      });
      setNewAccount({ platform: "", account_name: "" });
      setIsAddingAccount(false);
      loadAccounts();
    }
  };

  const removeAccount = async (id: string) => {
    const { error } = await supabase.from("protected_accounts").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove account",
      });
    } else {
      toast({
        title: "Account removed",
        description: "Account is no longer protected",
      });
      loadAccounts();
    }
  };

  return (
    <Card className="bg-card border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Protected Accounts</CardTitle>
          <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Protected Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={addAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={newAccount.platform}
                    onValueChange={(value) =>
                      setNewAccount({ ...newAccount, platform: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Name / Username</Label>
                  <Input
                    placeholder="@username or email"
                    value={newAccount.account_name}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, account_name: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No protected accounts yet</p>
            <p className="text-sm text-muted-foreground">
              Add your social media accounts to enable protection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 rounded-xl bg-accent/30 border border-border/50 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-card-foreground">
                        {account.platform}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {account.account_name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Protected since{" "}
                        {new Date(account.connected_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAccount(account.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProtectedAccounts;
