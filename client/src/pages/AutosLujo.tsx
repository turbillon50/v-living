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

      <section className="px-4 safe-area-top-offset pb-6">
        <div className="bg-gradient-to-r from-[#059669] to-[#06b6d4] rounded-md p-5 text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-white/70" />
            <h1 className="text-white text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-autos">Autos de Lujo</h1>
          </div>
          <p className="text-white/90 text-sm mb-3">Beneficio exclusivo Fractional Living</p>
          <div className="bg-white/20 rounded-md p-3 border border-white/30">
            <p className="text-white font-bold text-xl">40% OFF</p>
            <p className="text-white/80 text-xs">Te conseguimos cualquier auto al mejor precio</p>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="aspect-[16/10] rounded-md overflow-hidden">
            <img 
              src={AUTOS[current].image} 
              alt={AUTOS[current].name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2"
            aria-label="Previous car"
          >
            <ChevronLeft className="w-5 h-5 text-[#555]" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2"
            aria-label="Next car"
          >
            <ChevronRight className="w-5 h-5 text-[#555]" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {AUTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#059669] w-6' : 'bg-[#059669]/30'}`}
                aria-label={`Go to car ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#222] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>{AUTOS[current].name}</h2>
          <p className="text-[#717171] text-sm">{AUTOS[current].desc}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-[#f7f7f7] rounded-md p-4 border border-[#ebebeb]">
            <p className="text-[#555] text-sm text-center">
              Como miembro de <span className="font-bold text-[#222]">Fractional Living</span>, te conseguimos cualquier vehículo de lujo con hasta <span className="font-bold">40% de descuento</span>.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#f7f7f7] rounded-lg p-3 border border-[#ebebeb]">
              <p className="text-[#222] font-bold text-sm">Sedanes</p>
              <p className="text-[#888] text-xs">Ejecutivos</p>
            </div>
            <div className="bg-[#f7f7f7] rounded-lg p-3 border border-[#ebebeb]">
              <p className="text-[#222] font-bold text-sm">SUVs</p>
              <p className="text-[#888] text-xs">Premium</p>
            </div>
            <div className="bg-[#f7f7f7] rounded-lg p-3 border border-[#ebebeb]">
              <p className="text-[#222] font-bold text-sm">Exóticos</p>
              <p className="text-[#888] text-xs">Super Autos</p>
            </div>
          </div>
        </div>

        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20rentar%20un%20auto%20de%20lujo%20con%20el%20beneficio%20Fractional%20Living"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-semibold rounded-md transition-all"
          data-testid="whatsapp-autos"
        >
          <MessageCircle className="w-5 h-5" />
          Cotizar Auto de Lujo
        </a>

        <p className="text-center text-[#999] text-xs mt-4">
          Disponible para miembros Fractional Living
        </p>
      </section>
    </div>
  );
}
