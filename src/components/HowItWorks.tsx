import { Download, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install",
    description: "Download for Android or add the browser extension. Takes just seconds.",
  },
  {
    number: "02",
    icon: Shield,
    title: "Activate",
    description: "Our AI immediately starts analyzing threats. No configuration needed.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Relax",
    description: "Browse with confidence. We handle protection, you enjoy peace of mind.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Three simple steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Get protected in under a minute
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-center p-8 bg-card rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group">
                    {/* Step number */}
                    <div className="text-6xl font-bold text-muted/30 mb-6 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <step.icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background border border-border items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;