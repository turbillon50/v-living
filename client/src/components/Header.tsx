import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, Lock, Search, X } from 'lucide-react';
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
    window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20V-Living%20de%20All%20Global%20Holding', '_blank');
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" data-testid="link-home">
              <span className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-cyan-300/25 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                  <span className="text-white font-serif text-lg leading-none">V</span>
                </div>
                <span className="hidden sm:inline">
                  <span className="block text-lg font-semibold text-white tracking-tight">V-Living</span>
                  <span className="block text-[9px] text-cyan-200/60 tracking-[0.24em] uppercase">All Global Holding LLC</span>
                </span>
              </span>
            </Link>

            <button
              onClick={() => setShowSearch(true)}
              className="hidden md:flex items-center gap-4 border border-white/10 bg-white/5 rounded-full py-2 px-4 shadow-sm hover:bg-white/10 transition-colors cursor-pointer"
              data-testid="button-search-header"
            >
              <span className="text-sm font-semibold px-2 border-r border-white/10 text-white">
                {language === 'es' ? 'Destino' : 'Destination'}
              </span>
              <span className="text-sm font-semibold px-2 border-r border-white/10 text-white">
                {language === 'es' ? 'Semana' : 'Week'}
              </span>
              <span className="text-sm text-white/50 px-2">
                {language === 'es' ? 'Fracciones' : 'Fractions'}
              </span>
              <div className="w-8 h-8 rounded-full bg-cyan-300/20 border border-cyan-300/30 flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-cyan-200" />
              </div>
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className="hidden md:flex items-center gap-2 flex-1 mx-2 max-w-[200px] bg-white/5 border border-white/10 rounded-full py-2 px-3 active:shadow-none transition-colors"
              data-testid="button-search-mobile"
            >
              <Search className="w-3.5 h-3.5 text-cyan-200 flex-shrink-0" />
              <span className="text-xs font-semibold text-white truncate">{language === 'es' ? 'Buscar acceso' : 'Search access'}</span>
            </button>

            <div className="flex items-center gap-2">
              <Link href="/creator">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-colors" title="Admin" data-testid="button-admin-lock">
                  <Lock className="w-[18px] h-[18px]" />
                </button>
              </Link>

              <button
                className="hidden md:flex items-center gap-1.5 text-sm text-white/70 font-semibold hover:bg-white/10 px-3 py-2 rounded-full transition-colors"
                data-testid="button-language"
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-2 py-1.5 hover:bg-white/10 transition-colors ml-1"
                    data-testid="button-user-menu"
                  >
                    <Menu className="w-4 h-4 text-white/55" />
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? 'bg-cyan-300/20 border border-cyan-300/30' : 'bg-white/15'}`}>
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl bg-[#050505] border border-white/10 shadow-2xl text-white">
                  {user ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="font-semibold text-sm text-white">{user.name}</p>
                        <p className="text-xs text-white/45">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <Link href="/perfil">
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-white focus:bg-white/10 font-medium">
                          {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10">
                          {language === 'es' ? 'Mis Reservas' : 'My Bookings'}
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={handleRegister} className="cursor-pointer rounded-lg text-white focus:bg-white/10">
                        <span className="font-semibold">{language === 'es' ? 'Solicitar acceso' : 'Request access'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogin} className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10">
                        {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <Link href="/experiences">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10">
                      {language === 'es' ? 'Experiencias' : 'Experiences'}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/ai">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10" data-testid="menu-alix">
                      <div className="w-4 h-4 rounded-full bg-cyan-300/20 border border-cyan-300/30 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-cyan-100 font-bold text-[5px]">AI</span>
                      </div>
                      ALIX
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/creator">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10" data-testid="menu-admin">
                      <Lock className="w-3.5 h-3.5 mr-2" />
                      {language === 'es' ? 'Administración' : 'Admin'}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10 md:hidden">
                    <Globe className="w-3.5 h-3.5 mr-2" />
                    {language === 'es' ? 'English' : 'Español'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer rounded-lg text-white/70 focus:bg-white/10">
                    {language === 'es' ? 'Centro de Ayuda' : 'Help Center'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-2xl mx-auto md:mt-20 bg-[#050505] md:rounded-3xl shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <button onClick={() => setShowSearch(false)} className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors" data-testid="button-close-search">
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-4">
                <button className="text-sm font-semibold text-white border-b-2 border-cyan-300 pb-1">
                  {language === 'es' ? 'Fracciones' : 'Fractions'}
                </button>
                <button className="text-sm text-white/45 pb-1">
                  {language === 'es' ? 'Experiencias' : 'Experiences'}
                </button>
              </div>
              <div className="w-8" />
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-xs font-bold text-white mb-1">{language === 'es' ? 'Destino' : 'Destination'}</p>
                <p className="text-sm text-white/45">{language === 'es' ? 'Riviera Maya, Tulum, Cancún...' : 'Riviera Maya, Tulum, Cancún...'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/fractional" onClick={() => setShowSearch(false)}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-white mb-1">{language === 'es' ? 'Semana' : 'Week'}</p>
                    <p className="text-sm text-white/45">{language === 'es' ? 'Elige semanas' : 'Choose weeks'}</p>
                  </div>
                </Link>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-white mb-1">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
                  <p className="text-sm text-white/45">{language === 'es' ? 'Elige acceso' : 'Choose access'}</p>
                </div>
              </div>
              <Link href="/fractional" onClick={() => setShowSearch(false)}>
                <button className="w-full py-3.5 bg-white text-black rounded-xl text-base font-semibold flex items-center justify-center gap-2" data-testid="button-search-go">
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
