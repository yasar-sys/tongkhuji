import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import StallCard from '@/components/StallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { sampleStalls } from '@/data/sampleStalls';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Stalls */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-bangla">
              🍵 {t('featuredStalls')}
            </h2>
            <Link to="/map">
              <Button variant="ghost" className="font-bangla gap-1">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleStalls.slice(0, 6).map((stall, i) => (
              <StallCard key={stall.id} stall={stall} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4 font-bangla">
              {t('addNewStall')}
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto font-bangla">
              {t('appDescription')}
            </p>
            <Link to="/add-stall">
              <Button size="lg" variant="secondary" className="font-bangla">
                {t('addStall')} →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground font-bangla">
            © 2026 {t('appName')} — {t('appTagline')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
