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

  const isMapPage = location.pathname === '/map';
  if (isMapPage) return null;
  const isTransparent = location.pathname === '/';

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/map', label: t('map'), icon: <MapPin className="w-4 h-4 mr-1" /> },
    { path: '/add-stall', label: t('addStall'), icon: <Plus className="w-4 h-4 mr-1" /> },
    { path: '/about', label: t('about'), icon: <User className="w-4 h-4 mr-1" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-background/20 backdrop-blur-md border-transparent hover:bg-background/80 hover:border-border' : 'bg-background/80 backdrop-blur-lg border-b border-border'}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col group gap-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">🍵</span>
            <span className="text-xl md:text-2xl font-bold text-primary font-bangla tracking-tight leading-none">{t('appName')}</span>
          </div>
          <span className="text-[10px] md:text-xs font-bangla text-muted-foreground/80 mt-1 pl-8 lowercase tracking-wider leading-none">
            {t('appSlogan')}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={isActive(link.path) ? 'default' : 'ghost'}
                size="sm"
                className={`font-bangla rounded-xl transition-all ${isActive(link.path) ? 'shadow-lg shadow-primary/20' : ''}`}
              >
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleLang} className="font-bangla text-xs rounded-xl h-10 px-4 bg-background/50 border-border/50">
            <Globe className="w-4 h-4 mr-2" />
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </Button>

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:flex font-bangla text-xs gap-1 h-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
              {lang === 'bn' ? 'লগআউট' : 'Logout'}
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="hidden md:flex font-bangla text-xs gap-1 h-10 rounded-xl hover:bg-primary/10 transition-colors">
                <LogIn className="w-4 h-4" />
                {t('login')}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 bg-background/50 backdrop-blur-md rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-3">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                  <Button variant={isActive(link.path) ? 'default' : 'ghost'} className="w-full justify-start font-bangla h-14 rounded-2xl text-lg">
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="h-[1px] bg-border/50 my-2" />
              {user ? (
                <Button variant="destructive" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full justify-start font-bangla gap-2 h-14 rounded-2xl text-lg">
                  <LogOut className="w-5 h-5" /> {lang === 'bn' ? 'লগআউট' : 'Logout'}
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-bangla gap-2 h-14 rounded-2xl text-lg hover:bg-primary/10">
                    <LogIn className="w-5 h-5" /> {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
