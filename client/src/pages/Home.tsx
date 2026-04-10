import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { PropertyCardCarousel } from '@/components/PropertyCardCarousel';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useState, useRef } from 'react';

const CATEGORY_TABS = [
  { key: 'all', labelEs: 'Todo', labelEn: 'All', img: '/hero-ocean.jpg' },
  { key: 'fractional', labelEs: 'Fracciones', labelEn: 'Fractions', img: '/attik-1.jpg' },
  { key: 'yachts', labelEs: 'Yates', labelEn: 'Yachts', img: '/exp-yates.jpg' },
  { key: 'experiences', labelEs: 'Experiencias', labelEn: 'Experiences', img: '/exp-privadas.jpg' },
  { key: 'luxury-cars', labelEs: 'Autos de Lujo', labelEn: 'Luxury Cars', img: '/auto-sedan.jpg' },
  { key: 'dining', labelEs: 'Restaurantes', labelEn: 'Dining', img: '/exp-restaurantes.jpg' },
  { key: 'events', labelEs: 'Eventos', labelEn: 'Events', img: '/exp-eventos.jpg' },
  { key: 'concierge', labelEs: 'Concierge', labelEn: 'Concierge', img: '/exp-concierge.jpg' },
];

export default function Home() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [showLegal, setShowLegal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const filteredProperties = activeTab === 'all'
    ? properties
    : properties.filter(p => p.category === activeTab);

  const displayProperties = filteredProperties.length > 0 ? filteredProperties : properties;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="relative h-[480px] md:h-[560px]">
          <img src="/hero-ocean.jpg" alt="Vista aérea del Caribe mexicano" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />
          
          <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-10 text-center">
            <div className="fl-fade-in">
              <h1 className="text-5xl md:text-6xl text-white tracking-tight leading-[0.95] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title">
                {language === 'es' ? 'Vive el Caribe' : 'Live the Caribbean'}
              </h1>
              <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
                {language === 'es' ? 'Propiedad fraccionada de lujo. Servicio llave en mano.' : 'Luxury fractional property. Turnkey service.'}
              </p>
              <Link href="/fractional">
                <button className="py-3.5 px-8 bg-white text-[#222] rounded-2xl text-sm font-semibold inline-flex items-center gap-2 active:scale-[0.97] transition-transform shadow-2xl" data-testid="button-explore-hero">
                  {language === 'es' ? 'Ver Propiedades' : 'View Properties'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-30 bg-white border-b border-[#ebebeb]">
        <div className="overflow-x-auto no-scrollbar" ref={tabsRef}>
          <div className="flex gap-0 px-4 py-2" style={{ width: 'max-content' }}>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 min-w-[64px] transition-all ${
                  activeTab === tab.key ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <div className={`w-12 h-12 rounded-xl overflow-hidden ${activeTab === tab.key ? 'ring-2 ring-[#222] ring-offset-2' : ''}`}>
                  <img src={tab.img} alt="" className="w-full h-full object-cover" />
                </div>
                <span className={`text-[10px] whitespace-nowrap ${activeTab === tab.key ? 'text-[#222] font-bold' : 'text-[#717171] font-medium'}`}>
                  {language === 'es' ? tab.labelEs : tab.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-[2.2/1] active:scale-[0.98] transition-transform cursor-pointer group">
          <img src="/hero-caribbean.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center pl-6">
            <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-1">{language === 'es' ? 'Oportunidad' : 'Opportunity'}</p>
            <p className="text-white text-xl font-semibold mb-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Desde $195K MXN' : 'From $195K MXN'}
            </p>
            <p className="text-white/50 text-xs">30% enganche · 12 MSI</p>
          </div>
        </div>
      </section>

      {displayProperties.length > 0 && (
        <section className="pb-8">
          <div className="px-5 mb-4 flex items-end justify-between max-w-7xl mx-auto">
            <h2 className="text-xl text-[#222] font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
              {language === 'es' ? 'Propiedades Disponibles' : 'Available Properties'}
            </h2>
            <Link href="/fractional">
              <span className="text-xs text-[#717171] flex items-center gap-1 hover:text-[#222] transition-colors font-medium">
                {language === 'es' ? 'Ver todo' : 'View all'} <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto no-scrollbar" ref={scrollRef}>
            <div className="flex gap-4 px-5 pb-4" style={{ width: 'max-content' }}>
              {displayProperties.slice(0, 8).map((property) => (
                <div key={property.id} className="w-[300px] flex-shrink-0">
                  <PropertyCardCarousel property={property} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {properties.length === 0 && (
        <section className="px-5 pb-8 max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
            <img src="/hero-ocean.jpg" alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#717171] text-sm">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-8 max-w-3xl mx-auto">
        <h3 className="text-xl text-[#222] mb-4 font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
          {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { img: '/attik-2.jpg', title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', sub: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates' },
            { img: '/almyria-1.jpg', title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', sub: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want' },
            { img: '/exp-privadas.jpg', title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', sub: language === 'es' ? 'Genera ingresos' : 'Generate income' },
            { img: '/hermitage-2.jpg', title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', sub: language === 'es' ? 'Derechos heredables' : 'Inheritable rights' },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-white/50 text-[11px] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 max-w-3xl mx-auto">
        <h3 className="text-xl text-[#222] mb-4 font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
          {language === 'es' ? 'Descubre Más' : 'Discover More'}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { img: '/last-minute-capital.jpg', label: 'Last Minute Capital', href: '/last-minute-capital' },
            { img: '/perfil-asociado.jpg', label: language === 'es' ? 'Perfil Asociado' : 'Associate Profile', href: '/perfil-asociado' },
            { img: '/modelo-negocio.jpg', label: language === 'es' ? 'Modelo de Negocio' : 'Business Model', href: '/modelo-negocios' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] transition-transform group cursor-pointer">
                <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-[11px] font-semibold leading-tight">{item.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <Link href="/fractional">
          <div className="relative rounded-2xl overflow-hidden aspect-[2.5/1] active:scale-[0.98] transition-transform cursor-pointer group" data-testid="button-explore-all">
            <img src="/attik-3.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
              </p>
              <p className="text-white/50 text-xs mt-1">{properties.length} {language === 'es' ? 'disponibles' : 'available'}</p>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img src="/hero-caribbean.jpg" alt="" className="w-full aspect-[16/9] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] mb-1 font-semibold">{language === 'es' ? '¿Te interesa?' : 'Interested?'}</p>
            <h3 className="text-[#222] text-lg mb-1 font-semibold">{language === 'es' ? 'Regístrate' : 'Register'}</h3>
            <p className="text-[#717171] text-xs mb-4">{language === 'es' ? 'Te contactamos en menos de 5 días.' : 'We contact you in less than 5 days.'}</p>
            <Link href="/registro">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#222] text-white text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform" data-testid="button-register">
                {language === 'es' ? 'Registrarme' : 'Register'} <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 max-w-2xl mx-auto">
        <button 
          onClick={() => setShowLegal(!showLegal)}
          className="w-full flex items-center justify-between py-4 text-[#717171] text-sm border-t border-[#ebebeb]"
        >
          <span>{language === 'es' ? 'Marco Legal y Respaldo' : 'Legal Framework'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        {showLegal && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { title: language === 'es' ? 'Marco Legal' : 'Legal Framework', desc: language === 'es' ? 'Cesión de derechos fiduciarios' : 'Fiduciary rights' },
              { title: language === 'es' ? 'Operación 24/7' : '24/7 Operation', desc: language === 'es' ? 'Mantenimiento y seguridad' : 'Maintenance & security' },
              { title: language === 'es' ? 'Gestión de Rentas' : 'Rental Management', desc: language === 'es' ? 'Comercialización incluida' : 'Marketing included' },
              { title: language === 'es' ? 'Respaldo' : 'Backing', desc: 'VanDeFi Wallet' },
            ].map((item, i) => (
              <div key={i} className="bg-[#f7f7f7] rounded-xl p-4">
                <p className="text-[#222] text-xs font-semibold mb-0.5">{item.title}</p>
                <p className="text-[#717171] text-[10px]">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20broker/influencer%20de%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 border border-[#222] text-[#222] rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
          data-testid="button-broker"
        >
          {language === 'es' ? '¿Quieres ser Broker? Comisiones 6%+' : 'Want to be a Broker? 6%+ commissions'}
        </a>
      </section>

      <AGHFooter />
    </div>
  );
}
