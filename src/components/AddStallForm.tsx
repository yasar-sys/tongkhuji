import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { divisions } from '@/data/sampleStalls';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const AddStallForm = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<string[]>([]);

  const [form, setForm] = useState({
    name_bn: '', name_en: '', owner_name: '', phone: '',
    division: '', district: '', upazila: '',
    open_time: '06:00', close_time: '22:00',
    tea_price_min: '10', tea_price_max: '30',
    description_bn: '', description_en: '',
    lat: searchParams.get('lat') || '23.8103',
    lng: searchParams.get('lng') || '90.4125',
  });

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (lat && lng) {
      setForm(prev => ({ ...prev, lat, lng }));
    }
  }, [searchParams]);

  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleFacility = (f: string) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: lang === 'bn' ? 'প্রথমে লগইন করুন' : 'Please login first', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('tea_stalls').insert({
      user_id: user.id,
      name_bn: form.name_bn,
      name_en: form.name_en,
      owner_name: form.owner_name,
      phone: form.phone,
      division: form.division,
      district: form.district,
      upazila: form.upazila,
      open_time: form.open_time,
      close_time: form.close_time,
      tea_price_min: parseInt(form.tea_price_min) || 10,
      tea_price_max: parseInt(form.tea_price_max) || 30,
      description_bn: form.description_bn,
      description_en: form.description_en,
      lat: parseFloat(form.lat) || 23.8103,
      lng: parseFloat(form.lng) || 90.4125,
      facilities,
    });
    setLoading(false);

    if (error) {
      toast({ title: lang === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred', description: error.message, variant: 'destructive' });
    } else {
      // Handle image upload if exists
      const fileInput = document.getElementById('stall-image') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        const { data: stall } = await supabase.from('tea_stalls').select('id').eq('name_bn', form.name_bn).order('created_at', { ascending: false }).limit(1).single();
        if (stall) {
          const fileName = `${stall.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('stall-photos').upload(fileName, file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('stall-photos').getPublicUrl(fileName);
            await supabase.from('stall_images').insert({ stall_id: stall.id, image_url: publicUrl });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['tea-stalls'] });
      toast({
        title: lang === 'bn' ? 'সফলভাবে জমা হয়েছে!' : 'Successfully submitted!',
        description: lang === 'bn' ? 'আপনার টঙ পর্যালোচনার জন্য পাঠানো হয়েছে।' : 'Your stall has been sent for review.',
      });
      navigate('/map');
    }
  };

  const facilityOptions = [
    { key: 'wifi', label: t('wifi'), icon: '📶' },
    { key: 'tv', label: t('tv'), icon: '📺' },
    { key: 'seating', label: t('seating'), icon: '🪑' },
    { key: 'smoking_zone', label: t('smokingZone'), icon: '🚬' },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 pb-20"
    >
      {/* Basic Info */}
      <div className="bg-card border border-border/50 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">১</span>
          {lang === 'bn' ? 'সাধারণ তথ্য' : 'Basic Information'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('stallNameBn')}</Label>
            <Input placeholder="যেমন: রহিম চাচার টঙ" className="font-bangla h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.name_bn} onChange={e => updateField('name_bn', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('stallNameEn')}</Label>
            <Input placeholder="e.g., Rahim Chacha's Tong" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.name_en} onChange={e => updateField('name_en', e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('ownerName')}</Label>
            <Input placeholder={lang === 'bn' ? 'মালিকের নাম লিখুন' : 'Enter owner name'} className="font-bangla h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.owner_name} onChange={e => updateField('owner_name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('phone')}</Label>
            <Input placeholder="01XXXXXXXXX" type="tel" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-card border border-border/50 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">২</span>
          {t('division')} ও {t('district')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('division')}</Label>
            <Select value={form.division} onValueChange={v => updateField('division', v)} required>
              <SelectTrigger className="font-bangla h-12 rounded-xl bg-muted/30 border-none focus:ring-primary/20 outline-none"><SelectValue placeholder={t('division')} /></SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50">
                {divisions.map(d => (
                  <SelectItem key={d.en} value={d.en} className="font-bangla focus:bg-primary/10 focus:text-primary">{lang === 'bn' ? d.bn : d.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('district')}</Label>
            <Input placeholder={t('district')} className="font-bangla h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.district} onChange={e => updateField('district', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('upazila')}</Label>
            <Input placeholder={t('upazila')} className="font-bangla h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.upazila} onChange={e => updateField('upazila', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Latitude</Label>
            <Input type="number" step="any" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.lat} onChange={e => updateField('lat', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">Longitude</Label>
            <Input type="number" step="any" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.lng} onChange={e => updateField('lng', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Timing & Pricing */}
      <div className="bg-card border border-border/50 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">৩</span>
          সময় এবং মূল্য
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1 flex items-center gap-1"><Clock className="w-4 h-4" /> {t('openTime')}</Label>
            <Input type="time" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.open_time} onChange={e => updateField('open_time', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1 flex items-center gap-1"><Clock className="w-4 h-4" /> {t('closeTime')}</Label>
            <Input type="time" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.close_time} onChange={e => updateField('close_time', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('teaPrice')} ({t('taka')} min)</Label>
            <Input type="number" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.tea_price_min} onChange={e => updateField('tea_price_min', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('teaPrice')} ({t('taka')} max)</Label>
            <Input type="number" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" value={form.tea_price_max} onChange={e => updateField('tea_price_max', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Description & Photo */}
      <div className="bg-card border border-border/50 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">৪</span>
          বিস্তারিত এবং ছবি
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('descriptionBn')}</Label>
            <Textarea placeholder="বাংলায় বিবরণ লিখুন..." className="font-bangla rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 resize-none" rows={4} value={form.description_bn} onChange={e => updateField('description_bn', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bangla text-muted-foreground ml-1">{t('descriptionEn')}</Label>
            <Textarea placeholder="Write description in English..." className="rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 resize-none" rows={4} value={form.description_en} onChange={e => updateField('description_en', e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bangla text-muted-foreground ml-1 flex items-center gap-1"><Camera className="w-4 h-4" /> {lang === 'bn' ? 'দোকানের ছবি' : 'Stall Photo'}</Label>
          <div className="relative group cursor-pointer h-32 md:h-40 rounded-3xl bg-muted/30 border-2 border-dashed border-border/50 flex flex-col items-center justify-center transition-colors hover:bg-primary/5 hover:border-primary/50 overflow-hidden">
            <Camera className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-bangla">{lang === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload photo'}</span>
            <Input id="stall-image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer h-full" />
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-card border border-border/50 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">৫</span>
          {t('facilities')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facilityOptions.map(f => (
            <label key={f.key} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${facilities.includes(f.key) ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-muted/30 border-transparent hover:border-primary/50'}`}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <span className="font-bangla text-[10px] md:text-xs text-center font-bold">{f.label}</span>
              <Checkbox checked={facilities.includes(f.key)} onCheckedChange={() => toggleFacility(f.key)} className="mt-2" />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-10">
        <Button type="submit" size="lg" className="font-bangla h-16 rounded-2xl text-lg flex-1 shadow-xl shadow-primary/20 gap-3" disabled={loading}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Check className="w-6 h-6" />
          )}
          {loading ? (lang === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : t('submit')}
        </Button>
        <Button type="button" variant="outline" size="lg" className="font-bangla h-16 rounded-2xl text-lg border-border/50 hover:bg-muted" onClick={() => navigate(-1)}>
          {t('cancel')}
        </Button>
      </div>
    </motion.form>
  );
};

export default AddStallForm;
