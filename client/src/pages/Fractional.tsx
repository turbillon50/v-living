import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, MapPin, ChevronRight, Calendar, Users, TrendingUp, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { getProperties } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

import type { Property } from '@shared/schema';

export default function Fractional() {
  const { language } = useLanguage();

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const attikProperties = properties.filter(p => p.title?.includes('ATTIK'));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero */}
      <section className="px-5 pt-6 pb-8">
        <div className="text-center">
          <p className="text-teal-400 text-xs font-medium uppercase tracking-wider mb-2">Proyecto ATTIK</p>
          <h1 className="text-2xl font-light text-white mb-2">Fracciones Disponibles</h1>
          <p className="text-white/50 text-sm">10 propiedades • 140 fracciones • Tulum, La Veleta</p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-5 pb-8">
        <h2 className="text-white/60 text-sm font-medium mb-4 text-center">¿Cómo funciona?</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <Calendar className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">3 Semanas/Año</p>
            <p className="text-white/40 text-xs">Uso garantizado por fracción</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <Users className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">14 Fracciones</p>
            <p className="text-white/40 text-xs">Por cada propiedad</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <TrendingUp className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">Plusvalía Real</p>
            <p className="text-white/40 text-xs">Tu fracción se valoriza</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <Shield className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">Propiedad Legal</p>
            <p className="text-white/40 text-xs">Cesión de derechos fiduciarios</p>
          </div>
        </div>
      </section>

      {/* Políticas */}
      <section className="px-5 pb-8">
        <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-xl p-5 border border-teal-500/20">
          <h3 className="text-white font-medium mb-3">Políticas de Reserva</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              Enganche mínimo del 30%
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              12 meses sin intereses o 24 meses al 8% anual
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              Reserva tu fracción y selecciona tus 3 semanas
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              Los primeros en reservar eligen primero
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              Puedes rentar o revender tu fracción
            </li>
          </ul>
        </div>
      </section>

      {/* Propiedades */}
      <section className="px-5 pb-8">
        <h2 className="text-white font-medium mb-4">Selecciona una Propiedad</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
          </div>
        ) : attikProperties.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl">
            <p className="text-white/50">Cargando propiedades...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attikProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="flex gap-4 bg-white/5 rounded-xl p-3 border border-white/10 active:scale-[0.98] transition-transform" data-testid={`property-card-${property.id}`}>
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-teal-900/50 to-cyan-900/50">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-xs">ATTIK</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">
                      {property.title.replace('ATTIK ', '')}
                    </h3>
                    <p className="text-white/40 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                      <span>{property.sqMeters}m²</span>
                      <span>•</span>
                      <span>{property.bedrooms} rec</span>
                      <span>•</span>
                      <span>{property.bathrooms} baño</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-400 font-semibold">
                        ${((property.price || 650000) / 1000).toFixed(0)}K MXN
                      </p>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Registro */}
      <section className="px-5 pb-8">
        <Link href="/registro">
          <div className="bg-teal-500 rounded-xl p-5 text-center active:scale-[0.98] transition-transform">
            <p className="text-white font-semibold text-lg mb-1">¿Te interesa una fracción?</p>
            <p className="text-white/80 text-sm">Regístrate y te contactamos en 5 días</p>
          </div>
        </Link>
      </section>

      {/* WhatsApp */}
      <section className="px-5 pb-8">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones%20de%20ATTIK"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 bg-green-600 text-white font-medium rounded-xl"
        >
          <span className="text-xl">💬</span>
          WhatsApp Directo
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="px-5 text-center">
          <p className="text-white/30 text-xs mb-4">FRACTIONAL LIVING • ATTIK TULUM</p>
          <p className="text-[10px] text-white/20">© 2024 All Global Holding LLC</p>
        </div>
      </footer>
    </div>
  );
}
