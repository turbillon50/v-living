import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, ChevronRight, Bed, Bath, Maximize, Waves, ArrowRight } from 'lucide-react';
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

      <section className="px-6 pt-12 pb-10 max-w-3xl mx-auto text-center fl-fade-in">
        <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium">Fractional Living</p>
        <h1 className="text-3xl md:text-4xl text-[#0a1628] tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
        </h1>
        <p className="text-[#94a3b8] text-sm font-light mb-8">{properties.length} {language === 'es' ? 'propiedades disponibles' : 'properties available'}</p>
        <div className="flex justify-center gap-10">
          <div className="text-center">
            <p className="text-2xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{properties.length * 42}</p>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>30%</p>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light">{language === 'es' ? 'Enganche' : 'Down payment'}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>12</p>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light">MSI</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-4 max-w-5xl mx-auto fl-fade-in-delay-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            language === 'es' ? 'Servicio llave en mano' : 'Turnkey service',
            language === 'es' ? 'Nosotros rentamos por ti' : 'We rent for you',
            language === 'es' ? 'Plusvalía garantizada' : 'Guaranteed appreciation',
            language === 'es' ? 'Disfruta o genera ingresos' : 'Enjoy or generate income'
          ].map((text) => (
            <div key={text} className="fl-gradient-turquoise rounded-xl p-3 flex items-center gap-2 shadow-sm shadow-[#0891b2]/20">
              <span className="text-white/70 text-xs">✓</span>
              <span className="text-white/90 text-[10px] font-light tracking-wide">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto fl-fade-in-delay-2">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#0891b2]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 fl-card">
            <Waves className="w-10 h-10 text-[#0891b2]/30 mx-auto mb-3" />
            <p className="text-[#64748b] text-sm font-light mb-1">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            <p className="text-[#94a3b8] text-xs font-light">{language === 'es' ? 'Agrega propiedades desde el modo creador' : 'Add properties from creator mode'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="fl-card overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer group" data-testid={`property-card-${property.id}`}>
                  <div className="aspect-square relative bg-[#f1f5f9] overflow-hidden">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Waves className="w-8 h-8 text-[#0891b2]/20" />
                      </div>
                    )}
                    {property.tag && (
                      <span className="absolute top-2 left-2 bg-[#0891b2] text-white text-[8px] font-medium px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-sm">
                        {property.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-[#0a1628] font-medium text-[12px] truncate mb-1">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-[#94a3b8] text-[9px] font-light mb-2">
                      <span className="flex items-center gap-0.5">
                        <Maximize className="w-2.5 h-2.5" />
                        {property.sqMeters}m²
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bed className="w-2.5 h-2.5" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-2.5 h-2.5" />
                        {property.bathrooms}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-[#0a1628] font-medium text-[12px]">
                        ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
                        <span className="text-[#94a3b8] font-light text-[9px] ml-0.5">/sem</span>
                      </p>
                      <div className="w-6 h-6 rounded-full fl-gradient-turquoise flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <Link href="/registro">
          <div className="fl-gradient-sunset rounded-2xl p-5 text-center active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#0891b2]/15">
            <p className="text-white font-medium tracking-wide">{language === 'es' ? 'Reserva tu fracción' : 'Reserve your fraction'}</p>
            <p className="text-white/50 text-xs font-light">{language === 'es' ? 'Te contactamos en 5 días' : 'We contact you in 5 days'}</p>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-6 max-w-2xl mx-auto">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 fl-btn-outline text-sm"
        >
          WhatsApp Directo
        </a>
      </section>

      <AGHFooter />
    </div>
  );
}
