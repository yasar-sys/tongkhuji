import { Eye, Maximize2, Navigation2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FloatingMapControlsProps {
    onLocateMe?: () => void;
    onToggleLayers?: () => void;
}

const FloatingMapControls = ({ onLocateMe, onToggleLayers }: FloatingMapControlsProps) => {
    return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3">
            <div className="flex flex-col bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/50"
                    onClick={onToggleLayers}
                >
                    <Eye className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <Maximize2 className="w-5 h-5" />
                </Button>
            </div>

            <Button
                size="icon"
                className="h-12 w-12 bg-background/95 backdrop-blur-md text-primary hover:bg-background shadow-2xl rounded-2xl border-none"
                onClick={onLocateMe}
            >
                <Navigation2 className="w-5 h-5 fill-current" />
            </Button>

            <Link to="/add-stall">
                <Button size="icon" className="h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl rounded-2xl border-none">
                    <Plus className="w-7 h-7" />
                </Button>
            </Link>
        </div>
    );
};

export default FloatingMapControls;
