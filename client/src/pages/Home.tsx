import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, TrendingUp, Calendar, ChevronDown, X, Waves, Shield, Sun, Star, ArrowRight, Crown, Plane, Hotel, Building2, Zap, Handshake, Briefcase, Gem, Compass, Heart } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Home() {
  const { language } = useLanguage();
  const [showLegal, setShowLegal] = useState(false);
  const [showBeneficios, setShowBeneficios] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const featuredProperties = properties.slice(0, 6);

  const categories = [
    { label: language === 'es' ? 'Propiedades' : 'Properties', href: '/fractional', Icon: Crown },
    { label: language === 'es' ? 'Experiencias' : 'Experiences', href: '/experiences', Icon: Gem },
    { label: language === 'es' ? 'Inmobiliaria' : 'Real Estate', href: '/inmobiliaria', Icon: Building2 },
    { label: language === 'es' ? 'Créditos' : 'Credits', href: '/creditos', Icon: Shield },
    { label: language === 'es' ? 'Vuelos' : 'Flights', href: '/vuelos', Icon: Plane },
    { label: language === 'es' ? 'Hoteles' : 'Hotels', href: '/hoteles', Icon: Hotel },
    { label: language === 'es' ? 'Invertir' : 'Invest', href: '/invest', Icon: TrendingUp },
    { label: 'Last Minute', href: '/last-minute', Icon: Zap },
    { label: language === 'es' ? 'Asociados' : 'Associates', href: '/perfil-asociado', Icon: Handshake },
    { label: language === 'es' ? 'Modelo' : 'Model', href: '/modelo-negocios', Icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-white" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
            <div className="fl-fade-in">
              <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Fractional Living</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-tight mb-3 font-semibold" data-testid="hero-title">
                {language === 'es' ? 'Vive el Caribe' : 'Live the Caribbean'}
              </h1>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-6">
                {language === 'es' ? 'Servicio llave en mano. Nosotros rentamos por ti.' : 'Turnkey service. We rent for you.'}
              </p>
              <Link href="/fractional">
                <button className="py-3 px-8 fl-btn-primary text-sm inline-flex items-center gap-2" data-testid="button-explore-hero">
                  {language === 'es' ? 'Ver Propiedades' : 'View Properties'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 -mt-6 relative z-20 max-w-3xl mx-auto fl-fade-in-delay-1">
        <div className="overflow-x-auto no-scrollbar -mx-1">
          <div className="flex gap-2 px-1 pb-2" style={{ width: 'max-content' }}>
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href}>
                <div className="flex flex-col items-center gap-1.5 min-w-[68px] py-3 px-2 bg-white rounded-2xl shadow-sm border border-[#ebebeb] hover:shadow-md hover:border-[#059669]/30 transition-all active:scale-95 cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl fl-gradient-brand flex items-center justify-center group-hover:shadow-md transition-all">
                    <cat.Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] text-[#717171] font-medium tracking-tight whitespace-nowrap">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 max-w-2xl mx-auto fl-fade-in-delay-2">
        <div className="fl-gradient-brand rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-caribbean.jpg')] bg-cover bg-center opacity-15" />
          <div className="relative z-10">
            <p className="text-white/80 text-xs uppercase tracking-[0.2em] mb-2 font-semibold">{language === 'es' ? 'Oportunidad' : 'Opportunity'}</p>
            <p className="text-white text-2xl font-semibold mb-1">
              {language === 'es' ? 'Invierte desde $195K MXN' : 'Invest from $195K MXN'}
            </p>
            <p className="text-white/70 text-sm mb-4">
              {language === 'es' ? '30% enganche · 12 meses sin intereses' : '30% down payment · 12 months no interest'}
            </p>
            <Link href="/fractional">
              <button className="py-2.5 px-6 bg-white text-[#222] rounded-xl text-xs font-semibold inline-flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg">
                {language === 'es' ? 'Conocer más' : 'Learn more'} <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {featuredProperties.length > 0 && (
        <section className="pb-10 fl-fade-in-delay-2">
          <div className="px-6 mb-5 flex items-end justify-between max-w-7xl mx-auto">
            <div>
              <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] mb-1 font-semibold">{language === 'es' ? 'Propiedades' : 'Properties'}</p>
              <h2 className="text-2xl text-[#222] font-semibold">
                {language === 'es' ? 'Disponibles' : 'Available'}
              </h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-[#059669] flex items-center gap-1 hover:text-[#047857] transition-colors tracking-wider uppercase font-semibold">
                {language === 'es' ? 'Ver todo' : 'View all'} <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto no-scrollbar" ref={scrollRef}>
            <div className="flex gap-4 px-6 pb-4" style={{ width: 'max-content' }}>
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] bg-white rounded-xl overflow-hidden border border-[#ebebeb] hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group" data-testid={`card-property-${property.id}`}>
                    <div className="h-48 bg-[#f7f7f7] relative overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Waves className="w-8 h-8 text-[#059669]/20" />
                        </div>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors" aria-label="Guardar favorito">
                        <Heart className="w-4 h-4 text-[#222]" />
                      </button>
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-white text-[#222] text-[10px] px-2.5 py-1 rounded-lg font-semibold shadow-sm">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-[#222] font-semibold text-sm truncate flex-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <Star className="w-3 h-3 fill-[#222] text-[#222]" />
                          <span className="text-xs font-medium text-[#222]">5.0</span>
                        </div>
                      </div>
                      
                      <p className="text-[#717171] text-xs mb-1">{property.location}</p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-[#717171] mb-3">
                        <span>{property.sqMeters}m²</span>
                        <span>·</span>
                        <span>{property.bedrooms} rec</span>
                        <span>·</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <p className="text-[#222] font-semibold">
                        ${((property.price || 650000) / 1000).toFixed(0)}K
                        <span className="text-[#717171] font-normal text-xs ml-1">{property.currency || 'MXN'} / fracción</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {properties.length === 0 && (
        <section className="px-6 pb-10 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#ebebeb] p-10 text-center">
            <Waves className="w-10 h-10 text-[#059669]/20 mx-auto mb-3" />
            <p className="text-[#717171] text-sm mb-1">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            <p className="text-[#b0b0b0] text-xs">{language === 'es' ? 'Agrega propiedades desde el modo creador' : 'Add properties from creator mode'}</p>
          </div>
        </section>
      )}

      <section className="px-6 pb-10 max-w-3xl mx-auto">
        <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold text-center">{language === 'es' ? 'Ventajas' : 'Advantages'}</p>
        <h3 className="text-center mb-8 text-2xl text-[#222] font-semibold">
          {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates' },
            { icon: Calendar, title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', desc: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want' },
            { icon: Star, title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', desc: language === 'es' ? 'Genera ingresos' : 'Generate income' },
            { icon: Shield, title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', desc: language === 'es' ? 'Derechos heredables' : 'Inheritable rights' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#ebebeb] hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl fl-gradient-brand flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[#222] text-sm font-semibold mb-1">{item.title}</p>
              <p className="text-[#717171] text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-3xl mx-auto">
        <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold text-center">{language === 'es' ? 'Descubre' : 'Discover'}</p>
        <h3 className="text-center mb-6 text-2xl text-[#222] font-semibold">
          {language === 'es' ? 'Más Opciones' : 'More Options'}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/last-minute-capital">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all group cursor-pointer">
              <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-semibold leading-tight tracking-wider uppercase">Last Minute Capital</p>
              </div>
            </div>
          </Link>
          
          <Link href="/perfil-asociado">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all group cursor-pointer">
              <img src="/perfil-asociado.jpg" alt="Perfil Asociado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-semibold leading-tight tracking-wider uppercase">Perfil Asociado</p>
              </div>
            </div>
          </Link>
          
          <Link href="/modelo-negocios">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all group cursor-pointer">
              <img src="/modelo-negocio.jpg" alt="Modelo de Negocio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-semibold leading-tight tracking-wider uppercase">Modelo de Negocio</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <Link href="/fractional">
          <div className="fl-gradient-brand rounded-2xl p-6 text-center active:scale-[0.98] transition-all cursor-pointer shadow-lg" data-testid="button-explore-all">
            <p className="text-white font-semibold text-base mb-1 tracking-wide">
              {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
            </p>
            <p className="text-white/70 text-sm">
              {properties.length} {language === 'es' ? 'propiedades disponibles' : 'properties available'}
            </p>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#ebebeb] p-6">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold">{language === 'es' ? '¿Te interesa?' : 'Interested?'}</p>
          <h3 className="text-[#222] text-xl mb-2 font-semibold">
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-[#717171] text-sm mb-6">
            {language === 'es' ? 'Te contactamos en menos de 5 días con opciones personalizadas.' : 'We contact you in less than 5 days with personalized options.'}
          </p>
          <Link href="/registro">
            <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3.5 fl-btn-primary text-sm" data-testid="button-register">
              {language === 'es' ? 'Registrarme' : 'Register'} <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-8 max-w-2xl mx-auto">
        <button 
          onClick={() => setShowLegal(!showLegal)}
          className="w-full flex items-center justify-between py-4 text-[#717171] text-sm tracking-wide border-t border-[#ebebeb]"
        >
          <span>{language === 'es' ? 'Marco Legal y Respaldo' : 'Legal Framework & Backing'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        
        {showLegal && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { title: language === 'es' ? 'Marco Legal' : 'Legal Framework', desc: language === 'es' ? 'Cesión de derechos fiduciarios' : 'Fiduciary rights assignment' },
              { title: language === 'es' ? 'Operación 24/7' : '24/7 Operation', desc: language === 'es' ? 'Mantenimiento y seguridad' : 'Maintenance & security' },
              { title: language === 'es' ? 'Gestión de Rentas' : 'Rental Management', desc: language === 'es' ? 'Comercialización incluida' : 'Marketing included' },
              { title: language === 'es' ? 'Respaldo' : 'Backing', desc: 'VanDeFi Wallet' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#ebebeb] p-4 hover:shadow-sm transition-all">
                <p className="text-[#222] text-xs font-semibold mb-1">{item.title}</p>
                <p className="text-[#717171] text-[10px]">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20broker/influencer%20de%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 fl-btn-outline text-sm"
          data-testid="button-broker"
        >
          {language === 'es' ? '¿Quieres ser Broker? Comisiones 6%+' : 'Want to be a Broker? 6%+ commissions'}
        </a>
      </section>

      <AGHFooter />

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-[#ebebeb] flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-lg text-[#222] font-semibold">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors">
                <X className="w-5 h-5 text-[#717171]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#717171] space-y-6 leading-relaxed">
              <div>
                <h3 className="text-[#222] font-semibold text-base mb-2">¿Por qué Fractional Living?</h3>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales.</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>
              <div className="text-center pt-6 border-t border-[#ebebeb]">
                <p className="text-[#222] text-lg mb-2 font-semibold">Bienvenido a Fractional Living</p>
                <p className="text-sm text-[#717171] mb-3">Sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-[#222] font-semibold tracking-wider uppercase text-sm">Compra · Vive · Renta · Revende · Repite</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
