import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, MapPin, ChevronRight, Bed, Bath, Maximize } from 'lucide-react';
import { Header } from '@/components/Header';
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
    <div className="min-h-screen bg-white pb-40">
      <Header />

      {/* Hero con slogan */}
      <section className="px-4 pt-4 pb-3">
        <div className="bg-gradient-to-r from-black to-black rounded-2xl p-5 text-center">
          <h1 className="text-white text-lg font-bold mb-2">Compra • Vive • Renta • Revende • Repite</h1>
          <p className="text-white/90 text-xs">{properties.length} propiedades disponibles</p>
          <div className="flex justify-center gap-6 mt-4 text-white/80 text-xs">
            <div className="text-center">
              <p className="text-white text-lg font-bold">{properties.reduce((sum, p) => sum + (p.totalFractions || 14), 0)}</p>
              <p>Fracciones</p>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-bold">30%</p>
              <p>Enganche</p>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-bold">12</p>
              <p>MSI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-500 rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span className="text-gray-700 text-[10px] font-medium">Servicio llave en mano</span>
          </div>
          <div className="bg-orange-500 rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span className="text-gray-700 text-[10px] font-medium">Nosotros rentamos por ti</span>
          </div>
          <div className="bg-orange-500 rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span className="text-gray-700 text-[10px] font-medium">Plusvalía garantizada</span>
          </div>
          <div className="bg-orange-500 rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span className="text-gray-700 text-[10px] font-medium">Disfruta o genera ingresos</span>
          </div>
        </div>
      </section>

      {/* Grid de propiedades */}
      <section className="px-4 pb-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-2">No hay propiedades aún</p>
            <p className="text-gray-300 text-xs">Agrega propiedades desde el modo creador</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm active:scale-[0.97] transition-transform" data-testid={`property-card-${property.id}`}>
                  {/* Imagen */}
                  <div className="aspect-square relative bg-gray-100">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs">{property.title.split(' ')[0]}</span>
                      </div>
                    )}
                    {property.tag && (
                      <span className="absolute top-1 left-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        {property.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-2">
                    <h3 className="text-gray-900 font-semibold text-[11px] truncate">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-gray-500 text-[9px] mt-0.5">
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
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-orange-500 font-bold text-[11px]">
                        ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
                        <span className="text-gray-400 font-normal text-[9px]">/sem</span>
                      </p>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA fijo */}
      <section className="px-4 pb-6">
        <Link href="/registro">
          <div className="bg-orange-500 rounded-xl p-4 text-center active:scale-[0.98] transition-transform">
            <p className="text-white font-bold">Reserva tu fracción</p>
            <p className="text-white/80 text-xs">Te contactamos en 5 días</p>
          </div>
        </Link>
      </section>

      {/* WhatsApp */}
      <section className="px-4 pb-40">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white font-medium rounded-xl text-sm"
        >
          💬 WhatsApp Directo
        </a>
      </section>
    </div>
  );
}
