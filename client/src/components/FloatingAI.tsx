import { useState, useRef, useEffect } from 'react';
import { X, ArrowUp } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingAI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const setIsOpen = (v: boolean) => { if (!v) onClose(); };
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola! Soy Alix, tu asesora virtual de Fractional Living. ¿En qué puedo ayudarte hoy?' }
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
    <div className={`fixed bottom-20 left-3 right-3 sm:bottom-8 sm:right-6 sm:left-auto z-[70] sm:w-[380px] max-h-[70vh] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      style={{
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #ebebeb',
        boxShadow: '0 12px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      <div className="px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-[#ebebeb]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full fl-gradient-brand flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[9px] tracking-[0.2em]">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#222] text-sm">ALIX</h3>
            <p className="text-[10px] text-[#717171] tracking-wider uppercase">Asesora Virtual</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[#f7f7f7] border border-[#ebebeb]"
          data-testid="button-ai-close"
        >
          <X className="w-4 h-4 text-[#717171]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px] bg-[#fafafa]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#222] text-white rounded-br-md' 
                : 'bg-white text-[#222] rounded-bl-md border border-[#ebebeb]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-[#ebebeb]">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#717171] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#717171] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#717171] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-3 flex-shrink-0 border-t border-[#ebebeb] bg-white" style={{ borderRadius: '0 0 24px 24px' }}>
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta algo..."
            className="flex-1 text-[#222] text-sm placeholder:text-[#999] focus:outline-none py-2.5 px-4 rounded-full bg-[#f7f7f7] border border-[#ebebeb] focus:border-[#222] transition-colors"
            data-testid="input-ai-message"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
            style={{
              background: input.trim() && !isLoading ? 'linear-gradient(135deg, #059669, #06b6d4)' : '#f7f7f7',
            }}
            data-testid="button-ai-send"
          >
            <ArrowUp className={`w-4 h-4 ${input.trim() && !isLoading ? 'text-white' : 'text-[#717171]'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
