import { useQuery } from '@tanstack/react-query';
import { Instagram, Youtube, Facebook, Twitter, Linkedin, Globe, Play, ExternalLink, Music, MessageCircle, Mail, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import logoImg from '@/assets/logo.png';

interface MultiLink {
  id: string;
  title: string;
  url: string;
  type: string;
  position: number;
  isActive: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'instagram': return Instagram;
    case 'youtube': return Youtube;
    case 'facebook': return Facebook;
    case 'twitter': return Twitter;
    case 'linkedin': return Linkedin;
    case 'tiktok': return Music;
    case 'video': return Play;
    case 'whatsapp': return MessageCircle;
    case 'email': return Mail;
    case 'phone': return Phone;
    default: return Globe;
  }
};

const getBrandColor = (type: string) => {
  switch (type) {
    case 'instagram': return 'hover:border-pink-500';
    case 'youtube': return 'hover:border-red-500';
    case 'tiktok': return 'hover:border-white';
    case 'linkedin': return 'hover:border-blue-500';
    case 'whatsapp': return 'hover:border-green-500';
    default: return 'hover:border-orange-500';
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'instagram': return 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400';
    case 'youtube': return 'bg-red-600';
    case 'tiktok': return 'bg-black';
    case 'linkedin': return 'bg-blue-600';
    case 'facebook': return 'bg-blue-500';
    case 'whatsapp': return 'bg-green-500';
    case 'twitter': return 'bg-black';
    default: return 'bg-orange-500';
  }
};

export default function Multilinks() {
  const { data: links = [] } = useQuery<MultiLink[]>({
    queryKey: ['multilinks'],
    queryFn: async () => {
      const res = await fetch('/api/multilinks');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const activeLinks = links.filter(l => l.isActive).sort((a, b) => a.position - b.position);

  const defaultLinks: MultiLink[] = [
    { id: '1', title: 'WhatsApp', url: 'https://wa.me/529984292748', type: 'whatsapp', position: 1, isActive: true },
    { id: '2', title: 'Instagram', url: 'https://instagram.com/fractionalliving', type: 'instagram', position: 2, isActive: true },
    { id: '3', title: 'TikTok', url: 'https://tiktok.com/@fractionalliving', type: 'tiktok', position: 3, isActive: true },
    { id: '4', title: 'YouTube', url: 'https://youtube.com/@fractionalliving', type: 'youtube', position: 4, isActive: true },
    { id: '5', title: 'LinkedIn', url: 'https://linkedin.com/company/fractionalliving', type: 'linkedin', position: 5, isActive: true },
  ];

  const displayLinks = activeLinks.length > 0 ? activeLinks : defaultLinks;

  return (
    <div className="min-h-screen bg-black pb-32">
      <Header />
      
      <div className="max-w-md mx-auto px-4 pt-6 pb-12">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
            <img 
              src={logoImg} 
              alt="Fractional Living" 
              className="relative h-20 w-auto mx-auto drop-shadow-2xl" 
            />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight mb-1">FRACTIONAL LIVING</h1>
          <p className="text-white/40 text-sm font-light tracking-widest">ALL GLOBAL HOLDING LLC</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-orange-500" />
            <p className="text-orange-500 text-xs font-medium tracking-wide">COMPRA • VIVE • RENTA • REVENDE</p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-orange-500" />
          </div>
        </div>

        <div className="space-y-3">
          {displayLinks.map((link, index) => {
            const Icon = getIcon(link.type);
            const brandHover = getBrandColor(link.type);
            const iconBg = getIconBg(link.type);
            
            return (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] ${brandHover}`}
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`link-${link.type}`}
              >
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <span className="text-white font-semibold text-base">{link.title}</span>
                  <p className="text-white/40 text-xs truncate">{link.url.replace('https://', '').split('/')[0]}</p>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-orange-500">
                  <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl">
          <p className="text-center text-white/80 font-medium mb-2">¿Listo para invertir en el Caribe?</p>
          <p className="text-center text-white/40 text-sm mb-4">Fracciones desde $65,000 USD</p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20invertir%20en%20una%20fracción"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-center transition-all active:scale-[0.98]"
            data-testid="cta-whatsapp"
          >
            Solicitar Información
          </a>
        </div>

        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-orange-500 text-xl font-bold">8+</p>
              <p className="text-white/30 text-[10px]">PROPIEDADES</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-orange-500 text-xl font-bold">42</p>
              <p className="text-white/30 text-[10px]">FRACCIONES</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-orange-500 text-xl font-bold">30%</p>
              <p className="text-white/30 text-[10px]">ENGANCHE</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/20 text-[10px] tracking-widest">© 2024 ALL GLOBAL HOLDING LLC</p>
          <p className="text-white/10 text-[10px] mt-1">Cancún, Quintana Roo, México</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
