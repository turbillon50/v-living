import { Link, useLocation } from 'wouter';
import { Building2, Home as HomeIcon, Sparkles, User, Compass } from 'lucide-react';

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Inicio', icon: HomeIcon },
    { href: '/fractional', label: 'Fracciones', icon: Building2 },
    { href: '/experiences', label: 'Experiencias', icon: Sparkles },
    { href: '/links', label: 'Explorar', icon: Compass },
    { href: '/registro', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0]/60 safe-area-bottom">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href === '/fractional' && (location.startsWith('/fractional') || location.startsWith('/property')));
          
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-1.5 min-w-[60px] py-2 transition-all duration-300 ${
                isActive ? 'text-[#0891b2]' : 'text-[#94a3b8]'
              }`}>
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#0891b2]/10' : ''}`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0891b2]" />
                  )}
                </div>
                <span className={`text-[9px] tracking-[0.05em] uppercase transition-all duration-300 ${isActive ? 'font-semibold text-[#0891b2]' : 'font-light'}`}>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
