import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ChevronRight, Eye, Home, User, X, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { AGHLogo } from '@/components/AGHLogo';

export default function Welcome() {
  const { language, setLanguage } = useLanguage();
  const { setShowAuthModal, setAuthModalMode } = useAuth();
  const [showBeneficios, setShowBeneficios] = useState(false);

  const handleRegister = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#eee]">
        <p className="text-[#999] text-[10px] tracking-[0.25em] uppercase font-light">All Global Holding LLC</p>
        <div className="flex items-center gap-4">
          <Link href="/creator">
            <span className="text-[#ccc] hover:text-[#333] transition-colors duration-200 cursor-pointer">
              <Settings className="w-4 h-4" />
            </span>
          </Link>
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-[#999] hover:text-[#111] transition-colors duration-200"
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12 agh-fade-in">
          <div className="flex justify-center mb-8" data-testid="welcome-background">
            <AGHLogo size={44} color="#111" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-[#111] tracking-wide mb-4" data-testid="welcome-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Fractional Living
          </h1>
          
          <p className="text-[#111] font-light tracking-[0.15em] text-sm mb-3 uppercase">
            Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
          </p>
          <p className="text-[#888] text-sm font-light max-w-sm mx-auto">
            {language === 'es' 
              ? 'Fracciones inmobiliarias de lujo en el Caribe' 
              : 'Luxury fractional real estate in the Caribbean'}
          </p>
        </div>

        <button 
          onClick={() => setShowBeneficios(true)}
          className="w-36 mx-auto block mb-10 active:scale-[0.97] transition-transform duration-200 agh-fade-in-delay-1"
          data-testid="button-beneficios"
        >
          <img 
            src="/beneficios-btn.png" 
            alt="Beneficios Fractional Living" 
            className="w-full rounded-md border border-[#ddd]"
          />
          <p className="text-[#aaa] text-[10px] mt-2 tracking-[0.15em] uppercase font-light">Ver beneficios</p>
        </button>

        <div className="space-y-3 max-w-sm mx-auto w-full agh-fade-in-delay-2">
          <Link href="/home">
            <button 
              className="w-full flex items-center justify-between p-5 border border-[#eee] rounded-md hover:border-[#999] transition-all duration-200 group"
              data-testid="button-explore"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#111] rounded-md flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#111] text-base">
                    {language === 'es' ? 'Explorar' : 'Explore'}
                  </p>
                  <p className="text-[#888] text-xs font-light">
                    {language === 'es' ? 'Ver propiedades disponibles' : 'See available properties'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#ccc] group-hover:text-[#111] transition-colors duration-200" />
            </button>
          </Link>

          <button 
            onClick={handleRegister}
            className="w-full flex items-center justify-between p-5 bg-[#111] text-white rounded-md hover:bg-[#000] transition-all duration-200 group"
            data-testid="button-register"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white text-base">
                  {language === 'es' ? 'Registrarme' : 'Sign up'}
                </p>
                <p className="text-white/60 text-xs font-light">
                  {language === 'es' ? 'Crear mi cuenta gratis' : 'Create my free account'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-between p-5 border border-[#eee] rounded-md hover:border-[#999] transition-all duration-200 group"
            data-testid="button-login"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#111] rounded-md flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[#111] text-base">
                  {language === 'es' ? 'Ya soy miembro' : 'I am a member'}
                </p>
                <p className="text-[#888] text-xs font-light">
                  {language === 'es' ? 'Iniciar sesión con mi PIN' : 'Log in with my PIN'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#ccc] group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <div className="px-6 py-8 text-center border-t border-[#eee] agh-fade-in-delay-3">
        <p className="text-[#999] text-xs mb-4 font-light tracking-wide">
          {language === 'es' 
            ? 'Modelo fractional legal, real y heredable' 
            : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-8 mb-4">
          <a 
            href="https://allglobalholding.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#111] text-xs font-medium hover:text-[#666] transition-colors duration-200 tracking-wide uppercase"
          >
            All Global Holding
          </a>
          <a 
            href="https://alix-ai.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#111] text-xs font-medium hover:text-[#666] transition-colors duration-200 tracking-wide uppercase"
          >
            ALIX AI
          </a>
        </div>
        <p className="text-[#ccc] text-[10px] tracking-wider">
          All Global Holding LLC — Delaware, USA — 2025
        </p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-md w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-[#eee] flex items-center justify-between z-10">
              <h2 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors duration-200">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#555] space-y-6">
              
              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>¿Por qué Fractional Living?</h3>
                <p className="mb-2 leading-relaxed">Fractional Living nace de una idea simple: el tiempo, el uso y el capital inmobiliario pueden trabajar mejor cuando se estructuran correctamente.</p>
                <p className="mb-2 leading-relaxed">No somos tiempo compartido. No somos preventas tradicionales.</p>
                <p className="font-medium text-[#111]">Somos una infraestructura inmobiliaria diseñada para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#666]">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>¿Por qué invertir aquí?</h3>
                <p className="mb-2 leading-relaxed">Porque aquí no compras promesas, compras procesos.</p>
                <p className="font-medium text-[#111]">Cada propiedad:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#666]">
                  <li>Está en zonas estratégicas</li>
                  <li>Tiene origen legal transparente</li>
                  <li>Cuenta con financiamiento hipotecario</li>
                  <li>Se integra a esquemas fiduciarios claros</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#111] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>La Gran Diferencia</h3>
                <p className="mb-2 leading-relaxed">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1 text-[#666]">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
              </div>

              <div className="text-center pt-6 border-t border-[#eee]">
                <p className="text-[#111] text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Bienvenido a Fractional Living</p>
                <p className="text-sm text-[#888] mb-3 font-light">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-[#111] font-medium tracking-wider text-sm uppercase">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
