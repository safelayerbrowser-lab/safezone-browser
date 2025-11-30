import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Monitor, Apple } from "lucide-react";

const platforms = [
  {
    icon: Smartphone,
    name: "Android",
    description: "Download for Android devices",
    badge: "APK",
  },
  {
    icon: Monitor,
    name: "Desktop",
    description: "Chrome & Edge extensions",
    badge: "Extension",
  },
  {
    icon: Apple,
    name: "iOS",
    description: "Coming to App Store",
    badge: "Soon",
  },
];

const Download = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get SafeLaylar Today
          </h2>
          <p className="text-xl text-white/90">
            Choose your platform and start browsing safely in minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all group shadow-elevated hover:shadow-soft animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <platform.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-4">
                  {platform.badge}
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {platform.name}
                </h3>
                <p className="text-white/80 mb-6">
                  {platform.description}
                </p>
                
                <Button 
                  className="w-full bg-white text-primary hover:bg-white/90"
                  size="lg"
                >
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-white/70 text-sm">
            Free for personal use • No credit card required • 30-day money-back guarantee for premium
          </p>
        </div>
      </div>
    </section>
  );
};

export default Download;
