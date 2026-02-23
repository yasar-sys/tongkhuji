import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapView from '@/components/MapView';
import StallCard from '@/components/StallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTeaStalls } from '@/hooks/useTeaStalls';
import { sampleStalls, divisions } from '@/data/sampleStalls';

const MapPage = () => {
  const { lang, t } = useLanguage();
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [showList, setShowList] = useState(false);

  const { data: dbStalls, isLoading } = useTeaStalls(selectedDivision);

  // Use DB stalls if available, otherwise show sample data
  const stalls = dbStalls && dbStalls.length > 0
    ? dbStalls.map(s => ({
        ...s,
        rating: 0,
        review_count: 0,
        image_url: '',
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
    : (selectedDivision === 'all'
        ? sampleStalls
        : sampleStalls.filter(s => s.division === selectedDivision));

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center gap-3 flex-wrap">
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger className="w-48 font-bangla">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-bangla">{t('allDivisions')}</SelectItem>
              {divisions.map(d => (
                <SelectItem key={d.en} value={d.en} className="font-bangla">
                  {lang === 'bn' ? d.bn : d.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showList ? 'default' : 'outline'}
            size="sm"
            className="font-bangla md:hidden"
            onClick={() => setShowList(!showList)}
          >
            {showList ? (lang === 'bn' ? 'মানচিত্র' : 'Map') : (lang === 'bn' ? 'তালিকা' : 'List')}
          </Button>

          <span className="text-sm text-muted-foreground font-bangla ml-auto">
            {isLoading ? '...' : `${stalls.length} ${lang === 'bn' ? 'টি টঙ পাওয়া গেছে' : 'stalls found'}`}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          <div className={`md:col-span-3 ${showList ? 'hidden md:block' : ''}`}>
            <div className="h-full rounded-lg overflow-hidden border border-border" style={{ minHeight: '500px' }}>
              <MapView stalls={stalls} />
            </div>
          </div>

          <motion.div
            className={`md:col-span-2 space-y-4 overflow-y-auto ${!showList ? 'hidden md:block' : ''}`}
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {stalls.map((stall, i) => (
              <StallCard key={stall.id} stall={stall} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
