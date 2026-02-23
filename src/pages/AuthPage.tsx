import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      toast({ title: lang === 'bn' ? 'লগইন ত্রুটি' : 'Login Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: lang === 'bn' ? 'সফলভাবে লগইন হয়েছে!' : 'Logged in successfully!' });
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { display_name: signupName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: lang === 'bn' ? 'সাইন আপ ত্রুটি' : 'Sign Up Error', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: lang === 'bn' ? 'সাইন আপ সফল!' : 'Sign up successful!',
        description: lang === 'bn' ? 'আপনার ইমেইল যাচাই করুন।' : 'Please verify your email.',
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">🍵</span>
          <h1 className="text-2xl font-bold text-foreground font-bangla mt-3">{t('appName')}</h1>
          <p className="text-muted-foreground font-bangla text-sm">{t('appTagline')}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-tea">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="font-bangla">{t('login')}</TabsTrigger>
              <TabsTrigger value="signup" className="font-bangla">{t('signup')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bangla flex items-center gap-1"><Mail className="w-4 h-4" /> {lang === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                  <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bangla flex items-center gap-1"><Lock className="w-4 h-4" /> {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
                  <Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full font-bangla gap-2" disabled={loading}>
                  <LogIn className="w-4 h-4" /> {t('login')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bangla flex items-center gap-1"><User className="w-4 h-4" /> {lang === 'bn' ? 'নাম' : 'Name'}</Label>
                  <Input value={signupName} onChange={e => setSignupName(e.target.value)} required placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your name'} className="font-bangla" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bangla flex items-center gap-1"><Mail className="w-4 h-4" /> {lang === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                  <Input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bangla flex items-center gap-1"><Lock className="w-4 h-4" /> {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
                  <Input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full font-bangla gap-2" disabled={loading}>
                  <User className="w-4 h-4" /> {t('signup')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
