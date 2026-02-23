import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapView from '@/components/MapView';
import StallCard from '@/components/StallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { sampleStalls, divisions } from '@/data/sampleStalls';

const MapPage = () => {
  const { lang, t } = useLanguage();
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [showList, setShowList] = useState(false);

  const filteredStalls = selectedDivision === 'all'
    ? sampleStalls
    : sampleStalls.filter(s => s.division === selectedDivision);

  return (
    <div className="min-h-screen pt-16">
      {/* Toolbar */}
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
            {filteredStalls.length} {lang === 'bn' ? 'টি টঙ পাওয়া গেছে' : 'stalls found'}
          </span>
        </div>
      </div>

      {/* Map + List */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {/* Map */}
          <div className={`md:col-span-3 ${showList ? 'hidden md:block' : ''}`}>
            <div className="h-full rounded-lg overflow-hidden border border-border" style={{ minHeight: '500px' }}>
              <MapView stalls={filteredStalls} />
            </div>
          </div>

          {/* Stall List */}
          <motion.div
            className={`md:col-span-2 space-y-4 overflow-y-auto ${!showList ? 'hidden md:block' : ''}`}
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {filteredStalls.map((stall, i) => (
              <StallCard key={stall.id} stall={stall} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
