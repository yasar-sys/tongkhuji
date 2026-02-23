import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TeaStallDisplay } from '@/components/StallCard';

import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  stalls: TeaStallDisplay[];
  className?: string;
}

const MapView = ({ stalls, className = '' }: MapViewProps) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
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

      // Tile Layers
      const road = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      });

      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery',
      });

      const topology = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap',
      });

      // Add default layer
      road.addTo(map);

      // Add Layer Control
      const baseMaps = {
        "Road": road,
        "Satellite": satellite,
        "Topology": topology
      };

      L.control.layers(baseMaps).addTo(map);

      // Add click listener for adding Tongs
      // Note: we can't use useNavigate here directly as it's not a hook top-level,
      // but we can pass it down or use a safer approach for this legacy MapView structure.
      // Since it's inside useEffect, we'll use window.location or similar if needed,
      // but better to use a ref to the navigate function if we want to be clean.

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        navigate(`/add-stall?lat=${lat}&lng=${lng}`);
      });

      const teaIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      stalls.forEach(stall => {
        const name = lang === 'bn' ? stall.name_bn : stall.name_en;
        const marker = L.marker([stall.lat, stall.lng], { icon: teaIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:'Hind Siliguri',sans-serif;padding:0;overflow:hidden;min-width:200px">
            ${stall.image_url ? `<img src="${stall.image_url}" style="width:100%;height:100px;object-cover:true;margin-bottom:8px" />` : ''}
            <div style="padding:8px">
              <h3 style="font-weight:bold;font-size:14px;margin:0 0 4px">${name}</h3>
              <p style="font-size:12px;color:#666;margin:0 0 4px">${stall.upazila}, ${stall.district}</p>
              <div style="font-size:12px">⭐ ${stall.rating} (${stall.review_count} ${t('reviews')})</div>
              <p style="font-size:12px;margin:4px 0 0">${t('taka')}${stall.tea_price_min}–${stall.tea_price_max} ${t('perCup')}</p>
            </div>
          </div>
        `);
      });

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
      className={`w-full h-full ${className}`}
    />
  );
};

export default MapView;
