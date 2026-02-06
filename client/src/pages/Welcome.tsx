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
      <header className="flex items-center justify-between px-6 py-4 border-b border-black/10">
        <p className="text-black/40 text-[10px] tracking-[0.2em] uppercase">All Global Holding LLC</p>
        <div className="flex items-center gap-4">
          <Link href="/creator">
            <span className="text-black/30 hover:text-black transition-colors cursor-pointer">
              <Settings className="w-4 h-4" />
            </span>
          </Link>
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors"
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6" data-testid="welcome-background">
            <AGHLogo size={36} color="#000000" />
          </div>
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2" data-testid="welcome-title">
            FRACTIONAL LIVING
          </h1>
          
          <p className="text-black font-light tracking-wider text-sm mb-2">
            Compra • Vive • Renta • Revende • Repite
          </p>
          <p className="text-black/50 text-xs">
            {language === 'es' 
              ? 'Fracciones inmobiliarias de lujo en el Caribe' 
              : 'Luxury fractional real estate in the Caribbean'}
          </p>
        </div>

        <button 
          onClick={() => setShowBeneficios(true)}
          className="w-36 mx-auto block mb-6 active:scale-[0.96] transition-transform"
          data-testid="button-beneficios"
        >
          <img 
            src="/beneficios-btn.png" 
            alt="Beneficios Fractional Living" 
            className="w-full rounded-lg shadow-md"
          />
          <p className="text-black/40 text-[10px] mt-1.5 tracking-wider uppercase">Ver beneficios</p>
        </button>

        <div className="space-y-3 max-w-sm mx-auto w-full">
          <Link href="/home">
            <button 
              className="w-full flex items-center justify-between p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors group"
              data-testid="button-explore"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-black text-base">
                    {language === 'es' ? 'Explorar' : 'Explore'}
                  </p>
                  <p className="text-black/50 text-xs">
                    {language === 'es' ? 'Ver propiedades disponibles' : 'See available properties'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-black/30 group-hover:text-black transition-colors" />
            </button>
          </Link>

          <button 
            onClick={handleRegister}
            className="w-full flex items-center justify-between p-4 bg-black text-white rounded-2xl hover:bg-black/90 transition-colors group"
            data-testid="button-register"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-base">
                  {language === 'es' ? 'Registrarme' : 'Sign up'}
                </p>
                <p className="text-white/80 text-xs">
                  {language === 'es' ? 'Crear mi cuenta gratis' : 'Create my free account'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-between p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors group"
            data-testid="button-login"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-black text-base">
                  {language === 'es' ? 'Ya soy miembro' : 'I am a member'}
                </p>
                <p className="text-black/50 text-xs">
                  {language === 'es' ? 'Iniciar sesión con mi PIN' : 'Log in with my PIN'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black/30 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 text-center border-t border-black/10">
        <p className="text-black/40 text-xs mb-3">
          {language === 'es' 
            ? 'Modelo fractional legal, real y heredable' 
            : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-6">
          <a 
            href="https://vandefi.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black text-sm font-medium underline hover:text-black/70 transition-colors"
          >
            VanDeFi
          </a>
          <a 
            href="https://agh-ia.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black text-sm font-medium underline hover:text-black/70 transition-colors"
          >
            AGH-IA
          </a>
        </div>
        <p className="text-black/20 text-[10px] mt-3">
          © 2025 All Global Holding LLC
        </p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b border-black/10 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-black">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2">
                <X className="w-5 h-5 text-black/50" />
              </button>
            </div>
            <div className="p-4 text-sm text-black/80 space-y-6">
              
              <div>
                <h3 className="text-black font-bold text-base mb-2">¿Por qué Fractional Living?</h3>
                <p className="mb-2">Fractional Living nace de una idea simple: el tiempo, el uso y el capital inmobiliario pueden trabajar mejor cuando se estructuran correctamente.</p>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales. No somos un "fraccional barato".</p>
                <p className="font-medium text-black">Somos una infraestructura inmobiliaria diseñada para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">¿Por qué invertir aquí?</h3>
                <p className="mb-2">Porque aquí no compras promesas, compras procesos.</p>
                <p className="font-medium text-black">Cada propiedad:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Está en zonas estratégicas</li>
                  <li>Tiene origen legal transparente</li>
                  <li>Cuenta con financiamiento hipotecario</li>
                  <li>Se integra a esquemas fiduciarios claros</li>
                </ul>
                <p className="mt-2 font-medium text-black">Eso es certeza legal. Eso es estructura real.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficio Legal</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades adquiridas con crédito hipotecario</li>
                  <li>Cesión de derechos fiduciarios clara</li>
                  <li>Acceso al legajo legal del activo</li>
                  <li>Disfrute del uso desde el día uno</li>
                  <li>Preventas con respaldo estructural</li>
                </ul>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficio Comercial</h3>
                <p className="text-center font-bold text-black mb-2">Compra · Vive · Renta · Revende · Repite</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ingreso potencial desde el día uno</li>
                  <li>Uso flexible de tu fracción</li>
                  <li>Acceso permanente a hospedaje</li>
                  <li>Descuentos superiores al 50% en fechas no propias</li>
                </ul>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">La Gran Diferencia</h3>
                <p className="mb-2">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
                <p className="mt-2 font-medium text-black">Por eso el modelo se sostiene en el tiempo.</p>
              </div>

              <div className="text-center pt-4 border-t border-black/10">
                <p className="text-black font-bold text-lg mb-2">Bienvenido a Fractional Living</p>
                <p className="text-sm text-black/60 mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-black font-bold">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
