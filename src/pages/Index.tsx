import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Camera, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import StallCard from '@/components/StallCard';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTeaStalls } from '@/hooks/useTeaStalls';
import { sampleStalls } from '@/data/sampleStalls';

const Index = () => {
  const { lang, t } = useLanguage();
  const { data: dbStalls } = useTeaStalls();

  // Use real DB stalls if available, fallback to sample
  const displayStalls = dbStalls && dbStalls.length > 0
    ? dbStalls.map((s: any) => ({
      ...s,
      rating: 4.5,
      review_count: 0,
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

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Stalls */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6 md:mb-8"
          >
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-bangla">
              🍵 {t('featuredStalls')}
            </h2>
            <Link to="/map">
              <Button variant="ghost" size="sm" className="font-bangla gap-1 text-sm">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayStalls.slice(0, 6).map((stall: any, i: number) => (
              <StallCard key={stall.id} stall={stall} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12 font-bangla">
            {lang === 'bn' ? 'অ্যাপ ফিচারস' : 'App Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: <MapPin className="w-6 h-6 text-primary" />, emoji: '🗺️', titleBn: 'মানচিত্র এবং অনুসন্ধান', titleEn: 'Map & Search', descBn: 'আপনার আসেপাশের সেরা চায়ের দোকানগুলো সহজেই খুঁজে বের করুন।', descEn: 'Easily find the best tea stalls near you.' },
              { icon: <Camera className="w-6 h-6 text-primary" />, emoji: '📸', titleBn: 'ছবি এবং তথ্য', titleEn: 'Photos & Info', descBn: 'দোকানের ছবি দেখুন এবং দাম ও সুযোগ-সুবিধা সম্পর্কে জানুন।', descEn: 'View stall photos with pricing and amenities.' },
              { icon: <Plus className="w-6 h-6 text-primary" />, emoji: '📍', titleBn: 'টঙ যোগ করুন', titleEn: 'Add Stalls', descBn: 'আপনি চাইলে মানচিত্রে আপনার পছন্দের টঙ যোগ করতে পারেন।', descEn: 'Add your favorite tea stall to our map.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-5 md:p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-tea transition-shadow"
              >
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="text-lg font-bold mb-2 font-bangla">{lang === 'bn' ? f.titleBn : f.titleEn}</h3>
                <p className="text-muted-foreground font-bangla text-sm">{lang === 'bn' ? f.descBn : f.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl md:text-3xl font-bold text-primary-foreground mb-3 font-bangla">
              {t('addNewStall')}
            </h2>
            <p className="text-primary-foreground/70 mb-5 max-w-md mx-auto font-bangla text-sm">
              {t('appDescription')}
            </p>
            <Link to="/add-stall">
              <Button size="lg" variant="secondary" className="font-bangla rounded-2xl h-12 px-8">
                {t('addStall')} →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 border-t border-border bg-muted/20">
        <div className="container mx-auto text-center">
          <span className="text-2xl block mb-2">🍵</span>
          <p className="text-sm font-bold text-foreground font-bangla mb-1">
            {t('appName')} — {t('appSlogan')}
          </p>
          <p className="text-xs text-muted-foreground font-bangla italic opacity-70">
            {t('appTagline')}
          </p>
        </div>
      </footer>
      <BottomNav />
    </div>
  );
};

export default Index;
