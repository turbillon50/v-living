import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { ArrowLeft, Hotel, Search, MapPin, Calendar, Users, Loader2, Star, Info } from 'lucide-react';

interface HotelResult {
  id: string;
  accommodation: {
    name: string;
    description: string;
    photos: Array<{ url: string }>;
    rating: { value: number; source: string };
    location: { address: string; city_name: string; country_code: string };
  };
  cheapest_rate_total_amount: string | null;
  cheapest_rate_currency: string;
}

const POPULAR_DESTINATIONS = [
  { name: 'Cancun', lat: 21.1619, lng: -86.8515, img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=300&h=200&fit=crop' },
  { name: 'Tulum', lat: 20.2114, lng: -87.4654, img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=200&fit=crop' },
  { name: 'Playa del Carmen', lat: 20.6296, lng: -87.0739, img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=300&h=200&fit=crop' },
  { name: 'Miami', lat: 25.7617, lng: -80.1918, img: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=300&h=200&fit=crop' },
  { name: 'Punta Cana', lat: 18.5601, lng: -68.3725, img: 'https://images.unsplash.com/photo-1590523278191-995a2e635a28?w=300&h=200&fit=crop' },
  { name: 'Los Cabos', lat: 22.8905, lng: -109.9167, img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=300&h=200&fit=crop' },
];

export default function Hotels() {
  const { language } = useLanguage();
  const [selectedDest, setSelectedDest] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [results, setResults] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState('');

  const searchHotels = async () => {
    if (!selectedDest || !checkIn || !checkOut) {
      setError(language === 'es' ? 'Selecciona destino, check-in y check-out' : 'Select destination, check-in and check-out');
      return;
    }
    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);
    setMessage('');

    try {
      const guestList: any[] = [];
      for (let i = 0; i < guests; i++) guestList.push({ type: 'adult' });

      const res = await fetch('/api/duffel/stays/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: { coordinates: { lat: selectedDest.lat, lng: selectedDest.lng } },
          check_in_date: checkIn,
          check_out_date: checkOut,
          rooms,
          guests: guestList,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results || []);
      if (data.message) setMessage(data.message);
    } catch (e: any) {
      setError(e.message || 'Error buscando hoteles');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfter = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <Header />

      <main className="pb-32 max-w-4xl mx-auto">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <Link href="/home">
            <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back-hotels">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2" data-testid="text-hotels-title">
              <Hotel className="w-5 h-5 text-[#22d3ee]" />
              {language === 'es' ? 'Hoteles' : 'Hotels'}
            </h1>
            <p className="text-white/40 text-xs">
              {language === 'es' ? 'Encuentra hospedaje en los mejores destinos' : 'Find accommodation in the best destinations'}
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
            {language === 'es' ? 'Destinos populares' : 'Popular destinations'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSelectedDest(dest)}
                className={`flex-shrink-0 relative rounded-xl overflow-hidden w-28 h-20 border-2 transition-all ${
                  selectedDest?.name === dest.name
                    ? 'border-[#0891b2] shadow-lg shadow-[#0891b2]/20'
                    : 'border-transparent hover:border-white/20'
                }`}
                data-testid={`button-dest-${dest.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[11px] font-medium text-white">{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          {selectedDest && (
            <div className="flex items-center gap-2 mb-3 text-[#22d3ee] text-sm">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{selectedDest.name}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={getTomorrow()}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all [color-scheme:dark]"
                data-testid="input-checkin"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || getDayAfter()}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all [color-scheme:dark]"
                data-testid="input-checkout"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                {language === 'es' ? 'Habitaciones' : 'Rooms'}
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all appearance-none"
                data-testid="select-rooms"
              >
                {[1,2,3,4].map(n => (
                  <option key={n} value={n} className="bg-[#1e293b]">{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <Users className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Huespedes' : 'Guests'}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#0891b2]/50 transition-all appearance-none"
                data-testid="select-guests"
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n} className="bg-[#1e293b]">{n}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={searchHotels}
            disabled={loading || !selectedDest}
            className="w-full fl-btn-primary py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="button-search-hotels"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Buscando...' : 'Searching...'}</>
            ) : (
              <><Search className="w-4 h-4" /> {language === 'es' ? 'Buscar Hoteles' : 'Search Hotels'}</>
            )}
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm" data-testid="text-hotel-error">
            {error}
          </div>
        )}

        {message && (
          <div className="mx-4 mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400 text-sm flex items-start gap-2" data-testid="text-hotel-message">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {message}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-2 border-[#0891b2]/20 border-t-[#0891b2] rounded-full animate-spin mb-4" />
            <p className="text-white/50 text-sm">{language === 'es' ? 'Buscando hoteles disponibles...' : 'Finding available hotels...'}</p>
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && !message && (
          <div className="text-center py-16 px-4">
            <Hotel className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm">{language === 'es' ? 'No se encontraron hoteles disponibles' : 'No hotels available'}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mx-4 mt-4">
            <p className="text-white/40 text-xs mb-3">
              {results.length} {language === 'es' ? 'hoteles encontrados' : 'hotels found'}
            </p>
            <div className="space-y-3">
              {results.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#0891b2]/30 transition-all"
                  data-testid={`card-hotel-${hotel.id}`}
                >
                  {hotel.accommodation?.photos?.[0]?.url && (
                    <div className="relative h-40">
                      <img
                        src={hotel.accommodation.photos[0].url}
                        alt={hotel.accommodation.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
                      {hotel.accommodation?.rating && (
                        <div className="absolute top-3 right-3 bg-[#0891b2] text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {hotel.accommodation.rating.value}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">{hotel.accommodation?.name}</h3>
                    {hotel.accommodation?.location && (
                      <p className="text-white/40 text-xs flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {hotel.accommodation.location.city_name || hotel.accommodation.location.address}
                      </p>
                    )}
                    {hotel.accommodation?.description && (
                      <p className="text-white/30 text-xs line-clamp-2 mb-3">{hotel.accommodation.description}</p>
                    )}
                    <div className="flex items-end justify-between">
                      {hotel.cheapest_rate_total_amount ? (
                        <div>
                          <span className="text-lg font-semibold text-[#22d3ee]">
                            ${parseFloat(hotel.cheapest_rate_total_amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-white/30 text-xs ml-1">{hotel.cheapest_rate_currency}</span>
                          <span className="text-white/20 text-[10px] block">
                            {language === 'es' ? 'por estancia' : 'per stay'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/30 text-xs">{language === 'es' ? 'Precio no disponible' : 'Price not available'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && !loading && results.length === 0 && message && (
          <div className="mx-4 mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Hotel className="w-10 h-10 text-[#0891b2]/30 mx-auto mb-3" />
            <h3 className="text-white/70 text-sm font-medium mb-2">
              {language === 'es' ? 'Hoteles en modo prueba' : 'Hotels in test mode'}
            </h3>
            <p className="text-white/30 text-xs leading-relaxed">
              {language === 'es'
                ? 'La API de hoteles est\u00e1 en modo test. Los resultados reales estar\u00e1n disponibles cuando se active en modo live.'
                : 'The hotels API is in test mode. Real results will be available when activated in live mode.'}
            </p>
          </div>
        )}
      </main>

      <AGHFooter />
    </div>
  );
}
