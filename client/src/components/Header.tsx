import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

export function Header() {
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { user, setShowAuthModal, setAuthModalMode } = useAuth();

  const openWhatsApp = () => {
    window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living', '_blank');
  };

  const handleLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 fl-glass-header">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {(location.startsWith('/property') || location === '/registro' || location === '/creator') && (
              <Link href="/fractional">
                <button className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors duration-200" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 text-[#94a3b8]" />
                </button>
              </Link>
            )}
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-2 cursor-pointer group">
                <div className="w-7 h-7 rounded-md fl-gradient-turquoise flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-[15px] tracking-[0.04em] text-white/90 font-light hidden sm:inline" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Fractional Living
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { href: '/fractional', labelEs: 'Propiedades', labelEn: 'Properties', match: (l: string) => l.startsWith('/fractional') || l.startsWith('/property') },
              { href: '/experiences', labelEs: 'Experiencias', labelEn: 'Experiences', match: (l: string) => l === '/experiences' },
              { href: '/inmobiliaria', labelEs: 'Inmobiliaria', labelEn: 'Real Estate', match: (l: string) => l === '/inmobiliaria' },
              { href: '/creditos', labelEs: 'Créditos', labelEn: 'Credits', match: (l: string) => l === '/creditos' },
            ].map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-${item.href.slice(1)}`}>
                <span className={`text-[11px] uppercase tracking-[0.12em] cursor-pointer transition-colors duration-200 font-medium ${item.match(location) ? 'text-[#22d3ee]' : 'text-[#64748b] hover:text-[#94a3b8]'}`}>
                  {language === 'es' ? item.labelEs : item.labelEn}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-7 h-7 text-[#475569] hover:text-[#22d3ee] hover:bg-white/5" title="Admin">
                <Lock className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <button
              className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#22d3ee] transition-colors duration-200 px-2 py-1 tracking-wider uppercase font-medium"
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-3 h-3" />
              {language.toUpperCase()}
            </button>

            <Link href="/invest">
              <button
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg fl-btn-primary text-[11px] uppercase tracking-[0.1em] font-medium"
                data-testid="button-invest-now"
              >
                {language === 'es' ? 'Invertir Ahora' : 'Invest Now'}
              </button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 border border-[rgba(6,182,212,0.12)] rounded-lg px-2 py-1.5 hover:border-[rgba(6,182,212,0.25)] transition-all duration-200"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-3.5 h-3.5 text-[#64748b]" />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user ? 'fl-gradient-turquoise' : 'bg-[#1e293b]'}`}>
                    <User className="w-3 h-3 text-white/80" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl bg-[#0a1628] border-[rgba(6,182,212,0.1)] text-[#e2e8f0]">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-medium text-white text-sm">{user.name}</p>
                      <p className="text-xs text-[#64748b]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-[rgba(6,182,212,0.08)]" />
                    <Link href="/perfil">
                      <DropdownMenuItem className="cursor-pointer rounded-lg text-[#94a3b8] focus:text-white focus:bg-white/5">
                        {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                      </DropdownMenuItem>
                    </Link>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleRegister} className="cursor-pointer rounded-lg text-[#94a3b8] focus:text-white focus:bg-white/5">
                      <span className="font-medium">{language === 'es' ? 'Registrarse' : 'Sign up'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogin} className="cursor-pointer rounded-lg text-[#94a3b8] focus:text-white focus:bg-white/5">
                      {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-[rgba(6,182,212,0.08)]" />
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer rounded-lg text-[#64748b] focus:text-[#22d3ee] focus:bg-white/5">
                  {language === 'es' ? 'Centro de Ayuda' : 'Help Center'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
