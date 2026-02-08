import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, TrendingUp, Calendar, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { AGHLogo, AGHLogoHorizontal } from '@/components/AGHLogo';

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
      
      <section className="pt-16 pb-20 px-6 md:pt-24 md:pb-28 agh-fade-in">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AGHLogo size={28} color="#111" />
          </div>
          <h1 className="text-4xl md:text-5xl text-[#111] tracking-wide mb-3" data-testid="hero-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            Fractional Living
          </h1>
          <p className="text-[10px] text-[#bbb] uppercase tracking-[0.3em] mb-6 font-light">All Global Holding LLC</p>
          
          <p className="text-sm text-[#555] font-light tracking-[0.12em] mb-2 uppercase">
            Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
          </p>
          <p className="text-xs text-[#999] mb-8 font-light">
            {language === 'es' ? 'Servicio llave en mano. Nosotros rentamos por ti.' : 'Turnkey service. We rent for you.'}
          </p>

          <button 
            onClick={() => setShowBeneficios(true)}
            className="w-32 mx-auto block mb-10 active:scale-[0.97] transition-transform duration-200"
            data-testid="button-beneficios"
          >
            <img 
              src="/beneficios-btn.png" 
              alt="Beneficios Fractional Living" 
              className="w-full rounded-md border border-[#ddd]"
            />
            <p className="text-[#bbb] text-[10px] mt-2 tracking-[0.15em] uppercase font-light">Ver beneficios</p>
          </button>

          <div className="flex justify-center gap-12 mb-0">
            <div className="text-center">
              <p className="text-3xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{properties.length * 42}</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">Fracciones</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>30%</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">Enganche</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>12</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-[0.15em] font-light">MSI</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto agh-fade-in-delay-1">
        <div className="bg-[#111] rounded-md p-6 text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2 font-light">Oportunidad</p>
          <p className="text-white text-lg font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {language === 'es' ? 'Invierte desde $195K MXN' : 'Invest from $195K MXN'}
          </p>
          <p className="text-white/50 text-sm font-light">
            {language === 'es' ? '30% enganche · 12 meses sin intereses' : '30% down payment · 12 months no interest'}
          </p>
        </div>
      </section>

      {featuredProperties.length > 0 && (
        <section className="pb-16 agh-fade-in-delay-2">
          <div className="px-6 mb-6 flex items-end justify-between max-w-7xl mx-auto">
            <div>
              <p className="text-[#999] text-[10px] uppercase tracking-[0.2em] mb-1 font-light">Propiedades</p>
              <h2 className="text-2xl text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>Disponibles</h2>
            </div>
            <Link href="/fractional">
              <span className="text-xs text-[#999] flex items-center gap-1 hover:text-[#111] transition-colors duration-200 tracking-wider uppercase">
                Ver todo <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-5 px-6 pb-2" style={{ width: 'max-content' }}>
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="w-[280px] bg-white rounded-md overflow-hidden border border-[#eee] hover:border-[#999] active:scale-[0.98] transition-all duration-200" data-testid={`card-property-${property.id}`}>
                    <div className="h-44 bg-[#f5f5f5] flex items-center justify-center relative">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-3xl font-light text-[#ddd]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{property.title.split(' ')[0]}</span>
                          <p className="text-[#ccc] text-xs mt-1">{property.sqMeters}m²</p>
                        </div>
                      )}
                      {property.tag && (
                        <span className="absolute top-3 left-3 bg-[#111] text-white text-[10px] px-2.5 py-1 rounded-sm font-medium tracking-wider uppercase">
                          {property.tag}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-[#111] font-medium text-sm mb-2 truncate">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[11px] text-[#999] mb-4 font-light">
                        <span>{property.sqMeters}m²</span>
                        <span className="text-[#ddd]">·</span>
                        <span>{property.bedrooms} rec</span>
                        <span className="text-[#ddd]">·</span>
                        <span>{property.bathrooms} baño</span>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[#111] font-medium text-lg">
                            ${((property.price || 650000) / 1000).toFixed(0)}K
                          </p>
                          <p className="text-[#bbb] text-[10px] font-light tracking-wider">{property.currency || 'MXN'} / fracción</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#999] text-xs font-light">{property.totalFractions || 14} fracciones</p>
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

      {properties.length === 0 && (
        <section className="px-6 pb-16 max-w-2xl mx-auto">
          <div className="bg-[#fafafa] rounded-md p-10 text-center border border-[#eee]">
            <p className="text-[#999] text-sm mb-1 font-light">No hay propiedades aún</p>
            <p className="text-[#ccc] text-xs font-light">Agrega propiedades desde el modo creador</p>
          </div>
        </section>
      )}

      <section className="px-6 pb-16 max-w-3xl mx-auto agh-fade-in-delay-3">
        <h3 className="text-center mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: '1.5rem', color: '#111' }}>
          ¿Por qué Fractional Living?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#eee] rounded-md p-5 hover:border-[#999] transition-colors duration-200">
            <TrendingUp className="w-5 h-5 text-[#555] mb-3" />
            <p className="text-[#111] text-sm font-medium mb-1">Plusvalía Real</p>
            <p className="text-[#999] text-xs font-light">Tu fracción se valoriza</p>
          </div>
          <div className="border border-[#eee] rounded-md p-5 hover:border-[#999] transition-colors duration-200">
            <Calendar className="w-5 h-5 text-[#555] mb-3" />
            <p className="text-[#111] text-sm font-medium mb-1">Compra Semanas</p>
            <p className="text-[#999] text-xs font-light">Suma las que quieras</p>
          </div>
          <div className="border border-[#eee] rounded-md p-5 hover:border-[#999] transition-colors duration-200">
            <TrendingUp className="w-5 h-5 text-[#555] mb-3 rotate-45" />
            <p className="text-[#111] text-sm font-medium mb-1">Renta tu Fracción</p>
            <p className="text-[#999] text-xs font-light">Genera ingresos</p>
          </div>
          <div className="border border-[#eee] rounded-md p-5 hover:border-[#999] transition-colors duration-200">
            <ChevronRight className="w-5 h-5 text-[#555] mb-3" />
            <p className="text-[#111] text-sm font-medium mb-1">Revende</p>
            <p className="text-[#999] text-xs font-light">Liquida cuando quieras</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <h3 className="text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: '1.5rem', color: '#111' }}>
          Más Opciones
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/last-minute-capital">
            <div className="relative rounded-md overflow-hidden aspect-[3/4] active:scale-[0.97] hover:opacity-90 transition-all duration-200 group">
              <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Last Minute Capital</p>
              </div>
            </div>
          </Link>
          
          <Link href="/perfil-asociado">
            <div className="relative rounded-md overflow-hidden aspect-[3/4] active:scale-[0.97] hover:opacity-90 transition-all duration-200 group">
              <img src="/perfil-asociado.jpg" alt="Perfil Asociado" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Perfil Asociado</p>
              </div>
            </div>
          </Link>
          
          <Link href="/modelo-negocios">
            <div className="relative rounded-md overflow-hidden aspect-[3/4] active:scale-[0.97] hover:opacity-90 transition-all duration-200 group">
              <img src="/modelo-negocio.jpg" alt="Modelo de Negocio" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[10px] font-medium leading-tight tracking-wider uppercase">Modelo de Negocio</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-16 max-w-2xl mx-auto">
        <Link href="/fractional">
          <div className="bg-[#111] rounded-md p-6 text-center active:scale-[0.98] transition-all duration-200 hover:bg-[#000]" data-testid="button-explore-all">
            <p className="text-white font-medium text-base mb-1 tracking-wide">
              {language === 'es' ? 'Explorar Todas las Propiedades' : 'Explore All Properties'}
            </p>
            <p className="text-white/40 text-sm font-light">
              {properties.length} propiedades disponibles
            </p>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-16 max-w-2xl mx-auto">
        <div className="border border-[#eee] rounded-md p-6">
          <p className="text-[#999] text-[10px] uppercase tracking-[0.2em] mb-2 font-light">¿Te interesa?</p>
          <h3 className="text-[#111] text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Regístrate para más información' : 'Register for more info'}
          </h3>
          <p className="text-[#888] text-sm mb-6 font-light">
            Te contactamos en menos de 5 días con opciones personalizadas.
          </p>
          <Link href="/registro">
            <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3.5 bg-[#111] text-white font-medium rounded-md text-sm hover:bg-[#000] transition-colors duration-200" data-testid="button-register">
              Registrarme <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-8 max-w-2xl mx-auto">
        <button 
          onClick={() => setShowLegal(!showLegal)}
          className="w-full flex items-center justify-between py-4 text-[#999] text-sm font-light tracking-wide"
        >
          <span>Marco Legal y Respaldo</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLegal ? 'rotate-180' : ''}`} />
        </button>
        
        {showLegal && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border border-[#eee] rounded-md p-4">
              <p className="text-[#111] text-xs font-medium mb-1">Marco Legal</p>
              <p className="text-[#999] text-[10px] font-light">Cesión de derechos fiduciarios</p>
            </div>
            <div className="border border-[#eee] rounded-md p-4">
              <p className="text-[#111] text-xs font-medium mb-1">Operación 24/7</p>
              <p className="text-[#999] text-[10px] font-light">Mantenimiento y seguridad</p>
            </div>
            <div className="border border-[#eee] rounded-md p-4">
              <p className="text-[#111] text-xs font-medium mb-1">Gestión de Rentas</p>
              <p className="text-[#999] text-[10px] font-light">Comercialización incluida</p>
            </div>
            <div className="border border-[#eee] rounded-md p-4">
              <p className="text-[#111] text-xs font-medium mb-1">Respaldo</p>
              <p className="text-[#999] text-[10px] font-light">VanDeFi Wallet</p>
            </div>
          </div>
        )}
      </section>

      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20broker/influencer%20de%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 border border-[#111] rounded-md text-[#111] text-sm font-medium hover:bg-[#111] hover:text-white transition-all duration-200"
          data-testid="button-broker"
        >
          ¿Quieres ser Broker? Comisiones 6%+
        </a>
      </section>

      <AGHFooter />

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-md w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-[#eee] flex items-center justify-between z-10">
              <h2 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors duration-200">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#555] space-y-6 font-light leading-relaxed">
              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>¿Por qué Fractional Living?</h3>
                <p className="mb-2">Fractional Living nace de una idea simple: el tiempo, el uso y el capital inmobiliario pueden trabajar mejor cuando se estructuran correctamente.</p>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales. No somos un "fraccional barato".</p>
                <p className="font-medium text-[#111]">Somos una infraestructura inmobiliaria diseñada para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#666]">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Beneficio Legal</h3>
                <ul className="list-disc pl-5 space-y-1 text-[#666]">
                  <li>Propiedades adquiridas con crédito hipotecario</li>
                  <li>Cesión de derechos fiduciarios clara</li>
                  <li>Acceso al legajo legal del activo</li>
                  <li>Disfrute del uso desde el día uno</li>
                  <li>Preventas con respaldo estructural</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Beneficio Comercial</h3>
                <p className="text-center font-medium text-[#111] mb-2 tracking-wider uppercase text-sm">Compra · Vive · Renta · Revende · Repite</p>
                <ul className="list-disc pl-5 space-y-1 text-[#666]">
                  <li>Ingreso potencial desde el día uno</li>
                  <li>Uso flexible de tu fracción</li>
                  <li>Acceso permanente a hospedaje</li>
                  <li>Descuentos superiores al 50% en fechas no propias</li>
                  <li>Preventas con uso garantizado</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>La Gran Diferencia</h3>
                <p className="mb-2">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1 text-[#666]">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
              </div>
              <div className="text-center pt-6 border-t border-[#eee]">
                <p className="text-[#111] text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Bienvenido a Fractional Living</p>
                <p className="text-sm text-[#888] mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-[#111] font-medium tracking-wider uppercase text-sm">Compra · Vive · Renta · Revende · Repite</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
