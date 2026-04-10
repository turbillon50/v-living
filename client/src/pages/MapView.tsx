import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api';
import {
  MapPin, Bed, Bath, Users, Star, Loader2, X, List, Layers,
  UtensilsCrossed, Waves, Hospital, ShoppingCart, GraduationCap, Plane, Music,
  ChevronRight, Clock, DollarSign
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

function createFLMarker(active = false): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);${active ? 'transform:scale(1.25);' : ''}`;

  const pin = document.createElement('div');
  pin.style.cssText = `
    width:${active ? '52px' : '44px'};
    height:${active ? '52px' : '44px'};
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:linear-gradient(135deg,#047857 0%,#059669 40%,#0d9488 70%,#06b6d4 100%);
    display:flex;align-items:center;justify-content:center;
    box-shadow:${active ? '0 8px 24px rgba(5,150,105,0.5),0 0 0 4px rgba(5,150,105,0.15)' : '0 4px 12px rgba(5,150,105,0.35),0 0 0 3px rgba(255,255,255,0.9)'};
    border:2.5px solid white;
    position:relative;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    transform:rotate(45deg);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    color:white;font-family:'Cormorant Garamond',Georgia,serif;
    line-height:1;
  `;
  inner.innerHTML = `<span style="font-size:${active ? '18px' : '15px'};font-weight:700;letter-spacing:1px;">FL</span>`;
  pin.appendChild(inner);
  wrapper.appendChild(pin);

  if (active) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position:absolute;top:50%;left:50%;
      width:70px;height:70px;
      margin-top:-35px;margin-left:-35px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(5,150,105,0.15) 0%,transparent 70%);
      animation:flPulse 2s ease-out infinite;
      pointer-events:none;z-index:-1;
    `;
    wrapper.style.position = 'relative';
    wrapper.insertBefore(pulse, pin);
  }

  return wrapper;
}

