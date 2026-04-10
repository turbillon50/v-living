import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { ChevronRight, ArrowRight } from 'lucide-react';

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
  },
];

export default function Experiences() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <img src="/exp-yates.jpg" alt="Yate de lujo en el Caribe" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />

          <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-10 text-center">
            <div className="fl-fade-in">
              <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] mb-3 font-medium">
                {language === 'es' ? 'Beneficio Fractional Living' : 'Fractional Living Benefit'}
              </p>
              <h1 className="text-4xl md:text-5xl text-white tracking-tight leading-[0.95] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-experiences-title">
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </h1>
              <p className="text-white/50 text-sm max-w-md mx-auto mb-5">
                {language === 'es' 
                  ? 'Autos, yates, gastronomía, eventos y más con descuentos exclusivos para miembros.' 
                  : 'Cars, yachts, gastronomy, events and more with exclusive member discounts.'}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/10">
                <span className="text-white font-semibold text-sm">
                  {language === 'es' ? 'Al menos 30% OFF o GRATIS' : 'At least 30% OFF or FREE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 -mt-4 relative z-20 max-w-5xl mx-auto fl-fade-in-delay-1" data-testid="section-experience-trust-badges">
        <div className="overflow-x-auto no-scrollbar -mx-1">
          <div className="flex gap-3 px-1 pb-3" style={{ width: 'max-content' }}>
            {[
              { img: '/auto-super.jpg', text: language === 'es' ? 'Acceso VIP' : 'VIP Access', sub: language === 'es' ? 'Prioridad en reservas' : 'Priority bookings' },
              { img: '/exp-eventos.jpg', text: language === 'es' ? 'Garantizado' : 'Guaranteed', sub: language === 'es' ? 'Servicio certificado' : 'Certified service' },
              { img: '/exp-privadas.jpg', text: language === 'es' ? 'Exclusivo' : 'Exclusive', sub: language === 'es' ? 'Solo miembros' : 'Members only' },
            ].map((item, i) => (
              <div key={i} className="relative w-[180px] rounded-xl overflow-hidden aspect-[16/10] flex-shrink-0" data-testid={`badge-experience-trust-${i}`}>
                <img src={item.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-white text-xs font-semibold">{item.text}</p>
                  <p className="text-white/50 text-[10px]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6 max-w-5xl mx-auto fl-fade-in-delay-2">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl text-[#222] font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
            {language === 'es' ? '8 Categorías de Lujo' : '8 Luxury Categories'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {experienceCategories.map((exp, idx) => (
            <Link key={exp.id} href={exp.href}>
              <div className={`group cursor-pointer relative rounded-2xl overflow-hidden active:scale-[0.97] transition-transform ${idx < 2 ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[3/4]'}`} data-testid={`card-experience-${exp.id}`}>
                <img 
                  src={exp.image} 
                  alt={language === 'es' ? exp.title : exp.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-3 right-3 bg-white text-[#222] text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm tracking-wider uppercase">
                  {exp.benefit}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-base text-white leading-tight mb-1">
                    {language === 'es' ? exp.title : exp.titleEn}
                  </h3>
                  <p className="text-white/50 text-[11px] leading-snug">
                    {language === 'es' ? exp.description : exp.descriptionEn}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1] group">
          <img src="/exp-privadas.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? '¿Necesitas algo especial?' : 'Need something special?'}
            </h3>
            <p className="text-white/50 text-xs mb-4 max-w-sm">
              {language === 'es' 
                ? 'Nuestro equipo concierge tiene acceso a experiencias que no encontrarás en ningún otro lugar.' 
                : 'Our concierge team has access to experiences you won\'t find anywhere else.'}
            </p>
            <a 
              href="https://wa.me/529984292748?text=Hola,%20necesito%20una%20experiencia%20especial%20con%20Fractional%20Living"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#222] text-sm font-semibold px-6 py-3 rounded-xl active:scale-[0.97] transition-transform shadow-lg"
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
