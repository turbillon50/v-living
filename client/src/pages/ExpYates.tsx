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
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-md">
          30% OFF o GRATIS
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-md">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>Yates y Embarcaciones</h1>
            <p className="text-[#888]">Navegación exclusiva en el Caribe</p>
          </div>
        </div>

        <div className="bg-[#111] rounded-md p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-white fill-white" />
            <h2 className="font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#bbb] text-sm">
            <li>• <strong>30% de descuento</strong> en renta de yates y catamaranes</li>
            <li>• Acceso a <strong>experiencias GRATIS</strong> en fechas selectas</li>
            <li>• Reserva prioritaria en temporada alta</li>
            <li>• Tripulación profesional incluida</li>
            <li>• Snacks, bebidas y música a bordo</li>
            <li>• Equipo de snorkel y deportes acuáticos</li>
          </ul>
        </div>

        <div className="bg-[#111] rounded-md p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            Como miembro de la familia <strong className="text-white/70">All Global Holding</strong>, 
            tienes acceso exclusivo a una red de experiencias que va más allá de lo convencional.
          </p>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            Nuestra flota de yates en el Caribe Mexicano está diseñada para quienes entienden que 
            el verdadero lujo es el tiempo bien vivido. Desde paseos al atardecer hasta travesías 
            a islas privadas, cada experiencia está curada para ti.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, expandiendo continuamente las opciones 
            y beneficios para nuestra comunidad de propietarios.
          </p>
        </div>

        <div className="bg-black rounded-md p-5 mb-6">
          <h3 className="font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Experiencias Disponibles</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Sunset Cruise</p>
              <p className="text-xs text-[#888]">2 horas • Atardecer en el mar</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Full Day Isla Mujeres</p>
              <p className="text-xs text-[#888]">8 horas • Snorkel y playa privada</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-black/10">
              <p className="font-semibold text-sm">Fishing Experience</p>
              <p className="text-xs text-[#888]">6 horas • Pesca deportiva</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20me%20interesa%20rentar%20un%20yate"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black hover:bg-black text-white font-bold py-4 rounded-md transition-colors"
        >
          <Phone className="w-5 h-5" />
          Reservar con Descuento
        </a>
      </div>
    </div>
  );
}
