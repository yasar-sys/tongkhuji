import { useState, useCallback } from 'react';
import MapView from '@/components/MapView';
import FloatingSearchBar from '@/components/FloatingSearchBar';
import FloatingMapControls from '@/components/FloatingMapControls';
import StallBottomSheet from '@/components/StallBottomSheet';
import { useTeaStalls } from '@/hooks/useTeaStalls';
import { sampleStalls } from '@/data/sampleStalls';
import { TeaStallDisplay } from '@/components/StallCard';

const MapPage = () => {
  const [selectedDivision] = useState('all');
  const { data: dbStalls } = useTeaStalls(selectedDivision);

  // Use DB stalls if available, otherwise show sample data
  const stalls: TeaStallDisplay[] = dbStalls && dbStalls.length > 0
    ? dbStalls.map(s => ({
      ...s,
      rating: 4.5, // Default rating as placeholder
      review_count: 12,
      image_url: s.image_url || '',
      is_open: true,
      tea_price_min: s.tea_price_min ?? 10,
      tea_price_max: s.tea_price_max ?? 30,
      facilities: s.facilities ?? [],
      open_time: s.open_time ?? '',
      close_time: s.close_time ?? '',
      description_bn: s.description_bn ?? '',
      description_en: s.description_en ?? '',
      owner_name: s.owner_name ?? '',
      phone: s.phone ?? '',
      upazila: s.upazila ?? '',
    }))
    : sampleStalls;

  const handleStallClick = useCallback((stall: TeaStallDisplay) => {
    window.location.href = `/map?lat=${stall.lat}&lng=${stall.lng}`;
  }, []);

  return (
    <div className="fixed inset-0 pt-16 overflow-hidden bg-background">
      <div className="relative w-full h-full">
        <MapView stalls={stalls} className="h-full w-full" />

        <FloatingSearchBar />

        <FloatingMapControls
          onLocateMe={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((pos) => {
                window.location.href = `/map?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;
              });
            }
          }}
        />

        <StallBottomSheet
          stalls={stalls}
          onStallClick={handleStallClick}
        />
      </div>
    </div>
  );
};

export default MapPage;
