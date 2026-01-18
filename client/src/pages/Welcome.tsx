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
      desc: lang === 'es' ? 'Fracciones de bienes raíces' : 'Real estate fractions',
      link: '/fractional'
    },
    { 
      id: 'experiencias',
      icon: Compass, 
      title: lang === 'es' ? 'Experiencias' : 'Experiences',
      desc: lang === 'es' ? 'Aventuras exclusivas' : 'Exclusive adventures',
      link: '/experiences'
    },
    { 
      id: 'calculadora',
      icon: Calculator, 
      title: lang === 'es' ? 'Calculadora' : 'Calculator',
      desc: lang === 'es' ? 'Calcula tu inversión' : 'Calculate investment',
      link: '/invest'
    },
    { 
      id: 'calendario',
      icon: Calendar, 
      title: lang === 'es' ? 'Calendario' : 'Calendar',
      desc: lang === 'es' ? 'Reserva semanas' : 'Book weeks',
      link: '/invest'
    },
    { 
      id: 'yachts',
      icon: Ship, 
      title: 'Yachts',
      desc: lang === 'es' ? 'Navegación de lujo' : 'Luxury sailing',
      link: '/fractional'
    },
    { 
      id: 'lastminute',
      icon: Zap, 
      title: 'Last Minute',
      desc: lang === 'es' ? 'Ofertas especiales' : 'Special offers',
      link: '/last-minute'
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-stone-200">
        <span className="text-xs tracking-[0.2em] text-stone-400 uppercase">All Global Holding LLC</span>
        <div className="flex items-center gap-4">
          <Link href="/creator">
            <span className="text-stone-400 hover:text-stone-600 cursor-pointer">
              <Settings className="w-4 h-4" />
            </span>
          </Link>
          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-10">
          <img 
            src={logoImg} 
            alt="Fractional Living" 
            className="h-28 md:h-40 w-auto"
            data-testid="logo"
          />
        </div>

        <p className="text-center text-stone-500 text-lg md:text-xl font-light max-w-xl mb-10">
          {lang === 'es' 
            ? 'Propiedad fraccionada de lujo en el Caribe' 
            : 'Luxury fractional ownership in the Caribbean'}
        </p>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <Link href="/home">
            <span 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d3a3a] text-white text-sm tracking-wide hover:bg-[#3d4a4a] transition-colors cursor-pointer"
              data-testid="button-explore"
            >
              {lang === 'es' ? 'Explorar' : 'Explore'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-stone-300 text-stone-700 text-sm tracking-wide hover:border-stone-500 hover:bg-white transition-colors"
            data-testid="button-contact"
          >
            {lang === 'es' ? 'Contactar' : 'Contact'}
          </a>
        </div>

        {/* Sections Grid */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sections.map((section) => (
              <Link key={section.id} href={section.link}>
                <div 
                  className="group bg-white border border-stone-200 p-5 hover:border-[#4db6ac] hover:shadow-sm transition-all cursor-pointer h-full text-center"
                  data-testid={`section-${section.id}`}
                >
                  <section.icon className="w-6 h-6 text-[#4db6ac] mx-auto mb-3" />
                  <h3 className="font-medium text-stone-800 text-sm mb-1">{section.title}</h3>
                  <p className="text-xs text-stone-500">{section.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-stone-200 bg-white">
        <p className="text-xs text-stone-400">
          © 2024 All Global Holding LLC
        </p>
      </footer>
    </div>
  );
}
