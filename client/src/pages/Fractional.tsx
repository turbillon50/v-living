import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, ChevronRight, Bed, Bath, Maximize, Waves, ArrowRight, Crown, Shield, TrendingUp, Calendar, Star, MapPin, Gem } from 'lucide-react';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { getProperties } from '@/lib/api';

import type { Property } from '@shared/schema';

export default function Fractional() {
  const { language } = useLanguage();
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-caribbean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/20 to-[#fafcfd]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2]/10 via-transparent to-[#0891b2]/10" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#0891b2]/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[#22d3ee]/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-12">
            <div className="fl-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#0891b2]/30">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-fractional-title">
                {language === 'es' ? 'Propiedades Fractional' : 'Fractional Properties'}
              </h1>
              <p className="text-white/50 text-sm font-light max-w-lg mx-auto mb-4">
                {language === 'es' 
                  ? 'Compra · Vive · Renta · Revende · Repite. Tu fracción en el Caribe con derechos heredables.' 
                  : 'Buy · Live · Rent · Resell · Repeat. Your Caribbean fraction with inheritable rights.'}
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{properties.length * 42}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>30%</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">{language === 'es' ? 'Enganche' : 'Down payment'}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>12</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">MSI</p>
                </div>
              </div>
              <Link href="/registro">
                <button className="py-3 px-8 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white text-sm rounded-xl inline-flex items-center gap-2 shadow-lg shadow-[#0891b2]/30 hover:from-[#0e7490] hover:to-[#0891b2] transition-all" data-testid="button-register-hero">
                  {language === 'es' ? 'Reservar Fracción' : 'Reserve Fraction'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-6 relative z-20 max-w-5xl mx-auto fl-fade-in-delay-1" data-testid="section-fractional-benefits">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Shield, text: language === 'es' ? 'Servicio llave en mano' : 'Turnkey service' },
            { icon: TrendingUp, text: language === 'es' ? 'Plusvalía garantizada' : 'Guaranteed appreciation' },
            { icon: Calendar, text: language === 'es' ? 'Nosotros rentamos por ti' : 'We rent for you' },
            { icon: Star, text: language === 'es' ? 'Disfruta o genera ingresos' : 'Enjoy or generate income' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-[#e2e8f0] hover:shadow-md hover:border-[#0891b2]/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center flex-shrink-0 shadow-sm">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#0a1628] text-[11px] font-medium leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto fl-fade-in-delay-2">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">{language === 'es' ? 'Portafolio' : 'Portfolio'}</p>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
              {properties.length} {language === 'es' ? 'Propiedades Disponibles' : 'Properties Available'}
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#0891b2]/20 border-t-[#0891b2] rounded-full animate-spin" />
              <Crown className="w-6 h-6 text-[#0891b2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 fl-card rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2]/10 to-[#22d3ee]/10 flex items-center justify-center mx-auto mb-4">
              <Waves className="w-8 h-8 text-[#0891b2]/30" />
            </div>
            <p className="text-[#64748b] text-sm font-light mb-1">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            <p className="text-[#94a3b8] text-xs font-light">{language === 'es' ? 'Agrega propiedades desde el modo creador' : 'Add properties from creator mode'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {properties.map((property, idx) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0] hover:shadow-xl hover:border-[#0891b2]/20 active:scale-[0.98] transition-all duration-300 cursor-pointer group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} data-testid={`property-card-${property.id}`}>
                  <div className={`relative overflow-hidden ${idx === 0 ? 'aspect-[16/10]' : 'aspect-square'}`}>
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0891b2]/5 to-[#22d3ee]/5 flex items-center justify-center">
                        <Waves className="w-8 h-8 text-[#0891b2]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {property.tag && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white text-[8px] font-medium px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-sm">
                        {property.tag}
                      </span>
                    )}
                    {idx === 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0a1628] text-[9px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Gem className="w-3 h-3 text-[#0891b2]" />
                        {language === 'es' ? 'Destacada' : 'Featured'}
                      </div>
                    )}
                  </div>
                  
                  <div className={`${idx === 0 ? 'p-5' : 'p-3'}`}>
                    <h3 className={`text-[#0a1628] font-medium truncate mb-1.5 ${idx === 0 ? 'text-base' : 'text-[12px]'}`} style={{ fontFamily: idx === 0 ? "'Cormorant Garamond', Georgia, serif" : undefined }}>
                      {property.title}
                    </h3>
                    
                    {property.location && (
                      <p className="text-[#94a3b8] text-[10px] flex items-center gap-1 mb-2">
                        <MapPin className="w-2.5 h-2.5 text-[#0891b2]" />
                        {property.location}
                      </p>
                    )}
                    
                    <div className={`flex items-center gap-1.5 text-[#94a3b8] font-light mb-3 ${idx === 0 ? 'text-xs' : 'text-[9px]'}`}>
                      <span className="flex items-center gap-0.5">
                        <Maximize className="w-2.5 h-2.5" />
                        {property.sqMeters}m²
                      </span>
                      <span className="text-[#e2e8f0]">·</span>
                      <span className="flex items-center gap-0.5">
                        <Bed className="w-2.5 h-2.5" />
                        {property.bedrooms}
                      </span>
                      <span className="text-[#e2e8f0]">·</span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-2.5 h-2.5" />
                        {property.bathrooms}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-[#0a1628] font-semibold ${idx === 0 ? 'text-lg' : 'text-[13px]'}`}>
                          ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
                          <span className="text-[#94a3b8] font-light text-[9px] ml-0.5">/{language === 'es' ? 'sem' : 'wk'}</span>
                        </p>
                      </div>
                      <div className={`rounded-full bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center shadow-sm shadow-[#0891b2]/20 ${idx === 0 ? 'w-10 h-10' : 'w-7 h-7'}`}>
                        <ArrowRight className={`text-white ${idx === 0 ? 'w-5 h-5' : 'w-3.5 h-3.5'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-10 max-w-3xl mx-auto" data-testid="section-fractional-stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates', gradient: 'from-[#0891b2] to-[#06b6d4]' },
            { icon: Calendar, title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', desc: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want', gradient: 'from-[#06b6d4] to-[#22d3ee]' },
            { icon: Star, title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', desc: language === 'es' ? 'Genera ingresos' : 'Generate income', gradient: 'from-[#0e7490] to-[#0891b2]' },
            { icon: Shield, title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', desc: language === 'es' ? 'Derechos heredables' : 'Inheritable rights', gradient: 'from-[#0891b2] to-[#22d3ee]' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] hover:shadow-md transition-all text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-[#0a1628] text-sm font-medium mb-1">{item.title}</p>
              <p className="text-[#94a3b8] text-xs font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 to-[#0891b2]/70" />
          <div className="relative z-10 p-8 text-center">
            <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">{language === 'es' ? 'Tu lugar' : 'Your place'}</p>
            <h3 className="text-white text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
              {language === 'es' ? 'Reserva tu Fracción' : 'Reserve Your Fraction'}
            </h3>
            <p className="text-white/50 text-sm font-light mb-5">{language === 'es' ? 'Te contactamos en 5 días con opciones personalizadas' : 'We contact you in 5 days with personalized options'}</p>
            <Link href="/registro">
              <button className="py-3 px-8 bg-white text-[#0a1628] text-sm font-medium rounded-xl inline-flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg" data-testid="button-register-cta">
                {language === 'es' ? 'Registrarme Ahora' : 'Register Now'} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-6 max-w-2xl mx-auto">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 fl-btn-outline text-sm"
          data-testid="link-whatsapp-fractional"
        >
          WhatsApp Directo
        </a>
      </section>

      <AGHFooter />
    </div>
  );
}
