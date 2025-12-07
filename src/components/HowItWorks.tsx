import { Download, Shield, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Install in Seconds",
    description: "Download SafeLaylar for Android or install the Safari/Chrome/Firefox extension.",
  },
  {
    icon: Shield,
    title: "Automatic Protection",
    description: "Our AI engine starts protecting you immediately—no complex setup required.",
  },
  {
    icon: CheckCircle,
    title: "Browse with Confidence",
    description: "Get real-time alerts and weekly PDF safety reports. Stay informed, stay safe.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get protected in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-elevated">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-soft">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
