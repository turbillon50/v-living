import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, Sparkles, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { language } = useLanguage();
  const [showLegal, setShowLegal] = useState(false);
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const attikProperties = properties.filter(p => p.title.includes('ATTIK'));
  const almyriaProperties = properties.filter(p => p.title.includes('ALMYRIA'));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      {/* Hero - Compacto para móvil */}
      <section className="pt-6 pb-8 px-5">
        <div className="text-center">
          <h1 className="text-3xl font-light text-white tracking-wide mb-2" data-testid="hero-title">
            Fractional Living
          </h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-4">All Global Holding LLC</p>
          
          <p className="text-base text-white/70 font-light mb-1">
            {language === 'es' 
              ? 'Reserva · Compra · Vive · Renta · Vende'
              : 'Reserve · Buy · Live · Rent · Sell'}
          </p>
          <p className="text-sm text-teal-400 font-medium mb-6">
            {language === 'es' ? 'Con plusvalía y vuelve a comenzar' : 'With appreciation and start again'}
          </p>

          {/* Stats en línea */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-light text-white">16</p>
              <p className="text-[10px] text-white/40 uppercase">Props</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-teal-400">$650K</p>
              <p className="text-[10px] text-white/40 uppercase">Desde MXN</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-white">3</p>
              <p className="text-[10px] text-white/40 uppercase">Semanas/año</p>
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

      {/* ATTIK Properties - Scroll Horizontal */}
      {attikProperties.length > 0 && (
        <section className="pb-8">
          <div className="px-5 mb-4 flex items-end justify-between">
            <div>
              <p className="text-teal-400 text-xs font-medium uppercase tracking-wider mb-1">Proyecto ATTIK</p>
              <h2 className="text-xl font-light text-white">Tulum, La Veleta</h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-white/50 flex items-center gap-1">
                Ver todo <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-2" style={{ width: 'max-content' }}>
              {attikProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] bg-white/5 rounded-xl overflow-hidden border border-white/10 active:scale-[0.98] transition-transform" data-testid={`card-property-${property.id}`}>
                    <div className="h-40 bg-gradient-to-br from-teal-900/50 to-cyan-900/50 flex items-center justify-center relative">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl font-extralight text-white/20">ATTIK</span>
                          <p className="text-white/30 text-xs mt-1">{property.sqMeters}m²</p>
                        </div>
                      )}
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {property.title.replace('ATTIK ', '')}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mb-3">
                        <span>{property.sqMeters}m²</span>
                        <span>•</span>
                        <span>{property.bedrooms} rec</span>
                        <span>•</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-teal-400 font-semibold text-lg">
                            ${((property.price || 650000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-white/30 text-[10px]">MXN / fracción</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">14 fracciones</p>
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

      {/* ALMYRIA Properties - Scroll Horizontal */}
      {almyriaProperties.length > 0 && (
        <section className="pb-8">
          <div className="px-5 mb-4 flex items-end justify-between">
            <div>
              <p className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-1">Proyecto ALMYRIA</p>
              <h2 className="text-xl font-light text-white">Riviera Maya</h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-white/50 flex items-center gap-1">
                Ver todo <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-2" style={{ width: 'max-content' }}>
              {almyriaProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] bg-white/5 rounded-xl overflow-hidden border border-white/10 active:scale-[0.98] transition-transform" data-testid={`card-property-${property.id}`}>
                    <div className="h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center relative">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl font-extralight text-white/20">ALMYRIA</span>
                          <p className="text-white/30 text-xs mt-1">{property.sqMeters}m²</p>
                        </div>
                      )}
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-purple-500 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {property.title.replace('ALMYRIA ', '')}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mb-3">
                        <span>{property.sqMeters}m²</span>
                        <span>•</span>
                        <span>{property.bedrooms} rec</span>
                        <span>•</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-purple-400 font-semibold text-lg">
                            ${((property.price || 950000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-white/30 text-[10px]">MXN / fracción</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">14 fracciones</p>
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

      {/* Por qué invertir - Cards simples */}
      <section className="px-5 pb-8">
        <h3 className="text-white/60 text-sm font-medium mb-4 text-center">¿Por qué Fractional Living?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <TrendingUp className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">Plusvalía Real</p>
            <p className="text-white/40 text-xs">Tu fracción se valoriza</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <Calendar className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white text-sm font-medium">3 Semanas/Año</p>
            <p className="text-white/40 text-xs">Uso garantizado</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <span className="text-xl mb-2 block">💰</span>
            <p className="text-white text-sm font-medium">Renta tu Fracción</p>
            <p className="text-white/40 text-xs">Genera ingresos</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <span className="text-xl mb-2 block">🔄</span>
            <p className="text-white text-sm font-medium">Revende</p>
            <p className="text-white/40 text-xs">Liquida cuando quieras</p>
          </div>
        </div>
      </section>

      {/* CTA Principal */}
      <section className="px-5 pb-8">
        <Link href="/fractional">
          <div className="bg-white rounded-xl p-5 text-center active:scale-[0.98] transition-transform" data-testid="button-explore-all">
            <p className="text-[#0a0a0a] font-semibold text-lg mb-1">
              {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
            </p>
            <p className="text-stone-500 text-sm">
              16 propiedades • 224 fracciones disponibles
            </p>
          </div>
        </Link>
      </section>

      {/* Registro - Después de explorar */}
      <section className="px-5 pb-8">
        <div className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 rounded-xl p-5 border border-teal-500/20">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">¿Te interesa?</p>
          <h3 className="text-white text-lg font-medium mb-2">
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-white/50 text-sm mb-4">
            Te contactamos en menos de 5 días con opciones personalizadas.
          </p>
          <Link href="/registro">
            <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg" data-testid="button-register">
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
          className="w-full flex items-center justify-between py-3 text-white/40 text-sm"
        >
          <span>Marco Legal y Respaldo</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        
        {showLegal && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-lg mb-1 block">🏛️</span>
              <p className="text-white/70 text-xs font-medium">Marco Legal</p>
              <p className="text-white/40 text-[10px]">Cesión de derechos fiduciarios</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-lg mb-1 block">🔧</span>
              <p className="text-white/70 text-xs font-medium">Operación 24/7</p>
              <p className="text-white/40 text-[10px]">Mantenimiento y seguridad</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-lg mb-1 block">💼</span>
              <p className="text-white/70 text-xs font-medium">Gestión de Rentas</p>
              <p className="text-white/40 text-[10px]">Comercialización incluida</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-lg mb-1 block">📊</span>
              <p className="text-white/70 text-xs font-medium">Respaldo</p>
              <p className="text-white/40 text-[10px]">VanDeFi Wallet</p>
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
          className="block w-full text-center py-3 border border-purple-500/30 rounded-xl text-purple-400 text-sm"
          data-testid="button-broker"
        >
          💼 ¿Quieres ser Broker? Comisiones 6%+
        </a>
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 border-t border-white/10">
        <div className="px-5 text-center">
          <p className="text-white/30 text-xs mb-4">FRACTIONAL LIVING</p>
          <div className="flex justify-center gap-6 text-xs text-white/40 mb-4">
            <Link href="/fractional"><span>Propiedades</span></Link>
            <Link href="/invest"><span>Invertir</span></Link>
            <Link href="/registro"><span>Registro</span></Link>
          </div>
          <p className="text-[10px] text-white/20">© 2024 All Global Holding LLC</p>
        </div>
      </footer>
    </div>
  );
}
