import { ArrowLeft, UtensilsCrossed, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpRestaurantes() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-restaurantes.jpg" 
          alt="Restaurantes Selectos"
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
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-restaurantes">Restaurantes Selectos</h1>
            <p className="text-[#717171]">Gastronomía de clase mundial</p>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            <h2 className="font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }} data-testid="heading-beneficio-restaurantes">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>30% de descuento</strong> en restaurantes aliados</li>
            <li>• Reservaciones prioritarias sin espera</li>
            <li>• Mesas preferenciales con mejor vista</li>
            <li>• Menús de degustación exclusivos</li>
            <li>• Experiencias de chef's table privadas</li>
            <li>• Catas de vino y maridajes especiales</li>
          </ul>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h2 className="text-[#222] font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            La familia <strong className="text-[#222]">All Global Holding</strong> ha cultivado 
            relaciones con los mejores restaurantes de la Riviera Maya. Tu membresía te abre puertas 
            que el público general no conoce.
          </p>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Desde cocina mexicana contemporánea hasta fusión internacional, cada experiencia 
            gastronómica está diseñada para crear memorias inolvidables. Porque en Fractional Living, 
            entendemos que cenar es un arte.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, añadiendo nuevos restaurantes y 
            experiencias gastronómicas a nuestra red de aliados.
          </p>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h3 className="font-bold text-[#222] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Restaurantes Aliados</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Restaurantes Fine Dining</p>
              <p className="text-xs text-[#888]">Alta cocina • Experiencia gourmet</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Beach Clubs Exclusivos</p>
              <p className="text-xs text-[#888]">Vista al mar • Ambiente premium</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Cocina Mexicana Contemporánea</p>
              <p className="text-xs text-[#888]">Tradición con innovación</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#ebebeb]">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20quiero%20reservar%20en%20un%20restaurante"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-bold py-4 rounded-md transition-colors"
          data-testid="whatsapp-restaurantes"
        >
          <Phone className="w-5 h-5" />
          Reservar Mesa
        </a>
      </div>
    </div>
  );
}
