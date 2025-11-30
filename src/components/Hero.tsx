import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Download, ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 shadow-elevated">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Digital Shield for a
            <span className="block text-secondary"> Safer Online World</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            SafeLaylar protects women and girls from toxic content, grooming, scams, and digital threats—all in one intelligent browser shield.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elevated hover:shadow-soft transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white shadow-elevated"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-sm">Android</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-sm">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-sm">iOS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
