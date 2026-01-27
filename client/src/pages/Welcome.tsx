import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ArrowRight, Settings } from 'lucide-react';

export default function Welcome() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

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
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
          {lang === 'es' 
            ? 'Servicio llave en mano. Nosotros rentamos por ti. Plusvalía garantizada.'
            : 'Turnkey service. We rent for you. Guaranteed appreciation.'}
        </p>
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
    </div>
  );
}
