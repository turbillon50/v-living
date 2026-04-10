import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, Lock, Search, X } from 'lucide-react';
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
  const [showSearch, setShowSearch] = useState(false);

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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 fl-glass-header">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg fl-gradient-brand flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-[#059669] tracking-tight hidden sm:inline">
                  fractional
                </span>
              </span>
            </Link>

            <button
              onClick={() => setShowSearch(true)}
              className="hidden md:flex items-center gap-4 border border-[#dddddd] rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              data-testid="button-search-header"
            >
              <span className="text-sm font-semibold px-2 border-r border-[#dddddd]">
                {language === 'es' ? 'Destino' : 'Destination'}
              </span>
              <span className="text-sm font-semibold px-2 border-r border-[#dddddd]">
                {language === 'es' ? 'Semana' : 'Week'}
              </span>
              <span className="text-sm text-[#717171] px-2">
                {language === 'es' ? '¿Cuántos?' : 'How many?'}
              </span>
              <div className="w-8 h-8 rounded-full fl-gradient-brand flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className="flex md:hidden items-center gap-2 flex-1 mx-2 max-w-[200px] bg-white border border-[#dddddd] rounded-full py-2 px-3 shadow-sm active:shadow-none transition-shadow"
              data-testid="button-search-mobile"
            >
              <Search className="w-3.5 h-3.5 text-[#222] flex-shrink-0" />
              <span className="text-xs font-semibold text-[#222] truncate">{language === 'es' ? '¿A dónde vas?' : 'Where to?'}</span>
            </button>

            <div className="flex items-center gap-1">
              <Link href="/creator">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-[#717171] hover:text-[#222] hover:bg-[#f7f7f7]" title="Admin">
                  <Lock className="w-4 h-4" />
                </Button>
              </Link>

              <button
                className="hidden md:flex items-center gap-1.5 text-sm text-[#222] font-semibold hover:bg-[#f7f7f7] px-3 py-2 rounded-full transition-colors"
                data-testid="button-language"
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 border border-[#dddddd] rounded-full px-2 py-1.5 hover:shadow-md transition-shadow ml-1"
                    data-testid="button-user-menu"
                  >
                    <Menu className="w-4 h-4 text-[#717171]" />
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? 'fl-gradient-brand' : 'bg-[#717171]'}`}>
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white border border-[#dddddd] shadow-lg">
                  {user ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="font-semibold text-sm text-[#222]">{user.name}</p>
                        <p className="text-xs text-[#717171]">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-[#ebebeb]" />
                      <Link href="/perfil">
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7] font-medium">
                          {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]">
                          {language === 'es' ? 'Mis Reservas' : 'My Bookings'}
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={handleRegister} className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]">
                        <span className="font-semibold">{language === 'es' ? 'Registrarse' : 'Sign up'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogin} className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]">
                        {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-[#ebebeb]" />
                  <Link href="/experiences">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]">
                      {language === 'es' ? 'Experiencias' : 'Experiences'}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/creator">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]" data-testid="menu-admin">
                      <Lock className="w-3.5 h-3.5 mr-2" />
                      {language === 'es' ? 'Administración' : 'Admin'}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7] md:hidden">
                    <Globe className="w-3.5 h-3.5 mr-2" />
                    {language === 'es' ? 'English' : 'Español'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer rounded-lg text-[#222] focus:bg-[#f7f7f7]">
                    {language === 'es' ? 'Centro de Ayuda' : 'Help Center'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-[100] bg-white md:bg-black/40" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-2xl mx-auto md:mt-20 bg-white md:rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-[#ebebeb]">
              <button onClick={() => setShowSearch(false)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#dddddd] hover:shadow-md transition-shadow" data-testid="button-close-search">
                <X className="w-4 h-4" />
              </button>
              <div className="flex gap-4">
                <button className="text-sm font-semibold text-[#222] border-b-2 border-[#222] pb-1">
                  {language === 'es' ? 'Fracciones' : 'Fractions'}
                </button>
                <button className="text-sm text-[#717171] pb-1">
                  {language === 'es' ? 'Experiencias' : 'Experiences'}
                </button>
              </div>
              <div className="w-8" />
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-[#dddddd] p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-xs font-bold text-[#222] mb-1">{language === 'es' ? 'Destino' : 'Destination'}</p>
                <p className="text-sm text-[#717171]">{language === 'es' ? 'Riviera Maya, Tulum, Cancún...' : 'Riviera Maya, Tulum, Cancún...'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/fractional" onClick={() => setShowSearch(false)}>
                  <div className="rounded-2xl border border-[#dddddd] p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="text-xs font-bold text-[#222] mb-1">{language === 'es' ? 'Semana' : 'Week'}</p>
                    <p className="text-sm text-[#717171]">{language === 'es' ? 'Elige semanas' : 'Choose weeks'}</p>
                  </div>
                </Link>
                <div className="rounded-2xl border border-[#dddddd] p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="text-xs font-bold text-[#222] mb-1">{language === 'es' ? '¿Cuántos?' : 'How many?'}</p>
                  <p className="text-sm text-[#717171]">{language === 'es' ? 'Agregar huéspedes' : 'Add guests'}</p>
                </div>
              </div>
              <Link href="/fractional" onClick={() => setShowSearch(false)}>
                <button className="w-full py-3.5 fl-btn-primary text-base flex items-center justify-center gap-2" data-testid="button-search-go">
                  <Search className="w-4 h-4" />
                  {language === 'es' ? 'Buscar' : 'Search'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
