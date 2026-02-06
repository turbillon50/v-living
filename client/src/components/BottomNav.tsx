import { Link, useLocation } from 'wouter';
import { Building2, Home as HomeIcon, Sparkles, User, LinkIcon } from 'lucide-react';

export function BottomNav() {
  const [location] = useLocation();


  const navItems = [
    { href: '/', label: 'Inicio', icon: HomeIcon },
    { href: '/fractional', label: 'Fracciones', icon: Building2 },
    { href: '/experiences', label: 'Experiencias', icon: Sparkles },
    { href: '/links', label: 'Links', icon: LinkIcon },
    { href: '/registro', label: 'Registro', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href === '/fractional' && (location.startsWith('/fractional') || location.startsWith('/property')));
          
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-2 transition-colors ${
                isActive ? 'text-black' : 'text-black/40'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[9px] leading-tight ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
