import { ArrowLeft, Ship, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpYates() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-yates.jpg" 
          alt="Yates y Embarcaciones"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-full">
          30% OFF o GRATIS
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-xl">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yates y Embarcaciones</h1>
            <p className="text-gray-500">Navegación exclusiva en el Caribe</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-black rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="font-bold text-gray-900">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>30% de descuento</strong> en renta de yates y catamaranes</li>
            <li>• Acceso a <strong>experiencias GRATIS</strong> en fechas selectas</li>
            <li>• Reserva prioritaria en temporada alta</li>
            <li>• Tripulación profesional incluida</li>
            <li>• Snacks, bebidas y música a bordo</li>
            <li>• Equipo de snorkel y deportes acuáticos</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3">El Privilegio de Pertenecer</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Como miembro de la familia <strong className="text-yellow-400">All Global Holding</strong>, 
            tienes acceso exclusivo a una red de experiencias que va más allá de lo convencional.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Nuestra flota de yates en el Caribe Mexicano está diseñada para quienes entienden que 
            el verdadero lujo es el tiempo bien vivido. Desde paseos al atardecer hasta travesías 
            a islas privadas, cada experiencia está curada para ti.
          </p>
          <p className="text-gray-400 text-xs italic">
            All Global Holding está en constante desarrollo, expandiendo continuamente las opciones 
            y beneficios para nuestra comunidad de propietarios.
          </p>
        </div>

        <div className="bg-black rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Experiencias Disponibles</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Sunset Cruise</p>
              <p className="text-xs text-gray-500">2 horas • Atardecer en el mar</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Full Day Isla Mujeres</p>
              <p className="text-xs text-gray-500">8 horas • Snorkel y playa privada</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Fishing Experience</p>
              <p className="text-xs text-gray-500">6 horas • Pesca deportiva</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20me%20interesa%20rentar%20un%20yate"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black hover:bg-black text-white font-bold py-4 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          Reservar con Descuento
        </a>
      </div>
    </div>
  );
}
