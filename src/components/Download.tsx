import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone, Apple, Chrome, Globe, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const platforms = [
  {
    icon: Smartphone,
    name: "Android",
    description: "Standalone app",
    primary: true,
  },
  {
    icon: Apple,
    name: "iOS",
    description: "Safari extension",
    primary: true,
  },
  {
    icon: Chrome,
    name: "Chrome",
    description: "Browser extension",
    primary: false,
  },
  {
    icon: Globe,
    name: "Firefox",
    description: "Browser extension",
    primary: false,
  },
];

const Download = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-background mb-6">
              Start protecting yourself today
            </h2>
            <p className="text-xl text-background/70 mb-12">
              Free to download. No credit card required.
            </p>
          </motion.div>

          {/* Platform buttons */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {platforms.map((platform, index) => (
              <motion.button
                key={index}
                onClick={() => navigate("/install")}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                  platform.primary
                    ? 'bg-background text-foreground hover:bg-background/90'
                    : 'bg-background/10 text-background border border-background/20 hover:bg-background/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <platform.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{platform.name}</div>
                  <div className={`text-xs ${platform.primary ? 'text-muted-foreground' : 'text-background/60'}`}>
                    {platform.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Features list */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-background/70 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {["Free forever", "No ads", "Privacy first", "Regular updates"].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Download;