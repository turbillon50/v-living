import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Car, Ship, UtensilsCrossed, PartyPopper, Headphones, UserCheck, Baby, Palmtree, ChevronRight } from 'lucide-react';

const experienceCategories = [
  { 
    id: 1, 
    title: 'Autos de Lujo', 
    titleEn: 'Luxury Cars',
    description: 'Sedanes, SUVs y super autos premium',
    descriptionEn: 'Sedans, SUVs and premium super cars',
    benefit: '40% OFF',
    image: '/auto-sedan.jpg',
    href: '/autos-lujo',
    icon: Car
  },
  { 
    id: 2, 
    title: 'Yates y Embarcaciones', 
    titleEn: 'Yachts & Boats',
    description: 'Navegación exclusiva en el Caribe mexicano',
    descriptionEn: 'Exclusive navigation in the Mexican Caribbean',
    benefit: '30% OFF o GRATIS',
    image: '/exp-yates.jpg',
    href: '/exp-yates',
    icon: Ship
  },
  { 
    id: 3, 
    title: 'Restaurantes Selectos', 
    titleEn: 'Fine Dining',
    description: 'Gastronomía de clase mundial en Tulum',
    descriptionEn: 'World-class gastronomy in Tulum',
    benefit: '30% OFF',
    image: '/exp-restaurantes.jpg',
    href: '/exp-restaurantes',
    icon: UtensilsCrossed
  },
  { 
    id: 4, 
    title: 'Eventos Privados', 
    titleEn: 'Private Events',
    description: 'Celebraciones únicas y memorables',
    descriptionEn: 'Unique and memorable celebrations',
    benefit: '30% OFF',
    image: '/exp-eventos.jpg',
    href: '/exp-eventos',
    icon: PartyPopper
  },
  { 
    id: 5, 
    title: 'Conserjería 24/7', 
    titleEn: 'Concierge 24/7',
    description: 'Asistencia personalizada en todo momento',
    descriptionEn: 'Personalized assistance at all times',
    benefit: 'INCLUIDO',
    image: '/exp-concierge.jpg',
    href: '/exp-concierge',
    icon: Headphones
  },
  { 
    id: 6, 
    title: 'Choferes Privados', 
    titleEn: 'Private Chauffeurs',
    description: 'Transporte ejecutivo y discreto',
    descriptionEn: 'Executive and discreet transportation',
    benefit: '30% OFF',
    image: '/exp-chofer.jpg',
    href: '/exp-chofer',
    icon: UserCheck
  },
  { 
    id: 7, 
    title: 'Servicios de Niñeras', 
    titleEn: 'Nanny Services',
    description: 'Cuidado profesional certificado',
    descriptionEn: 'Certified professional care',
    benefit: '30% OFF',
    image: '/exp-nineras.jpg',
    href: '/exp-nineras',
    icon: Baby
  },
  { 
    id: 8, 
    title: 'Experiencias Privadas', 
    titleEn: 'Private Experiences',
    description: 'Aventuras exclusivas diseñadas para ti',
    descriptionEn: 'Exclusive adventures designed for you',
    benefit: '30% OFF o GRATIS',
    image: '/exp-privadas.jpg',
    href: '/exp-privadas',
    icon: Palmtree
  },
];

export default function Experiences() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />

      <section className="px-6 pt-12 pb-10 max-w-3xl mx-auto text-center fl-fade-in">
        <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.25em] mb-3 font-medium">
          {language === 'es' ? 'Beneficio Fractional Living' : 'Fractional Living Benefit'}
        </p>
        <h1 className="text-3xl md:text-4xl text-[#0a1628] tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          {language === 'es' ? 'Experiencias Exclusivas' : 'Exclusive Experiences'}
        </h1>
        <div className="inline-block fl-gradient-turquoise rounded-xl px-6 py-3 shadow-sm shadow-[#0891b2]/20">
          <p className="text-white font-medium text-sm tracking-wider">
            {language === 'es' ? 'Al menos 30% OFF o GRATIS' : 'At least 30% OFF or FREE'}
          </p>
          <p className="text-white/60 text-xs font-light">
            {language === 'es' ? 'En todas las experiencias para miembros' : 'On all member experiences'}
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto fl-fade-in-delay-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experienceCategories.map((exp) => {
            const Icon = exp.icon;
            return (
              <Link key={exp.id} href={exp.href}>
                <div className="group cursor-pointer fl-card overflow-hidden active:scale-[0.98] transition-all duration-200">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={exp.image} 
                      alt={language === 'es' ? exp.title : exp.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-[#0891b2] text-white text-[9px] font-medium px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-sm">
                      {exp.benefit}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg fl-gradient-turquoise flex items-center justify-center">
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-medium text-sm text-[#0a1628]">{language === 'es' ? exp.title : exp.titleEn}</h3>
                    </div>
                    <p className="text-xs text-[#94a3b8] font-light leading-relaxed">{language === 'es' ? exp.description : exp.descriptionEn}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 fl-card p-6 text-center">
          <p className="text-[#64748b] text-sm mb-3 font-light">
            {language === 'es' 
              ? '¿Necesitas algo especial? ' 
              : 'Need something special? '}
            <span className="font-medium text-[#0a1628]">
              {language === 'es' ? 'Te lo conseguimos.' : 'We\'ll get it for you.'}
            </span>
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20necesito%20una%20experiencia%20especial%20con%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 fl-btn-primary text-sm px-8 py-3"
          >
            {language === 'es' ? 'Contactar Concierge' : 'Contact Concierge'} <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <AGHFooter />
    </div>
  );
}
