import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Building2, Compass, Ship, Calendar, Calculator, Zap, Settings } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const sections = [
    { 
      id: 'propiedades',
      icon: Building2, 
      title: lang === 'es' ? 'Propiedades' : 'Properties',
      link: '/fractional'
    },
    { 
      id: 'experiencias',
      icon: Compass, 
      title: lang === 'es' ? 'Experiencias' : 'Experiences',
      link: '/experiences'
    },
    { 
      id: 'invertir',
      icon: Calculator, 
      title: lang === 'es' ? 'Invertir' : 'Invest',
      link: '/invest'
    },
    { 
      id: 'yachts',
      icon: Ship, 
      title: 'Yachts',
      link: '/fractional'
    },
    { 
      id: 'calendario',
      icon: Calendar, 
      title: lang === 'es' ? 'Calendario' : 'Calendar',
      link: '/invest'
    },
    { 
      id: 'ofertas',
      icon: Zap, 
      title: 'Last Minute',
      link: '/last-minute'
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6">
        <span className="text-xs tracking-[0.3em] text-white/40 uppercase font-light">All Global Holding</span>
        <div className="flex items-center gap-6">
          <Link href="/creator">
            <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
              <Settings className="w-4 h-4" />
            </span>
          </Link>
          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Hero - Full Screen */}
      <main className="min-h-screen flex flex-col items-center justify-center px-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Logo Container */}
          <div className="mb-16">
            <div className="inline-block bg-white p-12 md:p-16 shadow-2xl">
              <img 
                src={logoImg} 
                alt="Fractional Living" 
                className="h-32 md:h-48 lg:h-56 w-auto"
                data-testid="logo"
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white/50 text-lg md:text-xl font-extralight tracking-wide max-w-xl mx-auto mb-16">
            {lang === 'es' 
              ? 'Propiedad fraccionada de lujo en el Caribe' 
              : 'Luxury fractional ownership in the Caribbean'}
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-12 md:gap-20 mb-20">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extralight text-[#4db6ac]">$65K</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {lang === 'es' ? 'Por fracción' : 'Per fraction'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extralight text-[#4db6ac]">3</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {lang === 'es' ? 'Semanas/año' : 'Weeks/year'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extralight text-[#4db6ac]">100%</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {lang === 'es' ? 'Legal' : 'Legal'}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/home">
              <span 
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white/90 transition-all cursor-pointer"
                data-testid="button-explore"
              >
                {lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'EXPLORE PROPERTIES'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <a 
              href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-all"
              data-testid="button-contact"
            >
              {lang === 'es' ? 'CONTACTAR ASESOR' : 'CONTACT ADVISOR'}
            </a>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
            {sections.map((section) => (
              <Link key={section.id} href={section.link}>
                <div 
                  className="group p-6 md:p-8 border border-white/10 hover:border-[#4db6ac]/50 hover:bg-white/5 transition-all cursor-pointer"
                  data-testid={`section-${section.id}`}
                >
                  <section.icon className="w-5 h-5 text-white/40 group-hover:text-[#4db6ac] mx-auto mb-3 transition-colors" />
                  <p className="text-xs text-white/60 group-hover:text-white font-medium tracking-wide transition-colors">
                    {section.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <p className="text-xs text-white/30">
          © 2024 All Global Holding LLC
        </p>
      </footer>
    </div>
  );
}
