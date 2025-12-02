import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download, Smartphone, Monitor, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation not available",
        description: "Please follow the manual instructions below for your device.",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast({
        title: "Installing SafeLaylar",
        description: "The app is being installed to your device.",
      });
      setDeferredPrompt(null);
    }
  };

  const iosInstructions = [
    "Tap the Share button at the bottom of Safari",
    "Scroll down and tap 'Add to Home Screen'",
    "Tap 'Add' in the top right corner",
    "SafeLaylar is now on your home screen!"
  ];

  const androidInstructions = [
    "Tap the menu (three dots) in your browser",
    "Select 'Add to Home screen' or 'Install app'",
    "Tap 'Add' or 'Install'",
    "SafeLaylar is now on your home screen!"
  ];

  const desktopInstructions = [
    "Look for the install icon in your browser's address bar",
    "Click the install button when prompted",
    "Or click 'Install SafeLaylar' below",
    "The app will open in its own window"
  ];

  const instructions = deviceType === 'ios' 
    ? iosInstructions 
    : deviceType === 'android' 
    ? androidInstructions 
    : desktopInstructions;

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">SafeLaylar is Installed!</CardTitle>
            <CardDescription>
              You're all set. SafeLaylar is protecting you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full"
              size="lg"
            >
              Open Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Install SafeLaylar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Install SafeLaylar on your device for the best experience. Works offline, loads instantly, and feels like a native app.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="h-6 w-6 text-primary" />
                <CardTitle>Mobile Install</CardTitle>
              </div>
              <CardDescription>
                Install SafeLaylar directly to your phone's home screen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="h-6 w-6 text-primary" />
                <CardTitle>Desktop Install</CardTitle>
              </div>
              <CardDescription>
                Install SafeLaylar as a desktop app for quick access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {desktopInstructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {deferredPrompt && (
          <Card className="bg-gradient-primary border-0 text-white">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Download className="h-8 w-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Quick Install Available</h3>
                    <p className="text-white/90 text-sm">
                      Click below to install SafeLaylar with one click
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleInstallClick}
                  size="lg"
                  variant="secondary"
                  className="flex-shrink-0"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Install Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Install SafeLaylar?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Always Protected</h3>
              <p className="text-sm text-muted-foreground">
                Quick access to your safety dashboard anytime
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Works Offline</h3>
              <p className="text-sm text-muted-foreground">
                Access your safety features even without internet
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Native Feel</h3>
              <p className="text-sm text-muted-foreground">
                Feels like a real app with instant loading
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
