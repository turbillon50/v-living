import { ArrowLeft, Palmtree, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpPrivadas() {
  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="relative">
        <img 
          src="/exp-privadas.jpg" 
          alt="Experiencias Privadas"
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
          <div className="bg-purple-100 p-3 rounded-xl">
            <Palmtree className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experiencias Privadas</h1>
            <p className="text-gray-500">Aventuras exclusivas para ti</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="font-bold text-gray-900">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>30% de descuento</strong> en experiencias curadas</li>
            <li>• Algunas experiencias <strong>completamente GRATIS</strong></li>
            <li>• Tours privados sin grupos</li>
            <li>• Guías expertos locales</li>
            <li>• Acceso a lugares exclusivos</li>
            <li>• Experiencias personalizadas a tu gusto</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3">El Privilegio de Pertenecer</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Como miembro de <strong className="text-yellow-400">All Global Holding</strong>, tienes 
            acceso a experiencias que van más allá de lo que cualquier turista puede encontrar. 
            Cenotes secretos, ruinas al amanecer, playas privadas.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Cada experiencia es curada pensando en lo que tú y tu familia realmente desean. 
            No seguimos itinerarios genéricos: creamos momentos únicos que se convierten en 
            recuerdos para toda la vida.
          </p>
          <p className="text-gray-400 text-xs italic">
            All Global Holding está en constante desarrollo, descubriendo nuevas experiencias 
            y alianzas para ofrecerte lo mejor del Caribe Mexicano.
          </p>
        </div>

        <div className="bg-teal-50 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Experiencias Destacadas</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-teal-100">
              <p className="font-semibold text-sm">Cenotes Privados</p>
              <p className="text-xs text-gray-500">Sin multitudes • Nada como un local</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-teal-100">
              <p className="font-semibold text-sm">Amanecer en Ruinas Mayas</p>
              <p className="text-xs text-gray-500">Antes de abrir al público</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-teal-100">
              <p className="font-semibold text-sm">Cenas en Playas Secretas</p>
              <p className="text-xs text-gray-500">Chef privado • Bajo las estrellas</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-teal-100">
              <p className="font-semibold text-sm">Snorkel con Tortugas</p>
              <p className="text-xs text-gray-500">Guías expertos • Grupos pequeños</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20reservar%20una%20experiencia%20privada"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          Descubrir Experiencias
        </a>
      </div>
    </div>
  );
}
