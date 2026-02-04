import { useLanguage } from '@/lib/LanguageContext';
import { Link } from 'wouter';
import { ArrowLeft, Shield, Clock, TrendingUp, Users, Check, Globe, Settings } from 'lucide-react';

export default function LastMinuteCapital() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>
          <h1 className="text-lg font-light tracking-wide">Last Minute Capital</h1>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-white/60">
          <Globe className="w-4 h-4" />
        </button>
      </header>

      <main className="px-6 py-10 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-4">All Global Holding LLC</p>
          <h2 className="text-3xl md:text-4xl font-extralight mb-6" data-testid="text-title">
            Last Minute Capital
          </h2>
          <p className="text-white/60 font-light leading-relaxed">
            Inversión operativa diseñada para el momento correcto, dentro de un sistema institucional en operación.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <p className="text-white/70 leading-relaxed text-sm md:text-base">
            All Global Holding LLC diseña, estructura y opera sistemas de capital vinculados a activos reales bajo el ecosistema Fractional Living. Nuestro enfoque integra adquisición, estructuración fiduciaria, operación y optimización de activos, con soluciones de capital diseñadas para cada etapa del proceso.
          </p>
          <p className="text-white/50 text-sm mt-4 italic">
            Last Minute Capital forma parte de ese sistema.
          </p>
        </div>

        <section className="mb-10">
          <h3 className="text-xl font-light mb-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            ¿Qué es Last Minute Capital?
          </h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base">
            Es una inversión operativa que se integra en etapas finales de procesos de adquisición y activación. Su función es aportar liquidez estratégica cuando el valor del activo ya está construido y el objetivo es acelerar cierres, formalizaciones y puesta en marcha.
          </p>
          <p className="text-white/50 leading-relaxed text-sm mt-4">
            Este producto aprovecha el factor tiempo como ventaja competitiva. Al integrarse al final del ciclo, el capital entra con alta visibilidad operativa y se orienta a ejecución concreta.
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-light mb-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            ¿Por qué es relevante ahora?
          </h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base">
            El ecosistema se encuentra en fase activa de crecimiento y consolidación. Existen procesos avanzados que requieren capital oportuno para mantener ritmo y eficiencia.
          </p>
          <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
            <p className="text-orange-500 font-medium text-sm">
              Ventana de participación limitada: 67 procesos disponibles
            </p>
            <p className="text-white/50 text-xs mt-1">
              La disponibilidad está ligada a la existencia de estos procesos. Cuando la fase concluye, la ventana se cierra.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-light mb-4">Propuesta de Valor</h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base mb-6">
            Last Minute Capital busca una asimetría favorable al participar en fases finales del proceso.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-2xl font-light text-orange-500 mb-1">7% - 12%</p>
              <p className="text-white/50 text-sm">Rendimiento estimado bimestral</p>
              <p className="text-white/30 text-xs mt-1">Según monto y proceso específico</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-2xl font-light text-white mb-1">$20K - $100K</p>
              <p className="text-white/50 text-sm">Montos de participación en MXN</p>
              <p className="text-white/30 text-xs mt-1">Integración ágil e inmediata</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-light mb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-500" />
            Estructura y Seguridad
          </h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base mb-4">
            Las operaciones donde se integra Last Minute Capital se desarrollan dentro de marcos fiduciarios, bancarios y contractuales formales, con procesos mercantiles y flujos operativos alineados a regulación financiera vigente.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Globe className="w-4 h-4 text-white/60" />
              </div>
              <div>
                <p className="text-white/80 font-medium text-sm">All Global Holding LLC</p>
                <p className="text-white/50 text-xs mt-1">
                  LLC constituida en Estados Unidos. Operaciones articuladas con entidades y procesos regulados, aportando control, trazabilidad y solidez institucional.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-light mb-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-500" />
            Participación en el Ecosistema
          </h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base mb-4">
            Además del componente de inversión, Last Minute Capital funciona como membresía operativa dentro de Fractional Living.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-sm">Acceso preferente a oportunidades del ecosistema</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-sm">Condiciones especiales de ocupación</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-sm">Desde $50,000 MXN: hasta una semana anual de estancia (sujeta a disponibilidad)</p>
            </div>
          </div>
          
          <p className="text-white/40 text-sm mt-4 italic">
            La participación permite utilizar el sistema, incluso sin ser propietario de una fracción.
          </p>
        </section>

        <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-light mb-4">Síntesis</h3>
          <div className="space-y-2 text-white/70 italic">
            <p>Last Minute Capital integra capital cuando el proceso ya está definido,</p>
            <p>cuando el tiempo impulsa el valor,</p>
            <p>y cuando la ejecución es la prioridad.</p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">
              Una solución de capital diseñada para el momento correcto,<br />
              dentro de un sistema institucional en operación.
            </p>
          </div>
        </section>

        <div className="mt-10 text-center">
          <p className="text-white/40 text-xs mb-4">¿Tienes preguntas? Habla con ALIX o contacta a un representante.</p>
          <Link href="/">
            <span className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0f0f0f] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors cursor-pointer">
              Volver al Inicio
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
