import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InteractiveDemo from "@/components/InteractiveDemo";
import HowItWorks from "@/components/HowItWorks";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import SafetyChatbot from "@/components/SafetyChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <InteractiveDemo />
      <HowItWorks />
      <Download />
      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Index;