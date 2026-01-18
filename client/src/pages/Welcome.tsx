import { useState } from 'react';
import { Link } from 'wouter';
import { Building2, Compass, Ship, Calendar, Gift, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const worlds = [
  { 
    id: 'propiedades', 
    icon: Building2, 
    title: 'Propiedades', 
    titleEn: 'Properties',
    desc: 'Fracciones inmobiliarias de lujo',
    descEn: 'Luxury real estate fractions',
    link: '/fractional'
  },
  { 
    id: 'experiencias', 
    icon: Compass, 
    title: 'Experiencias', 
    titleEn: 'Experiences',
    desc: 'Aventuras exclusivas',
    descEn: 'Exclusive adventures',
    link: '/experiences'
  },
  { 
    id: 'yachts', 
    icon: Ship, 
    title: 'Yachts', 
    titleEn: 'Yachts',
    desc: 'Navegación de lujo',
    descEn: 'Luxury sailing',
    link: '/fractional'
  },
  { 
    id: 'calendario', 
    icon: Calendar, 
    title: 'Reservas', 
    titleEn: 'Bookings',
    desc: 'Gestiona tu tiempo',
    descEn: 'Manage your time',
    link: '/fractional'
  },
  { 
    id: 'beneficios', 
    icon: Gift, 
    title: 'Beneficios', 
    titleEn: 'Benefits',
    desc: 'Programa de recompensas',
    descEn: 'Rewards program',
    link: '/experiences'
  },
  { 
    id: 'lastminute', 
    icon: Zap, 
    title: 'Last Minute', 
    titleEn: 'Last Minute',
    desc: 'Ofertas especiales',
    descEn: 'Special offers',
    link: '/last-minute'
  },
];

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-sm tracking-wider text-stone-500">ALL GLOBAL HOLDING</span>
        <button 
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          {lang.toUpperCase()}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight mb-3">
            FRACTIONAL LIVING
          </h1>
          <p className="text-stone-500 text-lg font-light">
            {lang === 'es' 
              ? 'Vive, invierte, construye patrimonio'
              : 'Live, invest, build wealth'}
          </p>
        </div>

        {/* Menu Grid */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {worlds.map((world) => (
            <Link key={world.id} href={world.link}>
              <div 
                className={cn(
                  "group relative p-6 md:p-8 border border-stone-800 hover:border-stone-600 transition-all duration-300 cursor-pointer",
                  "hover:bg-stone-900/50"
                )}
                data-testid={`world-${world.id}`}
              >
                <world.icon className="w-6 h-6 text-stone-500 group-hover:text-white transition-colors mb-4" />
                <h3 className="text-lg font-light text-white mb-1">
                  {lang === 'es' ? world.title : world.titleEn}
                </h3>
                <p className="text-sm text-stone-500 group-hover:text-stone-400 transition-colors">
                  {lang === 'es' ? world.desc : world.descEn}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-stone-500 text-sm mb-4">
            {lang === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-stone-700 text-sm text-stone-300 hover:bg-stone-800 hover:border-stone-600 transition-all"
            data-testid="button-whatsapp"
          >
            {lang === 'es' ? 'Hablar con un asesor' : 'Talk to an advisor'}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-stone-600">
          © 2024 All Global Holding LLC
        </p>
      </footer>
    </div>
  );
}
