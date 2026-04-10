import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, ChevronRight, Bed, Bath, Maximize, Waves, ArrowRight, Crown, Shield, TrendingUp, Calendar, Star, MapPin, Gem, Heart } from 'lucide-react';
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
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[380px] md:h-[460px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-caribbean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-white" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-12">
            <div className="fl-fade-in">
              <div className="w-14 h-14 rounded-2xl fl-gradient-brand flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Fractional Living</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-tight mb-3 font-semibold" data-testid="text-fractional-title">
                {language === 'es' ? 'Propiedades Fractional' : 'Fractional Properties'}
              </h1>
              <p className="text-white/70 text-sm max-w-lg mx-auto mb-4">
                {language === 'es' 
                  ? 'Compra · Vive · Renta · Revende · Repite. Tu fracción en el Caribe con derechos heredables.' 
                  : 'Buy · Live · Rent · Resell · Repeat. Your Caribbean fraction with inheritable rights.'}
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{properties.length * 42}</p>
                  <p className="text-[9px] text-white/50 uppercase tracking-[0.15em]">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">30%</p>
                  <p className="text-[9px] text-white/50 uppercase tracking-[0.15em]">{language === 'es' ? 'Enganche' : 'Down payment'}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-[9px] text-white/50 uppercase tracking-[0.15em]">MSI</p>
                </div>
              </div>
              <Link href="/registro">
                <button className="py-3 px-8 fl-btn-primary text-sm inline-flex items-center gap-2" data-testid="button-register-hero">
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
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-[#ebebeb] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl fl-gradient-brand flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#222] text-[11px] font-semibold leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto fl-fade-in-delay-2">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] mb-1 font-semibold">{language === 'es' ? 'Portafolio' : 'Portfolio'}</p>
            <h2 className="text-2xl text-[#222] font-semibold">
              {properties.length} {language === 'es' ? 'Propiedades Disponibles' : 'Properties Available'}
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
              <Crown className="w-6 h-6 text-[#059669] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#ebebeb]">
            <Waves className="w-8 h-8 text-[#059669]/20 mx-auto mb-4" />
            <p className="text-[#717171] text-sm mb-1">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            <p className="text-[#b0b0b0] text-xs">{language === 'es' ? 'Agrega propiedades desde el modo creador' : 'Add properties from creator mode'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property, idx) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className={`bg-white rounded-xl overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group ${idx === 0 ? 'sm:col-span-2 md:col-span-2' : ''}`} data-testid={`property-card-${property.id}`}>
                  <div className={`relative overflow-hidden ${idx === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f7f7f7] flex items-center justify-center">
                        <Waves className="w-8 h-8 text-[#059669]/15" />
                      </div>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm" aria-label="Guardar favorito">
                      <Heart className="w-4 h-4 text-[#222]" />
                    </button>
                    {property.tag && (
                      <span className="absolute top-3 left-3 bg-white text-[#222] text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                        {property.tag}
                      </span>
                    )}
                    {idx === 0 && (
                      <div className="absolute top-3 left-3 bg-white text-[#222] text-[9px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Gem className="w-3 h-3 text-[#059669]" />
                        {language === 'es' ? 'Destacada' : 'Featured'}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-[#222] font-semibold truncate text-sm flex-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Star className="w-3 h-3 fill-[#222] text-[#222]" />
                        <span className="text-xs font-medium">5.0</span>
                      </div>
                    </div>
                    
                    {property.location && (
                      <p className="text-[#717171] text-xs flex items-center gap-1 mb-2">
                        <MapPin className="w-2.5 h-2.5 text-[#059669]" />
                        {property.location}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-[11px] text-[#717171] mb-3">
                      <span className="flex items-center gap-0.5">
                        <Maximize className="w-2.5 h-2.5" />
                        {property.sqMeters}m²
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Bed className="w-2.5 h-2.5" />
                        {property.bedrooms}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-2.5 h-2.5" />
                        {property.bathrooms}
                      </span>
                    </div>
                    
                    <p className="text-[#222] font-semibold">
                      ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
                      <span className="text-[#717171] font-normal text-xs ml-1">/{language === 'es' ? 'sem' : 'wk'}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-10 max-w-3xl mx-auto" data-testid="section-fractional-stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates' },
            { icon: Calendar, title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', desc: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want' },
            { icon: Star, title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', desc: language === 'es' ? 'Genera ingresos' : 'Generate income' },
            { icon: Shield, title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', desc: language === 'es' ? 'Derechos heredables' : 'Inheritable rights' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#ebebeb] hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 rounded-xl fl-gradient-brand flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-[#222] text-sm font-semibold mb-1">{item.title}</p>
              <p className="text-[#717171] text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 fl-gradient-brand opacity-90" />
          <div className="relative z-10 p-8 text-center">
            <p className="text-white/80 text-xs uppercase tracking-[0.2em] mb-2 font-semibold">{language === 'es' ? 'Tu lugar' : 'Your place'}</p>
            <h3 className="text-white text-2xl mb-2 font-semibold">
              {language === 'es' ? 'Reserva tu Fracción' : 'Reserve Your Fraction'}
            </h3>
            <p className="text-white/70 text-sm mb-5">{language === 'es' ? 'Te contactamos en 5 días con opciones personalizadas' : 'We contact you in 5 days with personalized options'}</p>
            <Link href="/registro">
              <button className="py-3 px-8 bg-white text-[#222] text-sm font-semibold rounded-xl inline-flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg" data-testid="button-register-cta">
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
