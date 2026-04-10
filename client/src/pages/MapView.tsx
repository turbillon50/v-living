import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api';
import {
  ChevronLeft, MapPin, Bed, Bath, Users, Star, Loader2, X, Layers, List
} from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyForMap {
  id: string;
  title: string;
  subtitle: string | null;
  location: string;
  latitude: string | null;
  longitude: string | null;
  images: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  fractionPrice: number | null;
  currency: string | null;
  isActive: boolean | null;
  isFeatured: boolean | null;
}

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

let loaderPromise: Promise<typeof google> | null = null;

function getGoogleMaps(): Promise<typeof google> {
  if (!loaderPromise) {
    const loader = new Loader({ apiKey: MAPS_KEY, version: 'weekly', libraries: ['places', 'marker'] });
    loaderPromise = loader.load();
  }
  return loaderPromise;
}

function formatPrice(price: number): string {
  return `$${(price / 1000).toFixed(0)}K`;
}

function createPinElement(price: number, active = false): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all 0.2s;${active ? 'transform:scale(1.15);' : ''}`;

  const pill = document.createElement('div');
  pill.style.cssText = `display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;background:${active ? 'linear-gradient(135deg,#059669,#06b6d4)' : '#059669'};color:white;font-size:11px;font-weight:600;font-family:Inter,sans-serif;box-shadow:${active ? '0 4px 14px rgba(5,150,105,0.4)' : '0 2px 8px rgba(5,150,105,0.25)'};white-space:nowrap;`;
  pill.textContent = formatPrice(price);
  wrapper.appendChild(pill);

  const pin = document.createElement('div');
  pin.style.cssText = `width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${active ? '#06b6d4' : '#059669'};margin-top:-1px;`;
  wrapper.appendChild(pin);

  return wrapper;
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyForMap | null>(null);
  const [showList, setShowList] = useState(false);

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['properties-map'],
    queryFn: getProperties,
  });

  const properties = (allProperties as PropertyForMap[]).filter(
    p => p.isActive && p.latitude && p.longitude &&
      !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || properties.length === 0) return;

    let cancelled = false;

    async function initMap() {
      try {
        if (!MAPS_KEY || cancelled || !mapRef.current) return;

        const google = await getGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const defaultCenter = { lat: 20.2114, lng: -87.4654 };
        const firstLat = Number(properties[0]?.latitude);
        const firstLng = Number(properties[0]?.longitude);
        const center = (!isNaN(firstLat) && !isNaN(firstLng))
          ? { lat: firstLat, lng: firstLng }
          : defaultCenter;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          mapId: 'fractional-living-overview',
        });

        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        properties.forEach(prop => {
          const lat = Number(prop.latitude);
          const lng = Number(prop.longitude);
          if (isNaN(lat) || isNaN(lng)) return;

          const content = createPinElement(prop.fractionPrice || 0);

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content,
          });

          marker.addListener('click', () => {
            setSelectedProperty(prop);
            markersRef.current.forEach((m, id) => {
              const p = properties.find(pr => pr.id === id);
              if (p) {
                m.content = createPinElement(p.fractionPrice || 0);
              }
            });
            marker.content = createPinElement(prop.fractionPrice || 0, true);
          });

          markers.push(marker);
          markersRef.current.set(prop.id, marker);
        });

        const clusterer = new MarkerClusterer({
          map,
          markers,
          renderer: {
            render: ({ count, position }) => {
              const el = document.createElement('div');
              el.style.cssText = 'display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#059669,#06b6d4);color:white;font-size:13px;font-weight:600;font-family:Inter,sans-serif;box-shadow:0 2px 10px rgba(5,150,105,0.3);border:3px solid white;';
              el.textContent = String(count);
              return new google.maps.marker.AdvancedMarkerElement({
                position,
                content: el,
              });
            },
          },
        });

        clustererRef.current = clusterer;

        if (properties.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          properties.forEach(p => {
            bounds.extend({ lat: Number(p.latitude), lng: Number(p.longitude) });
          });
          map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
        }

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Failed to initialize Google Map:', err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      mapInstanceRef.current = null;
      markersRef.current.clear();
    };
  }, [properties]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafcfd]">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#fafcfd]" data-testid="map-view-page">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0]/60">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="h-14 flex items-center justify-between">
            <Link href="/fractional">
              <button className="flex items-center gap-2 text-sm font-light hover:bg-[#f0fdfa] px-3 py-2 rounded-xl transition-colors duration-200 text-[#64748b]" data-testid="back-to-listings">
                <ChevronLeft className="w-4 h-4" />
                <span className="tracking-wide">Propiedades</span>
              </button>
            </Link>
            <h1 className="text-sm font-medium text-[#111]">{properties.length} propiedades en el mapa</h1>
            <button
              onClick={() => setShowList(!showList)}
              className="flex items-center gap-2 text-sm font-light hover:bg-[#f0fdfa] px-3 py-2 rounded-xl transition-colors text-[#64748b]"
              data-testid="toggle-list-view"
            >
              {showList ? <Layers className="w-4 h-4" /> : <List className="w-4 h-4" />}
              <span className="hidden sm:inline">{showList ? 'Mapa' : 'Lista'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 relative">
        {properties.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <MapPin className="w-16 h-16 text-[#ccc] mb-4" />
            <h2 className="text-lg font-medium text-[#333] mb-2">No hay propiedades en el mapa</h2>
            <p className="text-sm text-[#888] font-light max-w-md">Las propiedades necesitan coordenadas para aparecer en el mapa. Agrega latitud y longitud desde el panel de creador.</p>
            <Link href="/fractional">
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white text-sm rounded-xl hover:opacity-90 transition-opacity" data-testid="back-to-listings-empty">
                Ver propiedades
              </button>
            </Link>
          </div>
        ) : showList ? (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {properties.map(prop => (
              <PropertyListCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <>
            <div ref={mapRef} className="w-full h-full" data-testid="map-container" />

            {selectedProperty && (
              <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-[1000]">
                <PropertyCard
                  property={selectedProperty}
                  onClose={() => {
                    setSelectedProperty(null);
                    markersRef.current.forEach((m, id) => {
                      const p = properties.find(pr => pr.id === id);
                      if (p) {
                        m.content = createPinElement(p.fractionPrice || 0);
                      }
                    });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property, onClose }: { property: PropertyForMap; onClose: () => void }) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400';
  const price = property.fractionPrice || 0;
  const currency = property.currency || 'MXN';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e2e8f0]/60 animate-in slide-in-from-bottom-4 duration-300" data-testid={`map-property-card-${property.id}`}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        data-testid="close-property-card"
      >
        <X className="w-4 h-4 text-[#333]" />
      </button>
      <Link href={`/fractional/${property.id}`}>
        <div className="flex cursor-pointer">
          <div className="w-[140px] h-[140px] flex-shrink-0">
            <img src={image} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 fill-[#111] text-[#111]" />
                <span className="text-xs font-medium text-[#111]">5.0</span>
              </div>
              <h3 className="text-sm font-medium text-[#111] line-clamp-2 leading-tight">{property.title}</h3>
              <p className="text-xs text-[#888] font-light mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <Users className="w-3.5 h-3.5" /> {property.maxGuests}
              </div>
            </div>
            <p className="text-sm mt-2">
              <span className="font-semibold text-[#111]">${(price / 1000).toFixed(0)}K</span>
              <span className="text-[#888] font-light text-xs ml-1">{currency} / semana</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function PropertyListCard({ property }: { property: PropertyForMap }) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400';
  const price = property.fractionPrice || 0;
  const currency = property.currency || 'MXN';

  return (
    <Link href={`/fractional/${property.id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#f0f0f0] hover:shadow-md transition-shadow cursor-pointer flex" data-testid={`list-property-${property.id}`}>
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <img src={image} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#111] line-clamp-1">{property.title}</h3>
            <p className="text-xs text-[#888] font-light mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {property.location}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-[#666]">
              <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#666]">
              <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
            </div>
          </div>
          <p className="text-sm mt-1">
            <span className="font-semibold text-[#111]">${(price / 1000).toFixed(0)}K</span>
            <span className="text-[#888] font-light text-xs ml-1">{currency}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
