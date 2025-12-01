import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Award, Flame, Star, Lock, Eye, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface SafetyScoreProps {
  userId: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  requirement: number;
  current: number;
}

const SafetyScore = ({ userId }: SafetyScoreProps) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalThreats, setTotalThreats] = useState(0);

  useEffect(() => {
    loadSafetyData();
  }, [userId]);

  const loadSafetyData = async () => {
    const { data: threats } = await supabase
      .from("threat_logs")
      .select("*")
      .eq("user_id", userId)
      .order("blocked_at", { ascending: false });

    if (threats) {
      const total = threats.length;
      setTotalThreats(total);
      
      // Calculate score (10 points per threat blocked)
      const calculatedScore = Math.min(total * 10, 1000);
      setScore(calculatedScore);

      // Calculate streak (days with at least one threat blocked)
      const uniqueDays = new Set(
        threats.map(t => new Date(t.blocked_at).toDateString())
      );
      setStreak(uniqueDays.size);

      // Calculate critical threats
      const criticalCount = threats.filter(t => t.severity === "critical").length;
      const highCount = threats.filter(t => t.severity === "high").length;

      // Set achievements
      setAchievements([
        {
          id: "first_block",
          name: "First Defense",
          description: "Block your first threat",
          icon: Shield,
          unlocked: total >= 1,
          requirement: 1,
          current: total,
        },
        {
          id: "five_blocks",
          name: "Guardian",
          description: "Block 5 threats",
          icon: Award,
          unlocked: total >= 5,
          requirement: 5,
          current: total,
        },
        {
          id: "streak_3",
          name: "On Fire",
          description: "Maintain a 3-day protection streak",
          icon: Flame,
          unlocked: streak >= 3,
          requirement: 3,
          current: streak,
        },
        {
          id: "critical_block",
          name: "Crisis Averted",
          description: "Block a critical threat",
          icon: Star,
          unlocked: criticalCount >= 1,
          requirement: 1,
          current: criticalCount,
        },
        {
          id: "ten_blocks",
          name: "Safety Expert",
          description: "Block 10 threats",
          icon: Lock,
          unlocked: total >= 10,
          requirement: 10,
          current: total,
        },
        {
          id: "vigilant",
          name: "Vigilant",
          description: "Block 5 high-severity threats",
          icon: Eye,
          unlocked: highCount >= 5,
          requirement: 5,
          current: highCount,
        },
        {
          id: "self_care",
          name: "Self-Care Champion",
          description: "Maintain 7-day protection streak",
          icon: Heart,
          unlocked: streak >= 7,
          requirement: 7,
          current: streak,
        },
        {
          id: "powerhouse",
          name: "Powerhouse",
          description: "Reach 500 safety score",
          icon: Zap,
          unlocked: calculatedScore >= 500,
          requirement: 500,
          current: calculatedScore,
        },
      ]);
    }
  };

  const getScoreLevel = () => {
    if (score >= 800) return { level: "Elite", color: "text-accent-foreground" };
    if (score >= 500) return { level: "Advanced", color: "text-primary" };
    if (score >= 200) return { level: "Intermediate", color: "text-secondary" };
    return { level: "Beginner", color: "text-muted-foreground" };
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const scoreLevel = getScoreLevel();

  return (
    <div className="space-y-6">
      {/* Safety Score Card */}
      <Card className="bg-gradient-to-br from-background to-accent/20 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Safety Score
          </CardTitle>
          <CardDescription>Your overall protection level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-5xl font-bold text-primary"
              >
                {score}
              </motion.div>
              <p className={`text-sm font-medium ${scoreLevel.color}`}>
                {scoreLevel.level}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-secondary">
                <Flame className="h-5 w-5" />
                <span className="text-2xl font-bold">{streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Elite</span>
              <span className="font-medium">{score}/1000</span>
            </div>
            <Progress value={(score / 1000) * 100} className="h-3" />
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{totalThreats}</span> threats blocked
              {" • "}
              <span className="font-medium text-foreground">{unlockedCount}/{achievements.length}</span> achievements unlocked
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges by maintaining safe habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked
                        ? "border-primary bg-primary/5 hover:bg-primary/10"
                        : "border-muted bg-muted/20 opacity-60"
                    }`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full p-1">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}
                    <Icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        achievement.unlocked ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <h4 className="font-semibold text-xs text-center mb-1">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-muted-foreground text-center leading-tight">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="h-1"
                        />
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                          {achievement.current}/{achievement.requirement}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyScore;
