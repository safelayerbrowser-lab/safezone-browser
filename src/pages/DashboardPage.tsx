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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Safety Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your protection status and manage your safety settings
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview userId={user.id} />
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <ThreatHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <ProtectedAccounts userId={user.id} />
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <SafetyNetwork userId={user.id} />
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <SharedTips userId={user.id} />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings userId={user.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <FilterSettings userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    </>
  );
};

export default DashboardPage;
