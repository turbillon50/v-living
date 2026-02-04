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
          
          <p className="text-base text-orange-500 font-bold mb-2">
            Compra • Vive • Renta • Revende • Repite
          </p>
          <p className="text-xs text-black/50 mb-4">
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
            <p className="text-orange-500 font-semibold text-sm mt-2">Beneficios Fractional Living</p>
          </button>

          {/* Stats en línea */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-light text-black">{properties.length * 42}</p>
              <p className="text-[10px] text-black/40 uppercase">Fracciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-orange-500">30%</p>
              <p className="text-[10px] text-black/40 uppercase">Enganche</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-black">12</p>
              <p className="text-[10px] text-black/40 uppercase">MSI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Oportunidad destacada */}
      <section className="px-5 pb-6">
        <div className="bg-black rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Oportunidad</span>
          </div>
          <p className="text-white text-lg font-medium mb-1">
            {language === 'es' ? 'Invierte desde $195K MXN' : 'Invest from $195K MXN'}
          </p>
          <p className="text-white/60 text-sm">
            {language === 'es' ? '30% enganche • 12 meses sin intereses' : '30% down payment • 12 months no interest'}
          </p>
        </div>
      </section>

      {/* Properties - Scroll Horizontal */}
      {featuredProperties.length > 0 && (
        <section className="pb-8">
          <div className="px-5 mb-4 flex items-end justify-between">
            <div>
              <p className="text-orange-500 text-xs font-medium uppercase tracking-wider mb-1">Propiedades</p>
              <h2 className="text-xl font-light text-black">Disponibles</h2>
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
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-medium">
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
                          <p className="text-orange-500 font-semibold text-lg">
                            ${((property.price || 650000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-black/40 text-[10px]">{property.currency || 'MXN'} / fracción</p>
                        </div>
                        <div className="text-right">
                          <p className="text-black/50 text-xs">{property.totalFractions || 14} fracciones</p>
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
        <h3 className="text-black/50 text-sm font-medium mb-4 text-center">¿Por qué Fractional Living?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/5 rounded-xl p-4 border border-black/10">
            <TrendingUp className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-black text-sm font-medium">Plusvalía Real</p>
            <p className="text-black/40 text-xs">Tu fracción se valoriza</p>
          </div>
          <div className="bg-black/5 rounded-xl p-4 border border-black/10">
            <Calendar className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-black text-sm font-medium">3 Semanas/Año</p>
            <p className="text-black/40 text-xs">Uso garantizado</p>
          </div>
          <div className="bg-black/5 rounded-xl p-4 border border-black/10">
            <span className="text-xl mb-2 block">💰</span>
            <p className="text-black text-sm font-medium">Renta tu Fracción</p>
            <p className="text-black/40 text-xs">Genera ingresos</p>
          </div>
          <div className="bg-black/5 rounded-xl p-4 border border-black/10">
            <span className="text-xl mb-2 block">🔄</span>
            <p className="text-black text-sm font-medium">Revende</p>
            <p className="text-black/40 text-xs">Liquida cuando quieras</p>
          </div>
        </div>
      </section>

      {/* Opciones de inversión */}
      <section className="px-5 pb-8">
        <h3 className="text-black/50 text-sm font-medium mb-4 text-center">Más Opciones</h3>
        <div className="space-y-3">
          <Link href="/last-minute-capital">
            <div className="flex items-center gap-4 bg-black rounded-xl p-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Last Minute Capital</p>
                <p className="text-white/50 text-xs">Oportunidades de inversión inmediata</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Link>
          
          <Link href="/perfil-asociado">
            <div className="flex items-center gap-4 bg-black rounded-xl p-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Perfil Asociado</p>
                <p className="text-white/50 text-xs">Únete como asociado de propiedades</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Link>
          
          <Link href="/modelo-negocios">
            <div className="flex items-center gap-4 bg-black rounded-xl p-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Modelo de Negocios</p>
                <p className="text-white/50 text-xs">Conoce cómo funciona Fractional Living</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Link>
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
        <div className="bg-black/5 rounded-xl p-5 border border-black/10">
          <p className="text-orange-500 text-xs uppercase tracking-wider mb-2">¿Te interesa?</p>
          <h3 className="text-gray-900 text-lg font-medium mb-2">
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Te contactamos en menos de 5 días con opciones personalizadas.
          </p>
          <Link href="/registro">
            <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg" data-testid="button-register">
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
          className="flex items-center justify-center gap-3 w-full py-3 bg-black hover:bg-black text-white font-medium rounded-xl transition-colors"
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
          className="block w-full text-center py-3 border border-orange-500 rounded-xl text-orange-500 text-sm bg-black"
          data-testid="button-broker"
        >
          💼 ¿Quieres ser Broker? Comisiones 6%+
        </a>
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 pb-40 border-t border-gray-100">
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
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700 space-y-6">
              
              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">¿Por qué Fractional Living?</h3>
                <p className="mb-2">Fractional Living nace de una idea simple: el tiempo, el uso y el capital inmobiliario pueden trabajar mejor cuando se estructuran correctamente.</p>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales. No somos un "fraccional barato".</p>
                <p className="font-medium">Somos una infraestructura inmobiliaria diseñada para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">¿Por qué invertir aquí?</h3>
                <p className="mb-2">Porque aquí no compras promesas, compras procesos.</p>
                <p className="font-medium">Cada propiedad:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Está en zonas estratégicas</li>
                  <li>Tiene origen legal transparente</li>
                  <li>Cuenta con financiamiento hipotecario</li>
                  <li>Se integra a esquemas fiduciarios claros</li>
                </ul>
                <p className="mt-2 font-medium text-orange-500">Eso es certeza legal. Eso es estructura real.</p>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">Beneficio Legal</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades adquiridas con crédito hipotecario</li>
                  <li>Cesión de derechos fiduciarios clara</li>
                  <li>Acceso al legajo legal del activo</li>
                  <li>Disfrute del uso desde el día uno</li>
                  <li>Preventas con respaldo estructural</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">Si tu fecha llega antes de la entrega, te hospedamos en una propiedad de igual o mejor categoría.</p>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">Beneficio Comercial</h3>
                <p className="text-center font-bold text-orange-500 mb-2">Compra · Vive · Renta · Revende · Repite</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ingreso potencial desde el día uno</li>
                  <li>Uso flexible de tu fracción</li>
                  <li>Acceso permanente a hospedaje</li>
                  <li>Descuentos superiores al 50% en fechas no propias</li>
                  <li>Preventas con uso garantizado</li>
                </ul>
                <p className="mt-2 font-medium">Tu fracción trabaja contigo, no se queda congelada.</p>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">Beneficios Incluidos</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Traslados aeropuerto ↔ propiedad</li>
                  <li>Concierge 24/7</li>
                  <li>Eventos semanales</li>
                  <li>Descuentos en yates, restaurantes, spas</li>
                  <li>Acceso a comunidad y networking</li>
                </ul>
                <p className="mt-2 font-medium">Aquí no solo vienes a hospedarte. Vienes a vivir el ecosistema.</p>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">Beneficio de Experiencia</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades pet friendly y no pet friendly</li>
                  <li>Espacios para fumadores y no fumadores</li>
                  <li>Experiencias diseñadas según tu perfil</li>
                  <li>Uso personal o comercial, tú decides</li>
                </ul>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">La Gran Diferencia</h3>
                <p className="mb-2">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
                <p className="mt-2 font-medium text-orange-500">Por eso el modelo se sostiene en el tiempo. Por eso la plusvalía es real.</p>
              </div>

              <div>
                <h3 className="text-orange-500 font-bold text-base mb-2">No es tiempo compartido</h3>
                <p className="mb-2">No compras noches. No compras puntos. No compras membresías opacas.</p>
                <p className="font-medium">Compras:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Derechos reales</li>
                  <li>Uso flexible</li>
                  <li>Beneficios transferibles</li>
                  <li>Un activo con vida comercial</li>
                </ul>
                <p className="mt-2 font-medium">Tu fracción es tuya. La usas tú, o quien tú decidas.</p>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-orange-500 font-bold text-lg mb-2">Bienvenido a Fractional Living</p>
                <p className="text-sm text-gray-600 mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-orange-500 font-bold">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
