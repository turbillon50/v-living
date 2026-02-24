import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { Link } from 'wouter';

export default function LastMinuteCapital() {
  const { language } = useLanguage();

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
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">All Global Holding LLC</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-lmc">
                Last Minute Capital
              </h1>
              <p className="text-white/70 max-w-lg mx-auto font-light text-sm md:text-base">
                {language === 'es'
                  ? 'Capital estratégico para etapas finales de adquisición inmobiliaria'
                  : 'Strategic capital for final stages of real estate acquisition'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-[#e2e8f0] rounded-2xl p-6 md:p-8 mb-8 shadow-lg" data-testid="card-lmc-intro">
          <p className="text-[#334155] leading-relaxed text-sm md:text-base">
            {language === 'es'
              ? 'All Global Holding LLC diseña, estructura y opera sistemas de capital vinculados a activos reales bajo el ecosistema Fractional Living. Nuestro enfoque integra adquisición, estructuración fiduciaria, operación y optimización de activos, con soluciones de capital diseñadas para cada etapa del proceso.'
              : 'All Global Holding LLC designs, structures and operates capital systems linked to real assets under the Fractional Living ecosystem.'}
          </p>
          <p className="text-[#64748b] text-sm mt-4 italic">
            Last Minute Capital {language === 'es' ? 'forma parte de ese sistema.' : 'is part of that system.'}
          </p>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? '¿Qué es Last Minute Capital?' : 'What is Last Minute Capital?'}
            </h2>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm md:text-base">
            {language === 'es'
              ? 'Es una inversión operativa que se integra en etapas finales de procesos de adquisición y activación. Su función es aportar liquidez estratégica cuando el valor del activo ya está construido y el objetivo es acelerar cierres, formalizaciones y puesta en marcha.'
              : 'It is an operational investment integrated in the final stages of acquisition and activation processes.'}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl text-[#0a1628] mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? 'Propuesta de Valor' : 'Value Proposition'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-2xl p-6 text-white" data-testid="card-lmc-returns">
              <p className="text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>7% - 12%</p>
              <p className="text-white/80 text-sm">{language === 'es' ? 'Rendimiento estimado bimestral' : 'Estimated bi-monthly return'}</p>
              <p className="text-white/50 text-xs mt-1">{language === 'es' ? 'Según monto y proceso específico' : 'Based on specific amount and process'}</p>
            </div>
            <div className="bg-gradient-to-br from-[#0a1628] to-[#1e293b] rounded-2xl p-6 text-white" data-testid="card-lmc-amounts">
              <p className="text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>$20K - $100K</p>
              <p className="text-white/80 text-sm">{language === 'es' ? 'Montos de participación en MXN' : 'Participation amounts in MXN'}</p>
              <p className="text-white/50 text-xs mt-1">{language === 'es' ? 'Integración ágil e inmediata' : 'Agile and immediate integration'}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'Estructura y Seguridad' : 'Structure & Security'}
            </h2>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm md:text-base mb-4">
            {language === 'es'
              ? 'Las operaciones donde se integra Last Minute Capital se desarrollan dentro de marcos fiduciarios, bancarios y contractuales formales.'
              : 'Operations where Last Minute Capital integrates are conducted within formal fiduciary, banking and contractual frameworks.'}
          </p>
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0891b2]/10 to-[#22d3ee]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0891b2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <p className="text-[#0a1628] font-medium text-sm">All Global Holding LLC</p>
                <p className="text-[#64748b] text-xs mt-1">
                  {language === 'es'
                    ? 'LLC constituida en Estados Unidos. Operaciones articuladas con entidades y procesos regulados, aportando control, trazabilidad y solidez institucional.'
                    : 'LLC incorporated in the United States. Operations articulated with regulated entities and processes.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'Participación en el Ecosistema' : 'Ecosystem Participation'}
            </h2>
          </div>
          <p className="text-[#475569] leading-relaxed text-sm md:text-base mb-4">
            {language === 'es'
              ? 'Last Minute Capital funciona como membresía operativa dentro de Fractional Living.'
              : 'Last Minute Capital works as an operational membership within Fractional Living.'}
          </p>
          <div className="space-y-3">
            {[
              language === 'es' ? 'Acceso preferente a oportunidades del ecosistema' : 'Preferential access to ecosystem opportunities',
              language === 'es' ? 'Condiciones especiales de ocupación' : 'Special occupancy conditions',
              language === 'es' ? 'Desde $50,000 MXN: hasta una semana anual de estancia (sujeta a disponibilidad)' : 'From $50,000 MXN: up to one annual week of stay (subject to availability)',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-[#475569] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0a1628] to-[#0e7490] rounded-2xl p-8 text-center mb-10" data-testid="card-lmc-synthesis">
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Síntesis' : 'Synthesis'}
          </h2>
          <div className="space-y-2 text-white/80 italic font-light">
            <p>{language === 'es' ? 'Last Minute Capital integra capital cuando el proceso ya está definido,' : 'Last Minute Capital integrates capital when the process is already defined,'}</p>
            <p>{language === 'es' ? 'cuando el tiempo impulsa el valor,' : 'when time drives value,'}</p>
            <p>{language === 'es' ? 'y cuando la ejecución es la prioridad.' : 'and when execution is the priority.'}</p>
          </div>
        </section>

        <div className="text-center mb-16">
          <p className="text-[#64748b] text-sm mb-4">
            {language === 'es' ? '¿Tienes preguntas? Habla con ALIX o contacta a un representante.' : 'Have questions? Talk to ALIX or contact a representative.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Last%20Minute%20Capital"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#0891b2]/25 transition-all"
              data-testid="cta-whatsapp-lmc"
            >
              {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            </a>
            <Link href="/">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#e2e8f0] text-[#475569] text-sm font-medium rounded-xl hover:bg-[#f8fafc] transition-all cursor-pointer" data-testid="button-back-lmc">
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
