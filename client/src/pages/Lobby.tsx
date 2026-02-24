import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';

const lobbyLinks = [
  {
    id: 'fractional',
    title: { es: 'Fractional Living', en: 'Fractional Living' },
    description: { es: 'Propiedad fraccionada de lujo en el Caribe', en: 'Luxury fractional ownership in the Caribbean' },
    href: '/fractional',
    gradient: 'from-[#0891b2] to-[#22d3ee]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'experiences',
    title: { es: 'Experiencias', en: 'Experiences' },
    description: { es: 'Vive momentos únicos en destinos exclusivos', en: 'Live unique moments at exclusive destinations' },
    href: '/experiences',
    gradient: 'from-[#06b6d4] to-[#22d3ee]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'capital',
    title: { es: 'Last Minute Capital', en: 'Last Minute Capital' },
    description: { es: 'Inversión operativa para escrituración', en: 'Operational investment for notarization' },
    href: '/last-minute',
    gradient: 'from-[#0e7490] to-[#0891b2]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'inmobiliaria',
    title: { es: 'Inmobiliaria', en: 'Real Estate' },
    description: { es: 'Propiedades en venta en el Caribe', en: 'Properties for sale in the Caribbean' },
    href: '/inmobiliaria',
    gradient: 'from-[#0891b2] to-[#0e7490]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="2" width="22" height="20" rx="2" ry="2" /><line x1="1" y1="12" x2="23" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    id: 'alix',
    title: { es: 'Hablar con ALIX', en: 'Talk to ALIX' },
    description: { es: 'Inteligencia artificial 24/7', en: 'AI assistance 24/7' },
    href: '/ai',
    gradient: 'from-[#7c3aed] to-[#a78bfa]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 22h-4a7 7 0 0 1-6.73-5H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" /><circle cx="9.5" cy="15.5" r="1" fill="currentColor" /><circle cx="14.5" cy="15.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    title: { es: 'WhatsApp', en: 'WhatsApp' },
    description: { es: 'Contacta a un asesor humano', en: 'Contact a human advisor' },
    href: 'https://wa.me/529984292748',
    gradient: 'from-[#25d366] to-[#128c7e]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

export default function Lobby() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fafcfd]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[360px] md:h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/30 to-[#fafcfd]" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
            <div className="fl-fade-in">
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">All Global Holding LLC</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-lobby">
                Lobby
              </h1>
              <p className="text-white/70 max-w-md mx-auto font-light text-sm">
                {language === 'es'
                  ? 'El punto central del ecosistema. Desde aquí accedes a todo.'
                  : 'The central hub of the ecosystem. Access everything from here.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 -mt-12 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lobbyLinks.map((item) => {
            const isExternal = item.href.startsWith('http');
            const card = (
              <div className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-[#e2e8f0] rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0891b2]/10 transition-all duration-300 hover:-translate-y-1" data-testid={`lobby-card-${item.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#0a1628] text-lg mb-1 group-hover:text-[#0891b2] transition-colors">
                      {item.title[language as 'es' | 'en'] || item.title.es}
                    </h3>
                    <p className="text-sm text-[#64748b]">
                      {item.description[language as 'es' | 'en'] || item.description.es}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-[#94a3b8] group-hover:text-[#0891b2] transition-colors flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              );
            }
            return (
              <Link key={item.id} href={item.href}>
                {card}
              </Link>
            );
          })}
        </div>
      </main>

      <AGHFooter />
    </div>
  );
}
