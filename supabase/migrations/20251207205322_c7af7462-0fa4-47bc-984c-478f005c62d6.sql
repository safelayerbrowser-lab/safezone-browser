-- Create chat messages table for authenticated users
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  conversation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own messages
CREATE POLICY "Users can view their own messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create parental connections table for monitoring
CREATE TABLE public.parental_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_user_id uuid NOT NULL,
  child_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  can_view_score boolean DEFAULT true,
  can_view_threats boolean DEFAULT true,
  can_view_reports boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (parent_user_id, child_user_id)
);

-- Enable RLS
ALTER TABLE public.parental_connections ENABLE ROW LEVEL SECURITY;

-- Parents can view their connections
CREATE POLICY "Parents can view their connections" 
ON public.parental_connections 
FOR SELECT 
USING (auth.uid() = parent_user_id OR auth.uid() = child_user_id);

CREATE POLICY "Parents can create connection requests" 
ON public.parental_connections 
FOR INSERT 
WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Users can update their connections" 
ON public.parental_connections 
FOR UPDATE 
USING (auth.uid() = parent_user_id OR auth.uid() = child_user_id);

CREATE POLICY "Parents can delete their connections" 
ON public.parental_connections 
FOR DELETE 
USING (auth.uid() = parent_user_id);

-- Create weekly reports table
CREATE TABLE public.weekly_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  report_date date NOT NULL,
  threats_blocked integer DEFAULT 0,
  safety_score integer DEFAULT 100,
  report_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Users can only access their own reports
CREATE POLICY "Users can view their own reports" 
ON public.weekly_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert reports" 
ON public.weekly_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_parental_connections_updated_at
BEFORE UPDATE ON public.parental_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();