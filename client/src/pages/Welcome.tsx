import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Settings, MessageCircle } from 'lucide-react';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const whatsappLink = "https://wa.me/529984292748";

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="relative h-[70vh]">
        <img 
          src="/welcome-bg.jpg" 
          alt="Fractional Living" 
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="welcome-background"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/20" />

        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4">
          <p className="text-white/60 text-xs tracking-[0.2em] uppercase">All Global Holding LLC</p>
          <div className="flex items-center gap-4">
            <Link href="/creator">
              <span className="text-white/50 hover:text-white transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
              data-testid="button-language"
            >
              <Globe className="w-4 h-4" />
              {lang.toUpperCase()}
            </button>
          </div>
        </header>
      </div>

      <div className="px-6 py-8 text-center">
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-6">
          {lang === 'es' 
            ? 'Funcionamos con inteligencia artificial. Puedes contactar a ALIX 24/7 para resolver tus dudas sobre propiedades, inversiones y más.'
            : 'We operate with artificial intelligence. You can contact ALIX 24/7 to resolve your questions about properties, investments and more.'}
        </p>
        
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm hover:bg-white/20 transition-colors mb-3"
          data-testid="button-whatsapp"
        >
          <MessageCircle className="w-4 h-4" />
          {lang === 'es' ? 'WhatsApp' : 'WhatsApp'}
        </a>
        <p className="text-white/40 text-xs">
          {lang === 'es' ? 'Tiempo de respuesta promedio: 1 hora' : 'Average response time: 1 hour'}
        </p>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Link href="/last-minute-capital">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-last-minute">
              <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover" />
            </div>
          </Link>
          <Link href="/perfil-asociado">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-perfil-asociado">
              <img src="/perfil-asociado.jpg" alt="Perfil Asociado" className="w-full h-full object-cover" />
            </div>
          </Link>
          <Link href="/modelo-negocios">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-modelo-negocio">
              <img src="/modelo-negocio.jpg" alt="Modelo de Negocio" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-6 flex justify-center">
        <Link href="/home">
          <span 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#0f0f0f] text-sm font-medium tracking-wide hover:bg-white/90 transition-all cursor-pointer rounded-lg"
            data-testid="button-explore"
          >
            {lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'EXPLORE PROPERTIES'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="px-6 pb-10 text-center">
        <p className="text-white/40 text-xs tracking-wide">
          {lang === 'es' ? 'Próximamente en iOS y Android' : 'Coming soon to iOS and Android'}
        </p>
        <p className="text-white/20 text-[10px] mt-4">
          © 2024 All Global Holding LLC
        </p>
      </div>
    </div>
  );
}
