import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function AIAssistant() {
  const [messages, setMessages] = useState<{role: 'user' | 'alix', text: string}[]>([
    { role: 'alix', text: '¡Hola! Soy ALIX 2.4, tu asistente de inteligencia artificial de Fractional Living. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'alix', 
        text: "Gracias por tu pregunta. Puedo ayudarte con información sobre nuestras fracciones inmobiliarias, el proceso de compra, financiamiento con Last Minute Capital, o conectarte con un asesor. ¿Qué te gustaría saber?" 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-10 pt-8 flex flex-col">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-light mb-2">ALIX 2.4</h1>
          <p className="text-muted-foreground text-sm">
            Pregunta a nuestra inteligencia artificial ALIX 2.4
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "max-w-[85%] p-4 rounded-2xl",
                msg.role === 'alix' 
                  ? "bg-muted rounded-tl-none mr-auto" 
                  : "bg-primary text-primary-foreground rounded-tr-none ml-auto"
              )}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="sticky bottom-24 bg-background pt-4 pb-2 flex gap-2">
          <Input 
            placeholder="Escribe tu pregunta..." 
            className="h-12"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button size="lg" onClick={handleSend} className="h-12 px-6">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
