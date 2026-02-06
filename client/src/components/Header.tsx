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
    <header className="sticky top-0 z-50 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {(location.startsWith('/property') || location === '/registro' || location === '/creator') && (
              <Link href="/fractional">
                <button className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5 text-black/60" />
                </button>
              </Link>
            )}
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-2.5 cursor-pointer">
                <AGHLogo size={22} color="#000000" />
                <span className="text-lg font-bold tracking-tight text-black">
                  FRACTIONAL LIVING
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-sm cursor-pointer transition-colors ${location.startsWith('/fractional') || location.startsWith('/property') ? 'text-black font-medium' : 'text-black/50 hover:text-black'}`}>
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-sm cursor-pointer transition-colors ${location === '/experiences' ? 'text-black font-medium' : 'text-black/50 hover:text-black'}`}>
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
            <Link href="/invest" data-testid="link-invest">
              <span className={`text-sm cursor-pointer transition-colors ${location === '/invest' ? 'text-black font-medium' : 'text-black/50 hover:text-black'}`}>
                {language === 'es' ? 'Invertir' : 'Invest'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-black/30 hover:text-black" title="Admin">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            
            <button 
              className="flex items-center gap-1 text-sm text-black/50 hover:text-black transition-colors px-2 py-1" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 border border-black/20 rounded-full px-2 py-1.5 hover:shadow-sm transition-shadow"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4 text-black/60" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? 'bg-black' : 'bg-black/40'}`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-2 py-2">
                      <p className="font-medium text-black">{user.name}</p>
                      <p className="text-xs text-black/50">{user.email}</p>
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
