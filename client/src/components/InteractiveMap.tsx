import { useEffect, useRef, useCallback } from 'react';
import { Minus, Plus, Navigation } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  location?: string;
  zoom?: number;
  height?: string;
  showControls?: boolean;
  className?: string;
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

export default function InteractiveMap({
  latitude,
  longitude,
  title,
  location,
  zoom = 15,
  height = '400px',
  showControls = true,
  className = '',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!mapRef.current || isNaN(latitude) || isNaN(longitude)) return;

    const center = { lat: latitude, lng: longitude };

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(zoom);
      markerRef.current.position = center;
      if (infoWindowRef.current && title) {
        infoWindowRef.current.setContent(
          `<div style="font-family:Inter,sans-serif;padding:4px 0;">
            <strong style="font-size:14px;color:#111;">${title}</strong>
            ${location ? `<p style="font-size:12px;color:#888;margin:4px 0 0;">${location}</p>` : ''}
          </div>`
        );
      }
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        if (!MAPS_KEY || cancelled) return;

        const google = await getGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          mapId: 'fractional-living-map',
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        });

        const pinEl = document.createElement('div');
        pinEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #0891b2;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0891b2" width="22" height="22"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div>`;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: center,
          content: pinEl,
        });

        if (title) {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="font-family:Inter,sans-serif;padding:4px 0;">
              <strong style="font-size:14px;color:#111;">${title}</strong>
              ${location ? `<p style="font-size:12px;color:#888;margin:4px 0 0;">${location}</p>` : ''}
            </div>`,
          });
          marker.addListener('click', () => infoWindow.open({ anchor: marker, map }));
          infoWindowRef.current = infoWindow;
        }

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (err) {
        console.error('Failed to initialize Google Map:', err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
      markerRef.current = null;
      infoWindowRef.current = null;
    };
  }, [latitude, longitude, zoom, title, location]);

  const handleZoomIn = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || zoom) + 1);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || zoom) - 1);
  }, [zoom]);

  const handleRecenter = useCallback(() => {
    mapInstanceRef.current?.panTo({ lat: latitude, lng: longitude });
    mapInstanceRef.current?.setZoom(zoom);
  }, [latitude, longitude, zoom]);

  if (isNaN(latitude) || isNaN(longitude)) return null;

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" data-testid="interactive-map" />
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            data-testid="map-zoom-in"
          >
            <Plus className="w-4 h-4 text-[#333]" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            data-testid="map-zoom-out"
          >
            <Minus className="w-4 h-4 text-[#333]" />
          </button>
          <button
            onClick={handleRecenter}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            data-testid="map-recenter"
          >
            <Navigation className="w-4 h-4 text-[#333]" />
          </button>
        </div>
      )}
    </div>
  );
}
