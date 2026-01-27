import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Settings, X } from 'lucide-react';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [showBeneficios, setShowBeneficios] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-100">
        <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">All Global Holding LLC</p>
        <div className="flex items-center gap-4">
          <Link href="/creator">
            <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <Settings className="w-4 h-4" />
            </span>
          </Link>
          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      <div className="py-8 flex flex-col items-center justify-center">
        <img 
          src="/fractional-logo.jpg" 
          alt="Fractional Living" 
          className="w-28 h-28 rounded-xl object-cover shadow-lg"
          data-testid="welcome-background"
        />
        <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-widest mt-4">FRACTIONAL LIVING</h1>
      </div>

      <div className="px-6 py-4 text-center border-b border-gray-100">
        <p className="text-teal-600 text-base md:text-lg font-bold mb-2">
          Compra • Vive • Renta • Revende • Repite
        </p>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto mb-4">
          {lang === 'es' 
            ? 'Servicio llave en mano. Nosotros rentamos por ti. Plusvalía garantizada.'
            : 'Turnkey service. We rent for you. Guaranteed appreciation.'}
        </p>
        
        {/* Botón Beneficios */}
        <button 
          onClick={() => setShowBeneficios(true)}
          className="w-full max-w-xs mx-auto block active:scale-[0.98] transition-transform"
          data-testid="button-beneficios"
        >
          <img 
            src="/beneficios-btn.png" 
            alt="Beneficios Fractional Living" 
            className="w-full rounded-xl shadow-lg"
          />
        </button>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-md mx-auto mb-2">
          {lang === 'es' 
            ? 'ALIX es la inteligencia artificial de All Global Holding, diseñada para ti. Mejora tu experiencia y está disponible 24/7 en el botón morado.'
            : 'ALIX is All Global Holding\'s artificial intelligence, designed for you. It enhances your experience and is available 24/7 on the purple button.'}
        </p>
        <p className="text-gray-400 text-xs max-w-md mx-auto">
          {lang === 'es' 
            ? 'Para hablar con un representante humano, usa el botón verde de WhatsApp.'
            : 'To speak with a human representative, use the green WhatsApp button.'}
        </p>
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Link href="/last-minute-capital">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-last-minute">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img src="/last-minute-capital.jpg" alt="Last Minute Capital" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-center mt-2">
                <p className="text-gray-800 text-[9px] md:text-[11px] font-semibold tracking-wide">LAST MINUTE CAPITAL</p>
                <p className="text-gray-500 text-[8px] md:text-[10px] mt-0.5">
                  {lang === 'es' ? 'Inversión a corto plazo' : 'Short-term investment'}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/perfil-asociado">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-perfil-asociado">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img src="/perfil-asociado.jpg" alt="Profile Associate" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-center mt-2">
                <p className="text-gray-800 text-[9px] md:text-[11px] font-semibold tracking-wide">PROFILE ASSOCIATE</p>
                <p className="text-gray-500 text-[8px] md:text-[10px] mt-0.5 leading-tight">
                  {lang === 'es' ? 'Invierte con tu perfil o asocia tu propiedad' : 'Invest with your profile or associate your property'}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/modelo-negocios">
            <div className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" data-testid="button-modelo-negocio">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img src="/modelo-negocio.jpg" alt="Business Model" className="w-full h-full object-cover object-center" />
              </div>
              <div className="text-center mt-2">
                <p className="text-gray-800 text-[9px] md:text-[11px] font-semibold tracking-wide">BUSINESS MODEL</p>
                <p className="text-gray-500 text-[8px] md:text-[10px] mt-0.5">
                  {lang === 'es' ? 'Cómo funciona el ecosistema' : 'How the ecosystem works'}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4 flex justify-center">
        <Link href="/fractional">
          <span 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-teal-600 text-white text-sm font-medium tracking-wide hover:bg-teal-700 transition-all cursor-pointer rounded-xl shadow-md"
            data-testid="button-explore"
          >
            {lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'EXPLORE PROPERTIES'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="px-6 pb-8 text-center">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 max-w-md mx-auto mb-4">
          <p className="text-gray-600 text-xs font-medium mb-2">
            {lang === 'es' ? '📱 Instala la app en tu celular' : '📱 Install the app on your phone'}
          </p>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            {lang === 'es' 
              ? 'iPhone: Abre en Safari → Toca "Compartir" → "Agregar a pantalla de inicio"'
              : 'iPhone: Open in Safari → Tap "Share" → "Add to Home Screen"'}
          </p>
          <p className="text-gray-400 text-[10px] leading-relaxed mt-1">
            {lang === 'es' 
              ? 'Android: Abre en Chrome → Menú (⋮) → "Añadir a pantalla de inicio"'
              : 'Android: Open in Chrome → Menu (⋮) → "Add to Home Screen"'}
          </p>
        </div>
        <p className="text-gray-400 text-xs tracking-wide">
          {lang === 'es' ? 'Próximamente en iOS App Store y Google Play' : 'Coming soon to iOS App Store and Google Play'}
        </p>
        <p className="text-gray-300 text-[10px] mt-3">
          © 2024 All Global Holding LLC
        </p>
      </div>

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
                <h3 className="text-teal-600 font-bold text-base mb-2">¿Por qué Fractional Living?</h3>
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
                <h3 className="text-teal-600 font-bold text-base mb-2">¿Por qué invertir aquí?</h3>
                <p className="mb-2">Porque aquí no compras promesas, compras procesos.</p>
                <p className="font-medium">Cada propiedad:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Está en zonas estratégicas</li>
                  <li>Tiene origen legal transparente</li>
                  <li>Cuenta con financiamiento hipotecario</li>
                  <li>Se integra a esquemas fiduciarios claros</li>
                </ul>
                <p className="mt-2 font-medium text-teal-600">Eso es certeza legal. Eso es estructura real.</p>
              </div>

              <div>
                <h3 className="text-teal-600 font-bold text-base mb-2">Beneficio Legal</h3>
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
                <h3 className="text-teal-600 font-bold text-base mb-2">Beneficio Comercial</h3>
                <p className="text-center font-bold text-teal-600 mb-2">Compra · Vive · Renta · Revende · Repite</p>
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
                <h3 className="text-teal-600 font-bold text-base mb-2">Beneficios Incluidos</h3>
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
                <h3 className="text-teal-600 font-bold text-base mb-2">Beneficio de Experiencia</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades pet friendly y no pet friendly</li>
                  <li>Espacios para fumadores y no fumadores</li>
                  <li>Experiencias diseñadas según tu perfil</li>
                  <li>Uso personal o comercial, tú decides</li>
                </ul>
              </div>

              <div>
                <h3 className="text-teal-600 font-bold text-base mb-2">La Gran Diferencia</h3>
                <p className="mb-2">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
                <p className="mt-2 font-medium text-teal-600">Por eso el modelo se sostiene en el tiempo. Por eso la plusvalía es real.</p>
              </div>

              <div>
                <h3 className="text-teal-600 font-bold text-base mb-2">No es tiempo compartido</h3>
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
                <p className="text-teal-600 font-bold text-lg mb-2">Bienvenido a Fractional Living</p>
                <p className="text-sm text-gray-600 mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-teal-600 font-bold">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
