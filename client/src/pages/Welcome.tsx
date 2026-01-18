import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Building2, Compass, Ship, Calendar, Calculator, Zap, Settings } from 'lucide-react';
import heroImg from '@/assets/hero-cover.png';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const sections = [
    { id: 'propiedades', icon: Building2, title: lang === 'es' ? 'Propiedades' : 'Properties', link: '/fractional' },
    { id: 'experiencias', icon: Compass, title: lang === 'es' ? 'Experiencias' : 'Experiences', link: '/experiences' },
    { id: 'invertir', icon: Calculator, title: lang === 'es' ? 'Invertir' : 'Invest', link: '/invest' },
    { id: 'yachts', icon: Ship, title: 'Yachts', link: '/fractional' },
    { id: 'calendario', icon: Calendar, title: lang === 'es' ? 'Calendario' : 'Calendar', link: '/invest' },
    { id: 'ofertas', icon: Zap, title: 'Last Minute', link: '/last-minute' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Header */}
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

      {/* Hero Image - Elegant and Centered */}
      <div className="flex items-center justify-center pt-16 pb-8 px-6">
        <img 
          src={heroImg} 
          alt="Fractional Living" 
          className="max-w-md md:max-w-lg lg:max-w-xl h-auto shadow-2xl"
          data-testid="hero-image"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-[#1a1a1a] px-6 py-10">
        {/* Company */}
        <p className="text-center text-white/40 text-xs tracking-[0.3em] uppercase mb-6">
          All Global Holding LLC
        </p>

        {/* Tagline */}
        <p className="text-center text-white/70 text-lg md:text-xl font-extralight max-w-lg mx-auto mb-8">
          {lang === 'es' 
            ? 'Propiedad fraccionada de lujo en el Caribe' 
            : 'Luxury fractional ownership in the Caribbean'}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-10 md:gap-16 mb-10">
          <div className="text-center">
            <p className="text-2xl font-extralight text-[#4db6ac]">$65K</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
              {lang === 'es' ? 'Por fracción' : 'Per fraction'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extralight text-[#4db6ac]">3</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
              {lang === 'es' ? 'Semanas' : 'Weeks'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extralight text-[#4db6ac]">100%</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Legal</p>
          </div>
        </div>

        {/* CTA */}
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

        {/* Navigation */}
        <div className="max-w-2xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-px bg-white/10">
          {sections.map((section) => (
            <Link key={section.id} href={section.link}>
              <div 
                className="bg-[#1a1a1a] p-4 hover:bg-white/5 transition-all cursor-pointer text-center group"
                data-testid={`section-${section.id}`}
              >
                <section.icon className="w-4 h-4 text-white/40 group-hover:text-[#4db6ac] mx-auto mb-2 transition-colors" />
                <p className="text-[10px] text-white/50 group-hover:text-white font-medium tracking-wide transition-colors">
                  {section.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/30 mt-10">
          © 2024 All Global Holding LLC
        </p>
      </div>
    </div>
  );
}
