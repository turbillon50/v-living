import { ArrowLeft, PartyPopper, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpEventos() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-eventos.jpg" 
          alt="Eventos Privados"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md" aria-label="Back to experiences">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white text-sm font-bold px-4 py-2 rounded-md">
          30% OFF
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-[#059669] to-[#06b6d4] p-3 rounded-md">
            <PartyPopper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-eventos">Eventos Privados</h1>
            <p className="text-[#717171]">Celebraciones únicas y memorables</p>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            <h2 className="font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }} data-testid="heading-beneficio-eventos">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>30% de descuento</strong> en organización de eventos</li>
            <li>• Acceso a venues exclusivos para miembros</li>
            <li>• Coordinación profesional de eventos</li>
            <li>• Decoración y ambientación premium</li>
            <li>• Catering de restaurantes aliados con descuento</li>
            <li>• Fotografía y video profesional</li>
          </ul>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h2 className="text-[#222] font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            En <strong className="text-[#222]">All Global Holding</strong>, cada celebración 
            merece ser extraordinaria. Ya sea un cumpleaños íntimo, un aniversario especial o una 
            reunión familiar, tenemos el espacio y el equipo perfecto.
          </p>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Nuestras propiedades se transforman en escenarios mágicos donde tus sueños de 
            celebración cobran vida. El Caribe como telón de fondo, y nuestra atención al 
            detalle como garantía.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, incorporando nuevos venues y 
            proveedores premium para hacer de tus eventos algo inolvidable.
          </p>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h3 className="font-bold text-[#222] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Tipos de Eventos</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Cumpleaños y Aniversarios</p>
              <p className="text-xs text-[#888]">Celebraciones íntimas o grandes fiestas</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Bodas y Compromisos</p>
              <p className="text-xs text-[#888]">El escenario perfecto para el "Sí"</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Reuniones Corporativas</p>
              <p className="text-xs text-[#888]">Networking en ambiente exclusivo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#ebebeb]">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20organizar%20un%20evento%20privado"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-bold py-4 rounded-md transition-colors"
          data-testid="whatsapp-eventos"
        >
          <Phone className="w-5 h-5" />
          Planear Mi Evento
        </a>
      </div>
    </div>
  );
}
