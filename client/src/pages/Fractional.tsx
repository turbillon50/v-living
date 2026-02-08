import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, ChevronRight, Bed, Bath, Maximize } from 'lucide-react';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { getProperties } from '@/lib/api';

import type { Property } from '@shared/schema';

export default function Fractional() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-6 pt-12 pb-10 max-w-3xl mx-auto text-center agh-fade-in">
        <h1 className="text-3xl md:text-4xl text-[#111] tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
        </h1>
        <p className="text-[#888] text-sm font-light mb-8">{properties.length} propiedades disponibles</p>
        <div className="flex justify-center gap-10">
          <div className="text-center">
            <p className="text-2xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{properties.length * 42}</p>
            <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">Fracciones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>30%</p>
            <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">Enganche</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>12</p>
            <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">MSI</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-4 max-w-5xl mx-auto agh-fade-in-delay-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Servicio llave en mano', 'Nosotros rentamos por ti', 'Plusvalía garantizada', 'Disfruta o genera ingresos'].map((text) => (
            <div key={text} className="bg-[#111] rounded-md p-3 flex items-center gap-2">
              <span className="text-white/50 text-xs">✓</span>
              <span className="text-white/80 text-[10px] font-light tracking-wide">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto agh-fade-in-delay-2">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#999]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#999] text-sm font-light mb-1">No hay propiedades aún</p>
            <p className="text-[#ccc] text-xs font-light">Agrega propiedades desde el modo creador</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="bg-white rounded-md overflow-hidden border border-[#eee] hover:border-[#999] active:scale-[0.98] transition-all duration-200" data-testid={`property-card-${property.id}`}>
                  <div className="aspect-square relative bg-[#f5f5f5]">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#ddd] text-xs font-light">{property.title.split(' ')[0]}</span>
                      </div>
                    )}
                    {property.tag && (
                      <span className="absolute top-2 left-2 bg-[#111] text-white text-[8px] font-medium px-2 py-0.5 rounded-sm tracking-wider uppercase">
                        {property.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-[#111] font-medium text-[12px] truncate mb-1">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-[#999] text-[9px] font-light mb-2">
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
                      <p className="text-[#111] font-medium text-[12px]">
                        ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
                        <span className="text-[#bbb] font-light text-[9px] ml-0.5">/sem</span>
                      </p>
                      <ChevronRight className="w-3 h-3 text-[#ccc]" />
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
          <div className="bg-[#111] rounded-md p-5 text-center active:scale-[0.98] transition-all duration-200 hover:bg-[#000]">
            <p className="text-white font-medium tracking-wide">Reserva tu fracción</p>
            <p className="text-white/40 text-xs font-light">Te contactamos en 5 días</p>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-6 max-w-2xl mx-auto">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#111] text-[#111] font-medium rounded-md text-sm hover:bg-[#111] hover:text-white transition-all duration-200"
        >
          WhatsApp Directo
        </a>
      </section>

      <AGHFooter />
    </div>
  );
}
