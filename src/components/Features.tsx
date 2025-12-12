import { Shield, AlertTriangle, Heart, Eye, Lock, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Content Protection",
    description: "Automatically filter explicit, degrading, violent, and harmful content. Connect your social media to hide toxic comments and threats.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: AlertTriangle,
    title: "Anti-Grooming Engine",
    description: "Detect suspicious behavior patterns and block known grooming websites and communication attempts.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Heart,
    title: "Romance Scam Alerts",
    description: "Identify manipulative behavior and scam-risk profiles with warning messages and guidance.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Eye,
    title: "Deepfake Detection",
    description: "Get alerts when accessing sites known for manipulated content. Scan uploaded images for deepfake risks.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Lock,
    title: "Spyware & Phishing Protection",
    description: "Block unsafe links, phishing URLs, malicious scripts, and spyware attempts in real-time.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Users,
    title: "Parental Control Mode",
    description: "Guardians can monitor safety scores, view threat history, and set safe-browsing filters for children.",
    gradient: "from-accent to-primary",
  },
  {
    icon: BarChart3,
    title: "Safety Reports",
    description: "Weekly PDF reports showing blocked threats, browsing safety scores, and recommended safety actions.",
    gradient: "from-primary to-secondary",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Complete Protection Suite
          </h2>
          <p className="text-xl text-muted-foreground">
            Seven powerful defense layers working together to keep you safe online
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/30 bg-card"
            >
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
