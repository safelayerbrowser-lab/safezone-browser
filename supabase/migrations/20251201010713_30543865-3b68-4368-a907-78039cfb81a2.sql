-- Create safety network table for friend/family connections
CREATE TABLE public.safety_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('family', 'friend')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  can_view_score BOOLEAN DEFAULT false,
  can_view_threats BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Create shared tips table
CREATE TABLE public.shared_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('scam_prevention', 'privacy', 'online_safety', 'general')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification settings table
CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_critical_threats BOOLEAN DEFAULT true,
  email_daily_summary BOOLEAN DEFAULT false,
  email_weekly_summary BOOLEAN DEFAULT true,
  network_activity_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.safety_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for safety_network
CREATE POLICY "Users can view their own connections"
  ON public.safety_network FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create connection requests"
  ON public.safety_network FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their connections"
  ON public.safety_network FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can delete their connections"
  ON public.safety_network FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- RLS Policies for shared_tips
CREATE POLICY "Users can view public tips or their own"
  ON public.shared_tips FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own tips"
  ON public.shared_tips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tips"
  ON public.shared_tips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tips"
  ON public.shared_tips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notification_settings
CREATE POLICY "Users can manage their own notification settings"
  ON public.notification_settings FOR ALL
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_safety_network_updated_at
  BEFORE UPDATE ON public.safety_network
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Update handle_new_user to create default notification settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    false
  );
  
  -- Insert default filter settings
  INSERT INTO public.filter_settings (user_id)
  VALUES (NEW.id);
  
  -- Insert default notification settings
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);
  
  -- Insert sample protected accounts
  INSERT INTO public.protected_accounts (user_id, platform, account_name, is_active)
  VALUES 
    (NEW.id, 'Instagram', 'Demo Account', true),
    (NEW.id, 'Facebook', 'Demo Profile', true);
  
  -- Insert sample threat logs with different severity levels
  INSERT INTO public.threat_logs (user_id, threat_type, threat_source, severity, description)
  VALUES 
    (NEW.id, 'Toxic Comment', 'Instagram DM', 'high', 'Blocked abusive message containing harmful language'),
    (NEW.id, 'Phishing Attempt', 'Email Link', 'critical', 'Detected and blocked malicious phishing URL attempting to steal credentials'),
    (NEW.id, 'Grooming Pattern', 'Social Media', 'critical', 'Identified suspicious behavior pattern and blocked contact'),
    (NEW.id, 'Deepfake Content', 'Website', 'medium', 'Warned about potential manipulated media on accessed site'),
    (NEW.id, 'Romance Scam', 'Dating App', 'high', 'Flagged profile showing scam-risk indicators'),
    (NEW.id, 'Explicit Content', 'Web Browser', 'medium', 'Filtered inappropriate content from search results'),
    (NEW.id, 'Spyware Attempt', 'Download Link', 'critical', 'Blocked malicious script attempting to install spyware'),
    (NEW.id, 'Impersonation', 'Facebook', 'high', 'Detected fake profile impersonating known contact');
  
  RETURN NEW;
END;
$function$;