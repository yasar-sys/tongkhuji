import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--tea-amber)/0.15),transparent_60%)]" />

      {/* Floating tea cups */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x: '10%', y: '20%', delay: 0 },
          { x: '80%', y: '15%', delay: 0.5 },
          { x: '65%', y: '70%', delay: 1 },
          { x: '20%', y: '75%', delay: 1.5 },
          { x: '90%', y: '50%', delay: 0.8 },
        ].map((cup, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{ left: cup.x, top: cup.y }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: cup.delay, ease: 'easeInOut' }}
          >
            ☕
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm">🍵</span>
              <span className="text-primary-foreground/90 text-sm font-bangla">{t('appTagline')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight font-bangla whitespace-pre-line">
              {t('heroTitle')}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 font-bangla leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/map">
                <Button size="lg" variant="secondary" className="font-bangla text-base gap-2 w-full sm:w-auto">
                  <MapPin className="w-5 h-5" />
                  {t('discoverStalls')}
                </Button>
              </Link>
              <Link to="/add-stall">
                <Button size="lg" variant="outline" className="font-bangla text-base gap-2 border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 w-full sm:w-auto">
                  <Users className="w-5 h-5" />
                  {t('joinCommunity')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { value: '৫,০০০+', label: t('totalStalls') },
              { value: '১২,০০০+', label: t('totalReviews') },
              { value: '৮,০০০+', label: t('totalUsers') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground font-bangla">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60 font-bangla mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
