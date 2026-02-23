import { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Share2, Navigation, MessageSquare, Star, MapPin } from 'lucide-react';
import { TeaStallDisplay } from './StallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StallBottomSheetProps {
    stalls: TeaStallDisplay[];
    onStallClick?: (stall: TeaStallDisplay) => void;
}

const StallBottomSheet = ({ stalls, onStallClick }: StallBottomSheetProps) => {
    const { lang, t } = useLanguage();
    const [snapPoint, setSnapPoint] = useState<'collapsed' | 'half' | 'expanded'>('half');

    const variants = {
        collapsed: { y: 'calc(100% - 80px)' },
        half: { y: '50%' },
        expanded: { y: '10%' }
    };

    const handleDragEnd = (event: any, info: any) => {
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        if (velocity > 500 || offset > 100) {
            if (snapPoint === 'expanded') setSnapPoint('half');
            else setSnapPoint('collapsed');
        } else if (velocity < -500 || offset < -100) {
            if (snapPoint === 'collapsed') setSnapPoint('half');
            else setSnapPoint('expanded');
        }
    };

    const listHeader = (
        <div className="flex items-center justify-between py-4 border-b border-border/10">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-bold font-bangla text-foreground">
                        {lang === 'bn' ? `আশেপাশে ${stalls.length}টি টঙ` : `Nearby ${stalls.length} stalls`}
                    </h2>
                </div>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LIVE
            </div>
        </div>
    );

    return (
        <motion.div
            variants={variants}
            initial="half"
            animate={snapPoint}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-background/95 backdrop-blur-xl rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-border/50 h-[90vh] overflow-hidden flex flex-col transition-shadow duration-300"
        >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="w-16 h-1.5 bg-border rounded-full" />
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-20 custom-scrollbar">
                {listHeader}

                <div className="py-4 space-y-4">
                    {stalls.map((stall, index) => (
                        <div
                            key={stall.id}
                            onClick={() => onStallClick?.(stall)}
                            className="group bg-background hover:bg-muted/30 transition-colors p-4 rounded-3xl border border-border/50 shadow-sm flex gap-4 cursor-pointer relative"
                        >
                            {/* Thumbnail */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center border border-border/50">
                                    {stall.image_url ? (
                                        <img src={stall.image_url} alt={stall.name_bn} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-hero flex items-center justify-center opacity-50">
                                            <span className="text-3xl">🍵</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -left-2 bg-background/95 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-border shadow-sm">
                                    <span className="text-[10px] font-bold text-muted-foreground">{index === 0 ? '1.5km' : index === 1 ? '1.6km' : '2.0km'}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-base text-foreground truncate font-bangla leading-tight pr-8">
                                        {lang === 'bn' ? stall.name_bn : stall.name_en}
                                    </h3>
                                    <div className="absolute right-16 top-4 flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20">
                                        <span className="text-[10px] font-bold text-accent">{stall.rating || (3.5 + Math.random() * 1.5).toFixed(1)}</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-muted-foreground truncate mb-2 font-bangla">
                                    {stall.upazila}, {stall.district}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1 bg-primary/5 text-primary px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                        {lang === 'bn' ? 'ফ্রি ওয়াইফাই' : 'Free Wifi'}
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-500/5 text-blue-600 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                        {lang === 'bn' ? '২৪ ঘণ্টা' : '24h'}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-2 justify-center ml-2">
                                <Button size="icon" variant="ghost" className="h-10 w-10 text-primary-foreground bg-blue-600 hover:bg-blue-700 rounded-2xl">
                                    <Navigation className="w-5 h-5 fill-current" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground bg-muted hover:bg-muted/80 rounded-2xl">
                                    <MessageSquare className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default StallBottomSheet;
