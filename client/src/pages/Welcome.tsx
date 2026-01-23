import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Settings } from 'lucide-react';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  return (
    <div className="min-h-screen relative">
      <img 
        src="/welcome-bg.jpg" 
        alt="Fractional Living" 
        className="absolute inset-0 w-full h-full object-cover"
        data-testid="welcome-background"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-end px-6 md:px-12 py-4">
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

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-10 px-6">
        <Link href="/last-minute-capital">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform" data-testid="button-last-minute">
            <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover" />
          </div>
        </Link>
        
        <Link href="/home">
          <span 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white transition-all cursor-pointer"
            data-testid="button-explore"
          >
            {lang === 'es' ? 'EXPLORAR' : 'EXPLORE'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        
        <p className="text-white/50 text-xs tracking-wide">
          {lang === 'es' ? 'Próximamente en iOS y Android' : 'Coming soon to iOS and Android'}
        </p>
      </div>
    </div>
  );
}
