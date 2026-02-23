import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TeaStall } from '@/data/sampleStalls';

interface MapViewProps {
  stalls: TeaStall[];
  className?: string;
}

const MapView = ({ stalls, className = '' }: MapViewProps) => {
  const { lang, t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import leaflet
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([23.8103, 90.4125], 7);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const teaIcon = L.divIcon({
        html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🍵</div>',
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      stalls.forEach(stall => {
        const name = lang === 'bn' ? stall.name_bn : stall.name_en;
        const marker = L.marker([stall.lat, stall.lng], { icon: teaIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:'Hind Siliguri',sans-serif;padding:4px">
            <h3 style="font-weight:bold;font-size:14px;margin:0 0 4px">${name}</h3>
            <p style="font-size:12px;color:#666;margin:0 0 4px">${stall.upazila}, ${stall.district}</p>
            <div style="font-size:12px">⭐ ${stall.rating} (${stall.review_count} ${t('reviews')})</div>
            <p style="font-size:12px;margin:4px 0 0">${t('taka')}${stall.tea_price_min}–${stall.tea_price_max} ${t('perCup')}</p>
          </div>
        `);
      });

      if (stalls.length > 0) {
        const bounds = L.latLngBounds(stalls.map(s => [s.lat, s.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      setLoaded(true);
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
    <div
      ref={mapRef}
      className={`w-full h-full rounded-lg ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapView;