function createFLCluster(count: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    width:54px;height:54px;border-radius:50%;
    background:linear-gradient(135deg,#047857,#059669 50%,#06b6d4);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    border:3px solid white;
    box-shadow:0 4px 16px rgba(5,150,105,0.4);
    cursor:pointer;
    font-family:Inter,sans-serif;
  `;
  wrapper.innerHTML = `
    <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:1px;font-family:'Cormorant Garamond',Georgia,serif;line-height:1;">FL</span>
    <span style="font-size:16px;font-weight:700;color:white;line-height:1;margin-top:1px;">${count}</span>
  `;
  return wrapper;
}

function createPOIMarker(color: string, emoji: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;`;

  const dot = document.createElement('div');
  dot.style.cssText = `
    width:32px;height:32px;border-radius:50%;
    background:${color};border:2.5px solid white;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;
    box-shadow:0 2px 8px rgba(0,0,0,0.2);
    transition:transform 0.2s;
  `;
  dot.textContent = emoji;
  dot.onmouseenter = () => { dot.style.transform = 'scale(1.15)'; };
  dot.onmouseleave = () => { dot.style.transform = 'scale(1)'; };
  wrapper.appendChild(dot);

  return wrapper;
}

const POI_EMOJI: Record<string, string> = {
  restaurant: '🍽️',
  beach: '🏖️',
  hospital: '🏥',
  supermarket: '🛒',
  school: '🎓',
  airport: '✈️',
  night_club: '🎵',
};

const MAP_STYLES = [
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b8dce8' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6b9daf' }] },
  { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#eef5ee' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#d4edda' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#fafafa' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c8d6c8' }] },
];

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
            const content = createPOIMarker(color, emoji);

            const marker = new google.maps.marker.AdvancedMarkerElement({
              map: mapInstanceRef.current!,
              position: place.geometry.location,
              content,
              title: place.name,
            });

            marker.addListener('click', () => {
              const stars = place.rating
                ? Array.from({ length: 5 }, (_, i) =>
                    `<span style="color:${i < Math.round(place.rating!) ? '#059669' : '#e0e0e0'};font-size:13px;">★</span>`
                  ).join('')
                : '';
              const reviews = place.user_ratings_total ? `<span style="color:#717171;font-size:11px;margin-left:4px;">(${place.user_ratings_total})</span>` : '';
              const isOpen = place.opening_hours?.isOpen?.();
              const openLabel = isOpen !== undefined
                ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;color:${isOpen ? '#059669' : '#ef4444'};background:${isOpen ? '#f0fdf4' : '#fef2f2'};padding:2px 8px;border-radius:10px;margin-top:6px;">${isOpen ? '● Abierto' : '● Cerrado'}</span>`
                : '';
              const price = place.price_level !== undefined && place.price_level > 0
                ? `<span style="font-size:10px;color:#717171;margin-left:6px;">${'$'.repeat(place.price_level)}</span>`
                : '';
              const photo = place.photos?.[0]?.getUrl({ maxWidth: 280, maxHeight: 140 });

              const infoContent = `
                <div style="font-family:Inter,sans-serif;margin:0;padding:0;max-width:260px;overflow:hidden;">
                  ${photo ? `<div style="width:100%;height:120px;overflow:hidden;border-radius:10px 10px 0 0;"><img src="${photo}" style="width:100%;height:100%;object-fit:cover;" /></div>` : ''}
                  <div style="padding:10px 12px 12px;">
                    <p style="font-weight:700;font-size:14px;margin:0 0 4px;color:#222;line-height:1.3;">${place.name}</p>
                    ${stars ? `<div style="margin:0 0 4px;line-height:1;">${stars}<span style="font-size:12px;font-weight:600;color:#222;margin-left:4px;">${place.rating}</span>${reviews}</div>` : ''}
                    <p style="font-size:11px;color:#717171;margin:0;line-height:1.4;">${place.vicinity || ''}</p>
                    <div style="display:flex;align-items:center;gap:4px;margin-top:4px;">${openLabel}${price}</div>
                  </div>
                </div>`;

              const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                maxWidth: 280,
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
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          gestureHandling: 'greedy',
          mapId: 'fractional-living-overview',
          styles: MAP_STYLES,
        });

        const style = document.createElement('style');
        style.textContent = `@keyframes flPulse{0%{transform:scale(0.8);opacity:0.6}50%{transform:scale(1.2);opacity:0.3}100%{transform:scale(1.6);opacity:0}}`;
        document.head.appendChild(style);

        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        properties.forEach(prop => {
          const lat = Number(prop.latitude);
          const lng = Number(prop.longitude);
          if (isNaN(lat) || isNaN(lng)) return;

          const content = createFLMarker();

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content,
            title: prop.title,
          });

          marker.addListener('click', () => {
            setSelectedProperty(prop);
            markersRef.current.forEach((m, id) => {
              const p = properties.find(pr => pr.id === id);
              if (p) m.content = createFLMarker(false);
            });
            marker.content = createFLMarker(true);
          });

          markers.push(marker);
          markersRef.current.set(prop.id, marker);
        });

        const clusterer = new MarkerClusterer({
          map,
          markers,
          renderer: {
            render: ({ count, position }) => {
              return new google.maps.marker.AdvancedMarkerElement({
                position,
                content: createFLCluster(count),
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
                {properties.length} {language === 'es' ? 'fracciones' : 'fractions'}
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
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all backdrop-blur-lg ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-white/90 text-[#222] border border-[#e0e0e0] shadow-sm hover:shadow-md hover:bg-white'
                      } ${loadingPOI && activePOI !== cat.key ? 'opacity-40' : ''}`}
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
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-6 py-3 bg-[#222] text-white rounded-full text-sm font-semibold shadow-2xl hover:bg-[#333] transition-all active:scale-95"
              data-testid="toggle-list-view"
            >
              <List className="w-4 h-4" />
              {language === 'es' ? 'Ver lista' : 'View list'}
            </button>

            {selectedProperty && (
              <div className="absolute bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:w-[400px] z-[1000]">
                <PropertyCard
                  property={selectedProperty}
                  language={language}
                  onClose={() => {
                    setSelectedProperty(null);
                    markersRef.current.forEach((m, id) => {
                      const p = properties.find(pr => pr.id === id);
                      if (p) m.content = createFLMarker(false);
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
  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'];
  const price = property.fractionPrice || 0;
  const currency = property.currency || 'MXN';
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8e8e8] animate-in slide-in-from-bottom-4 duration-300" data-testid={`map-property-card-${property.id}`}>
      <div className="relative">
        <img
          src={images[imgIdx]}
          alt={property.title}
          className="w-full h-[180px] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          data-testid="close-property-card"
        >
          <X className="w-4 h-4 text-[#333]" />
        </button>

        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-[#059669] to-[#06b6d4] rounded-full shadow-lg">
          <span className="text-white text-[10px] font-bold tracking-wider" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            FRACTIONAL LIVING
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl px-3 py-2 shadow-lg">
            <p className="text-[10px] text-[#717171] font-medium leading-none mb-0.5">
              {language === 'es' ? 'Desde' : 'From'}
            </p>
            <p className="text-sm font-bold text-[#059669] leading-none">
              ${(price / 1000).toFixed(0)}K <span className="text-[10px] font-normal text-[#717171]">{currency}</span>
            </p>
          </div>
        </div>
      </div>

      <Link href={`/fractional/${property.id}`}>
        <div className="px-4 py-3 cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-[#222] truncate">{property.title}</h3>
              <p className="text-xs text-[#717171] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#059669] flex-shrink-0" />
                <span className="truncate">{property.location}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#059669] text-[#059669]" />
              <span className="text-xs font-semibold text-[#222]">5.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#f0f0f0]">
            <div className="flex items-center gap-1.5 text-xs text-[#555]">
              <Bed className="w-3.5 h-3.5 text-[#059669]" />
              <span>{property.bedrooms} {language === 'es' ? 'hab' : 'bed'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#555]">
              <Bath className="w-3.5 h-3.5 text-[#059669]" />
              <span>{property.bathrooms} {language === 'es' ? 'baños' : 'bath'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#555]">
              <Users className="w-3.5 h-3.5 text-[#059669]" />
              <span>{property.maxGuests}</span>
            </div>
            <div className="ml-auto">
              <ChevronRight className="w-4 h-4 text-[#059669]" />
            </div>
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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#ebebeb] hover:shadow-md transition-shadow cursor-pointer" data-testid={`list-property-${property.id}`}>
        <div className="relative">
          <img src={image} alt={property.title} className="w-full h-[160px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-[#059669] to-[#06b6d4] rounded-full">
            <span className="text-white text-[9px] font-bold tracking-wider" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>FL</span>
          </div>
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 shadow">
            <span className="text-sm font-bold text-[#059669]">${(price / 1000).toFixed(0)}K</span>
            <span className="text-[10px] text-[#717171] ml-1">{currency}</span>
          </div>
        </div>
        <div className="p-3.5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#222]">{property.title}</h3>
              <p className="text-xs text-[#717171] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#059669]" /> {property.location}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#059669] text-[#059669]" />
              <span className="text-xs font-semibold text-[#222]">5.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[#f5f5f5]">
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
        </div>
      </div>
    </Link>
  );
}
