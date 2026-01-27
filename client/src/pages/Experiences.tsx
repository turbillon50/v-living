import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { Sparkles, Car, Ship, UtensilsCrossed, PartyPopper, Headphones, UserCheck, Baby, Palmtree } from 'lucide-react';

const experienceCategories = [
  { 
    id: 1, 
    title: 'Autos de Lujo', 
    description: 'Sedanes, SUVs y super autos premium',
    benefit: '40% OFF',
    image: '/auto-sedan.jpg',
    href: '/autos-lujo',
    icon: Car
  },
  { 
    id: 2, 
    title: 'Yates y Embarcaciones', 
    description: 'Navegación exclusiva en el Caribe mexicano',
    benefit: '30% OFF o GRATIS',
    image: '/exp-yates.jpg',
    href: '/exp-yates',
    icon: Ship
  },
  { 
    id: 3, 
    title: 'Restaurantes Selectos', 
    description: 'Gastronomía de clase mundial en Tulum',
    benefit: '30% OFF',
    image: '/exp-restaurantes.jpg',
    href: '/exp-restaurantes',
    icon: UtensilsCrossed
  },
  { 
    id: 4, 
    title: 'Eventos Privados', 
    description: 'Celebraciones únicas y memorables',
    benefit: '30% OFF',
    image: '/exp-eventos.jpg',
    href: '/exp-eventos',
    icon: PartyPopper
  },
  { 
    id: 5, 
    title: 'Conserjería 24/7', 
    description: 'Asistencia personalizada en todo momento',
    benefit: 'INCLUIDO',
    image: '/exp-concierge.jpg',
    href: '/exp-concierge',
    icon: Headphones
  },
  { 
    id: 6, 
    title: 'Choferes Privados', 
    description: 'Transporte ejecutivo y discreto',
    benefit: '30% OFF',
    image: '/exp-chofer.jpg',
    href: '/exp-chofer',
    icon: UserCheck
  },
  { 
    id: 7, 
    title: 'Servicios de Niñeras', 
    description: 'Cuidado profesional certificado',
    benefit: '30% OFF',
    image: '/exp-nineras.jpg',
    href: '/exp-nineras',
    icon: Baby
  },
  { 
    id: 8, 
    title: 'Experiencias Privadas', 
    description: 'Aventuras exclusivas diseñadas para ti',
    benefit: '30% OFF o GRATIS',
    image: '/exp-privadas.jpg',
    href: '/exp-privadas',
    icon: Palmtree
  },
];

export default function Experiences() {
  return (
    <div className="min-h-screen bg-white pb-40">
      <Header />

      <section className="px-4 pt-4 pb-3">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h1 className="text-white text-lg font-bold">Experiencias Exclusivas</h1>
          </div>
          <p className="text-white/90 text-sm mb-2">Beneficio Fractional Living</p>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-yellow-300 font-bold text-lg">Al menos 30% OFF o GRATIS</p>
            <p className="text-white/80 text-xs">En todas las experiencias para miembros</p>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {experienceCategories.map((exp) => {
            const Icon = exp.icon;
            const content = (
              <div 
                key={exp.id} 
                className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={exp.image} 
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full">
                    {exp.benefit}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-sm text-gray-900">{exp.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            );

            return <Link key={exp.id} href={exp.href}>{content}</Link>;
          })}
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm mb-2">
            ¿Necesitas algo especial? <span className="font-bold text-purple-600">Te lo conseguimos.</span>
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20necesito%20una%20experiencia%20especial%20con%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Contactar Concierge
          </a>
        </div>
      </section>
    </div>
  );
}
