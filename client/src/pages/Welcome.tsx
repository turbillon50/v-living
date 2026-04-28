import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ChevronRight, X, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

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
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-caribbean.jpg" alt="V-Living Caribbean fractional ownership" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,180,216,0.18),transparent_35%)]" />

        <header className="relative z-10 flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-3">
          <div>
            <p className="text-white/70 text-[10px] tracking-[0.28em] uppercase font-medium">All Global Holding LLC</p>
            <p className="text-cyan-300/70 text-[9px] tracking-[0.22em] uppercase mt-1">V-Living · Fractional Ownership</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/creator">
              <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors font-medium"
              data-testid="button-language"
            >
              <Globe className="w-3.5 h-3.5" />
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-col justify-end h-[calc(100%-60px)] px-6 pb-[calc(env(safe-area-inset-bottom,20px)+24px)]">
          <div className="fl-fade-in mb-8">
            <p className="text-cyan-300/75 text-[10px] tracking-[0.35em] uppercase mb-3">Institutional Premium Access</p>
            <h1 className="text-[52px] md:text-7xl text-white tracking-tight leading-[0.9] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="welcome-title">
              V-<br/>Living
            </h1>
            <p className="text-white/62 text-sm max-w-xs leading-relaxed">
              {language === 'es'
                ? 'Acceso fraccional a propiedades premium en el Caribe Mexicano. Compra · Vive · Renta · Revende.'
                : 'Fractional access to premium properties in the Mexican Caribbean. Buy · Live · Rent · Resell.'}
            </p>
          </div>

          <div className="space-y-3 fl-fade-in-delay-1">
            <Link href="/home">
              <button
                className="w-full py-4 px-6 bg-white text-black rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-2xl shadow-cyan-500/10"
                data-testid="button-explore"
              >
                {language === 'es' ? 'Explorar V-Living' : 'Explore V-Living'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="flex gap-3">
              <button
                onClick={handleRegister}
                className="flex-1 py-3.5 px-4 bg-cyan-300/12 backdrop-blur-md text-white rounded-2xl text-sm font-medium text-center active:scale-[0.98] transition-transform border border-cyan-300/20"
                data-testid="button-register"
              >
                {language === 'es' ? 'Solicitar acceso' : 'Request Access'}
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 py-3.5 px-4 bg-white/5 text-white/70 rounded-2xl text-sm font-medium text-center active:scale-[0.98] transition-transform border border-white/10"
                data-testid="button-login"
              >
                {language === 'es' ? 'Iniciar sesión' : 'Log in'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowBeneficios(true)}
            className="mt-5 mx-auto flex items-center gap-1.5 text-white/45 text-[11px] tracking-[0.15em] uppercase hover:text-white/70 transition-colors"
            data-testid="button-beneficios"
          >
            {language === 'es' ? 'Conoce el modelo' : 'Discover the model'}
            <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
      </div>

      <section className="bg-black py-16 px-6 border-t border-white/10">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-cyan-300 text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold">All Global Holding LLC</p>
          <h2 className="text-3xl text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? 'Patrimonio premium con uso real' : 'Premium ownership with real use'}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            {language === 'es'
              ? 'V-Living integra propiedades, hospitalidad y acceso fraccional en una vertical institucional diseñada para vivir, rentar y conservar valor.'
              : 'V-Living integrates properties, hospitality and fractional access into an institutional vertical designed to live, rent and preserve value.'}
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">8-12%</p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Proyección' : 'Projection'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Semanas' : 'Weeks'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">14</p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {[
            { img: '/attik-1.jpg', title: language === 'es' ? 'Activo Premium' : 'Premium Asset', sub: language === 'es' ? 'Uso + valor' : 'Use + value' },
            { img: '/exp-yates.jpg', title: language === 'es' ? 'Experiencia Real' : 'Real Experience', sub: language === 'es' ? 'Caribe mexicano' : 'Mexican Caribbean' },
            { img: '/hermitage-1.jpg', title: language === 'es' ? 'Estructura Legal' : 'Legal Structure', sub: language === 'es' ? 'Fideicomiso' : 'Trust' },
            { img: '/hero-ocean.jpg', title: language === 'es' ? 'Operación Comercial' : 'Commercial Operation', sub: language === 'es' ? 'Renta y reventa' : 'Rent and resale' },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/10 bg-white/5">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-cyan-200/60 text-[10px] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <Link href="/home">
            <div className="relative overflow-hidden rounded-2xl aspect-[2/1] active:scale-[0.98] transition-transform cursor-pointer group border border-white/10 bg-white/5" data-testid="button-explore-all">
              <img src="/hero-ocean.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center pl-6">
                <p className="text-cyan-200/70 text-[10px] uppercase tracking-[0.2em] mb-1">{language === 'es' ? 'Catálogo institucional' : 'Institutional catalog'}</p>
                <p className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Ver Propiedades' : 'View Properties'}
                </p>
                <span className="text-white/70 text-xs inline-flex items-center gap-1">
                  {language === 'es' ? 'Entrar' : 'Enter'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="px-6 py-8 text-center bg-black border-t border-white/10">
        <p className="text-white/45 text-xs mb-3">
          {language === 'es' ? 'Modelo de acceso fraccional legal, real y heredable' : 'Legal, real and inheritable fractional access model'}
        </p>
        <div className="flex justify-center gap-6 mb-3">
          <a href="https://allglobalholding.com" target="_blank" rel="noopener noreferrer" className="text-white text-[11px] font-semibold hover:text-cyan-300 transition-colors tracking-wider uppercase">All Global Holding</a>
          <a href="https://alix-ai.net" target="_blank" rel="noopener noreferrer" className="text-white text-[11px] font-semibold hover:text-cyan-300 transition-colors tracking-wider uppercase">ALIX AI</a>
        </div>
        <p className="text-white/30 text-[10px] tracking-wider">All Global Holding LLC — Delaware, USA — 2025</p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-[#050505] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#050505] p-5 border-b border-white/10 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-lg text-white font-semibold">{language === 'es' ? 'Modelo V-Living' : 'V-Living Model'}</h2>
              <button onClick={() => setShowBeneficios(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <div className="p-5 text-sm text-white/60 space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img src="/hero-caribbean.jpg" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <p className="text-white font-semibold text-center px-6">
                    {language === 'es' ? 'Propiedad, uso y valor en un solo activo' : 'Property, use and value in a single asset'}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed">{language === 'es' ? 'V-Living es la vertical de All Global Holding LLC para acceso fraccional a activos premium. Integra uso, renta, reventa y operación comercial bajo una estructura institucional.' : 'V-Living is the All Global Holding LLC vertical for fractional access to premium assets. It integrates use, rental, resale and commercial operation under an institutional structure.'}</p>
              <Link href="/home">
                <button className="w-full py-3.5 bg-white text-black rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform" onClick={() => setShowBeneficios(false)}>
                  {language === 'es' ? 'Ver Propiedades' : 'View Properties'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
