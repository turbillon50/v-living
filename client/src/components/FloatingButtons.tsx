import { useState } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '+529984292748';
const WHATSAPP_MESSAGE = 'Hola, estoy listo para invertir en Fractional Living';

export function FloatingButtons() {
  const [isOpen, setIsOpen] = useState(false);
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
        text: "Puedo ayudarte con información sobre nuestras fracciones inmobiliarias, el proceso de compra, financiamiento con Last Minute Capital, o conectarte con un asesor. ¿Qué te gustaría saber?" 
      }]);
    }, 1000);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white border border-border rounded-2xl shadow-2xl w-80 mb-2 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-medium">ALIX 2.4</span>
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
                  msg.role === 'alix' 
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
              placeholder="Pregunta a ALIX..." 
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

      <div className="flex flex-col gap-3">
        {/* WhatsApp Button */}
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
          onClick={openWhatsApp}
          data-testid="button-whatsapp"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {/* Alex AI Button */}
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-xl bg-black hover:bg-black/90 text-white"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-alex-ai"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
