import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Monitor, Apple, Download as DownloadIcon, Chrome, Globe } from "lucide-react";

const platforms = [
  {
    icon: Smartphone,
    name: "Android",
    description: "Standalone protection app",
    badge: "Primary",
    highlight: true,
    features: ["Full system protection", "Background monitoring", "Push notifications"],
  },
  {
    icon: Apple,
    name: "iOS",
    description: "Safari browser extension",
    badge: "Safari",
    highlight: true,
    features: ["Safari integration", "Content filtering", "Safe browsing"],
  },
  {
    icon: Chrome,
    name: "Chrome",
    description: "Desktop browser extension",
    badge: "Extension",
    highlight: false,
    features: ["Real-time protection", "Phishing detection", "Privacy guard"],
  },
  {
    icon: Globe,
    name: "Firefox",
    description: "Desktop browser extension",
    badge: "Extension",
    highlight: false,
    features: ["Cross-platform", "Customizable filters", "Weekly reports"],
  },
];

const Download = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-navy-foreground mb-6">
            Get SafeLaylar Today
          </h2>
          <p className="text-xl text-navy-foreground/80">
            Choose your platform and start browsing safely
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {platforms.map((platform, index) => (
            <Card 
              key={index} 
              className={`group transition-all duration-300 shadow-elevated hover:shadow-glow animate-scale-in ${
                platform.highlight 
                  ? 'bg-gradient-accent border-transparent' 
                  : 'bg-navy-foreground/10 backdrop-blur-sm border-navy-foreground/20'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform ${
                  platform.highlight ? 'bg-navy-foreground/20' : 'bg-secondary/20'
                }`}>
                  <platform.icon className={`w-7 h-7 ${platform.highlight ? 'text-navy-foreground' : 'text-secondary'}`} />
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  platform.highlight 
                    ? 'bg-navy-foreground/20 text-navy-foreground' 
                    : 'bg-secondary/20 text-secondary'
                }`}>
                  {platform.badge}
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 ${
                  platform.highlight ? 'text-navy-foreground' : 'text-navy-foreground'
                }`}>
                  {platform.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  platform.highlight ? 'text-navy-foreground/80' : 'text-navy-foreground/70'
                }`}>
                  {platform.description}
                </p>
                
                <ul className="space-y-2 mb-6 text-left">
                  {platform.features.map((feature, i) => (
                    <li key={i} className={`text-xs flex items-center gap-2 ${
                      platform.highlight ? 'text-navy-foreground/80' : 'text-navy-foreground/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        platform.highlight ? 'bg-navy-foreground' : 'bg-secondary'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => navigate("/install")}
                  className={`w-full ${
                    platform.highlight 
                      ? 'bg-navy text-navy-foreground hover:bg-navy/90' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  }`}
                  size="sm"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-navy-foreground/60 text-sm">
            Free to download • Works offline • Regular updates • 24/7 protection
          </p>
        </div>
      </div>
    </section>
  );
};

export default Download;
