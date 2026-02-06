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
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-full">
          30% OFF
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-xl">
            <PartyPopper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos Privados</h1>
            <p className="text-gray-500">Celebraciones únicas y memorables</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-black rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-black fill-black" />
            <h2 className="font-bold text-gray-900">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>30% de descuento</strong> en organización de eventos</li>
            <li>• Acceso a venues exclusivos para miembros</li>
            <li>• Coordinación profesional de eventos</li>
            <li>• Decoración y ambientación premium</li>
            <li>• Catering de restaurantes aliados con descuento</li>
            <li>• Fotografía y video profesional</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3">El Privilegio de Pertenecer</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            En <strong className="text-white/70">All Global Holding</strong>, cada celebración 
            merece ser extraordinaria. Ya sea un cumpleaños íntimo, un aniversario especial o una 
            reunión familiar, tenemos el espacio y el equipo perfecto.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Nuestras propiedades se transforman en escenarios mágicos donde tus sueños de 
            celebración cobran vida. El Caribe como telón de fondo, y nuestra atención al 
            detalle como garantía.
          </p>
          <p className="text-gray-400 text-xs italic">
            All Global Holding está en constante desarrollo, incorporando nuevos venues y 
            proveedores premium para hacer de tus eventos algo inolvidable.
          </p>
        </div>

        <div className="bg-black/5 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Tipos de Eventos</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Cumpleaños y Aniversarios</p>
              <p className="text-xs text-gray-500">Celebraciones íntimas o grandes fiestas</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Bodas y Compromisos</p>
              <p className="text-xs text-gray-500">El escenario perfecto para el "Sí"</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Reuniones Corporativas</p>
              <p className="text-xs text-gray-500">Networking en ambiente exclusivo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20organizar%20un%20evento%20privado"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black/5 hover:bg-black/5 text-white font-bold py-4 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          Planear Mi Evento
        </a>
      </div>
    </div>
  );
}
