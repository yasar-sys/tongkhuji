import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingSearchBar = () => {
    const { lang, t } = useLanguage();

    return (
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
            <div className="max-w-md mx-auto flex items-center gap-2 pointer-events-auto">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        <span className="text-xl">🍵</span>
                    </div>
                    <Input
                        placeholder={lang === 'bn' ? 'টঙ বা জায়গা খুঁজুন...' : 'Search stalls or places...'}
                        className="w-full h-14 pl-12 pr-4 bg-background/95 backdrop-blur-md border-none shadow-2xl rounded-2xl text-base font-bangla focus-visible:ring-primary/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="w-5 h-5" />
                    </div>
                </div>
                <Button size="icon" className="h-14 w-14 bg-background/95 backdrop-blur-md text-foreground hover:bg-background shadow-2xl rounded-2xl border-none">
                    <Filter className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
};

export default FloatingSearchBar;
