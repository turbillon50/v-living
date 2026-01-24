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
  });

  const attikProperties = properties.filter(p => p.title?.includes('ATTIK'));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      {/* Hero compacto */}
      <section className="px-4 pt-4 pb-6">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-5 text-center">
          <h1 className="text-white text-xl font-bold mb-1">ATTIK TULUM</h1>
          <p className="text-white/90 text-sm">10 propiedades • $650K - $1,050K MXN</p>
          <div className="flex justify-center gap-6 mt-4 text-white/80 text-xs">
            <div className="text-center">
              <p className="text-white text-lg font-bold">14</p>
              <p>Fracciones</p>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-bold">3</p>
              <p>Semanas/año</p>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-bold">30%</p>
              <p>Enganche</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de propiedades */}
      <section className="px-4 pb-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {attikProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm active:scale-[0.97] transition-transform" data-testid={`property-card-${property.id}`}>
                  {/* Imagen */}
                  <div className="aspect-[4/3] relative bg-gray-200">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">ATTIK</span>
                      </div>
                    )}
                    {property.tag && (
                      <span className="absolute top-2 left-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {property.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-gray-900 font-semibold text-sm truncate">
                      {property.title.replace('ATTIK ', '')}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-1">
                      <span className="flex items-center gap-0.5">
                        <Maximize className="w-3 h-3" />
                        {property.sqMeters}m²
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bed className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-3 h-3" />
                        {property.bathrooms}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-600 font-bold text-sm">
                        ${((property.price || 650000) / 1000).toFixed(0)}K
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
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
          <div className="bg-teal-500 rounded-xl p-4 text-center active:scale-[0.98] transition-transform">
            <p className="text-white font-bold">Reserva tu fracción</p>
            <p className="text-white/80 text-xs">Te contactamos en 5 días</p>
          </div>
        </Link>
      </section>

      {/* WhatsApp */}
      <section className="px-4 pb-8">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones%20de%20ATTIK"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-medium rounded-xl text-sm"
        >
          💬 WhatsApp Directo
        </a>
      </section>
    </div>
  );
}
