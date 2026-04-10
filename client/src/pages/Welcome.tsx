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
    <div className="min-h-screen bg-black">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-caribbean.jpg" alt="Playa del Caribe mexicano" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

        <header className="relative z-10 flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-3">
          <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">All Global Holding</p>
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
            <h1 className="text-[44px] md:text-7xl text-white tracking-tight leading-[0.95] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="welcome-title">
              Fractional<br/>Living
            </h1>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              {language === 'es'
                ? 'Fracciones inmobiliarias de lujo en el Caribe Mexicano. Compra · Vive · Renta · Revende.'
                : 'Luxury fractional real estate in the Mexican Caribbean. Buy · Live · Rent · Resell.'}
            </p>
          </div>

          <div className="space-y-3 fl-fade-in-delay-1">
            <Link href="/home">
              <button
                className="w-full py-4 px-6 bg-white text-[#222] rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-2xl"
                data-testid="button-explore"
              >
                {language === 'es' ? 'Explorar' : 'Explore'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="flex gap-3">
              <button
                onClick={handleRegister}
                className="flex-1 py-3.5 px-4 bg-white/10 backdrop-blur-md text-white rounded-2xl text-sm font-medium text-center active:scale-[0.98] transition-transform border border-white/10"
                data-testid="button-register"
              >
                {language === 'es' ? 'Registrarme' : 'Sign Up'}
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 py-3.5 px-4 bg-white/5 text-white/70 rounded-2xl text-sm font-medium text-center active:scale-[0.98] transition-transform"
                data-testid="button-login"
              >
                {language === 'es' ? 'Iniciar sesión' : 'Log in'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowBeneficios(true)}
            className="mt-5 mx-auto flex items-center gap-1.5 text-white/40 text-[11px] tracking-[0.15em] uppercase hover:text-white/70 transition-colors"
            data-testid="button-beneficios"
          >
            {language === 'es' ? 'Descubre más' : 'Discover more'}
            <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
      </div>

      <section className="bg-white py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold">El Caribe Mexicano</p>
          <h2 className="text-3xl text-[#222] mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? 'Tu patrimonio en el paraíso' : 'Your legacy in paradise'}
          </h2>
          <div className="flex justify-center gap-10 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">8-12%</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Rendimiento' : 'Yield'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">3</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Semanas' : 'Weeks'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">14</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {[
            { img: '/attik-1.jpg', title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', sub: '8-12%' },
            { img: '/exp-yates.jpg', title: language === 'es' ? '3 Semanas/Año' : '3 Weeks/Year', sub: language === 'es' ? 'Garantizado' : 'Guaranteed' },
            { img: '/hermitage-1.jpg', title: language === 'es' ? 'Legal y Heredable' : 'Legal & Inheritable', sub: language === 'es' ? 'Fideicomiso' : 'Trust' },
            { img: '/hero-ocean.jpg', title: language === 'es' ? 'Renta Pasiva' : 'Passive Income', sub: language === 'es' ? 'Nosotros rentamos' : 'We rent for you' },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <Link href="/home">
            <div className="relative overflow-hidden rounded-2xl aspect-[2/1] active:scale-[0.98] transition-transform cursor-pointer group" data-testid="button-explore-all">
              <img src="/hero-ocean.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center pl-6">
                <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-1">{language === 'es' ? 'Descubre' : 'Discover'}</p>
                <p className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Ver Catálogo' : 'View Catalog'}
                </p>
                <span className="text-white/70 text-xs inline-flex items-center gap-1">
                  {language === 'es' ? 'Explorar' : 'Explore'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="px-6 py-8 text-center bg-[#f7f7f7]">
        <p className="text-[#717171] text-xs mb-3">
          {language === 'es' ? 'Modelo fractional legal, real y heredable' : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-6 mb-3">
          <a href="https://allglobalholding.com" target="_blank" rel="noopener noreferrer" className="text-[#222] text-[11px] font-semibold hover:text-[#059669] transition-colors tracking-wider uppercase">All Global Holding</a>
          <a href="https://alix-ai.net" target="_blank" rel="noopener noreferrer" className="text-[#222] text-[11px] font-semibold hover:text-[#059669] transition-colors tracking-wider uppercase">ALIX AI</a>
        </div>
        <p className="text-[#999] text-[10px] tracking-wider">All Global Holding LLC — Delaware, USA — 2025</p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-[#ebebeb] flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-lg text-[#222] font-semibold">{language === 'es' ? 'Beneficios' : 'Benefits'}</h2>
              <button onClick={() => setShowBeneficios(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors">
                <X className="w-5 h-5 text-[#717171]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#717171] space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img src="/hero-caribbean.jpg" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white font-semibold text-center px-6">
                    {language === 'es' ? 'Propiedad, uso y valor en un solo activo' : 'Property, use and value in a single asset'}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed">{language === 'es' ? 'No somos tiempo compartido. Escritura real, renta pasiva, plusvalía documentada, reventa libre.' : 'We are not timeshare. Real deed, passive income, documented appreciation, free resale.'}</p>
              <Link href="/home">
                <button className="w-full py-3.5 bg-[#222] text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform" onClick={() => setShowBeneficios(false)}>
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
