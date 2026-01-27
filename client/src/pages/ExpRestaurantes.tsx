import { ArrowLeft, UtensilsCrossed, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpRestaurantes() {
  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="relative">
        <img 
          src="/exp-restaurantes.jpg" 
          alt="Restaurantes Selectos"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-full">
          30% OFF
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <UtensilsCrossed className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurantes Selectos</h1>
            <p className="text-gray-500">Gastronomía de clase mundial</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="font-bold text-gray-900">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>30% de descuento</strong> en restaurantes aliados</li>
            <li>• Reservaciones prioritarias sin espera</li>
            <li>• Mesas preferenciales con mejor vista</li>
            <li>• Menús de degustación exclusivos</li>
            <li>• Experiencias de chef's table privadas</li>
            <li>• Catas de vino y maridajes especiales</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3">El Privilegio de Pertenecer</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            La familia <strong className="text-yellow-400">All Global Holding</strong> ha cultivado 
            relaciones con los mejores restaurantes de la Riviera Maya. Tu membresía te abre puertas 
            que el público general no conoce.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Desde cocina mexicana contemporánea hasta fusión internacional, cada experiencia 
            gastronómica está diseñada para crear memorias inolvidables. Porque en Fractional Living, 
            entendemos que cenar es un arte.
          </p>
          <p className="text-gray-400 text-xs italic">
            All Global Holding está en constante desarrollo, añadiendo nuevos restaurantes y 
            experiencias gastronómicas a nuestra red de aliados.
          </p>
        </div>

        <div className="bg-orange-50 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Restaurantes Aliados</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-orange-100">
              <p className="font-semibold text-sm">Restaurantes Fine Dining</p>
              <p className="text-xs text-gray-500">Alta cocina • Experiencia gourmet</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-orange-100">
              <p className="font-semibold text-sm">Beach Clubs Exclusivos</p>
              <p className="text-xs text-gray-500">Vista al mar • Ambiente premium</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-orange-100">
              <p className="font-semibold text-sm">Cocina Mexicana Contemporánea</p>
              <p className="text-xs text-gray-500">Tradición con innovación</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20reservar%20en%20un%20restaurante"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          Reservar Mesa
        </a>
      </div>
    </div>
  );
}
