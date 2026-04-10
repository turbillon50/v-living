import { Link, useLocation } from 'wouter';
import { Search, Building2, Heart, User } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export function BottomNav({ onOpenAlix }: { onOpenAlix?: () => void }) {
  const [location] = useLocation();
  const { language } = useLanguage();

  const tabs = [
    { href: '/', icon: Search, labelEs: 'Explorar', labelEn: 'Explore', match: (l: string) => l === '/' || l === '/home' },
    { href: '/fractional', icon: Building2, labelEs: 'Fracciones', labelEn: 'Fractions', match: (l: string) => l.startsWith('/fractional') || l.startsWith('/property') },
    { href: '/favoritos', icon: Heart, labelEs: 'Favoritos', labelEn: 'Favorites', match: (l: string) => l === '/favoritos' },
    { href: '/perfil', icon: User, labelEs: 'Perfil', labelEn: 'Profile', match: (l: string) => l === '/perfil' || l === '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#ebebeb] safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = item.match(location);
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-colors ${
                isActive ? 'text-[#059669]' : 'text-[#717171]'
              }`} data-testid={`nav-${item.href.slice(1) || 'explore'}`}>
                <Icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
                  {language === 'es' ? item.labelEs : item.labelEn}
                </span>
              </button>
            </Link>
          );
        })}

        <button
          onClick={onOpenAlix}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 text-[#717171] active:text-[#059669] transition-colors"
          data-testid="nav-alix"
        >
          <div className="w-[22px] h-[22px] rounded-full fl-gradient-brand flex items-center justify-center">
            <span className="text-white font-bold text-[7px] tracking-wide">AI</span>
          </div>
          <span className="text-[10px] tracking-tight font-medium text-[#059669]">ALIX</span>
        </button>

        {tabs.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = item.match(location);
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-colors ${
                isActive ? 'text-[#059669]' : 'text-[#717171]'
              }`} data-testid={`nav-${item.href.slice(1)}`}>
                <Icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
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
