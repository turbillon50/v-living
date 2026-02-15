import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, TrendingUp, Calendar, ChevronDown, X, Waves, Shield, Sun, Star, ArrowRight } from 'lucide-react';
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
    { label: language === 'es' ? 'Propiedades' : 'Properties', href: '/fractional', icon: '🏠' },
    { label: language === 'es' ? 'Experiencias' : 'Experiences', href: '/experiences', icon: '✨' },
    { label: language === 'es' ? 'Invertir' : 'Invest', href: '/invest', icon: '📈' },
    { label: 'Last Minute', href: '/last-minute', icon: '⚡' },
    { label: language === 'es' ? 'Asociados' : 'Associates', href: '/perfil-asociado', icon: '🤝' },
    { label: language === 'es' ? 'Modelo' : 'Model', href: '/modelo-negocios', icon: '💼' },
  ];

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/50 via-[#0a1628]/20 to-[#fafcfd]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2]/15 via-transparent to-[#0891b2]/15" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
            <div className="fl-fade-in">
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" data-testid="hero-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                {language === 'es' ? 'Vive el Caribe' : 'Live the Caribbean'}
              </h1>
              <p className="text-white/60 text-sm font-light max-w-md mx-auto mb-6">
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

      <section className="px-6 -mt-6 relative z-20 max-w-2xl mx-auto fl-fade-in-delay-1">
        <div className="overflow-x-auto no-scrollbar -mx-2">
          <div className="flex gap-3 px-2 pb-2" style={{ width: 'max-content' }}>
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href}>
                <div className="flex flex-col items-center gap-2 min-w-[72px] py-3 px-3 bg-white rounded-2xl shadow-sm shadow-[#0891b2]/8 border border-[#e2e8f0] hover:shadow-md hover:border-[#0891b2]/20 transition-all duration-300 active:scale-95 cursor-pointer">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] text-[#475569] font-medium tracking-wide whitespace-nowrap">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 max-w-2xl mx-auto fl-fade-in-delay-2">
        <div className="fl-gradient-sunset rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-caribbean.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10">
            <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">{language === 'es' ? 'Oportunidad' : 'Opportunity'}</p>
            <p className="text-white text-2xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Invierte desde $195K MXN' : 'Invest from $195K MXN'}
            </p>
            <p className="text-white/50 text-sm font-light mb-4">
              {language === 'es' ? '30% enganche · 12 meses sin intereses' : '30% down payment · 12 months no interest'}
            </p>
            <Link href="/fractional">
              <button className="py-2.5 px-6 fl-btn-primary text-xs inline-flex items-center gap-2">
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
              <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">{language === 'es' ? 'Propiedades' : 'Properties'}</p>
              <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                {language === 'es' ? 'Disponibles' : 'Available'}
              </h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-[#0891b2] flex items-center gap-1 hover:text-[#0e7490] transition-colors duration-200 tracking-wider uppercase font-medium">
                {language === 'es' ? 'Ver todo' : 'View all'} <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto no-scrollbar" ref={scrollRef}>
            <div className="flex gap-5 px-6 pb-4" style={{ width: 'max-content' }}>
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] fl-card active:scale-[0.98] transition-all duration-300 cursor-pointer" data-testid={`card-property-${property.id}`}>
                    <div className="h-48 bg-[#f1f5f9] flex items-center justify-center relative overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="text-center">
                          <Waves className="w-8 h-8 text-[#0891b2]/30 mx-auto mb-2" />
                          <span className="text-lg font-light text-[#cbd5e1]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{property.title.split(' ')[0]}</span>
                        </div>
                      )}
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-[#0891b2] text-white text-[10px] px-2.5 py-1 rounded-lg font-medium tracking-wider uppercase shadow-sm">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-[#0a1628] font-medium text-sm mb-2 truncate">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[11px] text-[#94a3b8] mb-4 font-light">
                        <span>{property.sqMeters}m²</span>
                        <span className="text-[#e2e8f0]">·</span>
                        <span>{property.bedrooms} rec</span>
                        <span className="text-[#e2e8f0]">·</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[#0a1628] font-semibold text-lg">
                            ${((property.price || 650000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-[#94a3b8] text-[10px] font-light tracking-wider">{property.currency || 'MXN'} / fracción</p>
                        </div>
                        <div className="w-8 h-8 rounded-full fl-gradient-turquoise flex items-center justify-center shadow-sm shadow-[#0891b2]/20">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
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
          <div className="fl-card p-10 text-center">
            <Waves className="w-10 h-10 text-[#0891b2]/30 mx-auto mb-3" />
            <p className="text-[#64748b] text-sm mb-1 font-light">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            <p className="text-[#94a3b8] text-xs font-light">{language === 'es' ? 'Agrega propiedades desde el modo creador' : 'Add properties from creator mode'}</p>
          </div>
        </section>
      )}

      <section className="px-6 pb-10 max-w-3xl mx-auto">
        <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium text-center">{language === 'es' ? 'Ventajas' : 'Advantages'}</p>
        <h3 className="text-center mb-8 text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates', color: '#0891b2' },
            { icon: Calendar, title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', desc: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want', color: '#0e7490' },
            { icon: Star, title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', desc: language === 'es' ? 'Genera ingresos' : 'Generate income', color: '#06b6d4' },
            { icon: Shield, title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', desc: language === 'es' ? 'Derechos heredables' : 'Inheritable rights', color: '#22d3ee' },
          ].map((item, i) => (
            <div key={i} className="fl-card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[#0a1628] text-sm font-medium mb-1">{item.title}</p>
              <p className="text-[#94a3b8] text-xs font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-3xl mx-auto">
        <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium text-center">{language === 'es' ? 'Descubre' : 'Discover'}</p>
        <h3 className="text-center mb-6 text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          {language === 'es' ? 'Más Opciones' : 'More Options'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/last-minute-capital">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-[#0a1628]/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Last Minute Capital</p>
              </div>
            </div>
          </Link>
          
          <Link href="/perfil-asociado">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <img src="/perfil-asociado.jpg" alt="Perfil Asociado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-[#0a1628]/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Perfil Asociado</p>
              </div>
            </div>
          </Link>
          
          <Link href="/modelo-negocios">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] active:scale-[0.97] hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <img src="/modelo-negocio.jpg" alt="Modelo de Negocio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-[#0a1628]/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Modelo de Negocio</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <Link href="/fractional">
          <div className="fl-gradient-turquoise rounded-2xl p-6 text-center active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-[#0891b2]/20" data-testid="button-explore-all">
            <p className="text-white font-medium text-base mb-1 tracking-wide">
              {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
            </p>
            <p className="text-white/60 text-sm font-light">
              {properties.length} {language === 'es' ? 'propiedades disponibles' : 'properties available'}
            </p>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="fl-card p-6">
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.25em] mb-2 font-medium">{language === 'es' ? '¿Te interesa?' : 'Interested?'}</p>
          <h3 className="text-[#0a1628] text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-[#94a3b8] text-sm mb-6 font-light">
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
          className="w-full flex items-center justify-between py-4 text-[#64748b] text-sm font-light tracking-wide"
        >
          <span>{language === 'es' ? 'Marco Legal y Respaldo' : 'Legal Framework & Backing'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        
        {showLegal && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { title: language === 'es' ? 'Marco Legal' : 'Legal Framework', desc: language === 'es' ? 'Cesión de derechos fiduciarios' : 'Fiduciary rights assignment' },
              { title: language === 'es' ? 'Operación 24/7' : '24/7 Operation', desc: language === 'es' ? 'Mantenimiento y seguridad' : 'Maintenance & security' },
              { title: language === 'es' ? 'Gestión de Rentas' : 'Rental Management', desc: language === 'es' ? 'Comercialización incluida' : 'Marketing included' },
              { title: language === 'es' ? 'Respaldo' : 'Backing', desc: 'VanDeFi Wallet' },
            ].map((item, i) => (
              <div key={i} className="fl-card p-4">
                <p className="text-[#0a1628] text-xs font-medium mb-1">{item.title}</p>
                <p className="text-[#94a3b8] text-[10px] font-light">{item.desc}</p>
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
        <div className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-[#e2e8f0] flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-colors duration-200">
                <X className="w-5 h-5 text-[#94a3b8]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#64748b] space-y-6 font-light leading-relaxed">
              <div>
                <h3 className="text-[#0a1628] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>¿Por qué Fractional Living?</h3>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales.</p>
                <p className="font-medium text-[#0a1628]">Infraestructura inmobiliaria para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>
              <div className="text-center pt-6 border-t border-[#e2e8f0]">
                <p className="text-[#0a1628] text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Bienvenido a Fractional Living</p>
                <p className="text-sm text-[#94a3b8] mb-3">Sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-[#0a1628] font-medium tracking-wider uppercase text-sm">Compra · Vive · Renta · Revende · Repite</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
