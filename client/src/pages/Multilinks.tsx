import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import logoImg from '@/assets/logo-all-living.jpg';

interface MultiLink {
  id: string;
  title: string;
  url: string;
  type: string;
  position: number;
  isActive: boolean;
}

const getIconSvg = (type: string) => {
  switch (type) {
    case 'instagram':
      return <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
    case 'youtube':
      return <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'tiktok':
      return <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
    case 'linkedin':
      return <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'whatsapp':
      return <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    default:
      return <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'instagram': return 'bg-gradient-to-br from-purple-600 via-pink-500 to-amber-400';
    case 'youtube': return 'bg-red-600';
    case 'tiktok': return 'bg-[#0a1628]';
    case 'linkedin': return 'bg-blue-600';
    case 'facebook': return 'bg-blue-500';
    case 'whatsapp': return 'bg-[#25d366]';
    default: return 'bg-gradient-to-br from-[#0891b2] to-[#22d3ee]';
  }
};

const getBrandHover = (type: string) => {
  switch (type) {
    case 'instagram': return 'hover:border-pink-400/50';
    case 'youtube': return 'hover:border-red-400/50';
    case 'tiktok': return 'hover:border-[#0a1628]/50';
    case 'linkedin': return 'hover:border-blue-400/50';
    case 'whatsapp': return 'hover:border-[#25d366]/50';
    default: return 'hover:border-[#0891b2]/50';
  }
};

export default function Multilinks() {
  const { language } = useLanguage();

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
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0a1628] to-[#0e7490]/30">
      <div className="max-w-md mx-auto px-4 pt-10 pb-16">
        <div className="text-center mb-10">
          <div className="w-28 h-28 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#0891b2]/30 ring-4 ring-[#0891b2]/10">
            <img
              src={logoImg}
              alt="All Living"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white text-2xl tracking-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
            ALL LIVING
          </h1>
          <p className="text-[#22d3ee]/70 text-xs font-light tracking-[0.3em]">ALL GLOBAL HOLDING LLC</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#0891b2]/50" />
            <p className="text-[#22d3ee] text-[10px] font-medium tracking-[0.2em]">
              {language === 'es' ? 'COMPRA \u00b7 VIVE \u00b7 RENTA \u00b7 REVENDE' : 'BUY \u00b7 LIVE \u00b7 RENT \u00b7 RESELL'}
            </p>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#0891b2]/50" />
          </div>
        </div>

        <div className="space-y-3">
          {displayLinks.map((link) => {
            const iconBg = getIconBg(link.type);
            const brandHover = getBrandHover(link.type);

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] ${brandHover}`}
                data-testid={`link-${link.type}`}
              >
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                  {getIconSvg(link.type)}
                </div>

                <div className="flex-1">
                  <span className="text-white font-medium text-base">{link.title}</span>
                  <p className="text-white/40 text-xs truncate">{link.url.replace('https://', '').split('/')[0]}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#0891b2]">
                  <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-2xl">
          <p className="text-center text-white font-medium mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem' }}>
            {language === 'es' ? '¿Listo para invertir en el Caribe?' : 'Ready to invest in the Caribbean?'}
          </p>
          <p className="text-center text-white/70 text-sm mb-4">
            {language === 'es' ? 'Fracciones desde $65,000 USD' : 'Fractions from $65,000 USD'}
          </p>
          <a
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20invertir%20en%20una%20fracción"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-white text-[#0a1628] font-bold rounded-xl text-center transition-all hover:bg-white/90 active:scale-[0.98]"
            data-testid="cta-whatsapp"
          >
            {language === 'es' ? 'Solicitar Información' : 'Request Information'}
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/20 text-[10px] tracking-widest">© 2025 ALL GLOBAL HOLDING LLC</p>
          <p className="text-white/10 text-[10px] mt-1">Cancún, Quintana Roo, México</p>
        </div>
      </div>
    </div>
  );
}
