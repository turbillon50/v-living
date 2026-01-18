import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { ArrowRight, Shield, Key, TrendingUp, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920')] bg-cover bg-center" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                {language === 'es' 
                  ? 'Propiedad fraccionada en el Caribe' 
                  : 'Fractional ownership in the Caribbean'}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {language === 'es' 
                  ? 'Invierte en propiedades de lujo desde $650,000 MXN. Propiedad real, legal y heredable con 3 semanas de uso anual.'
                  : 'Invest in luxury properties from $37,000 USD. Real, legal and inheritable ownership with 3 weeks of annual use.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/fractional">
                  <button className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto" data-testid="btn-view-properties">
                    {language === 'es' ? 'Ver Propiedades' : 'View Properties'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button 
                  onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living', '_blank')}
                  className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto"
                  data-testid="btn-contact-advisor"
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === 'es' ? 'Hablar con Asesor' : 'Talk to Advisor'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'es' ? '¿Por qué Fractional Living?' : 'Why Fractional Living?'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {language === 'es' 
                  ? 'La evolución del timeshare tradicional. Propiedad real con todos los beneficios legales.'
                  : 'The evolution of traditional timeshare. Real ownership with all legal benefits.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Key className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'es' ? 'Propiedad Real' : 'Real Ownership'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es' 
                    ? 'Escritura a tu nombre. Puedes vender, rentar o heredar tu fracción en cualquier momento.'
                    : 'Deed in your name. You can sell, rent or inherit your fraction at any time.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'es' ? '100% Legal' : '100% Legal'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es' 
                    ? 'Estructura legal mexicana con fideicomiso. Protección total de tu inversión.'
                    : 'Mexican legal structure with trust. Full protection of your investment.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'es' ? 'Plusvalía' : 'Appreciation'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es' 
                    ? 'Tu fracción aumenta de valor con el tiempo. Inversión inteligente en bienes raíces.'
                    : 'Your fraction increases in value over time. Smart real estate investment.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {language === 'es' ? '3 semanas al año en el paraíso' : '3 weeks a year in paradise'}
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  {language === 'es' 
                    ? 'Cada fracción te da derecho a 3 semanas de uso anual. Tú eliges cuándo. Flexibilidad total para disfrutar tu propiedad.'
                    : 'Each fraction entitles you to 3 weeks of annual use. You choose when. Total flexibility to enjoy your property.'}
                </p>
                <ul className="space-y-4">
                  {[
                    language === 'es' ? 'Calendario de 52 semanas' : '52-week calendar',
                    language === 'es' ? 'Reserva con 5 días de anticipación' : 'Book with 5 days notice',
                    language === 'es' ? 'Sin cargos ocultos' : 'No hidden fees'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
                  alt="Luxury property" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'es' ? '¿Listo para invertir?' : 'Ready to invest?'}
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              {language === 'es' 
                ? 'Agenda una llamada con nuestro equipo y conoce las propiedades disponibles.'
                : 'Schedule a call with our team and learn about available properties.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fractional">
                <button className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors" data-testid="btn-explore-properties">
                  {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button 
                onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20quiero%20agendar%20una%20llamada', '_blank')}
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                data-testid="btn-schedule-call"
              >
                {language === 'es' ? 'Agendar Llamada' : 'Schedule Call'}
              </button>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="font-semibold">FRACTIONAL LIVING</p>
                <p className="text-sm text-gray-500">All Global Holding LLC</p>
              </div>
              <p className="text-sm text-gray-500">
                © 2024 All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
