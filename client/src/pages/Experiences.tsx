import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { Car, Ship, UtensilsCrossed, PartyPopper, Headphones, UserCheck, Baby, Palmtree } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-6 pt-12 pb-10 max-w-3xl mx-auto text-center agh-fade-in">
        <p className="text-[10px] text-[#aaa] uppercase tracking-[0.25em] mb-3 font-light">Beneficio Fractional Living</p>
        <h1 className="text-3xl md:text-4xl text-[#111] tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          Experiencias Exclusivas
        </h1>
        <div className="inline-block border border-[#ddd] rounded-md px-6 py-3">
          <p className="text-[#111] font-medium text-sm tracking-wider">Al menos 30% OFF o GRATIS</p>
          <p className="text-[#999] text-xs font-light">En todas las experiencias para miembros</p>
        </div>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto agh-fade-in-delay-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experienceCategories.map((exp) => {
            const Icon = exp.icon;
            return (
              <Link key={exp.id} href={exp.href}>
                <div className="group cursor-pointer bg-white border border-[#eee] rounded-md overflow-hidden hover:border-[#999] transition-all duration-200">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={exp.image} 
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-[#111] text-white text-[9px] font-medium px-2 py-1 rounded-sm tracking-wider uppercase">
                      {exp.benefit}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-[#555]" />
                      <h3 className="font-medium text-sm text-[#111]">{exp.title}</h3>
                    </div>
                    <p className="text-xs text-[#999] font-light leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 border border-[#eee] rounded-md p-6 text-center">
          <p className="text-[#888] text-sm mb-3 font-light">
            ¿Necesitas algo especial? <span className="font-medium text-[#111]">Te lo conseguimos.</span>
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20necesito%20una%20experiencia%20especial%20con%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#111] hover:bg-[#000] text-white text-sm font-medium px-8 py-3 rounded-md transition-colors duration-200 tracking-wide"
          >
            Contactar Concierge
          </a>
        </div>
      </section>

      <AGHFooter />
    </div>
  );
}
