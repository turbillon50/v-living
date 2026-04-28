import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { PropertyCardCarousel } from '@/components/PropertyCardCarousel';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
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
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const filteredProperties = activeTab === 'all'
    ? properties
    : properties.filter(p => p.category === activeTab);

  const displayProperties = filteredProperties;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />
      
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="relative h-[520px] md:h-[620px]">
          <img src="/hero-ocean.jpg" alt="Vista aérea del Caribe mexicano" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(0,180,216,0.22),transparent_38%)]" />
          
          <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-12 text-center">
            <div className="fl-fade-in max-w-2xl">
              <p className="text-cyan-300/75 text-[10px] uppercase tracking-[0.35em] mb-3 font-semibold">All Global Holding LLC · V-Living</p>
              <h1 className="text-5xl md:text-7xl text-white tracking-tight leading-[0.9] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title">
                {language === 'es' ? 'Vive, invierte y accede al Caribe' : 'Live, invest and access the Caribbean'}
              </h1>
              <p className="text-white/62 text-sm md:text-base max-w-lg mx-auto mb-7 leading-relaxed">
                {language === 'es' ? 'V-Living integra acceso fraccional, activos premium, hospitalidad y operación comercial dentro del ecosistema All Global Holding.' : 'V-Living integrates fractional access, premium assets, hospitality and commercial operation within the All Global Holding ecosystem.'}
              </p>
              <Link href="/fractional">
                <button className="py-3.5 px-8 bg-white text-black rounded-2xl text-sm font-semibold inline-flex items-center gap-2 active:scale-[0.97] transition-transform shadow-2xl shadow-cyan-500/10" data-testid="button-explore-hero">
                  {language === 'es' ? 'Ver Propiedades' : 'View Properties'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="overflow-x-auto no-scrollbar" ref={tabsRef}>
          <div className="flex gap-0 px-4 py-3" style={{ width: 'max-content' }}>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 min-w-[64px] transition-all ${
                  activeTab === tab.key ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <div className={`w-12 h-12 rounded-xl overflow-hidden border ${activeTab === tab.key ? 'border-cyan-300 shadow-lg shadow-cyan-500/10' : 'border-white/10'}`}>
                  <img src={tab.img} alt="" className="w-full h-full object-cover" />
                </div>
                <span className={`text-[10px] whitespace-nowrap ${activeTab === tab.key ? 'text-white font-bold' : 'text-white/50 font-medium'}`}>
                  {language === 'es' ? tab.labelEs : tab.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-[2.2/1] active:scale-[0.98] transition-transform cursor-pointer group border border-cyan-300/20 bg-white/5">
          <img src="/hero-caribbean.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center pl-6">
            <p className="text-cyan-200/75 text-[10px] uppercase tracking-[0.2em] mb-1">{language === 'es' ? 'Oportunidad institucional' : 'Institutional opportunity'}</p>
            <p className="text-white text-xl font-semibold mb-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Desde $195K MXN' : 'From $195K MXN'}
            </p>
            <p className="text-white/55 text-xs">30% enganche · 12 MSI</p>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="px-5 mb-4 flex items-end justify-between max-w-7xl mx-auto">
          <h2 className="text-xl text-white font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
            {language === 'es' ? 'Propiedades Disponibles' : 'Available Properties'}
          </h2>
          <Link href="/fractional">
            <span className="text-xs text-white/50 flex items-center gap-1 hover:text-cyan-300 transition-colors font-medium">
              {language === 'es' ? 'Ver todo' : 'View all'} <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
        
        {displayProperties.length > 0 ? (
          <div className="px-5 max-w-7xl mx-auto" data-testid="property-grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayProperties.slice(0, 12).map((property) => (
                <PropertyCardCarousel key={property.id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-5 max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-white/5" data-testid="empty-category">
              <img src="/hero-ocean.jpg" alt="Vista del Caribe" className="w-full h-full object-cover opacity-25" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-white/55 text-sm mb-1">
                  {language === 'es' ? 'No hay propiedades en esta categoría' : 'No properties in this category'}
                </p>
                <button onClick={() => setActiveTab('all')} className="text-cyan-300 text-sm font-medium mt-2" data-testid="button-show-all">
                  {language === 'es' ? 'Ver todas' : 'Show all'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-5 pb-8 max-w-3xl mx-auto">
        <h3 className="text-xl text-white mb-4 font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
          {language === 'es' ? '¿Por qué V-Living?' : 'Why V-Living?'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { img: '/attik-2.jpg', title: language === 'es' ? 'Activo Premium' : 'Premium Asset', sub: language === 'es' ? 'Uso, renta y reventa' : 'Use, rent and resale' },
            { img: '/almyria-1.jpg', title: language === 'es' ? 'Acceso Flexible' : 'Flexible Access', sub: language === 'es' ? 'Suma semanas' : 'Add weeks' },
            { img: '/exp-privadas.jpg', title: language === 'es' ? 'Operación Comercial' : 'Commercial Operation', sub: language === 'es' ? 'Genera ingresos' : 'Generate income' },
            { img: '/hermitage-2.jpg', title: language === 'es' ? 'Estructura Institucional' : 'Institutional Structure', sub: language === 'es' ? 'All Global Holding LLC' : 'All Global Holding LLC' },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group border border-white/10 bg-white/5">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-cyan-200/55 text-[11px] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 max-w-3xl mx-auto">
        <h3 className="text-xl text-white mb-4 font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
          {language === 'es' ? 'Ecosistema V-Living' : 'V-Living Ecosystem'}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { img: '/last-minute-capital.jpg', label: 'Last Minute Capital', href: '/last-minute-capital' },
            { img: '/perfil-asociado.jpg', label: language === 'es' ? 'Perfil Asociado' : 'Associate Profile', href: '/perfil-asociado' },
            { img: '/modelo-negocio.jpg', label: language === 'es' ? 'Modelo de Negocio' : 'Business Model', href: '/modelo-negocios' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] transition-transform group cursor-pointer border border-white/10 bg-white/5">
                <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
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
          <div className="relative rounded-2xl overflow-hidden aspect-[2.5/1] active:scale-[0.98] transition-transform cursor-pointer group border border-white/10 bg-white/5" data-testid="button-explore-all">
            <img src="/attik-3.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
              </p>
              <p className="text-white/55 text-xs mt-1">{properties.length} {language === 'es' ? 'disponibles' : 'available'}</p>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-cyan-300/20 bg-white/5">
          <img src="/hero-caribbean.jpg" alt="" className="w-full aspect-[16/9] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-cyan-300 text-[10px] uppercase tracking-[0.25em] mb-1 font-semibold">{language === 'es' ? 'Acceso institucional' : 'Institutional access'}</p>
            <h3 className="text-white text-lg mb-1 font-semibold">{language === 'es' ? 'Solicita información' : 'Request information'}</h3>
            <p className="text-white/55 text-xs mb-4">{language === 'es' ? 'Un asesor te contactará para revisar disponibilidad, fracciones y proceso.' : 'An advisor will contact you to review availability, fractions and process.'}</p>
            <Link href="/registro">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform" data-testid="button-register">
                {language === 'es' ? 'Solicitar acceso' : 'Request access'} <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 max-w-2xl mx-auto">
        <button 
          onClick={() => setShowLegal(!showLegal)}
          className="w-full flex items-center justify-between py-4 text-white/55 text-sm border-t border-white/10"
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
              { title: language === 'es' ? 'Respaldo' : 'Backing', desc: 'All Global Holding LLC' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white text-xs font-semibold mb-0.5">{item.title}</p>
                <p className="text-white/45 text-[10px]">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20conocer%20V-Living%20de%20All%20Global%20Holding"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 border border-cyan-300/30 text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform hover:bg-cyan-300/10"
          data-testid="button-broker"
        >
          {language === 'es' ? 'Quiero ser broker / aliado V-Living' : 'I want to be a V-Living broker / partner'}
        </a>
      </section>

      <AGHFooter />
    </div>
  );
}
