import { Link } from 'wouter';
import { ArrowLeft, CreditCard, Home, TrendingUp, Shield, Clock, Users, CheckCircle, Percent, Building2, Handshake } from 'lucide-react';

export default function PerfilAsociado() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-white/10">
        <Link href="/">
          <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <h1 className="text-lg font-light tracking-wide">Perfil Asociado</h1>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Handshake className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight mb-4" data-testid="text-title">
              Perfil Asociado
            </h2>
            <p className="text-xl text-white/60 font-light">
              El modelo de alianza dentro de All Global Holding LLC
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-white/70 leading-relaxed mb-6">
              Si llegaste hasta aquí, es porque estás evaluando algo más que una inversión aislada.
              Estás explorando una forma de asociación dentro de un sistema inmobiliario–financiero estructurado, donde el capital, el crédito y los activos reales trabajan de manera coordinada.
            </p>
            <p className="text-white/70 leading-relaxed mb-6">
              En All Global Holding LLC no operamos productos sueltos.
              Diseñamos modelos de participación que integran a personas, propiedades y capital dentro de procesos fiduciarios, bancarios y mercantiles formales.
            </p>
            <p className="text-white/70 leading-relaxed">
              El <span className="text-teal-400 font-medium">Perfil Asociado</span> es uno de los pilares del ecosistema Fractional Living.
              Un modelo pensado para quienes entienden el valor de participar desde la estructura, no solo desde la compra o la venta.
            </p>
          </div>

          <p className="text-center text-white/50 mb-8 italic">
            Actualmente existen dos tipos de Perfil Asociado, ambos complementarios y estratégicos dentro del sistema.
          </p>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-blue-400">Perfil Asociado – Crédito</h3>
                <p className="text-white/50 text-sm">Monetiza tu historial financiero dentro de un activo real</p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed mb-6">
              Este perfil está diseñado para personas con buen historial crediticio que desean utilizar su capacidad financiera de forma inteligente, respaldada por bienes inmuebles y procesos formales.
            </p>

            <div className="bg-white/5 rounded-xl p-5 mb-6">
              <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                ¿Cómo funciona?
              </h4>
              <p className="text-white/60 text-sm leading-relaxed mb-3">
                El asociado pone a disposición su perfil crediticio, el cual es previamente evaluado y estructurado por el equipo de All Global Holding.
                Ese crédito se utiliza para la adquisición de propiedades que posteriormente se integran al esquema Fractional Living.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                La clave está en que el crédito no se diluye en consumo, sino que se ancla a un activo inmobiliario que entra en un proceso de revalorización y comercialización fraccionada.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
              <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                ¿Qué obtiene el Perfil Asociado – Crédito?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white/80">Hasta <span className="text-blue-400 font-bold text-lg">8%</span> del monto total del crédito utilizado</span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <span className="text-white/60 text-sm">• 4% al momento de la firma de la escritura</span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <span className="text-white/60 text-sm">• 4% adicional al completarse la venta de las fracciones</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Tiempo promedio para generar el ingreso inicial: <span className="text-blue-400 font-medium">menor a dos meses</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Posibilidad de acceso y optimización de líneas de crédito</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Participación preferente en oportunidades del ecosistema</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Beneficios de uso y ocupación dentro del portafolio</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Integración a una alianza de largo plazo</span>
              </div>
            </div>

            <p className="text-white/40 text-xs mt-4 text-center">
              Todo el proceso se desarrolla bajo marcos fiduciarios, bancarios y contratos mercantiles, alineados a regulación financiera vigente.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Building2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-emerald-400">Perfil Asociado – Propietario</h3>
                <p className="text-white/50 text-sm">Vende tu propiedad con estructura, sin fricción y con mayor valor</p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed mb-6">
              Este perfil está diseñado para propietarios que desean colocar su inmueble de forma eficiente, sin los problemas tradicionales del mercado: regateos, tiempos indefinidos, intermediación desordenada o pérdida de valor.
            </p>

            <p className="text-white/70 leading-relaxed mb-6">
              En lugar de competir en el mercado abierto, la propiedad se integra a un modelo de revalorización fractional, donde el activo se optimiza, estructura y comercializa por partes dentro de un sistema operativo activo.
            </p>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-6">
              <h4 className="text-emerald-400 font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                ¿Qué obtiene el Propietario Asociado?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">Venta de la propiedad en un plazo <span className="text-emerald-400 font-bold">no mayor a 12 meses</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">Entre <span className="text-emerald-400 font-bold text-lg">7% y 12%</span> por encima del valor comercial tradicional</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">Acceso a un proceso ordenado, transparente y contractual</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 mb-6">
              <h4 className="text-white/80 font-medium mb-3">Ejemplo práctico:</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Una propiedad valuada en <span className="text-white/80 font-medium">$10,000,000 MXN</span> puede colocarse hasta en <span className="text-emerald-400 font-bold">$11,200,000 MXN</span>, gracias a la reconfiguración del activo dentro del modelo Fractional Living.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Acceso a beneficios de uso y ocupación dentro del ecosistema</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Participación preferente en futuras oportunidades</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Integración a una red de aliados inmobiliarios y financieros</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Relación directa con un holding operativo, no con intermediarios</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-light text-center mb-6 text-teal-400">
              ¿Por qué este modelo es posible?
            </h3>
            <p className="text-center text-white/70 mb-6 text-lg italic">
              Porque el valor no se crea solo en la compra o en la venta, sino en la estructura.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-teal-400 text-sm font-medium">Revalorizar</p>
                <p className="text-white/40 text-xs">el activo</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-teal-400 text-sm font-medium">Acelerar</p>
                <p className="text-white/40 text-xs">liquidez</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-teal-400 text-sm font-medium">Distribuir</p>
                <p className="text-white/40 text-xs">riesgos</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-teal-400 text-sm font-medium">Optimizar</p>
                <p className="text-white/40 text-xs">tiempos</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center col-span-2 md:col-span-1">
                <p className="text-teal-400 text-sm font-medium">Alinear</p>
                <p className="text-white/40 text-xs">intereses</p>
              </div>
            </div>

            <p className="text-white/50 text-sm text-center">
              Todo esto se ejecuta dentro de procesos fiduciarios y bancarios formales, con contratos claros y trazabilidad completa.
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-light text-center mb-4 text-teal-400">Síntesis</h3>
            <p className="text-white/70 leading-relaxed mb-4 text-center">
              El Perfil Asociado no es un rol pasivo.<br />
              Es una alianza estratégica dentro de un sistema diseñado para operar activos reales con visión institucional.
            </p>
            <p className="text-white/70 leading-relaxed mb-4 text-center">
              All Global Holding integra personas, propiedades y capital cuando el proceso ya está definido, cuando la ejecución es prioritaria y cuando el valor se construye desde la estructura.
            </p>
            <p className="text-white/50 text-center italic">
              Si estás aquí, no es casualidad.<br />
              Estás evaluando formar parte de un modelo que piensa en sistema, no en promesas.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-10 h-10 mx-auto mb-4 text-teal-400" />
            <h3 className="text-lg font-light mb-2">¿Tienes dudas?</h3>
            <p className="text-white/60 text-sm mb-4">
              Habla con <span className="text-purple-400 font-medium">ALIX</span> o con un asesor para evaluar cuál perfil se alinea mejor contigo.
            </p>
            <p className="text-white/40 text-xs">
              Usa el botón morado de ALIX o el botón verde de WhatsApp
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
