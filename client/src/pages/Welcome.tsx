import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Globe, ArrowRight, Settings } from 'lucide-react';
import heroImg from '@/assets/hero-cover.png';

interface NavButton {
  id: string;
  name: string;
  nameEn: string | null;
  link: string;
  image: string | null;
  isActive: boolean;
}

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const { data: navButtons = [] } = useQuery<NavButton[]>({
    queryKey: ['/api/nav-buttons'],
  });

  const mainButtons = navButtons.filter(b => b.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
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

      <div className="flex items-center justify-center pt-16 pb-8 px-6">
        <img 
          src={heroImg} 
          alt="Fractional Living" 
          className="max-w-md md:max-w-lg lg:max-w-xl h-auto shadow-2xl"
          data-testid="hero-image"
        />
      </div>

      <div className="flex-1 bg-[#1a1a1a] px-6 py-10">
        <p className="text-center text-white/40 text-xs tracking-[0.3em] uppercase mb-6">
          All Global Holding LLC
        </p>

        <p className="text-center text-white/70 text-lg md:text-xl font-extralight max-w-lg mx-auto mb-10">
          {lang === 'es' 
            ? 'Propiedad fraccionada de lujo en el Caribe' 
            : 'Luxury fractional ownership in the Caribbean'}
        </p>

        {mainButtons.length > 0 ? (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {mainButtons.map((btn) => (
              <Link key={btn.id} href={btn.link}>
                <div 
                  className="relative aspect-[16/9] bg-white/5 overflow-hidden cursor-pointer group hover:bg-white/10 transition-all"
                  data-testid={`nav-button-${btn.id}`}
                >
                  {btn.image ? (
                    <img 
                      src={btn.image} 
                      alt={btn.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-extralight text-white/20">{btn.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium text-sm tracking-wide">
                      {lang === 'es' ? btn.name : (btn.nameEn || btn.name)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { name: 'Last Minute Capital', link: '/last-minute-capital' },
              { name: 'Perfil Asociado', link: '/perfil-asociado' },
              { name: 'Modelo de Negocios', link: '/modelo-negocios' }
            ].map((btn, i) => (
              <Link key={i} href={btn.link}>
                <div 
                  className="relative aspect-[16/9] bg-white/5 overflow-hidden cursor-pointer group hover:bg-white/10 transition-all border border-white/10"
                  data-testid={`nav-button-default-${i}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-extralight text-white/20">{btn.name.charAt(0)}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium text-sm tracking-wide">{btn.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/home">
            <span 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white/90 transition-all cursor-pointer w-full sm:w-auto"
              data-testid="button-explore"
            >
              {lang === 'es' ? 'EXPLORAR' : 'EXPLORE'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-all"
            data-testid="button-contact"
          >
            {lang === 'es' ? 'CONTACTAR' : 'CONTACT'}
          </a>
        </div>

        <p className="text-center text-[10px] text-white/30 mt-10">
          © 2024 All Global Holding LLC
        </p>
      </div>
    </div>
  );
}
