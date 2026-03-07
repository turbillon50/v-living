import { useState } from 'react';
import { Link } from 'wouter';
import { Globe, ChevronRight, Eye, Home, X, Settings, Shield, TrendingUp, Calendar, Sun } from 'lucide-react';
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
    <div className="min-h-screen bg-[#030810]">
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-caribbean.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030810]/70 via-[#030810]/40 to-[#030810]" />

        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-light">All Global Holding LLC</p>
          <div className="flex items-center gap-4">
            <Link href="/creator">
              <span className="text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
              data-testid="button-language"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] px-6 text-center">
          <div className="fl-fade-in">
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl fl-gradient-turquoise flex items-center justify-center shadow-lg shadow-[#0891b2]/20">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl text-white tracking-wide mb-4" data-testid="welcome-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
              Fractional Living
            </h1>

            <p className="text-[#22d3ee]/80 font-light tracking-[0.18em] text-sm mb-3 uppercase">
              Compra &middot; Vive &middot; Renta &middot; Revende
            </p>
            <p className="text-[#64748b] text-sm font-light max-w-md mx-auto mb-10">
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
              className="w-full py-4 px-6 fl-glass text-white rounded-xl text-base font-medium flex items-center justify-center gap-3 hover:bg-[rgba(6,182,212,0.08)] transition-all duration-300"
              data-testid="button-register"
            >
              <Home className="w-5 h-5" />
              {language === 'es' ? 'Registrarme Gratis' : 'Sign Up Free'}
              <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full py-3 text-[#64748b] text-sm font-light hover:text-white transition-colors duration-200"
              data-testid="button-login"
            >
              {language === 'es' ? 'Ya soy miembro · Iniciar sesión' : 'Already a member · Log in'}
            </button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center fl-fade-in-delay-2">
            <button
              onClick={() => setShowBeneficios(true)}
              className="flex items-center gap-2 text-[#475569] text-xs tracking-widest uppercase hover:text-[#22d3ee] transition-colors duration-300"
              data-testid="button-beneficios"
            >
              <span>{language === 'es' ? 'Por qué invertir aquí' : 'Why invest here'}</span>
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 border-t border-[rgba(6,182,212,0.06)]">
        <div className="max-w-lg mx-auto text-center fl-slide-up">
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium">El Caribe Mexicano</p>
          <h2 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Tu patrimonio en el paraíso' : 'Your legacy in paradise'}
          </h2>
          <p className="text-[#64748b] text-sm font-light leading-relaxed mb-8">
            {language === 'es'
              ? 'Riviera Maya, Tulum, Cancún — zonas con mayor plusvalía del continente. Fracciones desde $65,000 USD.'
              : 'Riviera Maya, Tulum, Cancún — highest-appreciation zones in the continent. Fractions from $65,000 USD.'}
          </p>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>8-12%</p>
              <p className="text-[10px] text-[#475569] uppercase tracking-[0.15em] font-light mt-1">{language === 'es' ? 'Rendimiento anual' : 'Annual yield'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>3</p>
              <p className="text-[10px] text-[#475569] uppercase tracking-[0.15em] font-light mt-1">{language === 'es' ? 'Semanas / año' : 'Weeks / year'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>14</p>
              <p className="text-[10px] text-[#475569] uppercase tracking-[0.15em] font-light mt-1">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium text-center">{language === 'es' ? 'Beneficios' : 'Benefits'}</p>
          <h2 className="text-2xl text-center text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? '8-12% anual documentado' : '8-12% documented yearly' },
              { icon: Calendar, title: language === 'es' ? '3 Semanas' : '3 Weeks', desc: language === 'es' ? 'Uso anual garantizado' : 'Guaranteed annual use' },
              { icon: Shield, title: language === 'es' ? 'Legal y Heredable' : 'Legal & Inheritable', desc: language === 'es' ? 'Escritura y fideicomiso' : 'Deed and trust' },
              { icon: Sun, title: language === 'es' ? 'Renta Pasiva' : 'Passive Income', desc: language === 'es' ? 'Nosotros rentamos por ti' : 'We rent for you' },
            ].map((item, i) => (
              <div key={i} className="fl-glass-card p-5">
                <div className="w-9 h-9 rounded-lg bg-[rgba(6,182,212,0.1)] flex items-center justify-center mb-3">
                  <item.icon className="w-4 h-4 text-[#22d3ee]" />
                </div>
                <p className="text-white text-sm font-medium mb-1">{item.title}</p>
                <p className="text-[#64748b] text-xs font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          <Link href="/home">
            <div className="relative overflow-hidden rounded-2xl fl-gradient-sunset p-8 text-center cursor-pointer group" data-testid="button-explore-all">
              <div className="absolute inset-0 bg-[url('/hero-ocean.jpg')] bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-light">{language === 'es' ? 'Descubre' : 'Discover'}</p>
                <p className="text-white text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Ver Catálogo Completo' : 'View Full Catalog'}
                </p>
                <div className="inline-flex items-center gap-2 text-[#22d3ee] text-sm font-medium">
                  {language === 'es' ? 'Explorar' : 'Explore'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="px-6 py-10 text-center border-t border-[rgba(6,182,212,0.06)]">
        <p className="text-[#475569] text-xs mb-4 font-light tracking-wide">
          {language === 'es'
            ? 'Modelo fractional legal, real y heredable'
            : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-8 mb-4">
          <a href="https://allglobalholding.com" target="_blank" rel="noopener noreferrer" className="text-[#64748b] text-xs font-medium hover:text-[#22d3ee] transition-colors duration-200 tracking-wide uppercase">
            All Global Holding
          </a>
          <a href="https://alix-ai.net" target="_blank" rel="noopener noreferrer" className="text-[#64748b] text-xs font-medium hover:text-[#22d3ee] transition-colors duration-200 tracking-wide uppercase">
            ALIX AI
          </a>
        </div>
        <p className="text-[#334155] text-[10px] tracking-wider">
          All Global Holding LLC — Delaware, USA — 2025
        </p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-[#050d18] border border-[rgba(6,182,212,0.1)] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#050d18]/95 backdrop-blur-sm p-5 border-b border-[rgba(6,182,212,0.08)] flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                {language === 'es' ? 'Beneficios' : 'Benefits'}
              </h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors duration-200">
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#64748b] space-y-6">
              <div className="fl-gradient-sunset rounded-xl p-5 text-center">
                <p className="text-white font-light text-base" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es'
                    ? 'Propiedad, uso y valor en un solo activo'
                    : 'Property, use and value in a single asset'}
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
                </h3>
                <p className="mb-2 leading-relaxed">{language === 'es' ? 'No somos tiempo compartido. No somos preventas tradicionales.' : 'We are not timeshare. We are not traditional pre-sales.'}</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#64748b]">
                  <li>{language === 'es' ? 'Escritura real a tu nombre' : 'Real deed in your name'}</li>
                  <li>{language === 'es' ? 'Renta pasiva automática' : 'Automatic passive income'}</li>
                  <li>{language === 'es' ? 'Plusvalía documentada' : 'Documented appreciation'}</li>
                  <li>{language === 'es' ? 'Reventa libre' : 'Free resale'}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Datos del modelo' : 'Model data'}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-[#64748b]">
                  <li>8-12% {language === 'es' ? 'rendimiento anual' : 'annual yield'}</li>
                  <li>14 {language === 'es' ? 'fracciones por propiedad' : 'fractions per property'}</li>
                  <li>3 {language === 'es' ? 'semanas de uso al año' : 'weeks of use per year'}</li>
                  <li>{language === 'es' ? 'Fideicomiso bancario' : 'Banking trust'}</li>
                </ul>
              </div>

              <div className="text-center pt-6 border-t border-[rgba(6,182,212,0.08)]">
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
