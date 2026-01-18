import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Building2, Compass, Ship, Calendar } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const t = {
    subtitle: lang === 'es' ? 'Propiedad fraccionada de lujo en el Caribe' : 'Luxury fractional ownership in the Caribbean',
    explore: lang === 'es' ? 'Explorar Propiedades' : 'Explore Properties',
    contact: lang === 'es' ? 'Contactar Asesor' : 'Contact Advisor',
    properties: lang === 'es' ? 'Propiedades' : 'Properties',
    propertiesDesc: lang === 'es' ? 'Fracciones de bienes raíces de lujo' : 'Luxury real estate fractions',
    experiences: lang === 'es' ? 'Experiencias' : 'Experiences',
    experiencesDesc: lang === 'es' ? 'Aventuras exclusivas en el Caribe' : 'Exclusive Caribbean adventures',
    yachts: lang === 'es' ? 'Yachts' : 'Yachts',
    yachtsDesc: lang === 'es' ? 'Navegación de lujo' : 'Luxury sailing',
    calendar: lang === 'es' ? 'Calendario' : 'Calendar',
    calendarDesc: lang === 'es' ? 'Reserva tu tiempo' : 'Book your time',
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-stone-200">
        <span className="text-xs tracking-[0.2em] text-stone-400 uppercase">All Global Holding LLC</span>
        <button 
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          data-testid="button-language"
        >
          <Globe className="w-4 h-4" />
          {lang.toUpperCase()}
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={logoImg} 
            alt="Fractional Living" 
            className="h-32 md:h-44 w-auto"
            data-testid="logo"
          />
        </div>

        <p className="text-center text-stone-500 text-lg md:text-xl font-light max-w-xl mb-12">
          {t.subtitle}
        </p>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/home">
            <span 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d3a3a] text-white text-sm tracking-wide hover:bg-[#3d4a4a] transition-colors cursor-pointer"
              data-testid="button-explore"
            >
              {t.explore}
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
            {t.contact}
          </a>
        </div>

        {/* Categories */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard 
              icon={Building2} 
              title={t.properties} 
              desc={t.propertiesDesc}
              link="/fractional"
            />
            <CategoryCard 
              icon={Compass} 
              title={t.experiences} 
              desc={t.experiencesDesc}
              link="/experiences"
            />
            <CategoryCard 
              icon={Ship} 
              title={t.yachts} 
              desc={t.yachtsDesc}
              link="/fractional"
            />
            <CategoryCard 
              icon={Calendar} 
              title={t.calendar} 
              desc={t.calendarDesc}
              link="/fractional"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-stone-200 bg-white">
        <p className="text-xs text-stone-400">
          © 2024 All Global Holding LLC. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function CategoryCard({ 
  icon: Icon, 
  title, 
  desc, 
  link 
}: { 
  icon: any; 
  title: string; 
  desc: string; 
  link: string;
}) {
  return (
    <Link href={link}>
      <div 
        className="group bg-white border border-stone-200 p-6 hover:border-[#4db6ac] hover:shadow-sm transition-all cursor-pointer h-full"
        data-testid={`card-${title.toLowerCase()}`}
      >
        <Icon className="w-6 h-6 text-[#4db6ac] mb-4" />
        <h3 className="font-medium text-stone-800 mb-1">{title}</h3>
        <p className="text-sm text-stone-500">{desc}</p>
      </div>
    </Link>
  );
}
