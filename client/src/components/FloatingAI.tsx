import { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowUp } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingAI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const setIsOpen = (v: boolean) => { if (!v) onClose(); };
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy Alix, tu asesora virtual de Fractional Living. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/alix/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages.slice(1)
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || 'Lo siento, hubo un error. Intenta de nuevo.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error de conexión. Intenta de nuevo.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-20 left-3 right-3 sm:bottom-8 sm:right-6 sm:left-auto z-[70] sm:w-[380px] max-h-[70vh] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
        style={{
          borderRadius: '20px',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #222 0%, #111 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-white font-bold text-[9px] tracking-[0.2em]">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wide">ALIX</h3>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Asesora Virtual</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            data-testid="button-ai-close"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'text-white rounded-2xl rounded-br-md' 
                  : 'text-white/80 rounded-2xl rounded-bl-md'
              }`}
                style={{
                  background: msg.role === 'user' 
                    ? 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
                    : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user'
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta algo..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 focus:outline-none py-2.5 px-4 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              data-testid="input-ai-message"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
              style={{
                background: input.trim() && !isLoading ? '#fff' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              data-testid="button-ai-send"
            >
              <ArrowUp className={`w-4 h-4 ${input.trim() && !isLoading ? 'text-black' : 'text-white/30'}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
