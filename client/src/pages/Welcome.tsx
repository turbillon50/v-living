import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ChevronRight, Eye, Home, X, Settings, Shield, TrendingUp, Calendar, Sun, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-caribbean.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-white" />

        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <p className="text-white/70 text-xs tracking-[0.15em] uppercase font-medium">All Global Holding</p>
          <div className="flex items-center gap-4">
            <Link href="/creator">
              <span className="text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors font-medium"
              data-testid="button-language"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] px-6 text-center">
          <div className="fl-fade-in">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl fl-gradient-brand flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl text-white tracking-tight mb-4 font-semibold" data-testid="welcome-title">
              <span className="fl-text-gradient bg-clip-text" style={{ WebkitTextFillColor: 'white' }}>Fractional</span> Living
            </h1>

            <p className="text-white/80 font-medium tracking-[0.15em] text-sm mb-3 uppercase">
              Compra · Vive · Renta · Revende
            </p>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-10">
              {language === 'es'
                ? 'Fracciones inmobiliarias de lujo en el Caribe Mexicano'
                : 'Luxury fractional real estate in the Mexican Caribbean'}
            </p>
          </div>

          <div className="space-y-3 w-full max-w-sm fl-fade-in-delay-1">
            <Link href="/home">
              <button
                className="w-full py-4 px-6 fl-btn-primary text-base flex items-center justify-center gap-3"
                data-testid="button-explore"
              >
                <Eye className="w-5 h-5" />
                {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </Link>

            <button
              onClick={handleRegister}
              className="w-full py-4 px-6 bg-white/10 backdrop-blur-md text-white rounded-xl text-base font-semibold flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/20"
              data-testid="button-register"
            >
              <Home className="w-5 h-5" />
              {language === 'es' ? 'Registrarme Gratis' : 'Sign Up Free'}
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full py-3 text-white/60 text-sm font-medium hover:text-white transition-colors"
              data-testid="button-login"
            >
              {language === 'es' ? 'Ya soy miembro · Iniciar sesión' : 'Already a member · Log in'}
            </button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center fl-fade-in-delay-2">
            <button
              onClick={() => setShowBeneficios(true)}
              className="flex items-center gap-2 text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors"
              data-testid="button-beneficios"
            >
              <span>{language === 'es' ? 'Por qué invertir aquí' : 'Why invest here'}</span>
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-lg mx-auto text-center fl-slide-up">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold">El Caribe Mexicano</p>
          <h2 className="text-3xl md:text-4xl text-[#222] mb-4 font-semibold">
            {language === 'es' ? 'Tu patrimonio en el paraíso' : 'Your legacy in paradise'}
          </h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-8">
            {language === 'es'
              ? 'Riviera Maya, Tulum, Cancún — zonas con mayor plusvalía del continente. Fracciones desde $65,000 USD.'
              : 'Riviera Maya, Tulum, Cancún — highest-appreciation zones in the continent. Fractions from $65,000 USD.'}
          </p>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">8-12%</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Rendimiento anual' : 'Annual yield'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">3</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Semanas / año' : 'Weeks / year'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold fl-text-gradient">14</p>
              <p className="text-[10px] text-[#717171] uppercase tracking-[0.15em] mt-1">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f7f7f7]">
        <div className="max-w-lg mx-auto">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold text-center">{language === 'es' ? 'Beneficios' : 'Benefits'}</p>
          <h2 className="text-2xl text-center text-[#222] mb-8 font-semibold">
            {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? '8-12% anual documentado' : '8-12% documented yearly' },
              { icon: Calendar, title: language === 'es' ? '3 Semanas' : '3 Weeks', desc: language === 'es' ? 'Uso anual garantizado' : 'Guaranteed annual use' },
              { icon: Shield, title: language === 'es' ? 'Legal y Heredable' : 'Legal & Inheritable', desc: language === 'es' ? 'Escritura y fideicomiso' : 'Deed and trust' },
              { icon: Sun, title: language === 'es' ? 'Renta Pasiva' : 'Passive Income', desc: language === 'es' ? 'Nosotros rentamos por ti' : 'We rent for you' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#ebebeb] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl fl-gradient-brand flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[#222] text-sm font-semibold mb-1">{item.title}</p>
                <p className="text-[#717171] text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-lg mx-auto">
          <Link href="/home">
            <div className="relative overflow-hidden rounded-2xl fl-gradient-brand p-8 text-center cursor-pointer group" data-testid="button-explore-all">
              <div className="absolute inset-0 bg-[url('/hero-ocean.jpg')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-white/70 text-xs uppercase tracking-[0.2em] mb-2 font-medium">{language === 'es' ? 'Descubre' : 'Discover'}</p>
                <p className="text-white text-xl font-semibold mb-3">
                  {language === 'es' ? 'Ver Catálogo Completo' : 'View Full Catalog'}
                </p>
                <div className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/20 rounded-full px-5 py-2">
                  {language === 'es' ? 'Explorar' : 'Explore'} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="px-6 py-10 text-center bg-[#f7f7f7] border-t border-[#ebebeb]">
        <p className="text-[#717171] text-xs mb-4 tracking-wide">
          {language === 'es'
            ? 'Modelo fractional legal, real y heredable'
            : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-8 mb-4">
          <a href="https://allglobalholding.com" target="_blank" rel="noopener noreferrer" className="text-[#222] text-xs font-semibold hover:text-[#059669] transition-colors tracking-wide uppercase">
            All Global Holding
          </a>
          <a href="https://alix-ai.net" target="_blank" rel="noopener noreferrer" className="text-[#222] text-xs font-semibold hover:text-[#059669] transition-colors tracking-wide uppercase">
            ALIX AI
          </a>
        </div>
        <p className="text-[#999] text-[10px] tracking-wider">
          All Global Holding LLC — Delaware, USA — 2025
        </p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-[#ebebeb] flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-lg text-[#222] font-semibold">
                {language === 'es' ? 'Beneficios' : 'Benefits'}
              </h2>
              <button onClick={() => setShowBeneficios(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors">
                <X className="w-5 h-5 text-[#717171]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#717171] space-y-6">
              <div className="fl-gradient-brand rounded-xl p-5 text-center">
                <p className="text-white font-semibold text-base">
                  {language === 'es'
                    ? 'Propiedad, uso y valor en un solo activo'
                    : 'Property, use and value in a single asset'}
                </p>
              </div>

              <div>
                <h3 className="text-[#222] font-semibold text-base mb-2">
                  {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
                </h3>
                <p className="mb-2 leading-relaxed">{language === 'es' ? 'No somos tiempo compartido. No somos preventas tradicionales.' : 'We are not timeshare. We are not traditional pre-sales.'}</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>{language === 'es' ? 'Escritura real a tu nombre' : 'Real deed in your name'}</li>
                  <li>{language === 'es' ? 'Renta pasiva automática' : 'Automatic passive income'}</li>
                  <li>{language === 'es' ? 'Plusvalía documentada' : 'Documented appreciation'}</li>
                  <li>{language === 'es' ? 'Reventa libre' : 'Free resale'}</li>
                </ul>
              </div>

              <div className="text-center pt-6 border-t border-[#ebebeb]">
                <Link href="/home">
                  <button className="w-full py-3.5 fl-btn-primary text-sm" onClick={() => setShowBeneficios(false)}>
                    {language === 'es' ? 'Ver Propiedades' : 'View Properties'} <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
