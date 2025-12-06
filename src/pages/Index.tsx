import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InteractiveDemo from "@/components/InteractiveDemo";
import BrowserDemo from "@/components/BrowserDemo";
import ExtensionDownload from "@/components/ExtensionDownload";
import HowItWorks from "@/components/HowItWorks";
import Dashboard from "@/components/Dashboard";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import SafetyChatbot from "@/components/SafetyChatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <InteractiveDemo />
      <BrowserDemo />
      <ExtensionDownload />
      <HowItWorks />
      <Dashboard />
      <Download />
      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Index;
