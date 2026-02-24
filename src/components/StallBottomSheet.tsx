import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { TeaStallDisplay } from './StallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface StallBottomSheetProps {
  stalls: TeaStallDisplay[];
  onStallClick?: (stall: TeaStallDisplay) => void;
}

const StallBottomSheet = ({ stalls, onStallClick }: StallBottomSheetProps) => {
  const { lang, t } = useLanguage();
  const [snapPoint, setSnapPoint] = useState<'collapsed' | 'half' | 'expanded'>('collapsed');

  const variants = {
    collapsed: { y: 'calc(100% - 72px)' },
    half: { y: '50%' },
    expanded: { y: '8%' },
  };

  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    if (velocity > 400 || offset > 80) {
      setSnapPoint(snapPoint === 'expanded' ? 'half' : 'collapsed');
    } else if (velocity < -400 || offset < -80) {
      setSnapPoint(snapPoint === 'collapsed' ? 'half' : 'expanded');
    }
  };

  const toggleSheet = () => {
    setSnapPoint(prev => prev === 'collapsed' ? 'half' : prev === 'half' ? 'expanded' : 'collapsed');
  };

  return (
    <motion.div
      variants={variants}
      initial="collapsed"
      animate={snapPoint}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.05}
      onDragEnd={handleDragEnd}
      className="absolute bottom-0 left-0 right-0 z-[1001] bg-background/95 backdrop-blur-xl rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] border-t border-border/30 h-[92vh] overflow-hidden flex flex-col"
    >
      {/* Handle */}
      <div 
        className="w-full flex justify-center pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing"
        onClick={toggleSheet}
      >
        <div className="w-12 h-1.5 bg-border/60 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 p-2 rounded-xl">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-bangla text-foreground leading-tight">
              {lang === 'bn' ? `${stalls.length}টি টঙ পাওয়া গেছে` : `${stalls.length} stalls found`}
            </h2>
          </div>
        </div>
        <button onClick={toggleSheet} className="p-2 rounded-xl bg-muted/50 text-muted-foreground">
          {snapPoint === 'collapsed' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Stall List */}
      <div className="px-4 flex-1 overflow-y-auto pb-24">
        <div className="space-y-3">
          {stalls.map((stall) => (
            <div
              key={stall.id}
              onClick={() => onStallClick?.(stall)}
              className="bg-card hover:bg-muted/30 transition-all p-3 rounded-2xl border border-border/30 shadow-sm flex gap-3 cursor-pointer active:scale-[0.98]"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {stall.image_url ? (
                  <img src={stall.image_url} alt={stall.name_bn} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl">🍵</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground truncate font-bangla leading-tight">
                  {lang === 'bn' ? stall.name_bn : stall.name_en}
                </h3>
                <p className="text-[11px] text-muted-foreground truncate mb-1 font-bangla">
                  📍 {stall.upazila ? `${stall.upazila}, ` : ''}{stall.district}
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-primary font-bold">৳{stall.tea_price_min}–{stall.tea_price_max}</span>
                  {stall.open_time && (
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {stall.open_time}–{stall.close_time}
                    </span>
                  )}
                </div>
                {stall.facilities && stall.facilities.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {stall.facilities.slice(0, 3).map((f) => (
                      <span key={f} className="bg-primary/5 text-primary px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Nav Button */}
              <div className="flex items-center">
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                  <Navigation className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </div>
          ))}

          {stalls.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🍵</span>
              <p className="text-muted-foreground font-bangla text-sm">
                {lang === 'bn' ? 'কোনো টঙ পাওয়া যায়নি' : 'No stalls found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StallBottomSheet;
