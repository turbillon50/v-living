import { Link, useLocation } from 'wouter';
import { Building2, Sparkles, LayoutGrid, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Inicio', icon: Home },
  { href: '/fractional', label: 'Fracciones', icon: Building2 },
  { href: '/experiences', label: 'Experiencias', icon: Sparkles },
  { href: '/lobby', label: 'Lobby', icon: LayoutGrid },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href === '/fractional' && location.startsWith('/fractional'));
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all cursor-pointer",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-transform",
                    !isActive && "animate-[pulse_2s_ease-in-out_infinite]"
                  )} />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
