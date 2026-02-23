import { useState, useCallback } from 'react';
import MapView from '@/components/MapView';
import FloatingSearchBar from '@/components/FloatingSearchBar';
import FloatingMapControls from '@/components/FloatingMapControls';
import StallBottomSheet from '@/components/StallBottomSheet';
import { useTeaStalls } from '@/hooks/useTeaStalls';
import { sampleStalls } from '@/data/sampleStalls';
import { TeaStallDisplay } from '@/components/StallCard';
import { useLanguage } from '@/contexts/LanguageContext';

const MapPage = () => {
  const { lang } = useLanguage();
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dbStalls } = useTeaStalls(selectedDivision);

  // Use DB stalls if available, otherwise show sample data
  const rawStalls: TeaStallDisplay[] = dbStalls && dbStalls.length > 0
    ? dbStalls.map((s: any) => ({
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

  const stalls = rawStalls.filter(s => {
    // If using sampleStalls, we need to filter by division manually here as well
    if (!dbStalls && selectedDivision !== 'all' && s.division !== selectedDivision) return false;

    const name = lang === 'bn' ? s.name_bn : s.name_en;
    const location = `${s.upazila} ${s.district} ${s.division}`;
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || location.toLowerCase().includes(query);
  });

  const handleStallClick = useCallback((stall: TeaStallDisplay) => {
    window.location.href = `/map?lat=${stall.lat}&lng=${stall.lng}`;
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Search Header */}
      <div className="z-[2000] border-b border-border/10 bg-background/80 backdrop-blur-md">
        <FloatingSearchBar
          onSearchChange={setSearchQuery}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
        />
      </div>

      <div className="relative flex-1 w-full overflow-hidden">
        <MapView stalls={stalls} className="h-full w-full" />

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
