import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, Lock, ArrowLeft, Waves } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e2e8f0]/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {(location.startsWith('/property') || location === '/registro' || location === '/creator') && (
              <Link href="/fractional">
                <button className="p-2 -ml-2 hover:bg-[#f1f5f9] rounded-xl transition-colors duration-200" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5 text-[#64748b]" />
                </button>
              </Link>
            )}
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg fl-gradient-turquoise flex items-center justify-center shadow-sm shadow-[#0891b2]/20 group-hover:shadow-md group-hover:shadow-[#0891b2]/30 transition-all duration-300">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <span className="text-base tracking-[0.06em] text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                  Fractional Living
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 font-medium ${location.startsWith('/fractional') || location.startsWith('/property') ? 'text-[#0891b2]' : 'text-[#64748b] hover:text-[#0891b2]'}`}>
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 font-medium ${location === '/experiences' ? 'text-[#0891b2]' : 'text-[#64748b] hover:text-[#0891b2]'}`}>
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
            <Link href="/invest" data-testid="link-invest">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 font-medium ${location === '/invest' ? 'text-[#0891b2]' : 'text-[#64748b] hover:text-[#0891b2]'}`}>
                {language === 'es' ? 'Invertir' : 'Invest'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-[#94a3b8] hover:text-[#0891b2] hover:bg-[#f0fdfa]" title="Admin">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            
            <button 
              className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#0891b2] transition-colors duration-200 px-2 py-1 tracking-wider uppercase font-medium" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-3.5 h-3.5" />
              {language.toUpperCase()}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 border border-[#e2e8f0] rounded-xl px-2.5 py-1.5 hover:border-[#0891b2]/30 hover:shadow-sm transition-all duration-200"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4 text-[#94a3b8]" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? 'fl-gradient-turquoise' : 'bg-[#cbd5e1]'}`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-medium text-[#0a1628]">{user.name}</p>
                      <p className="text-xs text-[#94a3b8]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/perfil">
                      <DropdownMenuItem className="cursor-pointer rounded-lg">
                        {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                      </DropdownMenuItem>
                    </Link>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleRegister} className="cursor-pointer rounded-lg">
                      <span className="font-medium">{language === 'es' ? 'Registrarse' : 'Sign up'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogin} className="cursor-pointer rounded-lg">
                      {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer rounded-lg">
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
