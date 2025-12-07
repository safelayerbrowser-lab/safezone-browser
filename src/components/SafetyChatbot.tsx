import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Shield, Loader2, AlertCircle, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEMO_MESSAGE_LIMIT = 5;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/safety-chat`;

const SUGGESTED_QUESTIONS = [
  "How do I spot a phishing email?",
  "What are signs of online grooming?",
  "How can I create strong passwords?",
  "What should I do if I'm being cyberbullied?",
];

const SafetyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat history for authenticated users
  useEffect(() => {
    if (user && !conversationId) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastConversation = data[0].conversation_id;
      setConversationId(lastConversation);

      const { data: messages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", lastConversation)
        .order("created_at", { ascending: true });

      if (messages) {
        setMessages(messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
      }
    } else {
      setConversationId(crypto.randomUUID());
    }
  };

  const saveMessage = async (message: Message) => {
    if (!user || !conversationId) return;

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
    });
  };

  const clearHistory = async () => {
    if (!user) return;

    await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user.id);

    setMessages([]);
    setConversationId(crypto.randomUUID());
    toast({ title: "Chat history cleared" });
  };

  const streamChat = async (userMessage: string) => {
    setError(null);
    const userMsg: Message = { role: "user", content: userMessage };
    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Save user message for authenticated users
    if (user) {
      await saveMessage(userMsg);
    }

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          isDemo: !user,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Partial JSON, continue
          }
        }
      }

      // Save assistant message for authenticated users
      if (user && assistantContent) {
        await saveMessage({ role: "assistant", content: assistantContent });
      }

      if (!user) {
        setMessageCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast({
        title: "Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!user && messageCount >= DEMO_MESSAGE_LIMIT) {
      toast({
        title: "Demo Limit Reached",
        description: "Sign up for unlimited access to our AI Safety Advisor!",
      });
      return;
    }

    streamChat(input.trim());
  };

  const handleSuggestion = (question: string) => {
    if (!user && messageCount >= DEMO_MESSAGE_LIMIT) {
      toast({
        title: "Demo Limit Reached",
        description: "Sign up for unlimited access to our AI Safety Advisor!",
      });
      return;
    }
    streamChat(question);
  };

  const isLimited = !user && messageCount >= DEMO_MESSAGE_LIMIT;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent shadow-elevated flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-glow ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open Safety Advisor Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <Card className="w-[360px] sm:w-[400px] h-[550px] flex flex-col shadow-elevated border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy via-accent to-secondary p-4 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Safety Advisor</h3>
                <p className="text-xs text-primary-foreground/80">
                  {user ? "Unlimited access" : "AI-powered safety tips"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <button
                  onClick={clearHistory}
                  className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  aria-label="Clear chat history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 chatbot-scroll" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                  <p className="text-sm text-foreground mb-3">
                    👋 Hi! I'm your AI Safety Advisor. Ask me anything about staying safe online!
                  </p>
                  {!user && (
                    <p className="text-xs text-muted-foreground">
                      Demo: {DEMO_MESSAGE_LIMIT - messageCount} messages remaining
                    </p>
                  )}
                  {user && (
                    <p className="text-xs text-secondary font-medium">
                      ✓ Unlimited messages • Chat history saved
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(question)}
                      className="w-full text-left text-sm p-3 rounded-lg bg-card border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {/* Demo Limit Warning */}
          {isLimited && (
            <div className="px-4 py-3 bg-accent/10 border-t border-accent/20">
              <p className="text-sm text-center">
                <span className="font-medium">Demo limit reached!</span>{" "}
                <a href="/auth" className="text-accent hover:underline font-medium">
                  Sign up
                </a>{" "}
                for unlimited access.
              </p>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about online safety..."
                disabled={isLoading || isLimited}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isLimited}
                className="shrink-0 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default SafetyChatbot;
