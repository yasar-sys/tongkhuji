import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Wifi, Tv, Armchair, Cigarette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeaStallDisplay {
  id: string;
  name_bn: string;
  name_en: string;
  owner_name: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  lat: number;
  lng: number;
  open_time: string;
  close_time: string;
  description_bn: string;
  description_en: string;
  tea_price_min: number;
  tea_price_max: number;
  facilities: string[];
  rating: number;
  review_count: number;
  image_url?: string;
  is_open?: boolean;
}

export type { TeaStallDisplay };

const facilityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  tv: <Tv className="w-3 h-3" />,
  seating: <Armchair className="w-3 h-3" />,
  smoking_zone: <Cigarette className="w-3 h-3" />,
};

const StallCard = ({ stall, index = 0 }: { stall: TeaStallDisplay; index?: number }) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const name = lang === 'bn' ? stall.name_bn : stall.name_en;
  const description = lang === 'bn' ? stall.description_bn : stall.description_en;

  const handleClick = () => {
    navigate(`/map?lat=${stall.lat}&lng=${stall.lng}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={handleClick}
      className="bg-gradient-card rounded-lg border border-border overflow-hidden shadow-tea hover:shadow-tea-hover transition-shadow duration-300 cursor-pointer group"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
        {stall.image_url ? (
          <img src={stall.image_url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🍵</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={stall.is_open ? 'default' : 'secondary'} className="text-xs">
            {stall.is_open ? t('open') : t('closed')}
          </Badge>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 rounded-full px-2 py-1">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-semibold">{stall.rating}</span>
          <span className="text-xs text-muted-foreground">({stall.review_count})</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1 font-bangla">{name}</h3>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-bangla">{stall.upazila}, {stall.district}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-bangla">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
            <span>{t('taka')}{stall.tea_price_min}–{stall.tea_price_max}</span>
            <span className="text-muted-foreground font-normal">{t('perCup')}</span>
          </div>

          <div className="flex gap-1">
            {stall.facilities.map(f => (
              <div
                key={f}
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                title={f}
              >
                {facilityIcons[f]}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <Clock className="w-3 h-3" />
          <span>{stall.open_time} – {stall.close_time}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StallCard;
