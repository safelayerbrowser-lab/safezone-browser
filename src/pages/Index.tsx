import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InteractiveDemo from "@/components/InteractiveDemo";
import HowItWorks from "@/components/HowItWorks";
import Dashboard from "@/components/Dashboard";
import Download from "@/components/Download";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <InteractiveDemo />
      <HowItWorks />
      <Dashboard />
      <Download />
      <Footer />
    </div>
  );
};

export default Index;
