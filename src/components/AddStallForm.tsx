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
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('stallNameBn')}</Label>
          <Input placeholder="যেমন: রহিম চাচার টঙ" className="font-bangla" value={form.name_bn} onChange={e => updateField('name_bn', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('stallNameEn')}</Label>
          <Input placeholder="e.g., Rahim Chacha's Tong" value={form.name_en} onChange={e => updateField('name_en', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('ownerName')}</Label>
          <Input placeholder={lang === 'bn' ? 'মালিকের নাম লিখুন' : 'Enter owner name'} className="font-bangla" value={form.owner_name} onChange={e => updateField('owner_name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('phone')}</Label>
          <Input placeholder="01XXXXXXXXX" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('division')}</Label>
          <Select value={form.division} onValueChange={v => updateField('division', v)} required>
            <SelectTrigger className="font-bangla"><SelectValue placeholder={t('division')} /></SelectTrigger>
            <SelectContent>
              {divisions.map(d => (
                <SelectItem key={d.en} value={d.en} className="font-bangla">{lang === 'bn' ? d.bn : d.en}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('district')}</Label>
          <Input placeholder={t('district')} className="font-bangla" value={form.district} onChange={e => updateField('district', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('upazila')}</Label>
          <Input placeholder={t('upazila')} className="font-bangla" value={form.upazila} onChange={e => updateField('upazila', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla flex items-center gap-1"><Clock className="w-4 h-4" /> {t('openTime')}</Label>
          <Input type="time" value={form.open_time} onChange={e => updateField('open_time', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla flex items-center gap-1"><Clock className="w-4 h-4" /> {t('closeTime')}</Label>
          <Input type="time" value={form.close_time} onChange={e => updateField('close_time', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('teaPrice')} ({t('taka')} min)</Label>
          <Input type="number" value={form.tea_price_min} onChange={e => updateField('tea_price_min', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('teaPrice')} ({t('taka')} max)</Label>
          <Input type="number" value={form.tea_price_max} onChange={e => updateField('tea_price_max', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('descriptionBn')}</Label>
          <Textarea placeholder="বাংলায় বিবরণ লিখুন..." className="font-bangla" rows={3} value={form.description_bn} onChange={e => updateField('description_bn', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('descriptionEn')}</Label>
          <Textarea placeholder="Write description in English..." rows={3} value={form.description_en} onChange={e => updateField('description_en', e.target.value)} />
        </div>
      </div>

      {/* Lat/Lng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla flex items-center gap-1"><MapPin className="w-4 h-4" /> Latitude</Label>
          <Input type="number" step="any" value={form.lat} onChange={e => updateField('lat', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">Longitude</Label>
          <Input type="number" step="any" value={form.lng} onChange={e => updateField('lng', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bangla flex items-center gap-1"><Camera className="w-4 h-4" /> {lang === 'bn' ? 'দোকানের ছবি' : 'Stall Photo'}</Label>
        <Input id="stall-image" type="file" accept="image/*" className="cursor-pointer" />
      </div>

      <div className="space-y-3">
        <Label className="font-bangla">{t('facilities')}</Label>
        <div className="flex flex-wrap gap-3">
          {facilityOptions.map(f => (
            <label key={f.key} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${facilities.includes(f.key) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border hover:border-primary/50'}`}>
              <Checkbox checked={facilities.includes(f.key)} onCheckedChange={() => toggleFacility(f.key)} />
              <span className="font-bangla text-sm">{f.icon} {f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" size="lg" className="font-bangla gap-2 flex-1 md:flex-none" disabled={loading}>
          <Check className="w-4 h-4" />
          {loading ? (lang === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : t('submit')}
        </Button>
        <Button type="button" variant="outline" size="lg" className="font-bangla" onClick={() => navigate(-1)}>
          {t('cancel')}
        </Button>
      </div>
    </motion.form>
  );
};

export default AddStallForm;
