import { Link } from 'wouter';
import { ArrowLeft, Building2, TrendingUp, Globe, Cpu, Wallet, Settings, Layers, Zap, Shield, ExternalLink, CheckCircle, Puzzle } from 'lucide-react';

export default function ModeloNegocios() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-white/10">
        <Link href="/">
          <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <h1 className="text-lg font-light tracking-wide">Modelo de Negocio</h1>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-black to-black rounded-full flex items-center justify-center">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight mb-4" data-testid="text-title">
              Modelo de Negocio
            </h2>
            <p className="text-xl text-white/60 font-light">
              All Global Holding LLC
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-white/70 leading-relaxed mb-6 text-lg italic text-center">
              Si llegaste hasta aquí, no estás buscando un producto aislado.<br />
              Estás buscando entender un sistema.
            </p>
            <p className="text-white/70 leading-relaxed mb-6">
              <span className="text-orange-500 font-medium">All Global Holding LLC</span> es una Limited Liability Company constituida en Estados Unidos, creada para diseñar, estructurar y operar modelos de capital vinculados a activos reales, con alcance internacional y ejecución local.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-white/60 text-sm leading-relaxed">
                No nacimos en el mundo digital.<br />
                <span className="text-white/80 font-medium">Nacimos en el mundo inmobiliario.</span>
              </p>
            </div>
            <p className="text-white/60 leading-relaxed text-sm">
              Durante más de una década, nuestra actividad principal fue comprar propiedades, estructurarlas y venderlas. Ese fue el origen. Ese sigue siendo el núcleo.
            </p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-white">Momento de adaptación</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              La pandemia cambió las reglas. No solo del mercado inmobiliario, sino del sistema financiero global.
            </p>
            <p className="text-white/60 leading-relaxed mb-6 text-sm">
              Las tasas de interés subieron, el crédito se encareció, los ciclos de venta se alargaron y los mercados tradicionalmente sólidos —como Quintana Roo, nuestro destino madre— enfrentaron nuevos retos.
            </p>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-white font-medium mb-2">Entendimos algo fundamental:</p>
              <p className="text-white/70 text-sm">Los activos ya no se venden igual, y quien no se adapta, desaparece.</p>
            </div>
            <p className="text-white/50 text-sm italic text-center">
              La respuesta no era vender más barato ni asumir más riesgo.<br />
              La respuesta era <span className="text-white">reconfigurar el modelo</span>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/10 to-black/10 border border-orange-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-black/20 rounded-xl">
                <Puzzle className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-orange-500">El modelo Fractional</h3>
                <p className="text-white/50 text-sm">(y lo que NO es)</p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              El concepto de fraccionar un activo suele malentenderse. Muchos creen que fraccionar es dividir para vender más barato.
            </p>
            <div className="bg-black/10 border border-orange-500/20 rounded-xl p-4 mb-6">
              <p className="text-orange-500 font-bold text-center text-lg">No lo es.</p>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Un activo fraccionado no pierde valor, lo redistribuye, lo optimiza y lo hace accesible sin degradarlo.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-white/60 text-sm italic text-center">
                "Un elefante no corre más rápido por cortarlo en pedazos.<br />
                Pero puede llegar más lejos si se organiza mejor."
              </p>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              El modelo <span className="text-orange-500 font-medium">Fractional Living</span> nace de esa lógica:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Dividir la propiedad</p>
                <p className="text-white/40 text-xs">no el valor</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Multiplicar los puntos de entrada</p>
                <p className="text-white/40 text-xs">no reducir la calidad</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/10 to-black/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-black/5/20 rounded-xl">
                <Globe className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-light text-black">De lo local a lo global</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              Para operar este modelo de forma internacional, fundamos <span className="text-black font-medium">All Global Holding LLC</span>.
            </p>
            <p className="text-white/60 leading-relaxed text-sm mb-4">La estructura en Estados Unidos nos permitió:</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-white/60 text-sm">Abrir mercados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-white/60 text-sm">Vender a públicos internacionales</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-white/60 text-sm">Operar con flexibilidad legal</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-white/60 text-sm">Integrar tecnología sin fronteras</span>
              </div>
            </div>
            <p className="text-white/50 text-sm text-center italic">
              Fue en ese proceso donde incursionamos en el mundo digital, no como moda, sino como herramienta.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/10 to-black/10 border border-orange-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Cpu className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-light text-orange-500">Infraestructura digital y tokenización</h3>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-orange-500 font-medium text-center">La digitalización no es el negocio. Es el vehículo.</p>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              Desarrollamos dos tipos de instrumentos digitales claramente diferenciados:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-orange-500/20 rounded-xl p-4">
                <p className="text-orange-500 font-medium mb-2">Security Tokens</p>
                <p className="text-white/50 text-sm">Vinculados a activos reales y estructuras específicas</p>
              </div>
              <div className="bg-white/5 border border-orange-500/20 rounded-xl p-4">
                <p className="text-orange-500 font-medium mb-2">Utility Tokens</p>
                <p className="text-white/50 text-sm">Diseñados para acceso, uso y operación dentro del ecosistema</p>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed text-sm mb-4">Dentro de esta arquitectura nacen:</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-sm">Token ALIX</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-sm">Token LNC</span>
              <span className="px-3 py-1 bg-black/20 text-orange-500 rounded-full text-sm">ALIX (IA operativa)</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/50 text-xs mb-2">
                Como base conceptual, desarrollamos el audiolibro <span className="text-orange-500">Turbillón</span>, disponible de forma gratuita, donde se explica la lógica de sistemas, redes y comportamiento del capital en la era digital.
              </p>
              <p className="text-white/40 text-xs italic">(Próximamente enlace al audiolibro)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/10 to-emerald-500/10 border border-black/10/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-black/20 rounded-xl">
                <Wallet className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-light text-orange-500">Simplificar para escalar: VanDeFi</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              Para que todo este sistema fuera usable, entendimos algo esencial: <span className="text-orange-500 font-medium">la gente no quiere complicarse</span>.
            </p>
            <p className="text-white/60 leading-relaxed text-sm mb-4">
              Así nació <span className="text-orange-500 font-medium">VanDeFi</span>, una wallet digital que:
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">Conecta el mundo fiat con el mundo digital</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">Facilita pagos, acceso y operación</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">Resolvió un problema mayor: remesas internacionales</span>
              </div>
            </div>
            <div className="bg-black/10 border border-black/10/20 rounded-xl p-4 text-center">
              <p className="text-orange-500 font-medium mb-2">VanDeFi ya está disponible y operando</p>
              <a 
                href="https://vandefi.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-orange-500 text-sm transition-colors"
              >
                vandefi.org <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/10 to-black/10 border border-orange-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Settings className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-light text-orange-500">El modelo operativo</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 text-center italic">
              El modelo de negocio se construye como un engranaje donde cada pieza cumple una función clara:
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">1</span>
                  <p className="text-orange-500 font-medium">Adquisición con crédito hipotecario</p>
                </div>
                <p className="text-white/60 text-sm pl-11">Utilizamos el crédito hipotecario, el dinero más barato en México. Para ello existe el <span className="text-black">Perfil Asociado de Crédito</span>.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">2</span>
                  <p className="text-orange-500 font-medium">Optimización de capital y tiempos</p>
                </div>
                <p className="text-white/60 text-sm pl-11">Para reducir fricción y acelerar cierres, existe <span className="text-amber-400">Last Minute Capital</span>, que entra cuando el proceso ya está avanzado.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">3</span>
                  <p className="text-orange-500 font-medium">Selección del activo</p>
                </div>
                <p className="text-white/60 text-sm pl-11">El <span className="text-emerald-400">Perfil Asociado Patrimonial</span> integra propiedades al sistema, activándolas bajo el modelo fractional.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">4</span>
                  <p className="text-orange-500 font-medium">Estructuración fiduciaria</p>
                </div>
                <p className="text-white/60 text-sm pl-11">Una vez consolidado, el activo se integra a fideicomisos y contratos mercantiles, con flujos bancarios formales.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">5</span>
                  <p className="text-orange-500 font-medium">Monetización múltiple</p>
                </div>
                <p className="text-white/60 text-sm pl-11 mb-3">El activo se explota de manera integral:</p>
                <div className="flex flex-wrap gap-2 pl-11">
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Venta tradicional</span>
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Venta digital</span>
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Fraccionamiento</span>
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Uso vacacional</span>
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Ocupación</span>
                  <span className="px-2 py-1 bg-white/5 text-white/50 rounded text-xs">Reventa</span>
                </div>
              </div>
            </div>

            <p className="text-orange-500 font-medium text-center mt-6">Nada compite. Todo suma.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <Zap className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-light text-orange-500">Lo que hace distinto al modelo</h3>
            </div>
            <p className="text-center text-white/60 mb-6">
              No es solo rendimiento. No es solo experiencia. No es solo plusvalía.
            </p>
            <p className="text-center text-white/70 mb-6">
              Es la combinación equilibrada de:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Capital</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Crédito</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Tiempo</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Uso</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Estructura</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-orange-500 text-sm font-medium">Tecnología</p>
              </div>
            </div>
            <p className="text-center text-white/60 text-sm">Un modelo que cuida:</p>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">El rendimiento del inversionista</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">La liquidez del propietario</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">La experiencia del usuario</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-white/60 text-sm">La estabilidad del sistema</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-black/20 to-black/20 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <Building2 className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-light text-orange-500">Cierre</h3>
            </div>
            <div className="text-center space-y-4">
              <p className="text-white/70 leading-relaxed">
                <span className="text-orange-500 font-medium">All Global Holding LLC</span> no vende promesas.<br />
                <span className="text-white/90">Opera infraestructura.</span>
              </p>
              <p className="text-white/70 leading-relaxed">
                No compite por atención.<br />
                <span className="text-white/90">Construye sistemas que se descubren.</span>
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Sabemos que no existe hoy en el mercado un modelo que cubra tantas aristas, tantos vértices y tantas necesidades de forma integrada y coherente.
              </p>
              <div className="pt-4">
                <p className="text-white/50 italic">
                  Si llegaste hasta aquí, no fue casualidad.<br />
                  Estás viendo un modelo pensado para durar, no para impresionar.
                </p>
              </div>
              <p className="text-orange-500 font-medium text-xl pt-4">
                Bienvenido al sistema.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-light mb-2">¿Tienes preguntas?</h3>
            <p className="text-white/60 text-sm mb-4">
              Habla con <span className="text-orange-500 font-medium">ALIX</span>, nuestra inteligencia artificial, o con un asesor humano.
            </p>
            <div className="flex flex-col gap-2 text-white/50 text-xs">
              <p>🟣 <span className="text-orange-500">ALIX</span> — Botón morado en la esquina inferior derecha</p>
              <p>🟢 <span className="text-orange-500">WhatsApp</span> — Botón verde en la esquina inferior izquierda</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
