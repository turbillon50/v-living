import { Link, useLocation } from 'wouter';
import { Building2, Home as HomeIcon, Sparkles, User, Compass } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export function BottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();

  const navItems = [
    { href: '/', labelEs: 'Inicio', labelEn: 'Home', icon: HomeIcon },
    { href: '/fractional', labelEs: 'Fracciones', labelEn: 'Fractions', icon: Building2 },
    { href: '/experiences', labelEs: 'Experiencias', labelEn: 'Experiences', icon: Sparkles },
    { href: '/links', labelEs: 'Explorar', labelEn: 'Explore', icon: Compass },
    { href: '/perfil', labelEs: 'Perfil', labelEn: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 fl-glass-header safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href ||
            (item.href === '/fractional' && (location.startsWith('/fractional') || location.startsWith('/property')));

          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1.5 transition-all duration-200 ${
                isActive ? 'text-[#22d3ee]' : 'text-[#475569]'
              }`} data-testid={`nav-${item.href.slice(1) || 'home'}`}>
                <Icon className={`w-[18px] h-[18px] transition-all duration-200 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
                <span className={`text-[9px] tracking-[0.04em] uppercase transition-all duration-200 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                  {language === 'es' ? item.labelEs : item.labelEn}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
