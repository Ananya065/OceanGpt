import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatMutation } from "@/hooks/use-ocean";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartData?: any;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am OceanGPT. How can I help you understand our oceans today?"
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatMutation();

  // Read ?q= query param to auto-start chat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && messages.length === 1) {
      setInput(q);
      // Remove query param without reloading
      window.history.replaceState({}, document.title, "/chat");
      setTimeout(() => handleSend(q), 100);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (textToSubmit: string = input) => {
    if (!textToSubmit.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSubmit.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync({ message: userMessage.content });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        chartData: response.chartData
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error accessing the ocean database. Please try again."
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto w-full glass rounded-3xl overflow-hidden mt-6 shadow-2xl border border-border/50 relative">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">OceanGPT</h2>
          <p className="text-xs text-muted-foreground font-medium">Powered by Global Ocean Data</p>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 pb-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-accent/20' : 'bg-primary/20'
              }`}>
                {msg.role === 'user' ? 
                  <User className="w-5 h-5 text-accent" /> : 
                  <Bot className="w-5 h-5 text-primary" />
                }
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === 'user' 
                  ? 'bg-accent text-accent-foreground rounded-tr-sm shadow-md' 
                  : 'bg-card text-card-foreground border border-border/50 shadow-sm rounded-tl-sm'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {/* Render Chart if present */}
                {msg.chartData && Array.isArray(msg.chartData) && (
                  <div className="mt-6 h-[250px] w-full bg-background/50 rounded-xl p-4 border border-border/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={msg.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex gap-4 flex-row animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
              <div className="bg-card border border-border/50 shadow-sm rounded-2xl rounded-tl-sm p-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-300" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-background/50 backdrop-blur border-t border-border/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-3 relative"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-6 px-5 rounded-full border-2 border-border focus-visible:ring-primary/20 shadow-inner bg-background"
            disabled={chatMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || chatMutation.isPending}
            className="absolute right-2 top-1 bottom-1 aspect-square rounded-full bg-primary hover:bg-primary/90 transition-transform hover:scale-105 shadow-md"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
