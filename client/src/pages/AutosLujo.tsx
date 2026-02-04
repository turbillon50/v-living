import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';

const AUTOS = [
  { image: '/auto-sedan.jpg', name: 'Sedán Ejecutivo', desc: 'Confort y elegancia para tus traslados' },
  { image: '/auto-suv.jpg', name: 'SUV Premium', desc: 'Espacio y lujo para toda la familia' },
  { image: '/auto-super.jpg', name: 'Super Auto', desc: 'La experiencia definitiva de manejo' },
];

export default function AutosLujo() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % AUTOS.length);
  const prev = () => setCurrent((current - 1 + AUTOS.length) % AUTOS.length);

  return (
    <div className="min-h-screen bg-white pb-60">
      <Header />

      <section className="px-4 pt-4 pb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h1 className="text-white text-lg font-bold">Autos de Lujo</h1>
          </div>
          <p className="text-white/90 text-sm mb-3">Beneficio exclusivo Fractional Living</p>
          <div className="bg-yellow-400/20 rounded-xl p-3 border border-yellow-400/30">
            <p className="text-yellow-400 font-bold text-xl">40% OFF</p>
            <p className="text-white/80 text-xs">Te conseguimos cualquier auto al mejor precio</p>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={AUTOS[current].image} 
              alt={AUTOS[current].name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {AUTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{AUTOS[current].name}</h2>
          <p className="text-gray-500 text-sm">{AUTOS[current].desc}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 text-sm text-center">
              Como miembro de <span className="font-bold text-orange-500">Fractional Living</span>, te conseguimos cualquier vehículo de lujo con hasta <span className="font-bold">40% de descuento</span>.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <p className="text-orange-500 font-bold text-sm">Sedanes</p>
              <p className="text-gray-500 text-xs">Ejecutivos</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3">
              <p className="text-orange-500 font-bold text-sm">SUVs</p>
              <p className="text-gray-500 text-xs">Premium</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3">
              <p className="text-orange-500 font-bold text-sm">Exóticos</p>
              <p className="text-gray-500 text-xs">Super Autos</p>
            </div>
          </div>
        </div>

        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20rentar%20un%20auto%20de%20lujo%20con%20el%20beneficio%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-black to-black hover:from-black hover:to-black text-white font-semibold rounded-xl shadow-lg transition-all"
          data-testid="whatsapp-autos"
        >
          <MessageCircle className="w-5 h-5" />
          Cotizar Auto de Lujo
        </a>

        <p className="text-center text-gray-400 text-xs mt-4">
          Disponible para miembros Fractional Living
        </p>
      </section>
    </div>
  );
}
