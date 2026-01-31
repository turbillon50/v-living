import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy Alix, tu asesora virtual de Fractional Living. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Placeholder for AI integration - replace with your AI endpoint
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Gracias por tu mensaje. Un asesor de Fractional Living te contactará pronto. También puedes escribirnos directamente por WhatsApp al +52 998 429 2748.' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-[60] w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        data-testid="button-ai-open"
      >
        <div className="relative">
          <Sparkles className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[100dvh] sm:h-[600px] sm:max-h-[80vh] bg-[#1a1a1a] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-8 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Alix</h3>
              <p className="text-xs text-white/70">Asesora Virtual</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            data-testid="button-ai-close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-teal-500 text-white rounded-br-md' 
                  : 'bg-white/10 text-white/90 rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-teal-500"
              data-testid="input-ai-message"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50"
              data-testid="button-ai-send"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-2">
            Fractional Living - All Global Holding LLC
          </p>
        </div>
      </div>
    </>
  );
}
