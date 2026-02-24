import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { Link } from 'wouter';

export default function ModeloNegocios() {
  const { language } = useLanguage();

  const operativeSteps = [
    {
      num: 1,
      title: language === 'es' ? 'Adquisición con crédito hipotecario' : 'Mortgage credit acquisition',
      desc: language === 'es'
        ? 'Utilizamos el crédito hipotecario, el dinero más barato en México. Para ello existe el Perfil Asociado de Crédito.'
        : 'We use mortgage credit, the cheapest money in Mexico. The Credit Associate Profile exists for this.'
    },
    {
      num: 2,
      title: language === 'es' ? 'Optimización de capital y tiempos' : 'Capital and time optimization',
      desc: language === 'es'
        ? 'Para reducir fricción y acelerar cierres, existe Last Minute Capital, que entra cuando el proceso ya está avanzado.'
        : 'To reduce friction and accelerate closings, Last Minute Capital enters when the process is already advanced.'
    },
    {
      num: 3,
      title: language === 'es' ? 'Selección del activo' : 'Asset selection',
      desc: language === 'es'
        ? 'El Perfil Asociado Patrimonial integra propiedades al sistema, activándolas bajo el modelo fractional.'
        : 'The Patrimonial Associate Profile integrates properties into the system under the fractional model.'
    },
    {
      num: 4,
      title: language === 'es' ? 'Estructuración fiduciaria' : 'Fiduciary structuring',
      desc: language === 'es'
        ? 'Una vez consolidado, el activo se integra a fideicomisos y contratos mercantiles, con flujos bancarios formales.'
        : 'Once consolidated, the asset integrates into trusts and commercial contracts with formal banking flows.'
    },
    {
      num: 5,
      title: language === 'es' ? 'Monetización múltiple' : 'Multiple monetization',
      desc: language === 'es'
        ? 'El activo se explota de manera integral: venta tradicional, venta digital, fraccionamiento, uso vacacional, ocupación, reventa.'
        : 'The asset is exploited comprehensively: traditional sale, digital sale, fractioning, vacation use, occupancy, resale.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafcfd]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/30 to-[#fafcfd]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2]/20 via-transparent to-[#0891b2]/20" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
            <div className="fl-fade-in">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center shadow-lg shadow-[#0891b2]/30">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">All Global Holding LLC</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-modelo">
                {language === 'es' ? 'Modelo de Negocio' : 'Business Model'}
              </h1>
              <p className="text-white/70 max-w-lg mx-auto font-light text-sm md:text-base">
                {language === 'es'
                  ? 'Un sistema que integra inmuebles, capital, tecnología y personas'
                  : 'A system that integrates real estate, capital, technology and people'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-[#e2e8f0] rounded-2xl p-6 md:p-8 mb-8 shadow-lg" data-testid="card-modelo-intro">
          <p className="text-[#475569] leading-relaxed mb-4 text-lg italic text-center" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {language === 'es' ? 'Si llegaste hasta aquí, no estás buscando un producto aislado. Estás buscando entender un sistema.' : 'If you made it here, you are not looking for an isolated product. You are looking to understand a system.'}
          </p>
          <p className="text-[#334155] leading-relaxed mb-4 text-sm">
            {language === 'es'
              ? 'All Global Holding LLC es una Limited Liability Company constituida en Estados Unidos, creada para diseñar, estructurar y operar modelos de capital vinculados a activos reales.'
              : 'All Global Holding LLC is a Limited Liability Company incorporated in the United States, created to design, structure and operate capital models linked to real assets.'}
          </p>
          <div className="bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] rounded-xl p-4">
            <p className="text-[#0e7490] text-sm">
              {language === 'es' ? 'No nacimos en el mundo digital.' : 'We were not born in the digital world.'}
              <span className="font-medium"> {language === 'es' ? 'Nacimos en el mundo inmobiliario.' : 'We were born in the real estate world.'}</span>
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'Momento de adaptación' : 'Moment of Adaptation'}
            </h2>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm mb-4">
            {language === 'es'
              ? 'La pandemia cambió las reglas. Las tasas de interés subieron, el crédito se encareció, los ciclos de venta se alargaron.'
              : 'The pandemic changed the rules. Interest rates rose, credit became more expensive, sales cycles lengthened.'}
          </p>
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm">
            <p className="text-[#0a1628] font-medium mb-1 text-sm">{language === 'es' ? 'Entendimos algo fundamental:' : 'We understood something fundamental:'}</p>
            <p className="text-[#475569] text-sm">{language === 'es' ? 'Los activos ya no se venden igual, y quien no se adapta, desaparece.' : 'Assets no longer sell the same way, and those who don\'t adapt, disappear.'}</p>
          </div>
          <p className="text-[#94a3b8] text-sm italic text-center mt-4">
            {language === 'es' ? 'La respuesta era ' : 'The answer was '}<span className="text-[#0e7490] font-medium">{language === 'es' ? 'reconfigurar el modelo' : 'reconfigure the model'}</span>.
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                {language === 'es' ? 'El modelo Fractional' : 'The Fractional Model'}
              </h2>
              <p className="text-[#94a3b8] text-xs">({language === 'es' ? 'y lo que NO es' : 'and what it is NOT'})</p>
            </div>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm mb-4">
            {language === 'es'
              ? 'Un activo fraccionado no pierde valor, lo redistribuye, lo optimiza y lo hace accesible sin degradarlo.'
              : 'A fractional asset does not lose value, it redistributes, optimizes and makes it accessible without degrading it.'}
          </p>
          <div className="bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] border border-[#0891b2]/20 rounded-xl p-4 mb-4 text-center">
            <p className="text-[#0e7490] text-sm italic" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem' }}>
              {language === 'es'
                ? '"Un elefante no corre más rápido por cortarlo en pedazos. Pero puede llegar más lejos si se organiza mejor."'
                : '"An elephant doesn\'t run faster by cutting it into pieces. But it can go further if organized better."'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-3 text-center shadow-sm">
              <p className="text-[#0e7490] text-sm font-medium">{language === 'es' ? 'Dividir la propiedad' : 'Divide property'}</p>
              <p className="text-[#94a3b8] text-xs">{language === 'es' ? 'no el valor' : 'not value'}</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-3 text-center shadow-sm">
              <p className="text-[#0e7490] text-sm font-medium">{language === 'es' ? 'Multiplicar los puntos de entrada' : 'Multiply entry points'}</p>
              <p className="text-[#94a3b8] text-xs">{language === 'es' ? 'no reducir la calidad' : 'not reduce quality'}</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'De lo local a lo global' : 'From Local to Global'}
            </h2>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm mb-4">
            {language === 'es'
              ? 'Para operar este modelo de forma internacional, fundamos All Global Holding LLC. La estructura en Estados Unidos nos permitió:'
              : 'To operate this model internationally, we founded All Global Holding LLC. The US structure allowed us to:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              language === 'es' ? 'Abrir mercados' : 'Open markets',
              language === 'es' ? 'Vender a públicos internacionales' : 'Sell to international audiences',
              language === 'es' ? 'Operar con flexibilidad legal' : 'Operate with legal flexibility',
              language === 'es' ? 'Integrar tecnología sin fronteras' : 'Integrate technology without borders',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] rounded-lg p-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[#475569] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'Infraestructura digital' : 'Digital Infrastructure'}
            </h2>
          </div>
          <div className="bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] rounded-xl p-4 mb-4 text-center">
            <p className="text-[#0e7490] font-medium text-sm">{language === 'es' ? 'La digitalización no es el negocio. Es el vehículo.' : 'Digitization is not the business. It is the vehicle.'}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm">
              <p className="text-[#0a1628] font-medium mb-1 text-sm">Security Tokens</p>
              <p className="text-[#64748b] text-xs">{language === 'es' ? 'Vinculados a activos reales y estructuras específicas' : 'Linked to real assets and specific structures'}</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm">
              <p className="text-[#0a1628] font-medium mb-1 text-sm">Utility Tokens</p>
              <p className="text-[#64748b] text-xs">{language === 'es' ? 'Diseñados para acceso, uso y operación' : 'Designed for access, use and operation'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white rounded-full text-xs">Token ALIX</span>
            <span className="px-3 py-1 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white rounded-full text-xs">Token LNC</span>
            <span className="px-3 py-1 bg-gradient-to-r from-[#0a1628] to-[#1e293b] text-white rounded-full text-xs">ALIX (IA operativa)</span>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              VanDeFi
            </h2>
          </div>
          <p className="text-[#475569] text-sm mb-4">
            {language === 'es' ? 'Wallet digital que conecta el mundo fiat con el mundo digital.' : 'Digital wallet connecting fiat and digital worlds.'}
          </p>
          <div className="space-y-2 mb-4">
            {[
              language === 'es' ? 'Conecta el mundo fiat con el mundo digital' : 'Connects fiat and digital worlds',
              language === 'es' ? 'Facilita pagos, acceso y operación' : 'Facilitates payments, access and operation',
              language === 'es' ? 'Resuelve remesas internacionales' : 'Solves international remittances',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] rounded-lg p-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[#475569] text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-xl p-4 text-center">
            <p className="text-white font-medium mb-1 text-sm">{language === 'es' ? 'VanDeFi ya está disponible y operando' : 'VanDeFi is now available and operating'}</p>
            <a href="https://vandefi.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm transition-colors" data-testid="link-vandefi">
              vandefi.org
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'El modelo operativo' : 'The Operative Model'}
            </h2>
          </div>
          <p className="text-[#475569] text-center italic mb-6 text-sm">
            {language === 'es' ? 'Cada pieza cumple una función clara:' : 'Each piece fulfills a clear function:'}
          </p>

          <div className="space-y-4">
            {operativeSteps.map((step) => (
              <div key={step.num} className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm border-l-4 border-l-[#0891b2]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#0891b2] to-[#22d3ee] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {step.num}
                  </span>
                  <p className="text-[#0a1628] font-medium text-sm">{step.title}</p>
                </div>
                <p className="text-[#64748b] text-sm pl-11">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[#0e7490] font-medium text-center mt-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem' }}>
            {language === 'es' ? 'Nada compite. Todo suma.' : 'Nothing competes. Everything adds up.'}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-[#0a1628] text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? 'Lo que hace distinto al modelo' : 'What Makes the Model Different'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {['Capital', language === 'es' ? 'Crédito' : 'Credit', language === 'es' ? 'Tiempo' : 'Time', language === 'es' ? 'Uso' : 'Use', language === 'es' ? 'Estructura' : 'Structure', language === 'es' ? 'Tecnología' : 'Technology'].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-[#f0fdfa] to-[#ecfeff] rounded-lg p-3 text-center">
                <p className="text-[#0e7490] text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              language === 'es' ? 'El rendimiento del inversionista' : 'Investor returns',
              language === 'es' ? 'La liquidez del propietario' : 'Owner liquidity',
              language === 'es' ? 'La experiencia del usuario' : 'User experience',
              language === 'es' ? 'La estabilidad del sistema' : 'System stability',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-lg p-3 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-[#475569] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0a1628] to-[#0e7490] rounded-2xl p-8 text-center mb-10" data-testid="card-modelo-cierre">
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Cierre' : 'Closing'}
          </h2>
          <p className="text-white/80 leading-relaxed mb-3">
            All Global Holding LLC {language === 'es' ? 'no vende promesas.' : 'doesn\'t sell promises.'}
            <span className="text-white font-medium"> {language === 'es' ? 'Opera infraestructura.' : 'It operates infrastructure.'}</span>
          </p>
          <p className="text-white/60 italic text-sm">
            {language === 'es'
              ? 'Si llegaste hasta aquí, no fue casualidad. Estás viendo un modelo pensado para durar, no para impresionar.'
              : 'If you made it here, it was no coincidence. You are seeing a model built to last, not to impress.'}
          </p>
          <p className="text-white font-medium text-xl mt-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {language === 'es' ? 'Bienvenido al sistema.' : 'Welcome to the system.'}
          </p>
        </section>

        <div className="text-center mb-16">
          <p className="text-[#64748b] text-sm mb-4">
            {language === 'es' ? '¿Tienes preguntas? Habla con ALIX o contacta a un asesor.' : 'Questions? Talk to ALIX or contact an advisor.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/529984292748?text=Hola,%20quiero%20saber%20más%20sobre%20el%20modelo%20de%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#0891b2]/25 transition-all"
              data-testid="cta-whatsapp-modelo"
            >
              {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            </a>
            <Link href="/">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#e2e8f0] text-[#475569] text-sm font-medium rounded-xl hover:bg-[#f8fafc] transition-all cursor-pointer" data-testid="button-back-modelo">
                {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
              </span>
            </Link>
          </div>
        </div>
      </main>

      <AGHFooter />
    </div>
  );
}
