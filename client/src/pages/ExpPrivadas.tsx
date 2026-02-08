import { ArrowLeft, Palmtree, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpPrivadas() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-privadas.jpg" 
          alt="Experiencias Privadas"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-md">
          30% OFF o GRATIS
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-md">
            <Palmtree className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>Experiencias Privadas</h1>
            <p className="text-[#888]">Aventuras exclusivas para ti</p>
          </div>
        </div>

        <div className="bg-[#111] rounded-md p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-white fill-white" />
            <h2 className="font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#bbb] text-sm">
            <li>• <strong>30% de descuento</strong> en experiencias curadas</li>
            <li>• Algunas experiencias <strong>completamente GRATIS</strong></li>
            <li>• Tours privados sin grupos</li>
            <li>• Guías expertos locales</li>
            <li>• Acceso a lugares exclusivos</li>
            <li>• Experiencias personalizadas a tu gusto</li>
          </ul>
        </div>

        <div className="bg-[#111] rounded-md p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            Como miembro de <strong className="text-white/70">All Global Holding</strong>, tienes 
            acceso a experiencias que van más allá de lo que cualquier turista puede encontrar. 
            Cenotes secretos, ruinas al amanecer, playas privadas.
          </p>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            Cada experiencia es curada pensando en lo que tú y tu familia realmente desean. 
            No seguimos itinerarios genéricos: creamos momentos únicos que se convierten en 
            recuerdos para toda la vida.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, descubriendo nuevas experiencias 
            y alianzas para ofrecerte lo mejor del Caribe Mexicano.
          </p>
        </div>

        <div className="bg-black/5 rounded-md p-5 mb-6">
          <h3 className="font-bold text-[#111] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Experiencias Destacadas</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Cenotes Privados</p>
              <p className="text-xs text-[#888]">Sin multitudes • Nada como un local</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Amanecer en Ruinas Mayas</p>
              <p className="text-xs text-[#888]">Antes de abrir al público</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Cenas en Playas Secretas</p>
              <p className="text-xs text-[#888]">Chef privado • Bajo las estrellas</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Snorkel con Tortugas</p>
              <p className="text-xs text-[#888]">Guías expertos • Grupos pequeños</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20reservar%20una%20experiencia%20privada"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black hover:bg-black/90 text-white font-bold py-4 rounded-md transition-colors"
        >
          <Phone className="w-5 h-5" />
          Descubrir Experiencias
        </a>
      </div>
    </div>
  );
}
