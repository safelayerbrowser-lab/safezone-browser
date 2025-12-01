import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Plus, Trash2, Lock, Unlock } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SharedTipsProps {
  userId: string;
}

const categories = [
  "Social Media Safety",
  "Online Privacy",
  "Phishing Prevention",
  "Password Security",
  "Cyberbullying",
  "General Safety",
];

const SharedTips = ({ userId }: SharedTipsProps) => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTip, setIsAddingTip] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTips();
  }, [userId]);

  const loadTips = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("shared_tips")
      .select("*, profiles(email, full_name)")
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .order("created_at", { ascending: false });
    
    setTips(data || []);
    setLoading(false);
  };

  const addTip = async () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("shared_tips").insert({
      user_id: userId,
      title,
      content,
      category,
      is_public: isPublic,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create tip",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tip created",
      description: "Your safety tip has been shared",
    });
    setIsAddingTip(false);
    setTitle("");
    setContent("");
    setIsPublic(false);
    loadTips();
  };

  const deleteTip = async (tipId: string) => {
    const { error } = await supabase
      .from("shared_tips")
      .delete()
      .eq("id", tipId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete tip",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tip deleted",
    });
    loadTips();
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      "Social Media Safety": "bg-primary/10 text-primary",
      "Online Privacy": "bg-secondary/10 text-secondary",
      "Phishing Prevention": "bg-destructive/10 text-destructive",
      "Password Security": "bg-accent/10 text-accent-foreground",
      "Cyberbullying": "bg-primary/20 text-primary",
      "General Safety": "bg-muted text-muted-foreground",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="bg-card border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            Safety Tips
          </CardTitle>
          <Dialog open={isAddingTip} onOpenChange={setIsAddingTip}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Share Tip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share a Safety Tip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="How to spot phishing emails"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Tip Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your safety tip here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public">Make this tip public</Label>
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
                <Button onClick={addTip} className="w-full">
                  Share Tip
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
        ) : tips.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tips shared yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to share a safety tip!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-xl border border-border bg-muted/30 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{tip.title}</h3>
                      {tip.is_public ? (
                        <Unlock className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <Badge className={getCategoryColor(tip.category)} variant="secondary">
                      {tip.category}
                    </Badge>
                  </div>
                  {tip.user_id === userId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTip(tip.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tip.content}</p>
                <div className="text-xs text-muted-foreground">
                  Shared by {tip.profiles?.full_name || tip.profiles?.email} •{" "}
                  {new Date(tip.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedTips;