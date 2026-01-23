import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Settings } from 'lucide-react';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="relative h-[55vh]">
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

      <div className="px-6 py-5 text-center">
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-3">
          {lang === 'es' 
            ? 'Contamos con ALIX, nuestra asistente de inteligencia artificial disponible 24/7. Búscala en el botón morado para resolver cualquier duda.'
            : 'We have ALIX, our AI assistant available 24/7. Find her on the purple button to resolve any questions.'}
        </p>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          {lang === 'es' 
            ? 'Para hablar con un representante humano, usa el botón verde de WhatsApp. Tiempo de respuesta promedio: 1 hora.'
            : 'To speak with a human representative, use the green WhatsApp button. Average response time: 1 hour.'}
        </p>
      </div>

      <div className="px-4 pb-5">
        <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
          <Link href="/last-minute-capital">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-last-minute">
              <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
                <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover" />
              </div>
              <div className="text-center mt-2">
                <p className="text-white text-[10px] md:text-xs font-semibold tracking-wide">LAST MINUTE CAPITAL</p>
                <p className="text-white/50 text-[9px] md:text-[10px] mt-0.5">
                  {lang === 'es' ? 'Inversión a corto plazo' : 'Short-term investment'}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/perfil-asociado">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-perfil-asociado">
              <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
                <img src="/perfil-asociado.jpg" alt="Profile Associate" className="w-full h-full object-cover" />
              </div>
              <div className="text-center mt-2">
                <p className="text-white text-[10px] md:text-xs font-semibold tracking-wide">PROFILE ASSOCIATE</p>
                <p className="text-white/50 text-[9px] md:text-[10px] mt-0.5 leading-tight">
                  {lang === 'es' ? 'Invierte con tu buen perfil o asocia tu propiedad' : 'Invest with your good profile or associate your property'}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/modelo-negocios">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-modelo-negocio">
              <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
                <img src="/modelo-negocio.jpg" alt="Business Model" className="w-full h-full object-cover" />
              </div>
              <div className="text-center mt-2">
                <p className="text-white text-[10px] md:text-xs font-semibold tracking-wide">BUSINESS MODEL</p>
                <p className="text-white/50 text-[9px] md:text-[10px] mt-0.5">
                  {lang === 'es' ? 'Cómo funciona todo el ecosistema' : 'How the whole ecosystem works'}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-5 flex justify-center">
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

      <div className="px-6 pb-8 text-center">
        <p className="text-white/40 text-xs tracking-wide">
          {lang === 'es' ? 'Próximamente en iOS y Android' : 'Coming soon to iOS and Android'}
        </p>
        <p className="text-white/20 text-[10px] mt-3">
          © 2024 All Global Holding LLC
        </p>
      </div>
    </div>
  );
}
