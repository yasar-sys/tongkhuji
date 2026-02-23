import { useState } from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { divisions } from '@/data/sampleStalls';

interface FloatingSearchBarProps {
    onSearchChange?: (value: string) => void;
    selectedDivision: string;
    onDivisionChange: (division: string) => void;
}

const FloatingSearchBar = ({ onSearchChange, selectedDivision, onDivisionChange }: FloatingSearchBarProps) => {
    const { lang, t } = useLanguage();
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <div className="absolute top-4 left-4 right-4 z-[2000] pointer-events-none">
            <div className="max-w-md mx-auto flex flex-col gap-3 pointer-events-auto">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                            <span className="text-xl">🍵</span>
                        </div>
                        <Input
                            placeholder={lang === 'bn' ? 'টঙ বা জায়গা খুঁজুন...' : 'Search stalls or places...'}
                            className="w-full h-14 pl-12 pr-4 bg-background/95 backdrop-blur-xl border-none shadow-2xl rounded-[24px] text-base font-bangla focus-visible:ring-primary/20"
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>
                    <Button
                        size="icon"
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`h-14 w-14 backdrop-blur-xl shadow-2xl rounded-[24px] border-none transition-all ${filterOpen ? 'bg-primary text-primary-foreground' : 'bg-background/95 text-foreground hover:bg-background'}`}
                    >
                        {filterOpen ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
                    </Button>
                </div>

                <AnimatePresence>
                    {filterOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="bg-background/95 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl border border-border/50 overflow-hidden"
                        >
                            <h3 className="text-sm font-bold font-bangla text-muted-foreground mb-3 ml-2 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> {t('filterByDivision')}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => { onDivisionChange('all'); setFilterOpen(false); }}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bangla text-sm ${selectedDivision === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 hover:bg-muted/50 text-foreground'}`}
                                >
                                    {t('allDivisions')}
                                    {selectedDivision === 'all' && <Check className="w-4 h-4" />}
                                </button>
                                {divisions.map((d) => (
                                    <button
                                        key={d.en}
                                        onClick={() => { onDivisionChange(d.en); setFilterOpen(false); }}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bangla text-sm ${selectedDivision === d.en ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 hover:bg-muted/50 text-foreground'}`}
                                    >
                                        {lang === 'bn' ? d.bn : d.en}
                                        {selectedDivision === d.en && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FloatingSearchBar;
