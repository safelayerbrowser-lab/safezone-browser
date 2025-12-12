import { Shield, AlertTriangle, Heart, Eye, Lock, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Content Protection",
    description: "Filter harmful and toxic content automatically across all platforms.",
  },
  {
    icon: AlertTriangle,
    title: "Anti-Grooming",
    description: "Detect and block suspicious behavior patterns in real-time.",
  },
  {
    icon: Heart,
    title: "Scam Detection",
    description: "Identify romance scams and manipulation attempts instantly.",
  },
  {
    icon: Eye,
    title: "Deepfake Alerts",
    description: "Get warned about manipulated media and fake content.",
  },
  {
    icon: Lock,
    title: "Phishing Guard",
    description: "Block malicious links and unsafe downloads automatically.",
  },
  {
    icon: Users,
    title: "Family Safety",
    description: "Monitor and protect your loved ones with parental controls.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="max-w-2xl mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Powerful Protection
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Everything you need
              <br />
              <span className="text-muted-foreground">to stay safe online</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Six layers of intelligent protection working together to keep you secure.
            </p>
          </motion.div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-border/50 rounded-2xl overflow-hidden">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card p-8 hover:bg-muted/30 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;