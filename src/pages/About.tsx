import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Github, Mail, Globe, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
    const { lang, t } = useLanguage();

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-3xl" />

                    <div className="relative text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                            <span className="text-4xl text-primary font-bangla">🍵</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold font-bangla mb-2 text-primary">
                            {t('appName')}
                        </h1>
                        <p className="text-lg font-bangla text-muted-foreground mb-8">
                            "{t('appSlogan')}"
                        </p>

                        <div className="space-y-6 text-left">
                            <div className="p-6 bg-muted/50 rounded-3xl border border-border/50">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                    Developed By
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
                                        SY
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Samin Yasar Sunny</h3>
                                        <p className="text-sm text-muted-foreground">Full Stack Developer & Tea Enthusiast</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bangla border-border/50 hover:bg-primary/5">
                                    <Github className="w-5 h-5" /> GitHub
                                </Button>
                                <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bangla border-border/50 hover:bg-primary/5">
                                    <Mail className="w-5 h-5" /> Contact
                                </Button>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border/50">
                            <p className="text-sm text-muted-foreground font-bangla italic">
                                "{lang === 'bn'
                                    ? 'এই প্রজেক্টটি বাংলাদেশের প্রতিটি চায়ের দোকানের গল্প সারা বিশ্বে ছড়িয়ে দেওয়ার একটি ক্ষুদ্র প্রয়াস।'
                                    : 'This project is a humble effort to spread the stories of Bangladesh\'s tea stalls across the globe.'}"
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
