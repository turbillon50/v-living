import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Globe, ChevronRight, Eye, Home, User, X, Settings, Play, Waves, Sun, Palmtree, Shield, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function Welcome() {
  const { language, setLanguage } = useLanguage();
  const { setShowAuthModal, setAuthModalMode } = useAuth();
  const [showBeneficios, setShowBeneficios] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegister = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fafcfd]">
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
          style={{ 
            backgroundImage: 'url(/hero-caribbean.jpg)',
            transform: `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/30 to-[#0a1628]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0891b2]/20 via-transparent to-transparent" />

        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <p className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-light">All Global Holding LLC</p>
          <div className="flex items-center gap-4">
            <Link href="/creator">
              <span className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            <button 
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors duration-200"
              data-testid="button-language"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] px-6 text-center">
          <div className="fl-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl fl-gradient-turquoise flex items-center justify-center shadow-lg shadow-[#0891b2]/30">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl text-white tracking-wide mb-4" data-testid="welcome-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
              Fractional Living
            </h1>
            
            <p className="text-white/90 font-light tracking-[0.18em] text-sm mb-3 uppercase">
              Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
            </p>
            <p className="text-white/50 text-sm font-light max-w-md mx-auto mb-10">
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
              className="w-full py-4 px-6 fl-glass text-white rounded-xl text-base font-medium flex items-center justify-center gap-3 hover:bg-white/15 transition-all duration-300"
              data-testid="button-register"
            >
              <Home className="w-5 h-5" />
              {language === 'es' ? 'Registrarme Gratis' : 'Sign Up Free'}
              <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
            </button>

            <button 
              onClick={handleLogin}
              className="w-full py-3 text-white/60 text-sm font-light hover:text-white transition-colors duration-200"
              data-testid="button-login"
            >
              {language === 'es' ? 'Ya soy miembro · Iniciar sesión' : 'Already a member · Log in'}
            </button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center fl-fade-in-delay-2">
            <button 
              onClick={() => setShowBeneficios(true)}
              className="flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors duration-300"
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
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium">El Caribe Mexicano</p>
          <h2 className="text-3xl md:text-4xl text-[#0a1628] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Tu patrimonio en el paraíso' : 'Your legacy in paradise'}
          </h2>
          <p className="text-[#64748b] text-sm font-light leading-relaxed mb-8">
            {language === 'es' 
              ? 'Riviera Maya, Tulum, Cancún — las zonas con mayor plusvalía del continente. Invierte en fracciones desde $195K MXN con financiamiento a 12 meses sin intereses.'
              : 'Riviera Maya, Tulum, Cancún — the highest-appreciation zones in the continent. Invest in fractions from $195K MXN with 12-month interest-free financing.'}
          </p>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>8-12%</p>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light mt-1">{language === 'es' ? 'Plusvalía anual' : 'Annual appreciation'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>30%</p>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light mt-1">{language === 'es' ? 'Enganche' : 'Down payment'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light fl-text-gradient" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>12</p>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.15em] font-light mt-1">MSI</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-lg mx-auto">
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-3 font-medium text-center">Beneficios</p>
          <h2 className="text-2xl text-center text-[#0a1628] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', desc: language === 'es' ? 'Tu fracción se valoriza año con año' : 'Your fraction appreciates yearly' },
              { icon: Calendar, title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', desc: language === 'es' ? 'Suma las que necesites' : 'Add as many as you need' },
              { icon: Shield, title: language === 'es' ? 'Legal y Heredable' : 'Legal & Inheritable', desc: language === 'es' ? 'Cesión de derechos fiduciarios' : 'Fiduciary rights assignment' },
              { icon: Sun, title: language === 'es' ? 'Renta y Revende' : 'Rent & Resell', desc: language === 'es' ? 'Genera ingresos pasivos' : 'Generate passive income' },
            ].map((item, i) => (
              <div key={i} className="fl-card p-5">
                <div className="w-10 h-10 rounded-xl fl-gradient-turquoise flex items-center justify-center mb-3 shadow-sm shadow-[#0891b2]/20">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[#0a1628] text-sm font-medium mb-1">{item.title}</p>
                <p className="text-[#94a3b8] text-xs font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          <Link href="/home">
            <div className="relative overflow-hidden rounded-2xl fl-gradient-sunset p-8 text-center cursor-pointer group" data-testid="button-explore-all">
              <div className="absolute inset-0 bg-[url('/hero-ocean.jpg')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] mb-2 font-light">Descubre</p>
                <p className="text-white text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Explora Todas las Propiedades' : 'Explore All Properties'}
                </p>
                <div className="inline-flex items-center gap-2 text-[#22d3ee] text-sm font-medium">
                  {language === 'es' ? 'Ver ahora' : 'View now'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="px-6 py-10 text-center border-t border-[#e2e8f0]">
        <p className="text-[#94a3b8] text-xs mb-4 font-light tracking-wide">
          {language === 'es' 
            ? 'Modelo fractional legal, real y heredable' 
            : 'Legal, real and inheritable fractional model'}
        </p>
        <div className="flex justify-center gap-8 mb-4">
          <a 
            href="https://allglobalholding.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#0a1628] text-xs font-medium hover:text-[#0891b2] transition-colors duration-200 tracking-wide uppercase"
          >
            All Global Holding
          </a>
          <a 
            href="https://alix-ai.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#0a1628] text-xs font-medium hover:text-[#0891b2] transition-colors duration-200 tracking-wide uppercase"
          >
            ALIX AI
          </a>
        </div>
        <p className="text-[#cbd5e1] text-[10px] tracking-wider">
          All Global Holding LLC — Delaware, USA — 2025
        </p>
      </div>

      {showBeneficios && (
        <div className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-[#e2e8f0] flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                {language === 'es' ? 'Beneficios' : 'Benefits'}
              </h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-colors duration-200">
                <X className="w-5 h-5 text-[#94a3b8]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#64748b] space-y-6">
              
              <div className="fl-gradient-sunset rounded-xl p-5 text-center">
                <p className="text-white font-light text-base" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' 
                    ? 'La experiencia, plusvalía y seguridad son un mismo concepto'
                    : 'Experience, appreciation and security are one concept'}
                </p>
              </div>

              <div>
                <h3 className="text-[#0a1628] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
                </h3>
                <p className="mb-2 leading-relaxed">{language === 'es' ? 'No somos tiempo compartido. No somos preventas tradicionales.' : 'We are not timeshare. We are not traditional pre-sales.'}</p>
                <p className="font-medium text-[#0a1628]">{language === 'es' ? 'Infraestructura inmobiliaria para:' : 'Real estate infrastructure for:'}</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#64748b]">
                  <li>{language === 'es' ? 'Proteger valor' : 'Protect value'}</li>
                  <li>{language === 'es' ? 'Generar utilidad' : 'Generate utility'}</li>
                  <li>{language === 'es' ? 'Crear experiencia real' : 'Create real experience'}</li>
                  <li>{language === 'es' ? 'Construir plusvalía' : 'Build appreciation'}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#0a1628] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? '¿Por qué invertir aquí?' : 'Why invest here?'}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-[#64748b]">
                  <li>{language === 'es' ? 'Zonas estratégicas del Caribe' : 'Strategic Caribbean zones'}</li>
                  <li>{language === 'es' ? 'Origen legal transparente' : 'Transparent legal origin'}</li>
                  <li>{language === 'es' ? 'Financiamiento hipotecario' : 'Mortgage financing'}</li>
                  <li>{language === 'es' ? 'Esquemas fiduciarios claros' : 'Clear fiduciary schemes'}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#0a1628] font-medium text-base mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'La Gran Diferencia' : 'The Big Difference'}
                </h3>
                <p className="mb-2 leading-relaxed">{language === 'es' ? 'All Global Holding conserva fracciones propias en cada desarrollo.' : 'All Global Holding keeps its own fractions in each development.'}</p>
                <ul className="list-disc pl-5 space-y-1 text-[#64748b]">
                  <li>{language === 'es' ? 'Somos copropietarios contigo' : 'We are co-owners with you'}</li>
                  <li>{language === 'es' ? 'No cedemos la administración' : 'We don\'t give up management'}</li>
                  <li>{language === 'es' ? 'Nuestro interés está alineado' : 'Our interest is aligned'}</li>
                </ul>
              </div>

              <div className="text-center pt-6 border-t border-[#e2e8f0]">
                <p className="text-[#0a1628] text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {language === 'es' ? 'Bienvenido a Fractional Living' : 'Welcome to Fractional Living'}
                </p>
                <p className="text-sm text-[#94a3b8] mb-4 font-light">{language === 'es' ? 'Sumarte a una familia inmobiliaria estructurada.' : 'Join a structured real estate family.'}</p>
                <Link href="/home">
                  <button className="w-full py-3.5 fl-btn-primary text-sm" onClick={() => setShowBeneficios(false)}>
                    {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'} <ChevronRight className="w-4 h-4 inline ml-1" />
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
