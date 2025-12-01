-- Add onboarding_completed field to profiles table
ALTER TABLE public.profiles
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Update the handle_new_user function to insert sample data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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