import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { ArrowLeft, Plane, Search, ArrowRight, Clock, Users, ChevronDown, Loader2, ArrowLeftRight, Calendar, Shield, Zap, Globe, Star, MapPin } from 'lucide-react';

interface Airport {
  iata_code: string;
  name: string;
  city_name: string;
  type: string;
}

interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  owner: { name: string; logo_symbol_url: string; iata_code: string };
  slices: Array<{
    origin: { name: string; iata_code: string; city_name: string };
    destination: { name: string; iata_code: string; city_name: string };
    duration: string;
    segments: Array<{
      origin: { name: string; iata_code: string };
      destination: { name: string; iata_code: string };
      departing_at: string;
      arriving_at: string;
      duration: string;
      marketing_carrier: { name: string; logo_symbol_url: string; iata_code: string };
      marketing_carrier_flight_number: string;
    }>;
  }>;
  cabin_class: string;
  conditions: { refund_before_departure: any; change_before_departure: any };
}

function formatDuration(iso: string) {
  if (!iso) return '';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] || '0';
  const m = match[2] || '0';
  return `${h}h ${m}m`;
}

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function AirportInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (code: string, name: string) => void; placeholder: string; label: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const timeoutRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchAirports = (q: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (q.length < 2) { setResults([]); return; }
      try {
        const res = await fetch(`/api/duffel/airports?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch { setResults([]); }
    }, 300);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type="text"
        value={displayName || query}
        onChange={(e) => { setQuery(e.target.value); setDisplayName(''); searchAirports(e.target.value); }}
        onFocus={() => { if (results.length) setShowDropdown(true); }}
        placeholder={placeholder}
        className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-3 text-[#222] text-sm placeholder:text-[#bbb] focus:outline-none focus:border-[#059669]/50 focus:ring-1 focus:ring-[#059669]/20 transition-all"
        data-testid={`input-airport-${label.toLowerCase()}`}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ebebeb] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((a) => (
            <button
              key={a.iata_code}
              onClick={() => {
                onChange(a.iata_code, `${a.city_name} (${a.iata_code})`);
                setDisplayName(`${a.city_name} (${a.iata_code})`);
                setShowDropdown(false);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#f7f7f7] transition-colors border-b border-[#f7f7f7] last:border-0"
            >
              <div className="text-[#222] text-sm font-medium">{a.city_name}</div>
              <div className="text-[#999] text-xs">{a.name} ({a.iata_code})</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const POPULAR_ROUTES = [
  { from: 'CUN', fromCity: 'Cancún', to: 'MIA', toCity: 'Miami', img: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=250&fit=crop' },
  { from: 'MEX', fromCity: 'CDMX', to: 'CUN', toCity: 'Cancún', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=250&fit=crop' },
  { from: 'CUN', fromCity: 'Cancún', to: 'BOG', toCity: 'Bogotá', img: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=400&h=250&fit=crop' },
  { from: 'MIA', fromCity: 'Miami', to: 'PUJ', toCity: 'Punta Cana', img: 'https://images.unsplash.com/photo-1590523278191-995a2e635a28?w=400&h=250&fit=crop' },
];

export default function Flights() {
  const { language } = useLanguage();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originName, setOriginName] = useState('');
  const [destName, setDestName] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  const searchFlights = async () => {
    if (!origin || !destination || !departureDate) {
      setError(language === 'es' ? 'Completa origen, destino y fecha de salida' : 'Complete origin, destination and departure date');
      return;
    }
    setLoading(true);
    setError('');
    setOffers([]);
    setSearched(true);

    try {
      const res = await fetch('/api/duffel/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin, destination, departure_date: departureDate,
          return_date: returnDate || undefined,
          passengers: { adults },
          cabin_class: cabinClass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOffers(data.offers || []);
    } catch (e: any) {
      setError(e.message || 'Error buscando vuelos');
    } finally {
      setLoading(false);
    }
  };

  const cabinOptions = [
    { value: 'economy', label: language === 'es' ? 'Economy' : 'Economy' },
    { value: 'premium_economy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: language === 'es' ? 'Primera Clase' : 'First Class' },
  ];

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-white text-[#222]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[380px] md:h-[440px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1400&h=600&fit=crop)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#059669]/10 via-transparent to-[#059669]/10" />
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#059669]/5 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#06b6d4]/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-12">
            <div className="fl-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#059669]/30">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#059669] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living Travel</p>
              <h1 className="text-4xl md:text-5xl text-[#222] tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-flights-title">
                {language === 'es' ? 'Vuelos al Caribe' : 'Caribbean Flights'}
              </h1>
              <p className="text-[#717171] text-sm font-light max-w-lg mx-auto mb-6">
                {language === 'es' 
                  ? 'Busca vuelos reales con las mejores aerolíneas del mundo. Tarifas en tiempo real, reserva directa.' 
                  : 'Search real flights with the world\'s best airlines. Real-time fares, direct booking.'}
              </p>
              <div className="flex items-center justify-center gap-6 text-[10px] text-[#999] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#059669]" /> {language === 'es' ? 'Tarifas reales' : 'Real fares'}</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-[#059669]" /> +300 {language === 'es' ? 'aerolíneas' : 'airlines'}</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#059669]" /> {language === 'es' ? 'Reserva directa' : 'Direct booking'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-32 max-w-4xl mx-auto -mt-8 relative z-20">
        <div className="mx-4 bg-white border border-[#ebebeb] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[#444] text-sm font-medium tracking-wide">
              {language === 'es' ? 'Buscar Vuelos' : 'Search Flights'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <AirportInput
              value={origin}
              onChange={(code, name) => { setOrigin(code); setOriginName(name); }}
              placeholder={language === 'es' ? 'Ciudad o aeropuerto' : 'City or airport'}
              label={language === 'es' ? 'Origen' : 'Origin'}
            />
            <div className="flex items-end justify-center pb-3">
              <div className="w-8 h-8 rounded-full bg-[#059669]/10 flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-[#059669]" />
              </div>
            </div>
            <AirportInput
              value={destination}
              onChange={(code, name) => { setDestination(code); setDestName(name); }}
              placeholder={language === 'es' ? 'Ciudad o aeropuerto' : 'City or airport'}
              label={language === 'es' ? 'Destino' : 'Destination'}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Ida' : 'Departure'}
              </label>
              <input
                type="date"
                value={departureDate}
                min={getTomorrow()}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all"
                data-testid="input-departure-date"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Vuelta' : 'Return'}
              </label>
              <input
                type="date"
                value={returnDate}
                min={departureDate || getTomorrow()}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all"
                data-testid="input-return-date"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Users className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Pasajeros' : 'Passengers'}
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all appearance-none"
                data-testid="select-passengers"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-white text-[#222]">{n} {n === 1 ? (language === 'es' ? 'adulto' : 'adult') : (language === 'es' ? 'adultos' : 'adults')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                {language === 'es' ? 'Clase' : 'Class'}
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all appearance-none"
                data-testid="select-cabin"
              >
                {cabinOptions.map(o => (
                  <option key={o.value} value={o.value} className="bg-white text-[#222]">{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#059669] transition-all shadow-lg shadow-[#059669]/25 text-white"
            data-testid="button-search-flights"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Buscando mejores tarifas...' : 'Finding best fares...'}</>
            ) : (
              <><Search className="w-4 h-4" /> {language === 'es' ? 'Buscar Vuelos' : 'Search Flights'}</>
            )}
          </button>
        </div>

        {!searched && !loading && (
          <div className="mx-4 mt-8" data-testid="section-popular-routes">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] font-medium mb-1">
                  {language === 'es' ? 'Populares' : 'Popular'}
                </p>
                <h3 className="text-[#222] text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                  {language === 'es' ? 'Rutas Destacadas' : 'Featured Routes'}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_ROUTES.map((route, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setOrigin(route.from);
                    setOriginName(`${route.fromCity} (${route.from})`);
                    setDestination(route.to);
                    setDestName(`${route.toCity} (${route.to})`);
                  }}
                  className="group relative rounded-2xl overflow-hidden aspect-[16/10] text-left border border-[#ebebeb] hover:border-[#059669]/30 transition-all"
                  data-testid={`route-${route.from}-${route.to}`}
                >
                  <img src={route.img} alt={`${route.fromCity} - ${route.toCity}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                      <span>{route.fromCity}</span>
                      <ArrowRight className="w-3 h-3 text-[#06b6d4]" />
                      <span>{route.toCity}</span>
                    </div>
                    <p className="text-white/70 text-[10px] mt-0.5">{route.from} - {route.to}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Star, title: language === 'es' ? 'Mejores Precios' : 'Best Prices', desc: language === 'es' ? 'Comparamos aerolíneas' : 'We compare airlines' },
                { icon: Shield, title: language === 'es' ? 'Reserva Segura' : 'Secure Booking', desc: language === 'es' ? 'Pago protegido' : 'Protected payment' },
                { icon: Globe, title: language === 'es' ? 'Cobertura Global' : 'Global Coverage', desc: language === 'es' ? '+300 aerolíneas' : '+300 airlines' },
              ].map((item, i) => (
                <div key={i} className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-4 text-center" data-testid={`badge-flights-trust-${i}`}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669]/20 to-[#06b6d4]/20 flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-5 h-5 text-[#059669]" />
                  </div>
                  <p className="text-[#444] text-xs font-medium mb-0.5">{item.title}</p>
                  <p className="text-[#bbb] text-[10px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm" data-testid="text-flight-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
              <Plane className="w-6 h-6 text-[#059669] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[#717171] text-sm mt-4">{language === 'es' ? 'Buscando las mejores tarifas...' : 'Finding the best fares...'}</p>
            <p className="text-[#ccc] text-[10px] mt-1">{language === 'es' ? 'Comparando aerolíneas en tiempo real' : 'Comparing airlines in real time'}</p>
          </div>
        )}

        {searched && !loading && offers.length === 0 && !error && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669]/10 to-[#06b6d4]/10 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-[#059669]/30" />
            </div>
            <p className="text-[#999] text-sm">{language === 'es' ? 'No se encontraron vuelos para esta ruta' : 'No flights found for this route'}</p>
            <p className="text-[#ccc] text-xs mt-1">{language === 'es' ? 'Intenta con otras fechas o destinos' : 'Try different dates or destinations'}</p>
          </div>
        )}

        {offers.length > 0 && (
          <div className="mx-4 mt-6" data-testid="section-flight-results">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] font-medium mb-1">
                  {language === 'es' ? 'Resultados' : 'Results'}
                </p>
                <h3 className="text-[#222] text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                  {offers.length} {language === 'es' ? 'vuelos encontrados' : 'flights found'}
                </h3>
              </div>
              <div className="text-[10px] text-[#bbb] uppercase tracking-wider">
                {language === 'es' ? 'Ordenado por precio' : 'Sorted by price'}
              </div>
            </div>
            <div className="space-y-3">
              {offers.map((offer, idx) => (
                <div
                  key={offer.id}
                  className={`bg-white border rounded-2xl overflow-hidden hover:border-[#059669]/30 transition-all shadow-sm ${idx === 0 ? 'border-[#059669]/20 ring-1 ring-[#059669]/10' : 'border-[#ebebeb]'}`}
                  data-testid={`card-flight-${offer.id}`}
                >
                  {idx === 0 && (
                    <div className="bg-gradient-to-r from-[#059669] to-[#06b6d4] px-4 py-1.5 text-[10px] font-medium tracking-wider uppercase text-center text-white">
                      {language === 'es' ? 'Mejor precio' : 'Best price'}
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                    className="w-full text-left p-5"
                  >
                    {offer.slices.map((slice, si) => (
                      <div key={si} className={`flex items-center gap-3 ${si > 0 ? 'mt-3 pt-3 border-t border-[#ebebeb]' : ''}`}>
                        <div className="flex-shrink-0">
                          {offer.owner.logo_symbol_url ? (
                            <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669]/20 to-[#06b6d4]/20 flex items-center justify-center text-[#059669] text-xs font-bold">
                              {offer.owner.iata_code}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-[#222]">{slice.segments?.[0] ? formatTime(slice.segments[0].departing_at) : ''}</span>
                            <span className="text-[#999] text-xs">{slice.origin.iata_code}</span>
                            <div className="flex-1 flex items-center gap-1 px-2">
                              <div className="flex-1 h-px bg-gradient-to-r from-[#059669]/30 to-[#06b6d4]/30" />
                              <span className="text-[10px] text-[#bbb] whitespace-nowrap flex items-center gap-0.5 bg-[#f7f7f7] px-2 py-0.5 rounded-full">
                                <Clock className="w-2.5 h-2.5" />
                                {formatDuration(slice.duration)}
                              </span>
                              <div className="flex-1 h-px bg-gradient-to-r from-[#06b6d4]/30 to-[#059669]/30" />
                            </div>
                            <span className="text-[#999] text-xs">{slice.destination.iata_code}</span>
                            <span className="font-semibold text-[#222]">{slice.segments?.[slice.segments.length - 1] ? formatTime(slice.segments[slice.segments.length - 1].arriving_at) : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#bbb] text-[10px]">{offer.owner.name}</span>
                            {slice.segments && slice.segments.length > 1 && (
                              <span className="text-amber-400/70 text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded">
                                {slice.segments.length - 1} {language === 'es' ? 'escala(s)' : 'stop(s)'}
                              </span>
                            )}
                            {slice.segments && slice.segments.length === 1 && (
                              <span className="text-emerald-400/70 text-[10px] bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                {language === 'es' ? 'Directo' : 'Direct'}
                              </span>
                            )}
                          </div>
                        </div>

                        {si === 0 && (
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-semibold bg-gradient-to-r from-[#059669] to-[#06b6d4] bg-clip-text text-transparent">
                              ${parseFloat(offer.total_amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-[10px] text-[#bbb] uppercase">{offer.total_currency}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </button>

                  {expandedOffer === offer.id && (
                    <div className="px-5 pb-5 border-t border-[#ebebeb] pt-4">
                      {offer.slices.map((slice, si) => (
                        <div key={si} className={si > 0 ? 'mt-4' : ''}>
                          <div className="text-[10px] text-[#059669] uppercase tracking-wider mb-3 font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                            {si === 0 ? (language === 'es' ? 'Ida' : 'Outbound') : (language === 'es' ? 'Vuelta' : 'Return')}
                          </div>
                          {slice.segments?.map((seg, segi) => (
                            <div key={segi} className="flex items-start gap-3 mb-2 last:mb-0">
                              <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#059669] to-[#06b6d4]" />
                                <div className="w-px h-8 bg-gradient-to-b from-[#059669]/40 to-[#06b6d4]/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#059669]" />
                              </div>
                              <div className="flex-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-[#555]">{formatTime(seg.departing_at)} - {seg.origin.iata_code}</span>
                                  <span className="text-[#bbb]">{seg.marketing_carrier?.iata_code}{seg.marketing_carrier_flight_number}</span>
                                </div>
                                <div className="text-[#ccc] text-[10px] my-0.5">{formatDuration(seg.duration)}</div>
                                <div className="text-[#555]">{formatTime(seg.arriving_at)} - {seg.destination.iata_code}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {offer.conditions?.refund_before_departure?.allowed && (
                          <span className="text-[10px] text-emerald-400/70 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                            {language === 'es' ? 'Reembolsable' : 'Refundable'}
                          </span>
                        )}
                        {offer.conditions?.change_before_departure?.allowed && (
                          <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2.5 py-1 rounded-full">
                            {language === 'es' ? 'Cambios permitidos' : 'Changes allowed'}
                          </span>
                        )}
                        {offer.cabin_class && (
                          <span className="text-[10px] text-[#999] bg-[#f7f7f7] px-2.5 py-1 rounded-full capitalize">
                            {offer.cabin_class.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AGHFooter />
    </div>
  );
}
