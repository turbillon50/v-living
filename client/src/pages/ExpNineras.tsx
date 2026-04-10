import { ArrowLeft, Baby, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function ExpNineras() {
  return (
    <div className="min-h-screen bg-white pb-60">
      <div className="relative">
        <img 
          src="/exp-nineras.jpg" 
          alt="Servicios de Niñeras"
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
            <Baby className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="heading-nineras">Servicios de Niñeras</h1>
            <p className="text-[#717171]">Cuidado profesional certificado</p>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            <h2 className="font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }} data-testid="heading-beneficio-nineras">Tu Beneficio Fractional Living</h2>
          </div>
          <ul className="space-y-2 text-[#555] text-sm">
            <li>• <strong>30% de descuento</strong> en servicio de niñeras</li>
            <li>• Personal certificado y verificado</li>
            <li>• Experiencia con todas las edades</li>
            <li>• Actividades educativas y recreativas</li>
            <li>• Servicio por hora o por día</li>
            <li>• Primeros auxilios y CPR certificado</li>
          </ul>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h2 className="text-[#222] font-bold text-lg mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>El Privilegio de Pertenecer</h2>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            <strong className="text-[#222]">All Global Holding</strong> sabe que tus vacaciones 
            también merecen momentos de pareja o de descanso adulto. Por eso, seleccionamos 
            cuidadosamente a cada niñera de nuestra red.
          </p>
          <p className="text-[#717171] text-sm leading-relaxed mb-4">
            Profesionales cariñosas, bilingües y con amplia experiencia que harán que tus hijos 
            también tengan unas vacaciones increíbles. Mientras ellos se divierten con actividades 
            diseñadas para su edad, tú disfrutas tranquilo.
          </p>
          <p className="text-[#999] text-xs italic">
            All Global Holding está en constante desarrollo, verificando y capacitando continuamente 
            a nuestro equipo de cuidadores profesionales.
          </p>
        </div>

        <div className="bg-[#f7f7f7] rounded-md p-5 mb-6 border border-[#ebebeb]">
          <h3 className="font-bold text-[#222] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Servicios Disponibles</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Cuidado Por Horas</p>
              <p className="text-xs text-[#888]">Mínimo 3 horas • Ideal para cenas</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Servicio Por Día</p>
              <p className="text-xs text-[#888]">8 horas • Actividades planificadas</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-[#ebebeb]">
              <p className="font-semibold text-sm text-[#222]">Noche Completa</p>
              <p className="text-xs text-[#888]">Hasta 12 horas • Cuidado nocturno</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#ebebeb]">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20soy%20miembro%20Fractional%20Living%20y%20necesito%20servicio%20de%20niñera"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white font-bold py-4 rounded-md transition-colors"
          data-testid="whatsapp-nineras"
        >
          <Phone className="w-5 h-5" />
          Reservar Niñera
        </a>
      </div>
    </div>
  );
}
