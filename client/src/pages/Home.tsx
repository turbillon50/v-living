import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, Sparkles, TrendingUp, Calendar, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { language } = useLanguage();
  const [showLegal, setShowLegal] = useState(false);
  const [showBeneficios, setShowBeneficios] = useState(false);
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero - Compacto para móvil */}
      <section className="pt-6 pb-8 px-5">
        <div className="text-center">
          <img 
            src="/fractional-logo.jpg" 
            alt="Fractional Living" 
            className="w-24 h-24 mx-auto mb-4 rounded-xl object-cover"
          />
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-2" data-testid="hero-title">
            Fractional Living
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] mb-4">All Global Holding LLC</p>
          
          <p className="text-base text-teal-600 font-bold mb-2">
            Compra • Vive • Renta • Revende • Repite
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {language === 'es' ? 'Servicio llave en mano. Nosotros rentamos por ti.' : 'Turnkey service. We rent for you.'}
          </p>

          {/* Botón Beneficios */}
          <button 
            onClick={() => setShowBeneficios(true)}
            className="w-full max-w-xs mx-auto block mb-4 active:scale-[0.98] transition-transform"
            data-testid="button-beneficios"
          >
            <img 
              src="/beneficios-btn.png" 
              alt="Beneficios Fractional Living" 
              className="w-full rounded-xl shadow-lg"
            />
            <p className="text-teal-600 font-semibold text-sm mt-2">Beneficios Fractional Living</p>
          </button>

          {/* Stats en línea */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">420</p>
              <p className="text-[10px] text-gray-400 uppercase">Fracciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-teal-600">30%</p>
              <p className="text-[10px] text-gray-400 uppercase">Enganche</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">12</p>
              <p className="text-[10px] text-gray-400 uppercase">MSI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Oportunidad destacada */}
      <section className="px-5 pb-6">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Oportunidad</span>
          </div>
          <p className="text-white text-lg font-medium mb-1">
            {language === 'es' ? 'Invierte desde $195K MXN' : 'Invest from $195K MXN'}
          </p>
          <p className="text-white/70 text-sm">
            {language === 'es' ? '30% enganche • 12 meses sin intereses' : '30% down payment • 12 months no interest'}
          </p>
        </div>
      </section>

      {/* Properties - Scroll Horizontal */}
      {featuredProperties.length > 0 && (
        <section className="pb-8">
          <div className="px-5 mb-4 flex items-end justify-between">
            <div>
              <p className="text-teal-600 text-xs font-medium uppercase tracking-wider mb-1">Propiedades</p>
              <h2 className="text-xl font-light text-gray-900">Disponibles</h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                Ver todo <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-2" style={{ width: 'max-content' }}>
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform" data-testid={`card-property-${property.id}`}>
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl font-extralight text-gray-300">{property.title.split(' ')[0]}</span>
                          <p className="text-gray-400 text-xs mt-1">{property.sqMeters}m²</p>
                        </div>
                      )}
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-gray-900 font-medium text-sm mb-1 truncate">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                        <span>{property.sqMeters}m²</span>
                        <span>•</span>
                        <span>{property.bedrooms} rec</span>
                        <span>•</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-teal-600 font-semibold text-lg">
                            ${((property.price || 650000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-gray-400 text-[10px]">{property.currency || 'MXN'} / fracción</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">{property.totalFractions || 14} fracciones</p>
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

      {/* Empty state when no properties */}
      {properties.length === 0 && (
        <section className="px-5 pb-8">
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
            <p className="text-gray-400 text-sm mb-2">No hay propiedades aún</p>
            <p className="text-gray-300 text-xs">Agrega propiedades desde el modo creador</p>
          </div>
        </section>
      )}

      {/* Por qué invertir - Cards simples */}
      <section className="px-5 pb-8">
        <h3 className="text-gray-500 text-sm font-medium mb-4 text-center">¿Por qué Fractional Living?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <TrendingUp className="w-5 h-5 text-teal-600 mb-2" />
            <p className="text-gray-900 text-sm font-medium">Plusvalía Real</p>
            <p className="text-gray-400 text-xs">Tu fracción se valoriza</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <Calendar className="w-5 h-5 text-teal-600 mb-2" />
            <p className="text-gray-900 text-sm font-medium">3 Semanas/Año</p>
            <p className="text-gray-400 text-xs">Uso garantizado</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <span className="text-xl mb-2 block">💰</span>
            <p className="text-gray-900 text-sm font-medium">Renta tu Fracción</p>
            <p className="text-gray-400 text-xs">Genera ingresos</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <span className="text-xl mb-2 block">🔄</span>
            <p className="text-gray-900 text-sm font-medium">Revende</p>
            <p className="text-gray-400 text-xs">Liquida cuando quieras</p>
          </div>
        </div>
      </section>

      {/* CTA Principal */}
      <section className="px-5 pb-8">
        <Link href="/fractional">
          <div className="bg-gray-900 rounded-xl p-5 text-center active:scale-[0.98] transition-transform" data-testid="button-explore-all">
            <p className="text-white font-semibold text-lg mb-1">
              {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
            </p>
            <p className="text-gray-400 text-sm">
              {properties.length} propiedades disponibles
            </p>
          </div>
        </Link>
      </section>

      {/* Registro - Después de explorar */}
      <section className="px-5 pb-8">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100">
          <p className="text-teal-600 text-xs uppercase tracking-wider mb-2">¿Te interesa?</p>
          <h3 className="text-gray-900 text-lg font-medium mb-2">
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Te contactamos en menos de 5 días con opciones personalizadas.
          </p>
          <Link href="/registro">
            <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg" data-testid="button-register">
              Registrarme <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* WhatsApp flotante */}
      <section className="px-5 pb-6">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
          data-testid="button-whatsapp"
        >
          <span className="text-xl">💬</span>
          WhatsApp Directo
        </a>
      </section>

      {/* Legal - Colapsable al final */}
      <section className="px-5 pb-8">
        <button 
          onClick={() => setShowLegal(!showLegal)}
          className="w-full flex items-center justify-between py-3 text-gray-400 text-sm"
        >
          <span>Marco Legal y Respaldo</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        
        {showLegal && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-lg mb-1 block">🏛️</span>
              <p className="text-gray-700 text-xs font-medium">Marco Legal</p>
              <p className="text-gray-400 text-[10px]">Cesión de derechos fiduciarios</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-lg mb-1 block">🔧</span>
              <p className="text-gray-700 text-xs font-medium">Operación 24/7</p>
              <p className="text-gray-400 text-[10px]">Mantenimiento y seguridad</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-lg mb-1 block">💼</span>
              <p className="text-gray-700 text-xs font-medium">Gestión de Rentas</p>
              <p className="text-gray-400 text-[10px]">Comercialización incluida</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-lg mb-1 block">📊</span>
              <p className="text-gray-700 text-xs font-medium">Respaldo</p>
              <p className="text-gray-400 text-[10px]">VanDeFi Wallet</p>
            </div>
          </div>
        )}
      </section>

      {/* Broker CTA pequeño */}
      <section className="px-5 pb-8">
        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20broker/influencer%20de%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 border border-purple-200 rounded-xl text-purple-600 text-sm bg-purple-50"
          data-testid="button-broker"
        >
          💼 ¿Quieres ser Broker? Comisiones 6%+
        </a>
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 pb-28 border-t border-gray-100">
        <div className="px-5 text-center">
          <p className="text-gray-400 text-xs mb-4">FRACTIONAL LIVING</p>
          <div className="flex justify-center gap-6 text-xs text-gray-500 mb-4">
            <Link href="/fractional"><span>Propiedades</span></Link>
            <Link href="/invest"><span>Invertir</span></Link>
            <Link href="/registro"><span>Registro</span></Link>
          </div>
          <p className="text-[10px] text-gray-300">© 2024 All Global Holding LLC</p>
        </div>
      </footer>

      {/* Modal Beneficios */}
      {showBeneficios && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-center py-8">Lista de beneficios próximamente...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
