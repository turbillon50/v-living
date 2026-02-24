import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { ArrowLeft, Plane, Search, ArrowRight, Clock, Users, ChevronDown, Loader2, ArrowLeftRight, Calendar } from 'lucide-react';

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
      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type="text"
        value={displayName || query}
        onChange={(e) => { setQuery(e.target.value); setDisplayName(''); searchAirports(e.target.value); }}
        onFocus={() => { if (results.length) setShowDropdown(true); }}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#0891b2]/50 focus:ring-1 focus:ring-[#0891b2]/20 transition-all"
        data-testid={`input-airport-${label.toLowerCase()}`}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
          {results.map((a) => (
            <button
              key={a.iata_code}
              onClick={() => {
                onChange(a.iata_code, `${a.city_name} (${a.iata_code})`);
                setDisplayName(`${a.city_name} (${a.iata_code})`);
                setShowDropdown(false);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="text-white text-sm font-medium">{a.city_name}</div>
              <div className="text-white/40 text-xs">{a.name} ({a.iata_code})</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className="min-h-screen bg-[#0a1628] text-white">
      <Header />

      <main className="pb-32 max-w-4xl mx-auto">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <Link href="/home">
            <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back-flights">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2" data-testid="text-flights-title">
              <Plane className="w-5 h-5 text-[#22d3ee]" />
              {language === 'es' ? 'Vuelos' : 'Flights'}
            </h1>
            <p className="text-white/40 text-xs">
              {language === 'es' ? 'Busca vuelos reales con las mejores tarifas' : 'Search real flights with the best fares'}
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <AirportInput
              value={origin}
              onChange={(code, name) => { setOrigin(code); setOriginName(name); }}
              placeholder={language === 'es' ? 'Ciudad o aeropuerto' : 'City or airport'}
              label={language === 'es' ? 'Origen' : 'Origin'}
            />
            <div className="flex items-end justify-center pb-3">
              <ArrowLeftRight className="w-4 h-4 text-[#22d3ee]" />
            </div>
            <AirportInput
              value={destination}
              onChange={(code, name) => { setDestination(code); setDestName(name); }}
              placeholder={language === 'es' ? 'Ciudad o aeropuerto' : 'City or airport'}
              label={language === 'es' ? 'Destino' : 'Destination'}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Ida' : 'Departure'}
              </label>
              <input
                type="date"
                value={departureDate}
                min={getTomorrow()}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all [color-scheme:dark]"
                data-testid="input-departure-date"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Vuelta' : 'Return'}
              </label>
              <input
                type="date"
                value={returnDate}
                min={departureDate || getTomorrow()}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all [color-scheme:dark]"
                data-testid="input-return-date"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Users className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Pasajeros' : 'Passengers'}
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all appearance-none"
                data-testid="select-passengers"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-[#1e293b]">{n} {n === 1 ? (language === 'es' ? 'adulto' : 'adult') : (language === 'es' ? 'adultos' : 'adults')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                {language === 'es' ? 'Clase' : 'Class'}
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all appearance-none"
                data-testid="select-cabin"
              >
                {cabinOptions.map(o => (
                  <option key={o.value} value={o.value} className="bg-[#1e293b]">{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full fl-btn-primary py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="button-search-flights"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Buscando...' : 'Searching...'}</>
            ) : (
              <><Search className="w-4 h-4" /> {language === 'es' ? 'Buscar Vuelos' : 'Search Flights'}</>
            )}
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm" data-testid="text-flight-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-2 border-[#0891b2]/20 border-t-[#0891b2] rounded-full animate-spin mb-4" />
            <p className="text-white/50 text-sm">{language === 'es' ? 'Buscando las mejores tarifas...' : 'Finding the best fares...'}</p>
          </div>
        )}

        {searched && !loading && offers.length === 0 && !error && (
          <div className="text-center py-16 px-4">
            <Plane className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm">{language === 'es' ? 'No se encontraron vuelos para esta ruta' : 'No flights found for this route'}</p>
          </div>
        )}

        {offers.length > 0 && (
          <div className="mx-4 mt-4">
            <p className="text-white/40 text-xs mb-3">
              {offers.length} {language === 'es' ? 'vuelos encontrados' : 'flights found'}
            </p>
            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#0891b2]/30 transition-all"
                  data-testid={`card-flight-${offer.id}`}
                >
                  <button
                    onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                    className="w-full text-left p-4"
                  >
                    {offer.slices.map((slice, si) => (
                      <div key={si} className={`flex items-center gap-3 ${si > 0 ? 'mt-3 pt-3 border-t border-white/5' : ''}`}>
                        <div className="flex-shrink-0">
                          {offer.owner.logo_symbol_url ? (
                            <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#0891b2]/20 flex items-center justify-center text-[#22d3ee] text-xs font-bold">
                              {offer.owner.iata_code}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{slice.segments?.[0] ? formatTime(slice.segments[0].departing_at) : ''}</span>
                            <span className="text-white/30 text-xs">{slice.origin.iata_code}</span>
                            <div className="flex-1 flex items-center gap-1 px-2">
                              <div className="flex-1 h-px bg-white/10" />
                              <span className="text-[10px] text-white/30 whitespace-nowrap flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {formatDuration(slice.duration)}
                              </span>
                              <div className="flex-1 h-px bg-white/10" />
                            </div>
                            <span className="text-white/30 text-xs">{slice.destination.iata_code}</span>
                            <span className="font-medium">{slice.segments?.[slice.segments.length - 1] ? formatTime(slice.segments[slice.segments.length - 1].arriving_at) : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-white/30 text-[10px]">{offer.owner.name}</span>
                            {slice.segments && slice.segments.length > 1 && (
                              <span className="text-amber-400/70 text-[10px]">
                                {slice.segments.length - 1} {language === 'es' ? 'escala(s)' : 'stop(s)'}
                              </span>
                            )}
                            {slice.segments && slice.segments.length === 1 && (
                              <span className="text-emerald-400/70 text-[10px]">
                                {language === 'es' ? 'Directo' : 'Direct'}
                              </span>
                            )}
                          </div>
                        </div>

                        {si === 0 && (
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-semibold text-[#22d3ee]">
                              ${parseFloat(offer.total_amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-[10px] text-white/30 uppercase">{offer.total_currency}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </button>

                  {expandedOffer === offer.id && (
                    <div className="px-4 pb-4 border-t border-white/5 pt-3">
                      {offer.slices.map((slice, si) => (
                        <div key={si} className={si > 0 ? 'mt-4' : ''}>
                          <div className="text-[10px] text-[#22d3ee] uppercase tracking-wider mb-2 font-medium">
                            {si === 0 ? (language === 'es' ? 'Ida' : 'Outbound') : (language === 'es' ? 'Vuelta' : 'Return')}
                          </div>
                          {slice.segments?.map((seg, segi) => (
                            <div key={segi} className="flex items-start gap-3 mb-2 last:mb-0">
                              <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-[#0891b2]" />
                                <div className="w-px h-8 bg-white/10" />
                                <div className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                              </div>
                              <div className="flex-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-white/70">{formatTime(seg.departing_at)} - {seg.origin.iata_code}</span>
                                  <span className="text-white/30">{seg.marketing_carrier?.iata_code}{seg.marketing_carrier_flight_number}</span>
                                </div>
                                <div className="text-white/20 text-[10px] my-0.5">{formatDuration(seg.duration)}</div>
                                <div className="text-white/70">{formatTime(seg.arriving_at)} - {seg.destination.iata_code}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="flex gap-2 mt-3">
                        {offer.conditions?.refund_before_departure?.allowed && (
                          <span className="text-[10px] text-emerald-400/70 bg-emerald-400/10 px-2 py-1 rounded-full">
                            {language === 'es' ? 'Reembolsable' : 'Refundable'}
                          </span>
                        )}
                        {offer.conditions?.change_before_departure?.allowed && (
                          <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2 py-1 rounded-full">
                            {language === 'es' ? 'Cambios permitidos' : 'Changes allowed'}
                          </span>
                        )}
                        {offer.cabin_class && (
                          <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full">
                            {offer.cabin_class}
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
