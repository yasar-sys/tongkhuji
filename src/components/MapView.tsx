import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TeaStallDisplay } from '@/components/StallCard';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  stalls: TeaStallDisplay[];
  className?: string;
  onStallSelect?: (stall: TeaStallDisplay) => void;
}

const MapView = ({ stalls, className = '', onStallSelect }: MapViewProps) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.8103, 90.4125], 7);
      mapInstanceRef.current = map;

      // Add zoom control to bottom-left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Beautiful tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
      }).addTo(map);

      // Click to add stall
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        navigate(`/add-stall?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`);
      });

      // Add markers
      addMarkers(L, map);

      // Fit bounds
      if (stalls.length > 0) {
        const searchParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(searchParams.get('lat') || '');
        const lng = parseFloat(searchParams.get('lng') || '');

        if (!isNaN(lat) && !isNaN(lng)) {
          map.flyTo([lat, lng], 15);
        } else {
          const bounds = L.latLngBounds(stalls.map(s => [s.lat, s.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    };

    const addMarkers = (L: any, map: any) => {
      // Clear existing markers
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      const teaIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;background:rgba(34,139,34,0.2);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#2d7a3a,#1a5c28);border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:18px;">
              🍵
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });

      stalls.forEach(stall => {
        const name = lang === 'bn' ? stall.name_bn : stall.name_en;
        const desc = lang === 'bn' ? stall.description_bn : stall.description_en;
        const marker = L.marker([stall.lat, stall.lng], { icon: teaIcon }).addTo(map);
        
        marker.bindPopup(`
          <div style="font-family:'Hind Siliguri',sans-serif;min-width:220px;max-width:280px;overflow:hidden;border-radius:16px;">
            ${stall.image_url ? `<img src="${stall.image_url}" style="width:100%;height:120px;object-fit:cover;" />` : 
            `<div style="width:100%;height:80px;background:linear-gradient(135deg,#2d7a3a,#1a5c28);display:flex;align-items:center;justify-content:center;font-size:32px;">🍵</div>`}
            <div style="padding:12px;">
              <h3 style="font-weight:700;font-size:15px;margin:0 0 4px;color:#1a1a1a;">${name}</h3>
              <p style="font-size:12px;color:#888;margin:0 0 6px;">📍 ${stall.upazila ? stall.upazila + ', ' : ''}${stall.district}</p>
              ${desc ? `<p style="font-size:11px;color:#666;margin:0 0 6px;line-height:1.4;">${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}</p>` : ''}
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;font-weight:600;color:#2d7a3a;">৳${stall.tea_price_min}–${stall.tea_price_max}</span>
                <span style="font-size:11px;color:#888;">${stall.open_time || ''} – ${stall.close_time || ''}</span>
              </div>
              ${stall.facilities && stall.facilities.length > 0 ? `
                <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;">
                  ${stall.facilities.map((f: string) => `<span style="background:#f0f7f0;color:#2d7a3a;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;">${f}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `, { className: 'tea-popup', maxWidth: 300 });

        marker.on('click', () => onStallSelect?.(stall));
        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stalls, lang, t]);

  return (
    <div ref={mapRef} className={`w-full h-full ${className}`} />
  );
};

export default MapView;
