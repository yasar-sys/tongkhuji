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
  const { data: dbStalls, isLoading } = useTeaStalls(selectedDivision);

  // Use DB stalls if available, otherwise show sample data
  const rawStalls: TeaStallDisplay[] = dbStalls && dbStalls.length > 0
    ? dbStalls.map((s: any) => ({
      ...s,
      rating: s.rating ?? 4.5,
      review_count: s.review_count ?? 0,
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
    if (!dbStalls && selectedDivision !== 'all' && s.division !== selectedDivision) return false;
    const name = lang === 'bn' ? s.name_bn : s.name_en;
    const location = `${s.upazila} ${s.district} ${s.division}`;
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || location.toLowerCase().includes(query);
  });

  const handleStallClick = useCallback((stall: TeaStallDisplay) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lat', String(stall.lat));
    url.searchParams.set('lng', String(stall.lng));
    window.location.href = url.toString();
  }, []);

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      {/* Search Header */}
      <div className="z-[2000] bg-background/60 backdrop-blur-md safe-area-top">
        <FloatingSearchBar
          onSearchChange={setSearchQuery}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
        />
      </div>

      <div className="relative flex-1 w-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl animate-bounce">🍵</span>
              <p className="font-bangla text-muted-foreground text-sm">
                {lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}

        <MapView stalls={stalls} className="h-full w-full" onStallSelect={handleStallClick} />

        <FloatingMapControls
          onLocateMe={() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const url = new URL(window.location.href);
                url.searchParams.set('lat', String(pos.coords.latitude));
                url.searchParams.set('lng', String(pos.coords.longitude));
                window.location.href = url.toString();
              });
            }
          }}
        />

        <StallBottomSheet stalls={stalls} onStallClick={handleStallClick} />
      </div>
    </div>
  );
};

export default MapPage;
