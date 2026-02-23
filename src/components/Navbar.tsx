import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Menu, X, Globe, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/map', label: t('map'), icon: <MapPin className="w-4 h-4 mr-1" /> },
    { path: '/add-stall', label: t('addStall'), icon: <Plus className="w-4 h-4 mr-1" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍵</span>
          <span className="text-xl font-bold text-primary">{t('appName')}</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}>
                <Button variant={isActive(link.path) ? 'default' : 'ghost'} size="sm" className="font-bangla">
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-border mx-2" />
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] text-muted-foreground">By</span>
            <span className="text-xs font-semibold text-primary">Samin Yasar Sunny</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleLang} className="font-bangla text-xs">
            <Globe className="w-3.5 h-3.5 mr-1" />
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </Button>

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:flex font-bangla text-xs gap-1">
              <LogOut className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'লগআউট' : 'Logout'}
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="hidden md:flex font-bangla text-xs gap-1">
                <LogIn className="w-3.5 h-3.5" />
                {t('login')}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                  <Button variant={isActive(link.path) ? 'default' : 'ghost'} className="w-full justify-start font-bangla">
                    {link.label}
                  </Button>
                </Link>
              ))}
              {user ? (
                <Button variant="ghost" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full justify-start font-bangla gap-1">
                  <LogOut className="w-4 h-4" /> {lang === 'bn' ? 'লগআউট' : 'Logout'}
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-bangla gap-1">
                    <LogIn className="w-4 h-4" /> {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
        <div className="flex flex-col items-center gap-1 border-t border-border pt-4 mt-2">
          <p className="text-[10px] text-muted-foreground">Created by</p>
          <p className="text-xs font-bold text-primary">Samin Yasar Sunny</p>
        </div>
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
