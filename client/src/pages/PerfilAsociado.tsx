import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { Link } from 'wouter';

export default function PerfilAsociado() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#030810] pt-14">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030810]/60 via-[#030810]/30 to-[#030810]" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
            <div className="fl-fade-in">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center shadow-lg shadow-[#0891b2]/30">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">All Global Holding LLC</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-asociado">
                {language === 'es' ? 'Perfil Asociado' : 'Associate Profile'}
              </h1>
              <p className="text-[#94a3b8] max-w-lg mx-auto font-light text-sm md:text-base">
                {language === 'es'
                  ? 'El modelo de alianza dentro de All Global Holding LLC'
                  : 'The alliance model within All Global Holding LLC'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="fl-glass-card p-6 md:p-8 mb-8" data-testid="card-asociado-intro">
          <p className="text-[#94a3b8] leading-relaxed mb-4">
            {language === 'es'
              ? 'Si llegaste hasta aquí, es porque estás evaluando algo más que una inversión aislada. Estás explorando una forma de asociación dentro de un sistema inmobiliario–financiero estructurado.'
              : 'If you made it here, you are evaluating more than an isolated investment. You are exploring a form of partnership within a structured real estate-financial system.'}
          </p>
          <p className="text-[#64748b] leading-relaxed mb-4 text-sm">
            {language === 'es'
              ? 'En All Global Holding LLC no operamos productos sueltos. Diseñamos modelos de participación que integran a personas, propiedades y capital dentro de procesos fiduciarios, bancarios y mercantiles formales.'
              : 'At All Global Holding LLC we do not operate standalone products. We design participation models that integrate people, properties and capital.'}
          </p>
          <p className="text-[#475569] text-sm italic">
            {language === 'es'
              ? 'Actualmente existen dos tipos de Perfil Asociado, ambos complementarios y estratégicos dentro del sistema.'
              : 'There are currently two types of Associate Profiles, both complementary and strategic within the system.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-2xl p-6 md:p-8 mb-6 text-white" data-testid="card-credito">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                {language === 'es' ? 'Perfil Asociado – Crédito' : 'Associate Profile – Credit'}
              </h2>
              <p className="text-white/70 text-sm">
                {language === 'es' ? 'Monetiza tu historial financiero dentro de un activo real' : 'Monetize your financial history within a real asset'}
              </p>
            </div>
          </div>

          <p className="text-white/80 leading-relaxed mb-6 text-sm">
            {language === 'es'
              ? 'Diseñado para personas con buen historial crediticio que desean utilizar su capacidad financiera de forma inteligente, respaldada por bienes inmuebles y procesos formales.'
              : 'Designed for people with good credit history who want to use their financial capacity intelligently, backed by real estate.'}
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {language === 'es' ? '¿Cómo funciona?' : 'How does it work?'}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {language === 'es'
                ? 'El asociado pone a disposición su perfil crediticio, el cual es evaluado y estructurado por el equipo de All Global Holding. Ese crédito se utiliza para adquisición de propiedades que se integran al esquema Fractional Living.'
                : 'The associate provides their credit profile, which is evaluated and structured by the All Global Holding team.'}
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 mb-6">
            <h3 className="text-white font-medium mb-4 text-sm">
              {language === 'es' ? '¿Qué obtiene el Perfil Asociado – Crédito?' : 'What does the Credit Associate get?'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/90 text-sm">
                  {language === 'es' ? 'Hasta' : 'Up to'} <span className="text-white font-bold text-lg">8%</span> {language === 'es' ? 'del monto total del crédito utilizado' : 'of total credit used'}
                </span>
              </div>
              <div className="pl-8 space-y-1">
                <span className="text-white/70 text-sm block">• 4% {language === 'es' ? 'al momento de la firma de la escritura' : 'at signing'}</span>
                <span className="text-white/70 text-sm block">• 4% {language === 'es' ? 'al completarse la venta de las fracciones' : 'upon fraction sales completion'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-white/70 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {language === 'es' ? 'Tiempo promedio para generar ingreso inicial:' : 'Average time for initial income:'} <span className="text-white font-medium">{language === 'es' ? 'menor a dos meses' : 'less than two months'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              language === 'es' ? 'Optimización de líneas de crédito' : 'Credit line optimization',
              language === 'es' ? 'Participación preferente' : 'Preferential participation',
              language === 'es' ? 'Beneficios de uso y ocupación' : 'Use and occupancy benefits',
              language === 'es' ? 'Alianza de largo plazo' : 'Long-term alliance',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/10 rounded-lg p-3">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/80 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a1628] to-[#030810] rounded-2xl p-6 md:p-8 mb-8 text-white" data-testid="card-propietario">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                {language === 'es' ? 'Perfil Asociado – Propietario' : 'Associate Profile – Owner'}
              </h2>
              <p className="text-[#94a3b8] text-sm">
                {language === 'es' ? 'Vende tu propiedad con estructura, sin fricción y con mayor valor' : 'Sell your property with structure, no friction and greater value'}
              </p>
            </div>
          </div>

          <p className="text-white/70 leading-relaxed mb-6 text-sm">
            {language === 'es'
              ? 'Diseñado para propietarios que desean colocar su inmueble de forma eficiente, sin los problemas tradicionales del mercado.'
              : 'Designed for owners who want to place their property efficiently, without traditional market problems.'}
          </p>

          <div className="bg-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-white font-medium mb-4 text-sm">
              {language === 'es' ? '¿Qué obtiene el Propietario Asociado?' : 'What does the Owner Associate get?'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0891b2]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22d3ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">
                  {language === 'es' ? 'Venta en plazo' : 'Sale within'} <span className="text-white font-bold">{language === 'es' ? 'no mayor a 12 meses' : 'no more than 12 months'}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0891b2]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22d3ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">
                  <span className="text-[#22d3ee] font-bold text-lg">7% - 12%</span> {language === 'es' ? 'por encima del valor comercial' : 'above commercial value'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0891b2]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22d3ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{language === 'es' ? 'Proceso ordenado, transparente y contractual' : 'Organized, transparent and contractual process'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-white/80 font-medium mb-2 text-sm">{language === 'es' ? 'Ejemplo práctico:' : 'Practical example:'}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {language === 'es'
                ? 'Una propiedad valuada en $10,000,000 MXN puede colocarse hasta en $11,200,000 MXN, gracias a la reconfiguración del activo dentro del modelo Fractional Living.'
                : 'A property valued at $10,000,000 MXN can be placed at up to $11,200,000 MXN through the Fractional Living model.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              language === 'es' ? 'Beneficios de uso y ocupación' : 'Use and occupancy benefits',
              language === 'es' ? 'Participación preferente' : 'Preferential participation',
              language === 'es' ? 'Red de aliados inmobiliarios' : 'Real estate allies network',
              language === 'es' ? 'Relación directa con holding' : 'Direct holding relationship',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                <div className="w-4 h-4 rounded-full bg-[#0891b2]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-[#22d3ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/70 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fl-glass-card p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-2xl text-white text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? '¿Por qué este modelo es posible?' : 'Why is this model possible?'}
          </h2>
          <p className="text-center text-[#94a3b8] mb-6 italic">
            {language === 'es'
              ? 'Porque el valor no se crea solo en la compra o en la venta, sino en la estructura.'
              : 'Because value is not created only in buying or selling, but in the structure.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: language === 'es' ? 'Revalorizar' : 'Revalue', sub: language === 'es' ? 'el activo' : 'the asset' },
              { label: language === 'es' ? 'Acelerar' : 'Accelerate', sub: language === 'es' ? 'liquidez' : 'liquidity' },
              { label: language === 'es' ? 'Distribuir' : 'Distribute', sub: language === 'es' ? 'riesgos' : 'risks' },
              { label: language === 'es' ? 'Optimizar' : 'Optimize', sub: language === 'es' ? 'tiempos' : 'times' },
              { label: language === 'es' ? 'Alinear' : 'Align', sub: language === 'es' ? 'intereses' : 'interests' },
            ].map((item, i) => (
              <div key={i} className="bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.08)] rounded-lg p-3 text-center">
                <p className="text-[#22d3ee] text-sm font-medium">{item.label}</p>
                <p className="text-[#64748b] text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-[#64748b] text-sm text-center">
            {language === 'es'
              ? 'Todo esto se ejecuta dentro de procesos fiduciarios y bancarios formales.'
              : 'All executed within formal fiduciary and banking processes.'}
          </p>
        </div>

        <section className="bg-gradient-to-br from-[#030810] to-[#0e7490] rounded-2xl p-8 text-center mb-10" data-testid="card-asociado-synthesis">
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Síntesis' : 'Synthesis'}
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            {language === 'es'
              ? 'El Perfil Asociado no es un rol pasivo. Es una alianza estratégica dentro de un sistema diseñado para operar activos reales con visión institucional.'
              : 'The Associate Profile is not a passive role. It is a strategic alliance within a system designed to operate real assets with institutional vision.'}
          </p>
          <p className="text-white/60 italic text-sm">
            {language === 'es' ? 'Si estás aquí, no es casualidad.' : 'If you are here, it is no coincidence.'}
          </p>
        </section>

        <div className="text-center mb-16">
          <p className="text-[#64748b] text-sm mb-4">
            {language === 'es' ? '¿Tienes dudas? Habla con ALIX o contacta a un asesor.' : 'Questions? Talk to ALIX or contact an advisor.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20el%20Perfil%20Asociado"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#0891b2]/25 transition-all"
              data-testid="cta-whatsapp-asociado"
            >
              {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            </a>
            <Link href="/">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[rgba(6,182,212,0.12)] text-[#64748b] text-sm font-medium rounded-xl hover:bg-white/5 transition-all cursor-pointer" data-testid="button-back-asociado">
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
