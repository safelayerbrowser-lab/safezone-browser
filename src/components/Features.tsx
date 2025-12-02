import { Shield, AlertTriangle, Heart, Eye, Lock, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Content Protection",
    description: "Automatically filter explicit, degrading, violent, and harmful content. Connect your social media to hide toxic comments and threats.",
    color: "text-primary",
  },
  {
    icon: AlertTriangle,
    title: "Anti-Grooming Engine",
    description: "Detect suspicious behavior patterns and block known grooming websites and communication attempts.",
    color: "text-secondary",
  },
  {
    icon: Heart,
    title: "Romance Scam Alerts",
    description: "Identify manipulative behavior and scam-risk profiles with warning messages and guidance.",
    color: "text-accent",
  },
  {
    icon: Eye,
    title: "Deepfake Detection",
    description: "Get alerts when accessing sites known for manipulated content. Scan uploaded images for deepfake risks.",
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "Spyware & Phishing Protection",
    description: "Block unsafe links, phishing URLs, malicious scripts, and spyware attempts in real-time.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Parental Control Mode",
    description: "Guardians can set safe-browsing filters for girls under 18 with age-appropriate content filtering.",
    color: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Safety Reports",
    description: "Weekly dashboards showing blocked threats, browsing safety scores, and recommended safety actions.",
    color: "text-primary",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Complete Protection Suite
          </h2>
          <p className="text-xl text-muted-foreground">
            Seven powerful defense layers working together to keep you safe online
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/30 animate-scale-in bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
