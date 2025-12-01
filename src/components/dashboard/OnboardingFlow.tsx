import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  MessageSquareWarning,
  Heart,
  ScanFace,
  Bug,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to SafeLaylar",
    description: "Let's take a quick tour of how we protect you online",
    icon: Shield,
    color: "text-teal-500",
    features: [
      "Real-time threat detection",
      "Privacy-first protection",
      "Trauma-informed design",
    ],
  },
  {
    title: "Content Protection",
    description: "Automatically filter toxic, harmful, or abusive content across all your platforms",
    icon: MessageSquareWarning,
    color: "text-coral-500",
    features: [
      "Toxic comment filtering",
      "Hate speech detection",
      "Customizable sensitivity levels",
    ],
  },
  {
    title: "Anti-Grooming Engine",
    description: "Advanced AI detects suspicious behavior patterns and protects you from predatory contacts",
    icon: Users,
    color: "text-lavender-500",
    features: [
      "Behavioral pattern analysis",
      "Automatic contact blocking",
      "Safety alerts and guidance",
    ],
  },
  {
    title: "Romance Scam Alerts",
    description: "Identify manipulative behavior and scam-risk profiles before you get hurt",
    icon: Heart,
    color: "text-coral-400",
    features: [
      "Profile risk analysis",
      "Red flag detection",
      "Warning messages with guidance",
    ],
  },
  {
    title: "Deepfake Detection",
    description: "Stay safe from manipulated images and videos designed to deceive or harm",
    icon: ScanFace,
    color: "text-teal-400",
    features: [
      "AI-powered media scanning",
      "Site reputation checking",
      "Instant deepfake alerts",
    ],
  },
  {
    title: "Spyware Protection",
    description: "Block malicious links, phishing attempts, and spyware before they reach you",
    icon: Bug,
    color: "text-lavender-400",
    features: [
      "Real-time URL scanning",
      "Phishing detection",
      "Malicious script blocking",
    ],
  },
];

const OnboardingFlow = ({ userId, onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Welcome to SafeLaylar!",
        description: "You're all set up and protected.",
      });

      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    await handleComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={isCompleting}
              >
                Skip Tutorial
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-muted ${step.color}`}>
                <StepIcon className="h-8 w-8" />
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
                <p className="text-lg text-muted-foreground">{step.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-3">
                {step.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isCompleting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isCompleting}
              className="min-w-[120px]"
            >
              {isCompleting ? (
                "Loading..."
              ) : currentStep === onboardingSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;