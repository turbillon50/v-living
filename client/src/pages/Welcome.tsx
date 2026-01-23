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

      <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
        <Link href="/home">
          <span 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white transition-all cursor-pointer"
            data-testid="button-explore"
          >
            {lang === 'es' ? 'EXPLORAR' : 'EXPLORE'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
