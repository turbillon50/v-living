import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { ArrowLeft, Hotel, Search, MapPin, Calendar, Users, Loader2, Star, Info, Shield, Sparkles, Award, Heart } from 'lucide-react';

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
  { name: 'Cancun', lat: 21.1619, lng: -86.8515, img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=300&fit=crop', desc: 'Riviera Maya' },
  { name: 'Tulum', lat: 20.2114, lng: -87.4654, img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop', desc: 'Quintana Roo' },
  { name: 'Playa del Carmen', lat: 20.6296, lng: -87.0739, img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop', desc: 'Riviera Maya' },
  { name: 'Miami', lat: 25.7617, lng: -80.1918, img: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=300&fit=crop', desc: 'Florida, USA' },
  { name: 'Punta Cana', lat: 18.5601, lng: -68.3725, img: 'https://images.unsplash.com/photo-1590523278191-995a2e635a28?w=400&h=300&fit=crop', desc: 'Rep. Dominicana' },
  { name: 'Los Cabos', lat: 22.8905, lng: -109.9167, img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop', desc: 'Baja California' },
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
    <div className="min-h-screen bg-white text-[#222]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[380px] md:h-[440px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&h=600&fit=crop)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#059669]/10 via-transparent to-[#059669]/10" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-12">
            <div className="fl-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#059669]/30">
                <Hotel className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#059669] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living Stays</p>
              <h1 className="text-4xl md:text-5xl text-[#222] tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-hotels-title">
                {language === 'es' ? 'Hoteles de Lujo' : 'Luxury Hotels'}
              </h1>
              <p className="text-[#717171] text-sm font-light max-w-lg mx-auto mb-6">
                {language === 'es' 
                  ? 'Descubre los mejores resorts y hoteles boutique en el Caribe. Hospedaje premium para miembros Fractional Living.' 
                  : 'Discover the best resorts and boutique hotels in the Caribbean. Premium accommodation for Fractional Living members.'}
              </p>
              <div className="flex items-center justify-center gap-6 text-[10px] text-[#999] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Award className="w-3 h-3 text-[#059669]" /> {language === 'es' ? 'Resorts premium' : 'Premium resorts'}</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#059669]" /> {language === 'es' ? 'Precio garantizado' : 'Price guaranteed'}</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#059669]" /> {language === 'es' ? 'Experiencia VIP' : 'VIP experience'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-32 max-w-4xl mx-auto -mt-6 relative z-20">
        <div className="mx-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] font-medium mb-1">
                {language === 'es' ? 'Destinos' : 'Destinations'}
              </p>
              <h3 className="text-[#222] text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                {language === 'es' ? 'Caribe y Más' : 'Caribbean & More'}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSelectedDest(dest)}
                className={`group relative rounded-2xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                  selectedDest?.name === dest.name
                    ? 'border-[#059669] shadow-lg shadow-[#059669]/20 scale-[1.02]'
                    : 'border-transparent hover:border-[#ddd]'
                }`}
                data-testid={`button-dest-${dest.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                {selectedDest?.name === dest.name && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-white text-[11px] font-medium block leading-tight">{dest.name}</span>
                  <span className="text-white/60 text-[9px]">{dest.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 bg-[#f7f7f7] border border-[#ebebeb] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[#444] text-sm font-medium tracking-wide">
              {language === 'es' ? 'Buscar Hospedaje' : 'Search Accommodation'}
            </h2>
            {selectedDest && (
              <div className="ml-auto flex items-center gap-1.5 text-[#059669] text-xs bg-[#059669]/10 px-3 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                <span className="font-medium">{selectedDest.name}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={getTomorrow()}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all"
                data-testid="input-checkin"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || getDayAfter()}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all"
                data-testid="input-checkout"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                {language === 'es' ? 'Habitaciones' : 'Rooms'}
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full bg-white border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all appearance-none"
                data-testid="select-rooms"
              >
                {[1,2,3,4].map(n => (
                  <option key={n} value={n} className="bg-white text-[#222]">{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#999] uppercase tracking-wider mb-1.5">
                <Users className="w-3 h-3 inline mr-1" />
                {language === 'es' ? 'Huéspedes' : 'Guests'}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-white border border-[#ebebeb] rounded-xl px-3 py-3 text-[#222] text-sm focus:outline-none focus:border-[#059669]/50 transition-all appearance-none"
                data-testid="select-guests"
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n} className="bg-white text-[#222]">{n}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={searchHotels}
            disabled={loading || !selectedDest}
            className="w-full py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#059669] transition-all shadow-lg shadow-[#059669]/25 text-white"
            data-testid="button-search-hotels"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Buscando hoteles...' : 'Searching hotels...'}</>
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
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
              <Hotel className="w-6 h-6 text-[#059669] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[#717171] text-sm mt-4">{language === 'es' ? 'Buscando hoteles disponibles...' : 'Finding available hotels...'}</p>
            <p className="text-[#ccc] text-[10px] mt-1">{language === 'es' ? 'Comparando precios en tiempo real' : 'Comparing prices in real time'}</p>
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && !message && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669]/10 to-[#06b6d4]/10 flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-8 h-8 text-[#059669]/30" />
            </div>
            <p className="text-[#999] text-sm">{language === 'es' ? 'No se encontraron hoteles disponibles' : 'No hotels available'}</p>
            <p className="text-[#ccc] text-xs mt-1">{language === 'es' ? 'Intenta con otras fechas o destinos' : 'Try different dates or destinations'}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mx-4 mt-6" data-testid="section-hotel-results">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#059669] text-[10px] uppercase tracking-[0.25em] font-medium mb-1">
                  {language === 'es' ? 'Resultados' : 'Results'}
                </p>
                <h3 className="text-[#222] text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                  {results.length} {language === 'es' ? 'hoteles encontrados' : 'hotels found'}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((hotel, idx) => (
                <div
                  key={hotel.id}
                  className={`bg-[#f7f7f7] border rounded-2xl overflow-hidden hover:border-[#059669]/30 transition-all group ${idx === 0 ? 'border-[#059669]/20 sm:col-span-2' : 'border-[#ebebeb]'}`}
                  data-testid={`card-hotel-${hotel.id}`}
                >
                  {hotel.accommodation?.photos?.[0]?.url && (
                    <div className={`relative ${idx === 0 ? 'h-56' : 'h-44'}`}>
                      <img
                        src={hotel.accommodation.photos[0].url}
                        alt={hotel.accommodation.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      {hotel.accommodation?.rating && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          {hotel.accommodation.rating.value}
                        </div>
                      )}
                      {idx === 0 && (
                        <div className="absolute top-3 left-3 bg-white/80 text-[#222] text-[10px] font-medium px-2.5 py-1 rounded-lg tracking-wider uppercase">
                          {language === 'es' ? 'Recomendado' : 'Recommended'}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-[#222] font-semibold text-sm mb-1.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
                      {hotel.accommodation?.name}
                    </h3>
                    {hotel.accommodation?.location && (
                      <p className="text-[#999] text-xs flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-[#059669]" />
                        {hotel.accommodation.location.city_name || hotel.accommodation.location.address}
                      </p>
                    )}
                    {hotel.accommodation?.description && (
                      <p className="text-[#bbb] text-xs line-clamp-2 mb-4">{hotel.accommodation.description}</p>
                    )}
                    <div className="flex items-end justify-between">
                      {hotel.cheapest_rate_total_amount ? (
                        <div>
                          <span className="text-xl font-semibold bg-gradient-to-r from-[#059669] to-[#06b6d4] bg-clip-text text-transparent">
                            ${parseFloat(hotel.cheapest_rate_total_amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[#bbb] text-xs ml-1">{hotel.cheapest_rate_currency}</span>
                          <span className="text-[#ccc] text-[10px] block">
                            {language === 'es' ? 'por estancia' : 'per stay'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#bbb] text-xs">{language === 'es' ? 'Precio no disponible' : 'Price not available'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && !loading && results.length === 0 && message && (
          <div className="mx-4 mt-6 bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669]/10 to-[#06b6d4]/10 flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-8 h-8 text-[#059669]/30" />
            </div>
            <h3 className="text-[#555] text-sm font-medium mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Hoteles en modo prueba' : 'Hotels in test mode'}
            </h3>
            <p className="text-[#bbb] text-xs leading-relaxed max-w-sm mx-auto">
              {language === 'es'
                ? 'La API de hoteles está en modo test. Los resultados reales estarán disponibles cuando se active en modo live.'
                : 'The hotels API is in test mode. Real results will be available when activated in live mode.'}
            </p>
          </div>
        )}

        {!searched && !loading && (
          <div className="mx-4 mt-8 grid grid-cols-3 gap-3" data-testid="section-hotel-trust-badges">
            {[
              { icon: Award, title: language === 'es' ? 'Hoteles 5 Estrellas' : '5 Star Hotels', desc: language === 'es' ? 'Los mejores del Caribe' : 'Best in the Caribbean' },
              { icon: Shield, title: language === 'es' ? 'Precio Garantizado' : 'Price Guaranteed', desc: language === 'es' ? 'Sin cargos ocultos' : 'No hidden charges' },
              { icon: Sparkles, title: language === 'es' ? 'Trato VIP' : 'VIP Treatment', desc: language === 'es' ? 'Beneficios exclusivos' : 'Exclusive benefits' },
            ].map((item, i) => (
              <div key={i} className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-4 text-center" data-testid={`badge-hotel-trust-${i}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669]/20 to-[#06b6d4]/20 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-[#059669]" />
                </div>
                <p className="text-[#444] text-xs font-medium mb-0.5">{item.title}</p>
                <p className="text-[#bbb] text-[10px]">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <AGHFooter />
    </div>
  );
}
