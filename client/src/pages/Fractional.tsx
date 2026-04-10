import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, ChevronRight, Map } from 'lucide-react';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { PropertyCardCarousel } from '@/components/PropertyCardCarousel';
import { useLanguage } from '@/lib/LanguageContext';
import { getProperties } from '@/lib/api';
import type { Property } from '@shared/schema';

export default function Fractional() {
  const { language } = useLanguage();
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <img src="/hero-caribbean.jpg" alt="Propiedad fraccional en el Caribe" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />

          <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-10 text-center">
            <div className="fl-fade-in">
              <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-4xl md:text-5xl text-white tracking-tight leading-[0.95] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-fractional-title">
                {language === 'es' ? 'Propiedades Fractional' : 'Fractional Properties'}
              </h1>
              <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                {language === 'es' 
                  ? 'Compra · Vive · Renta · Revende · Repite' 
                  : 'Buy · Live · Rent · Resell · Repeat'}
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{properties.length * 42}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
                </div>
                <div className="w-px h-8 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">30%</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">{language === 'es' ? 'Enganche' : 'Down'}</p>
                </div>
                <div className="w-px h-8 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.15em]">MSI</p>
                </div>
              </div>
              <Link href="/registro">
                <button className="py-3.5 px-8 bg-white text-[#222] rounded-2xl text-sm font-semibold inline-flex items-center gap-2 active:scale-[0.97] transition-transform shadow-2xl" data-testid="button-register-hero">
                  {language === 'es' ? 'Reservar Fracción' : 'Reserve Fraction'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 -mt-4 relative z-20 max-w-5xl mx-auto fl-fade-in-delay-1" data-testid="section-fractional-benefits">
        <div className="overflow-x-auto no-scrollbar -mx-1">
          <div className="flex gap-3 px-1 pb-2" style={{ width: 'max-content' }}>
            {[
              { img: '/attik-4.jpg', text: language === 'es' ? 'Servicio llave en mano' : 'Turnkey service' },
              { img: '/almyria-2.jpg', text: language === 'es' ? 'Plusvalía garantizada' : 'Guaranteed appreciation' },
              { img: '/exp-concierge.jpg', text: language === 'es' ? 'Nosotros rentamos por ti' : 'We rent for you' },
              { img: '/hermitage-3.jpg', text: language === 'es' ? 'Disfruta o genera ingresos' : 'Enjoy or generate income' },
            ].map((item, i) => (
              <div key={i} className="relative w-[200px] rounded-xl overflow-hidden aspect-[16/9] flex-shrink-0">
                <img src={item.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-white text-[11px] font-semibold leading-tight">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 max-w-5xl mx-auto fl-fade-in-delay-2">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl text-[#222] font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
            {properties.length} {language === 'es' ? 'Propiedades' : 'Properties'}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-2 border-[#ebebeb] border-t-[#059669] rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
            <img src="/hero-ocean.jpg" alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#717171] text-sm">{language === 'es' ? 'No hay propiedades aún' : 'No properties yet'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property, idx) => (
              <PropertyCardCarousel key={property.id} property={property} featured={idx === 0} />
            ))}
          </div>
        )}
      </section>

      <section className="px-5 pb-8 max-w-3xl mx-auto" data-testid="section-fractional-stats">
        <div className="grid grid-cols-2 gap-3">
          {[
            { img: '/attik-5.jpg', title: language === 'es' ? 'Plusvalía Real' : 'Real Appreciation', sub: language === 'es' ? 'Tu fracción se valoriza' : 'Your fraction appreciates' },
            { img: '/almyria-3.jpg', title: language === 'es' ? 'Compra Semanas' : 'Buy Weeks', sub: language === 'es' ? 'Suma las que quieras' : 'Add as many as you want' },
            { img: '/exp-privadas.jpg', title: language === 'es' ? 'Renta tu Fracción' : 'Rent Your Fraction', sub: language === 'es' ? 'Genera ingresos' : 'Generate income' },
            { img: '/hermitage-1.jpg', title: language === 'es' ? 'Legal y Seguro' : 'Legal & Secure', sub: language === 'es' ? 'Derechos heredables' : 'Inheritable rights' },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-square group">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-semibold">{item.title}</p>
                <p className="text-white/50 text-[11px] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1] cursor-pointer group active:scale-[0.98] transition-transform">
          <img src="/hero-ocean.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-1">{language === 'es' ? 'Tu lugar' : 'Your place'}</p>
            <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
              {language === 'es' ? 'Reserva tu Fracción' : 'Reserve Your Fraction'}
            </h3>
            <p className="text-white/50 text-xs mb-4">{language === 'es' ? 'Te contactamos en 5 días' : 'We contact you in 5 days'}</p>
            <Link href="/registro">
              <button className="py-3 px-8 bg-white text-[#222] text-sm font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg active:scale-[0.97] transition-transform" data-testid="button-register-cta">
                {language === 'es' ? 'Registrarme' : 'Register'} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 max-w-2xl mx-auto">
        <a 
          href="https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#222] text-[#222] rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
          data-testid="link-whatsapp-fractional"
        >
          WhatsApp Directo
        </a>
      </section>

      <Link href="/mapa">
        <button
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 bg-[#0a1628] text-white text-sm font-medium rounded-full shadow-xl shadow-black/20 hover:bg-[#111d33] transition-all duration-200 hover:scale-105"
          data-testid="button-show-map"
        >
          <Map className="w-4 h-4" />
          {language === 'es' ? 'Mostrar mapa' : 'Show map'}
        </button>
      </Link>

      <AGHFooter />
    </div>
  );
}
