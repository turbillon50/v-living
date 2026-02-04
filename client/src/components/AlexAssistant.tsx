import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AlexAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'alex', text: string}[]>([
    { role: 'alex', text: 'Hello, I am Alex. How can I guide you through the All Living Experience today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    // Simple mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'alex', 
        text: "I can help you understand our fractional ownership model or guide you to the perfect property. Would you like to explore our new Villa collection?" 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border border-border rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="font-medium">Alex AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm",
                  msg.role === 'alex' 
                    ? "bg-white border border-border rounded-tl-none self-start mr-auto" 
                    : "bg-black text-white rounded-tr-none self-end ml-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <Input 
              placeholder="Ask Alex..." 
              className="border-0 bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <Button size="icon" onClick={handleSend} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Button 
        size="lg" 
        className="rounded-full h-14 w-14 shadow-xl bg-black hover:bg-black/90 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </Button>
    </div>
  );
}
