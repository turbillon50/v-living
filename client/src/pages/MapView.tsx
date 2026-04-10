import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api';
import {
  MapPin, Bed, Bath, Users, Star, Loader2, X, List, Layers,
  UtensilsCrossed, Waves, Hospital, ShoppingCart, GraduationCap, Plane, Music
} from 'lucide-react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';

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

let mapsInitialized = false;

async function getGoogleMaps(): Promise<typeof google> {
  if (!mapsInitialized) {
    setOptions({ apiKey: MAPS_KEY, version: 'weekly' });
    mapsInitialized = true;
  }
  await importLibrary('maps');
  await importLibrary('marker');
  await importLibrary('places');
  return google;
}

const POI_CATEGORIES = [
  { key: 'restaurant', labelEs: 'Restaurantes', labelEn: 'Restaurants', icon: UtensilsCrossed, color: '#f59e0b' },
  { key: 'beach', labelEs: 'Playas', labelEn: 'Beaches', icon: Waves, color: '#06b6d4' },
  { key: 'hospital', labelEs: 'Hospitales', labelEn: 'Hospitals', icon: Hospital, color: '#ef4444' },
  { key: 'supermarket', labelEs: 'Súper', labelEn: 'Grocery', icon: ShoppingCart, color: '#8b5cf6' },
  { key: 'school', labelEs: 'Escuelas', labelEn: 'Schools', icon: GraduationCap, color: '#3b82f6' },
  { key: 'airport', labelEs: 'Aeropuerto', labelEn: 'Airport', icon: Plane, color: '#6366f1' },
  { key: 'night_club', labelEs: 'Vida Nocturna', labelEn: 'Nightlife', icon: Music, color: '#ec4899' },
];

function createPropertyPin(title: string, active = false): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);${active ? 'transform:scale(1.2);filter:drop-shadow(0 6px 12px rgba(5,150,105,0.4));' : 'filter:drop-shadow(0 2px 6px rgba(5,150,105,0.25));'}`;

  const bubble = document.createElement('div');
  bubble.style.cssText = `display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:24px;background:${active ? 'linear-gradient(135deg,#047857,#059669,#06b6d4)' : '#059669'};color:white;font-size:11px;font-weight:600;font-family:Inter,sans-serif;white-space:nowrap;border:2px solid white;`;

  const pinIcon = document.createElement('div');
  pinIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0ZM12 11.5C10.34 11.5 9 10.16 9 8.5S10.34 5.5 12 5.5S15 6.84 15 8.5S13.66 11.5 12 11.5Z"/></svg>`;
  bubble.appendChild(pinIcon);

  const label = document.createElement('span');
  label.textContent = title.length > 18 ? title.substring(0, 16) + '…' : title;
  bubble.appendChild(label);
  wrapper.appendChild(bubble);

  const arrow = document.createElement('div');
  arrow.style.cssText = `width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${active ? '#06b6d4' : '#059669'};margin-top:-2px;`;
  wrapper.appendChild(arrow);

  return wrapper;
}

