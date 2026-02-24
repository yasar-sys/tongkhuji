import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Camera, Check, X, Image } from 'lucide-react';
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_bn: '', name_en: '', owner_name: '', phone: '',
    division: '', district: '', upazila: '',
    open_time: '06:00', close_time: '22:00',
    tea_price_min: '10', tea_price_max: '30',
    description_bn: '', description_en: '',
    lat: searchParams.get('lat') || '23.8103',
    lng: searchParams.get('lng') || '90.4125',
  });

  const [geoLoading, setGeoLoading] = useState(false);

  // Reverse geocode to auto-fill division/district/upazila
  const reverseGeocode = async (lat: string, lng: string) => {
    setGeoLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en&zoom=14`);
      const data = await res.json();
      const addr = data.address || {};
      
      // Map state/region to our division list
      const state = (addr.state || '').replace(' Division', '');
      const matchedDivision = divisions.find(d => 
        d.en.toLowerCase() === state.toLowerCase() || 
        d.bn === state
      );

      setForm(prev => ({
        ...prev,
        lat, lng,
        division: matchedDivision?.en || prev.division,
        district: addr.county || addr.city || addr.town || prev.district,
        upazila: addr.suburb || addr.town || addr.village || prev.upazila,
      }));
    } catch {
      // silently fail, user can fill manually
    } finally {
      setGeoLoading(false);
    }
  };

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (lat && lng) {
      reverseGeocode(lat, lng);
    }
  }, [searchParams]);

  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleFacility = (f: string) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: lang === 'bn' ? 'প্রথমে লগইন করুন' : 'Please login first', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      // Insert stall
      const { data: stallData, error } = await supabase.from('tea_stalls').insert({
        user_id: user.id,
        name_bn: form.name_bn,
        name_en: form.name_en,
        owner_name: form.owner_name || null,
        phone: form.phone || null,
        division: form.division,
        district: form.district,
        upazila: form.upazila || null,
        open_time: form.open_time,
        close_time: form.close_time,
        tea_price_min: parseInt(form.tea_price_min) || 10,
        tea_price_max: parseInt(form.tea_price_max) || 30,
        description_bn: form.description_bn || null,
        description_en: form.description_en || null,
        lat: parseFloat(form.lat) || 23.8103,
        lng: parseFloat(form.lng) || 90.4125,
        facilities,
      }).select().single();

      if (error) throw error;

      // Upload image if exists
      const file = fileInputRef.current?.files?.[0];
      if (file && stallData) {
        const ext = file.name.split('.').pop();
        const fileName = `${stallData.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('stall-photos').upload(fileName, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('stall-photos').getPublicUrl(fileName);
          await supabase.from('stall_images').insert({ stall_id: stallData.id, image_url: publicUrl });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['tea-stalls'] });
      toast({
        title: lang === 'bn' ? '✅ সফলভাবে যোগ হয়েছে!' : '✅ Successfully added!',
        description: lang === 'bn' ? 'আপনার টঙ মানচিত্রে যোগ করা হয়েছে।' : 'Your stall has been added to the map.',
      });
      navigate('/map');
    } catch (err: any) {
      toast({ title: lang === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const facilityOptions = [
    { key: 'wifi', label: t('wifi'), icon: '📶' },
    { key: 'tv', label: t('tv'), icon: '📺' },
    { key: 'seating', label: t('seating'), icon: '🪑' },
    { key: 'smoking_zone', label: t('smokingZone'), icon: '🚬' },
  ];

  const sectionClass = "bg-card border border-border/30 rounded-2xl md:rounded-[32px] p-4 md:p-8 space-y-5 shadow-sm";
  const inputClass = "font-bangla h-11 md:h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-5 md:space-y-8 pb-24"
    >
      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="text-lg md:text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm">১</span>
          {lang === 'bn' ? 'সাধারণ তথ্য' : 'Basic Information'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('stallNameBn')} *</Label>
            <Input placeholder="যেমন: রহিম চাচার টঙ" className={inputClass} value={form.name_bn} onChange={e => updateField('name_bn', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('stallNameEn')} *</Label>
            <Input placeholder="e.g., Rahim Chacha's Tong" className={inputClass} value={form.name_en} onChange={e => updateField('name_en', e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('ownerName')}</Label>
            <Input placeholder={lang === 'bn' ? 'মালিকের নাম' : 'Owner name'} className={inputClass} value={form.owner_name} onChange={e => updateField('owner_name', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('phone')}</Label>
            <Input placeholder="01XXXXXXXXX" type="tel" className={inputClass} value={form.phone} onChange={e => updateField('phone', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className={sectionClass}>
        <h2 className="text-lg md:text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm">২</span>
          <MapPin className="w-4 h-4" /> {lang === 'bn' ? 'অবস্থান' : 'Location'}
          {geoLoading && <span className="ml-2 text-xs text-muted-foreground animate-pulse font-normal">{lang === 'bn' ? '📍 লোকেশন খোঁজা হচ্ছে...' : '📍 Detecting location...'}</span>}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('division')} *</Label>
            <Select value={form.division} onValueChange={v => updateField('division', v)} required>
              <SelectTrigger className="font-bangla h-11 md:h-12 rounded-xl bg-muted/30 border-none"><SelectValue placeholder={t('division')} /></SelectTrigger>
              <SelectContent className="rounded-2xl">
                {divisions.map(d => (
                  <SelectItem key={d.en} value={d.en} className="font-bangla">{lang === 'bn' ? d.bn : d.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('district')} *</Label>
            <Input placeholder={t('district')} className={inputClass} value={form.district} onChange={e => updateField('district', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('upazila')}</Label>
            <Input placeholder={t('upazila')} className={inputClass} value={form.upazila} onChange={e => updateField('upazila', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs ml-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Latitude</Label>
            <Input type="number" step="any" className={inputClass} value={form.lat} onChange={e => updateField('lat', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs ml-1">Longitude</Label>
            <Input type="number" step="any" className={inputClass} value={form.lng} onChange={e => updateField('lng', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Timing & Pricing */}
      <div className={sectionClass}>
        <h2 className="text-lg md:text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm">৩</span>
          <Clock className="w-4 h-4" /> {lang === 'bn' ? 'সময় ও মূল্য' : 'Time & Price'}
        </h2>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('openTime')}</Label>
            <Input type="time" className={inputClass} value={form.open_time} onChange={e => updateField('open_time', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('closeTime')}</Label>
            <Input type="time" className={inputClass} value={form.close_time} onChange={e => updateField('close_time', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('teaPrice')} (৳ min)</Label>
            <Input type="number" className={inputClass} value={form.tea_price_min} onChange={e => updateField('tea_price_min', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('teaPrice')} (৳ max)</Label>
            <Input type="number" className={inputClass} value={form.tea_price_max} onChange={e => updateField('tea_price_max', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Description & Photo */}
      <div className={sectionClass}>
        <h2 className="text-lg md:text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm">৪</span>
          <Camera className="w-4 h-4" /> {lang === 'bn' ? 'বিবরণ ও ছবি' : 'Details & Photo'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('descriptionBn')}</Label>
            <Textarea placeholder="বাংলায় বিবরণ..." className="font-bangla rounded-xl bg-muted/30 border-none resize-none text-sm" rows={3} value={form.description_bn} onChange={e => updateField('description_bn', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bangla text-muted-foreground text-xs ml-1">{t('descriptionEn')}</Label>
            <Textarea placeholder="Description in English..." className="rounded-xl bg-muted/30 border-none resize-none text-sm" rows={3} value={form.description_en} onChange={e => updateField('description_en', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-bangla text-muted-foreground text-xs ml-1 flex items-center gap-1">
            <Image className="w-3 h-3" /> {lang === 'bn' ? 'দোকানের ছবি' : 'Stall Photo'}
          </Label>
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden h-40 md:h-48">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer h-28 md:h-36 rounded-2xl bg-muted/30 border-2 border-dashed border-border/50 flex flex-col items-center justify-center transition-colors hover:bg-primary/5 hover:border-primary/50"
            >
              <Camera className="w-7 h-7 text-muted-foreground mb-1.5" />
              <span className="text-xs text-muted-foreground font-bangla">{lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload photo'}</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      {/* Facilities */}
      <div className={sectionClass}>
        <h2 className="text-lg md:text-xl font-bold font-bangla text-primary flex items-center gap-2">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm">৫</span>
          {t('facilities')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          {facilityOptions.map(f => (
            <label key={f.key} className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer ${facilities.includes(f.key) ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-muted/30 border-transparent hover:border-primary/50'}`}>
              <div className="text-xl md:text-2xl mb-1.5">{f.icon}</div>
              <span className="font-bangla text-[10px] md:text-xs text-center font-bold">{f.label}</span>
              <Checkbox checked={facilities.includes(f.key)} onCheckedChange={() => toggleFacility(f.key)} className="mt-1.5" />
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" size="lg" className="font-bangla h-14 rounded-2xl text-base flex-1 shadow-xl shadow-primary/20 gap-2" disabled={loading}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          {loading ? (lang === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : t('submit')}
        </Button>
        <Button type="button" variant="outline" size="lg" className="font-bangla h-14 rounded-2xl text-base border-border/50" onClick={() => navigate(-1)}>
          {t('cancel')}
        </Button>
      </div>
    </motion.form>
  );
};

export default AddStallForm;
