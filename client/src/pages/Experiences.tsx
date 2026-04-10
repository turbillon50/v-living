import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Car, Ship, UtensilsCrossed, PartyPopper, Headphones, UserCheck, Baby, Palmtree, ChevronRight, Gem, Star, Shield, Crown, ArrowRight, Sparkles } from 'lucide-react';

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
    icon: Car,
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
    icon: Ship,
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
    icon: UtensilsCrossed,
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
    icon: PartyPopper,
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
    icon: Headphones,
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
    icon: UserCheck,
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
    icon: Baby,
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
    icon: Palmtree,
  },
];

export default function Experiences() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[380px] md:h-[460px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/exp-yates.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-white" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-12">
            <div className="fl-fade-in">
              <div className="w-14 h-14 rounded-2xl fl-gradient-brand flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Gem className="w-7 h-7 text-white" />
              </div>
              <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">
                {language === 'es' ? 'Beneficio Fractional Living' : 'Fractional Living Benefit'}
              </p>
              <h1 className="text-4xl md:text-5xl text-white tracking-tight mb-4 font-semibold" data-testid="text-experiences-title">
                {language === 'es' ? 'Experiencias Exclusivas' : 'Exclusive Experiences'}
              </h1>
              <p className="text-white/60 text-sm max-w-lg mx-auto mb-6">
                {language === 'es' 
                  ? 'Accede a un mundo de lujo y privilegios. Autos, yates, gastronomía, eventos y más con descuentos exclusivos para miembros.' 
                  : 'Access a world of luxury and privileges. Cars, yachts, gastronomy, events and more with exclusive member discounts.'}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">
                  {language === 'es' ? 'Al menos 30% OFF o GRATIS' : 'At least 30% OFF or FREE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-4 relative z-20 max-w-5xl mx-auto fl-fade-in-delay-1" data-testid="section-experience-trust-badges">
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: Crown, title: language === 'es' ? 'Acceso VIP' : 'VIP Access', desc: language === 'es' ? 'Prioridad en reservas' : 'Priority bookings' },
            { icon: Shield, title: language === 'es' ? 'Garantizado' : 'Guaranteed', desc: language === 'es' ? 'Servicio certificado' : 'Certified service' },
            { icon: Star, title: language === 'es' ? 'Exclusivo' : 'Exclusive', desc: language === 'es' ? 'Solo miembros' : 'Members only' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#ebebeb] hover:shadow-md transition-all" data-testid={`badge-experience-trust-${i}`}>
              <div className="w-10 h-10 rounded-xl fl-gradient-brand flex items-center justify-center mx-auto mb-2">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[#222] text-xs font-semibold mb-0.5">{item.title}</p>
              <p className="text-[#717171] text-[10px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-5xl mx-auto fl-fade-in-delay-2">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] mb-1 font-semibold">
              {language === 'es' ? 'Catálogo' : 'Catalog'}
            </p>
            <h2 className="text-2xl text-[#222] font-semibold">
              {language === 'es' ? '8 Categorías de Lujo' : '8 Luxury Categories'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experienceCategories.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <Link key={exp.id} href={exp.href}>
                <div className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#ebebeb] hover:shadow-lg active:scale-[0.98] transition-all duration-300 ${idx < 2 ? 'md:col-span-2' : ''}`} data-testid={`card-experience-${exp.id}`}>
                  <div className={`relative overflow-hidden ${idx < 2 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    <img 
                      src={exp.image} 
                      alt={language === 'es' ? exp.title : exp.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-white text-[#222] text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm tracking-wider uppercase">
                      {exp.benefit}
                    </div>
                    {idx < 2 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-semibold text-lg text-white mb-1">
                          {language === 'es' ? exp.title : exp.titleEn}
                        </h3>
                        <p className="text-white/70 text-xs">{language === 'es' ? exp.description : exp.descriptionEn}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-lg fl-gradient-brand flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[#222] truncate">{language === 'es' ? exp.title : exp.titleEn}</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#059669] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-[#717171] leading-relaxed pl-[42px]">{language === 'es' ? exp.description : exp.descriptionEn}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/exp-privadas.jpg)' }} />
          <div className="absolute inset-0 fl-gradient-brand opacity-85" />
          <div className="relative z-10 p-8 text-center">
            <Sparkles className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white text-xl mb-2 font-semibold">
              {language === 'es' 
                ? '¿Necesitas algo especial?' 
                : 'Need something special?'}
            </h3>
            <p className="text-white/70 text-sm mb-5 max-w-sm mx-auto">
              {language === 'es' 
                ? 'Te lo conseguimos. Nuestro equipo concierge tiene acceso a experiencias que no encontrarás en ningún otro lugar.' 
                : 'We\'ll get it for you. Our concierge team has access to experiences you won\'t find anywhere else.'}
            </p>
            <a 
              href="https://wa.me/529984292748?text=Hola,%20necesito%20una%20experiencia%20especial%20con%20Fractional%20Living"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#222] text-sm font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg"
              data-testid="button-concierge-cta"
            >
              {language === 'es' ? 'Contactar Concierge' : 'Contact Concierge'} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <AGHFooter />
    </div>
  );
}
