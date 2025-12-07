import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Smartphone, Apple, Monitor } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-secondary/30 backdrop-blur-sm mb-8 shadow-glow animate-pulse-glow">
            <Shield className="w-12 h-12 text-secondary-foreground" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Your Digital Shield for a
            <span className="block bg-gradient-to-r from-secondary via-secondary to-accent bg-clip-text text-transparent"> Safer Online World</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            SafeLaylar protects women and girls from toxic content, grooming, scams, and digital threats—all in one intelligent shield.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elevated hover:shadow-glow transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/install")}
              className="text-lg px-8 py-6 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground shadow-elevated"
            >
              Download Now
            </Button>
          </div>
          
          {/* Platform badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/90">
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium">Android App</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <Apple className="w-5 h-5" />
              <span className="text-sm font-medium">iOS (Safari Extension)</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-medium">Chrome & Firefox</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
