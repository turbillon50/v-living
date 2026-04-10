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
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md" aria-label="Back to experiences">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white text-sm font-bold px-4 py-2 rounded-md">
          30% OFF o GRATIS
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-[#059669] to-[#06b6d4] p-3 rounded-md">
            <Palmtree className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-privadas">Experiencias Privadas</h1>
            <p className="text-[#717171]">Aventuras exclusivas para ti</p>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            <h2 className="font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }} data-testid="heading-beneficio-privadas">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>30% de descuento</strong> en experiencias curadas</li>
            <li>• Algunas experiencias <strong>completamente GRATIS</strong></li>
            <li>• Tours privados sin grupos</li>
            <li>• Guías expertos locales</li>
            <li>• Acceso a lugares exclusivos</li>
            <li>• Experiencias personalizadas a tu gusto</li>
          </ul>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h2 className="text-[#222] font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Como miembro de <strong className="text-[#222]">All Global Holding</strong>, tienes 
            acceso a experiencias que van más allá de lo que cualquier turista puede encontrar. 
            Cenotes secretos, ruinas al amanecer, playas privadas.
          </p>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Cada experiencia es curada pensando en lo que tú y tu familia realmente desean. 
            No seguimos itinerarios genéricos: creamos momentos únicos que se convierten en 
            recuerdos para toda la vida.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, descubriendo nuevas experiencias 
            y alianzas para ofrecerte lo mejor del Caribe Mexicano.
          </p>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h3 className="font-bold text-[#222] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Experiencias Destacadas</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Cenotes Privados</p>
              <p className="text-xs text-[#888]">Sin multitudes • Nada como un local</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Amanecer en Ruinas Mayas</p>
              <p className="text-xs text-[#888]">Antes de abrir al público</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Cenas en Playas Secretas</p>
              <p className="text-xs text-[#888]">Chef privado • Bajo las estrellas</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Snorkel con Tortugas</p>
              <p className="text-xs text-[#888]">Guías expertos • Grupos pequeños</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#ebebeb]">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20reservar%20una%20experiencia%20privada"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-bold py-4 rounded-md transition-colors"
          data-testid="whatsapp-privadas"
        >
          <Phone className="w-5 h-5" />
          Descubrir Experiencias
        </a>
      </div>
    </div>
  );
}
