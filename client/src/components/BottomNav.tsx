import { Link, useLocation } from 'wouter';
import { Building2, Home as HomeIcon, Share2, User, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const WHATSAPP_NUMBER = '529984292748';
const WHATSAPP_MESSAGE = 'Hola, me interesa Fractional Living';

export function BottomNav({ onOpenAlix }: { onOpenAlix?: () => void }) {
  const [location] = useLocation();
  const { language } = useLanguage();

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Fractional Living',
      text: language === 'es'
        ? 'Descubre fracciones inmobiliarias de lujo en el Caribe Mexicano'
        : 'Discover luxury fractional real estate in the Mexican Caribbean',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`;
      window.open(waUrl, '_blank');
    }
  };

  const navItems = [
    { href: '/', labelEs: 'Inicio', labelEn: 'Home', icon: HomeIcon, action: 'link' as const },
    { href: '/fractional', labelEs: 'Invertir', labelEn: 'Invest', icon: Building2, action: 'link' as const },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 fl-glass-header safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href ||
            (item.href === '/fractional' && (location.startsWith('/fractional') || location.startsWith('/property')));

          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 transition-all duration-200 ${
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

        <button
          onClick={onOpenAlix}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 transition-all duration-200 text-[#475569] active:text-white"
          data-testid="nav-alix"
        >
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center border border-[rgba(6,182,212,0.3)] bg-[rgba(6,182,212,0.08)]">
            <span className="text-[#22d3ee] font-bold text-[7px] tracking-[0.1em] leading-none">AI</span>
          </div>
          <span className="text-[9px] tracking-[0.04em] uppercase font-normal text-[#22d3ee]">ALIX</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 transition-all duration-200 text-[#475569] active:text-white"
          data-testid="nav-share"
        >
          <Share2 className="w-[18px] h-[18px] stroke-[1.5]" />
          <span className="text-[9px] tracking-[0.04em] uppercase font-normal">
            {language === 'es' ? 'Compartir' : 'Share'}
          </span>
        </button>

        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 transition-all duration-200 text-[#25D366] active:text-[#20BD5A]"
          data-testid="nav-whatsapp"
        >
          <MessageCircle className="w-[18px] h-[18px] stroke-[1.5] fill-[#25D366]/20" />
          <span className="text-[9px] tracking-[0.04em] uppercase font-normal">WhatsApp</span>
        </button>
      </div>
    </nav>
  );
}
