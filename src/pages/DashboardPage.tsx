import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ThreatHistory from "@/components/dashboard/ThreatHistory";
import ProtectedAccounts from "@/components/dashboard/ProtectedAccounts";
import FilterSettings from "@/components/dashboard/FilterSettings";
import SafetyNetwork from "@/components/dashboard/SafetyNetwork";
import SharedTips from "@/components/dashboard/SharedTips";
import NotificationSettings from "@/components/dashboard/NotificationSettings";
import OnboardingFlow from "@/components/dashboard/OnboardingFlow";
import ParentalDashboard from "@/components/dashboard/ParentalDashboard";
import ChildAcceptanceFlow from "@/components/dashboard/ChildAcceptanceFlow";
import WeeklyReports from "@/components/dashboard/WeeklyReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Users, Bell, Settings, FileText, UserCheck, BarChart } from "lucide-react";

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        
        // Check if user needs onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();
        
        if (profile && !profile.onboarding_completed) {
          setShowOnboarding(true);
        }
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse-soft">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {showOnboarding && (
        <OnboardingFlow
          userId={user.id}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
      <DashboardLayout user={user}>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Safety Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your protection status and manage your safety settings
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="flex flex-wrap gap-1 h-auto p-1 bg-muted/50 border border-border/50">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <BarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="threats" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Threats</span>
              </TabsTrigger>
              <TabsTrigger value="accounts" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Accounts</span>
              </TabsTrigger>
              <TabsTrigger value="family" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Family</span>
              </TabsTrigger>
              <TabsTrigger value="parental" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Parental</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <DashboardOverview userId={user.id} />
            </TabsContent>

            <TabsContent value="threats" className="space-y-6 animate-fade-in">
              <ThreatHistory userId={user.id} />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6 animate-fade-in">
              <ProtectedAccounts userId={user.id} />
            </TabsContent>

            <TabsContent value="family" className="space-y-6 animate-fade-in">
              <ChildAcceptanceFlow userId={user.id} />
              <SafetyNetwork userId={user.id} />
              <SharedTips userId={user.id} />
            </TabsContent>

            <TabsContent value="parental" className="space-y-6 animate-fade-in">
              <ParentalDashboard userId={user.id} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 animate-fade-in">
              <WeeklyReports userId={user.id} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <NotificationSettings userId={user.id} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 animate-fade-in">
              <FilterSettings userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
