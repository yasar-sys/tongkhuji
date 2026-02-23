import { Home, Map as MapIcon, PlusCircle, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNav = () => {
    const { t } = useLanguage();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    if (location.pathname === '/map') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-4 h-16 flex items-center justify-around md:hidden">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-bangla">{t('home')}</span>
            </Link>
            <Link to="/map" className={`flex flex-col items-center gap-1 ${isActive('/map') ? 'text-primary' : 'text-muted-foreground'}`}>
                <MapIcon className="w-5 h-5" />
                <span className="text-[10px] font-bangla">{t('map')}</span>
            </Link>
            <Link to="/add-stall" className={`flex flex-col items-center gap-1 ${isActive('/add-stall') ? 'text-primary' : 'text-muted-foreground'}`}>
                <PlusCircle className="w-5 h-5" />
                <span className="text-[10px] font-bangla">{t('addStall')}</span>
            </Link>
            <button
                onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else if (location.pathname !== '/') window.location.href = '/#features';
                }}
                className="flex flex-col items-center gap-1 text-muted-foreground"
            >
                <Star className="w-5 h-5" />
                <span className="text-[10px] font-bangla">ফিচারস</span>
            </button>
        </div>
    );
};

export default BottomNav;
