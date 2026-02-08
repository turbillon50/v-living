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
import { AGHLogo } from '@/components/AGHLogo';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#eee]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {(location.startsWith('/property') || location === '/registro' || location === '/creator') && (
              <Link href="/fractional">
                <button className="p-2 -ml-2 hover:bg-[#f5f5f5] rounded-md transition-colors duration-200" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5 text-[#999]" />
                </button>
              </Link>
            )}
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-2.5 cursor-pointer">
                <AGHLogo size={20} color="#111" />
                <span className="text-base tracking-[0.08em] text-[#111] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                  Fractional Living
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 ${location.startsWith('/fractional') || location.startsWith('/property') ? 'text-[#111]' : 'text-[#999] hover:text-[#111]'}`}>
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 ${location === '/experiences' ? 'text-[#111]' : 'text-[#999] hover:text-[#111]'}`}>
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
            <Link href="/invest" data-testid="link-invest">
              <span className={`text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 ${location === '/invest' ? 'text-[#111]' : 'text-[#999] hover:text-[#111]'}`}>
                {language === 'es' ? 'Invertir' : 'Invest'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-[#ccc] hover:text-[#111] hover:bg-[#f5f5f5]" title="Admin">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            
            <button 
              className="flex items-center gap-1 text-xs text-[#999] hover:text-[#111] transition-colors duration-200 px-2 py-1 tracking-wider uppercase" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-3.5 h-3.5" />
              {language.toUpperCase()}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 border border-[#ddd] rounded-md px-2.5 py-1.5 hover:border-[#999] transition-all duration-200"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4 text-[#999]" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? 'bg-[#111]' : 'bg-[#ccc]'}`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-medium text-[#111]">{user.name}</p>
                      <p className="text-xs text-[#999]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/perfil">
                      <DropdownMenuItem className="cursor-pointer">
                        {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                      </DropdownMenuItem>
                    </Link>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleRegister} className="cursor-pointer">
                      <span className="font-medium">{language === 'es' ? 'Registrarse' : 'Sign up'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
                      {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer">
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
