import { ArrowLeft, Headphones, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpConcierge() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-concierge.jpg" 
          alt="Conserjería 24/7"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-full">
          INCLUIDO
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-xl">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conserjería 24/7</h1>
            <p className="text-gray-500">Asistencia personalizada siempre</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-gray-50 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-black fill-black" />
            <h2 className="font-bold text-gray-900">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>Servicio INCLUIDO</strong> en tu membresía</li>
            <li>• Atención 24 horas, 7 días a la semana</li>
            <li>• Reservaciones en restaurantes y experiencias</li>
            <li>• Coordinación de transporte y traslados</li>
            <li>• Asistencia para compras y mandados</li>
            <li>• Recomendaciones personalizadas</li>
            <li>• Solución de imprevistos</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3">El Privilegio de Pertenecer</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            La conserjería de <strong className="text-white/70">All Global Holding</strong> es 
            tu aliado personal en el Caribe. No eres un turista más, eres parte de nuestra familia, 
            y te tratamos como tal.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Nuestro equipo conoce cada rincón de la Riviera Maya. Desde conseguir la mejor mesa 
            en el restaurante más exclusivo hasta organizar una aventura de último minuto. 
            Tú pides, nosotros hacemos que suceda.
          </p>
          <p className="text-gray-400 text-xs italic">
            All Global Holding está en constante desarrollo, entrenando continuamente a nuestro 
            equipo y expandiendo nuestra red de contactos para servirte mejor.
          </p>
        </div>

        <div className="bg-black rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">¿Qué Podemos Hacer Por Ti?</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Reservaciones</p>
              <p className="text-xs text-gray-500">Restaurantes, spas, tours, actividades</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Logística</p>
              <p className="text-xs text-gray-500">Transporte, traslados, coordinación</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/10">
              <p className="font-semibold text-sm">Lo Imposible</p>
              <p className="text-xs text-gray-500">Si existe, te lo conseguimos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20necesito%20asistencia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black hover:bg-black text-white font-bold py-4 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          Contactar Concierge
        </a>
      </div>
    </div>
  );
}
