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
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md" aria-label="Back to experiences">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white text-sm font-bold px-4 py-2 rounded-md">
          INCLUIDO
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-[#059669] to-[#06b6d4] p-3 rounded-md">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-concierge">Conserjería 24/7</h1>
            <p className="text-[#717171]">Asistencia personalizada siempre</p>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            <h2 className="font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }} data-testid="heading-beneficio-concierge">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>Servicio INCLUIDO</strong> en tu membresía</li>
            <li>• Atención 24 horas, 7 días a la semana</li>
            <li>• Reservaciones en restaurantes y experiencias</li>
            <li>• Coordinación de transporte y traslados</li>
            <li>• Asistencia para compras y mandados</li>
            <li>• Recomendaciones personalizadas</li>
            <li>• Solución de imprevistos</li>
          </ul>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h2 className="text-[#222] font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            La conserjería de <strong className="text-[#222]">All Global Holding</strong> es 
            tu aliado personal en el Caribe. No eres un turista más, eres parte de nuestra familia, 
            y te tratamos como tal.
          </p>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Nuestro equipo conoce cada rincón de la Riviera Maya. Desde conseguir la mejor mesa 
            en el restaurante más exclusivo hasta organizar una aventura de último minuto. 
            Tú pides, nosotros hacemos que suceda.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, entrenando continuamente a nuestro 
            equipo y expandiendo nuestra red de contactos para servirte mejor.
          </p>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h3 className="font-bold text-[#222] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>¿Qué Podemos Hacer Por Ti?</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Reservaciones</p>
              <p className="text-xs text-[#888]">Restaurantes, spas, tours, actividades</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Logística</p>
              <p className="text-xs text-[#888]">Transporte, traslados, coordinación</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Lo Imposible</p>
              <p className="text-xs text-[#888]">Si existe, te lo conseguimos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#ebebeb]">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20necesito%20asistencia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-bold py-4 rounded-md transition-colors"
          data-testid="whatsapp-concierge"
        >
          <Phone className="w-5 h-5" />
          Contactar Concierge
        </a>
      </div>
    </div>
  );
}
