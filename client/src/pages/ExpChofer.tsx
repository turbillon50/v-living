import { ArrowLeft, UserCheck, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpChofer() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-chofer.jpg" 
          alt="Choferes Privados"
          className="w-full h-64 object-cover"
        />
        <Link href="/experiences">
          <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-md">
          30% OFF
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 rounded-md">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>Choferes Privados</h1>
            <p className="text-[#888]">Transporte ejecutivo y discreto</p>
          </div>
        </div>

        <div className="bg-[#fafafa] rounded-md p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-black fill-black" />
            <h2 className="font-bold text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>30% de descuento</strong> en servicio de chofer</li>
            <li>• Choferes bilingües profesionales</li>
            <li>• Suburbans cómodas y espaciosas</li>
            <li>• Traslados aeropuerto incluidos</li>
            <li>• Servicio por hora o por día</li>
            <li>• Discreción y puntualidad garantizada</li>
          </ul>
        </div>

        <div className="bg-[#111] rounded-md p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            En <strong className="text-white/70">All Global Holding</strong> entendemos que tu 
            tiempo es invaluable. Por eso, nuestros choferes no son solo conductores, son 
            profesionales capacitados que conocen cada destino.
          </p>
          <p className="text-[#bbb] text-sm leading-relaxed mb-4">
            Desde tu llegada al aeropuerto hasta la última noche de tu estadía, tienes a tu 
            disposición transporte de primera clase. Sin preocupaciones, sin esperas, 
            solo comodidad absoluta.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, expandiendo nuestra flota y 
            capacitando continuamente a nuestro equipo de choferes.
          </p>
        </div>

        <div className="bg-[#fafafa] rounded-md p-5 mb-6">
          <h3 className="font-bold text-[#111] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Servicios Disponibles</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ccc]">
              <p className="font-semibold text-sm">Traslado Aeropuerto</p>
              <p className="text-xs text-[#888]">CUN - Tu propiedad • Ida y vuelta</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ccc]">
              <p className="font-semibold text-sm">Servicio Por Hora</p>
              <p className="text-xs text-[#888]">Mínimo 4 horas • Ideal para tours</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ccc]">
              <p className="font-semibold text-sm">Servicio Por Día</p>
              <p className="text-xs text-[#888]">Disponible 12 horas • Total libertad</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20necesito%20servicio%20de%20chofer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-black text-white font-bold py-4 rounded-md transition-colors"
        >
          <Phone className="w-5 h-5" />
          Reservar Chofer
        </a>
      </div>
    </div>
  );
}