function createPOIPin(color: string, emoji: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.2));`;

  const dot = document.createElement('div');
  dot.style.cssText = `width:28px;height:28px;border-radius:50%;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:13px;`;
  dot.textContent = emoji;
  wrapper.appendChild(dot);

  return wrapper;
}

const POI_EMOJI: Record<string, string> = {
  restaurant: '🍽',
  beach: '🏖',
  hospital: '🏥',
  supermarket: '🛒',
  school: '🎓',
  airport: '✈️',
  night_club: '🎵',
};

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const poiMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyForMap | null>(null);
  const [showList, setShowList] = useState(false);
  const [activePOI, setActivePOI] = useState<string | null>(null);
  const [loadingPOI, setLoadingPOI] = useState(false);
  const { language } = useLanguage();

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['properties-map'],
    queryFn: getProperties,
  });

  const properties = (allProperties as PropertyForMap[]).filter(
    p => p.isActive && p.latitude && p.longitude &&
      !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
  );

  function clearPOIMarkers() {
    poiMarkersRef.current.forEach(m => (m.map = null));
    poiMarkersRef.current = [];
  }

  async function searchNearby(type: string) {
    if (!mapInstanceRef.current) return;
    if (activePOI === type) {
      setActivePOI(null);
      clearPOIMarkers();
      return;
    }

    setLoadingPOI(true);
    setActivePOI(type);
    clearPOIMarkers();

    try {
      const center = mapInstanceRef.current.getCenter();
      if (!center) return;

      const service = new google.maps.places.PlacesService(mapInstanceRef.current);
      const request: google.maps.places.NearbySearchRequest = {
        location: center,
        radius: 10000,
        type: type as string,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const color = POI_CATEGORIES.find(c => c.key === type)?.color || '#666';
          const emoji = POI_EMOJI[type] || '📍';

          results.slice(0, 15).forEach(place => {
            if (!place.geometry?.location) return;
            const content = createPOIPin(color, emoji);

            const marker = new google.maps.marker.AdvancedMarkerElement({
              map: mapInstanceRef.current!,
              position: place.geometry.location,
              content,
              title: place.name,
            });

            marker.addListener('click', () => {
              const ratingStars = place.rating
                ? Array.from({ length: 5 }, (_, i) =>
                    `<span style="color:${i < Math.round(place.rating!) ? '#059669' : '#ddd'};">★</span>`
                  ).join('')
                : '';
              const reviewCount = place.user_ratings_total ? `(${place.user_ratings_total})` : '';
              const openNow = place.opening_hours?.isOpen?.()
                ? '<span style="color:#059669;font-weight:600;">Abierto</span>'
                : place.opening_hours
                  ? '<span style="color:#ef4444;font-weight:600;">Cerrado</span>'
                  : '';
              const priceLevel = place.price_level !== undefined
                ? '&nbsp;&nbsp;' + '💲'.repeat(place.price_level || 1)
                : '';

              const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 200, maxHeight: 120 });

              const infoWindow = new google.maps.InfoWindow({
                content: `<div style="font-family:Inter,sans-serif;padding:0;max-width:220px;">
                  ${photoUrl ? `<img src="${photoUrl}" style="width:100%;height:100px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:8px;" />` : ''}
                  <div style="padding:${photoUrl ? '0 8px 8px' : '8px'};">
                    <p style="font-weight:700;font-size:13px;margin:0 0 4px;color:#222;">${place.name}</p>
                    ${ratingStars ? `<p style="font-size:12px;margin:0 0 3px;letter-spacing:1px;">${ratingStars} <span style="font-size:11px;color:#717171;font-weight:500;">${place.rating} ${reviewCount}</span></p>` : ''}
                    <p style="font-size:11px;color:#717171;margin:0 0 3px;">${place.vicinity || ''}</p>
                    ${openNow || priceLevel ? `<p style="font-size:11px;margin:4px 0 0;">${openNow}${priceLevel}</p>` : ''}
                  </div>
                </div>`,
                maxWidth: 240,
              });
              infoWindow.open(mapInstanceRef.current!, marker);
            });

            poiMarkersRef.current.push(marker);
          });
        }
        setLoadingPOI(false);
      });
    } catch {
      setLoadingPOI(false);
    }
  }

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
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          gestureHandling: 'greedy',
          mapId: 'fractional-living-overview',
          styles: [
            { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#c8e6f0' }] },
            { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#f0f7f0' }] },
            { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#d4edda' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 50 }] },
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        });

        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        properties.forEach(prop => {
          const lat = Number(prop.latitude);
          const lng = Number(prop.longitude);
          if (isNaN(lat) || isNaN(lng)) return;

          const content = createPropertyPin(prop.title);

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
                m.content = createPropertyPin(p.title);
              }
            });
            marker.content = createPropertyPin(prop.title, true);
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
              el.style.cssText = 'display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#059669,#06b6d4);color:white;font-size:14px;font-weight:700;font-family:Inter,sans-serif;box-shadow:0 4px 14px rgba(5,150,105,0.35);border:3px solid white;';
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
          map.fitBounds(bounds, { top: 80, right: 40, bottom: 120, left: 40 });
        }

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Failed to initialize Google Map:', err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      clearPOIMarkers();
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
      <Header />

      <div className="flex-1 relative" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
        {properties.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#059669]/10 to-[#06b6d4]/10 flex items-center justify-center mb-5">
              <MapPin className="w-10 h-10 text-[#059669]" />
            </div>
            <h2 className="text-xl font-semibold text-[#222] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Mapa de Fracciones' : 'Fractions Map'}
            </h2>
            <p className="text-sm text-[#717171] max-w-sm">
              {language === 'es'
                ? 'Las propiedades necesitan coordenadas para aparecer aquí. Agrega ubicación desde el panel de administración.'
                : 'Properties need coordinates to show here. Add location from the admin panel.'}
            </p>
            <Link href="/fractional">
              <button className="mt-6 px-6 py-3 fl-btn-primary text-sm" data-testid="back-to-listings-empty">
                {language === 'es' ? 'Ver Catálogo' : 'View Catalog'}
              </button>
            </Link>
          </div>
        ) : showList ? (
          <div className="h-full overflow-y-auto p-4 pb-24 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#222]">
                {properties.length} {language === 'es' ? 'propiedades' : 'properties'}
              </h2>
              <button
                onClick={() => setShowList(false)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#059669] hover:underline"
                data-testid="switch-to-map"
              >
                <Layers className="w-3.5 h-3.5" />
                {language === 'es' ? 'Ver mapa' : 'View map'}
              </button>
            </div>
            {properties.map(prop => (
              <PropertyListCard key={prop.id} property={prop} language={language} />
            ))}
          </div>
        ) : (
          <>
            <div ref={mapRef} className="w-full h-full" data-testid="map-container" />

            <div className="absolute top-2 left-0 right-0 z-10 px-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {POI_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activePOI === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => searchNearby(cat.key)}
                      disabled={loadingPOI && activePOI !== cat.key}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-md'
                          : 'bg-white/95 text-[#222] border border-[#ddd] shadow-sm hover:shadow-md'
                      } ${loadingPOI && activePOI !== cat.key ? 'opacity-50' : ''}`}
                      data-testid={`poi-${cat.key}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {language === 'es' ? cat.labelEs : cat.labelEn}
                      {loadingPOI && isActive && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowList(true)}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-5 py-3 bg-[#222] text-white rounded-full text-sm font-medium shadow-xl hover:bg-[#333] transition-colors"
              data-testid="toggle-list-view"
            >
              <List className="w-4 h-4" />
              {language === 'es' ? 'Ver lista' : 'View list'}
            </button>

            {selectedProperty && (
              <div className="absolute bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-[1000]">
                <PropertyCard
                  property={selectedProperty}
                  language={language}
                  onClose={() => {
                    setSelectedProperty(null);
                    markersRef.current.forEach((m, id) => {
                      const p = properties.find(pr => pr.id === id);
                      if (p) {
                        m.content = createPropertyPin(p.title);
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

function PropertyCard({ property, language, onClose }: { property: PropertyForMap; language: string; onClose: () => void }) {
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
                <Star className="w-3.5 h-3.5 fill-[#059669] text-[#059669]" />
                <span className="text-xs font-medium text-[#222]">5.0</span>
              </div>
              <h3 className="text-sm font-medium text-[#222] line-clamp-2 leading-tight">{property.title}</h3>
              <p className="text-xs text-[#717171] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#059669]" />
                {property.location}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs text-[#717171]">
                <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#717171]">
                <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#717171]">
                <Users className="w-3.5 h-3.5" /> {property.maxGuests}
              </div>
            </div>
            <p className="text-sm mt-2">
              <span className="font-semibold text-[#059669]">${(price / 1000).toFixed(0)}K</span>
              <span className="text-[#717171] text-xs ml-1">{currency} / {language === 'es' ? 'fracción' : 'fraction'}</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function PropertyListCard({ property, language }: { property: PropertyForMap; language: string }) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400';
  const price = property.fractionPrice || 0;
  const currency = property.currency || 'MXN';

  return (
    <Link href={`/fractional/${property.id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#ebebeb] hover:shadow-md transition-shadow cursor-pointer flex" data-testid={`list-property-${property.id}`}>
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <img src={image} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#222] line-clamp-1">{property.title}</h3>
            <p className="text-xs text-[#717171] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#059669]" /> {property.location}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-[#717171]">
              <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#717171]">
              <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
            </div>
          </div>
          <p className="text-sm mt-1">
            <span className="font-semibold text-[#059669]">${(price / 1000).toFixed(0)}K</span>
            <span className="text-[#717171] text-xs ml-1">{currency}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
