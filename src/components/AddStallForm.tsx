import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { divisions } from '@/data/sampleStalls';
import { useToast } from '@/hooks/use-toast';

const AddStallForm = () => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<string[]>([]);

  const toggleFacility = (f: string) => {
    setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: lang === 'bn' ? 'সফলভাবে জমা হয়েছে!' : 'Successfully submitted!',
      description: lang === 'bn' ? 'আপনার টঙ পর্যালোচনার জন্য পাঠানো হয়েছে।' : 'Your stall has been sent for review.',
    });
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
      {/* Stall Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('stallNameBn')}</Label>
          <Input placeholder="যেমন: রহিম চাচার টঙ" className="font-bangla" />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('stallNameEn')}</Label>
          <Input placeholder="e.g., Rahim Chacha's Tong" />
        </div>
      </div>

      {/* Owner & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('ownerName')}</Label>
          <Input placeholder={lang === 'bn' ? 'মালিকের নাম লিখুন' : 'Enter owner name'} className="font-bangla" />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('phone')}</Label>
          <Input placeholder="01XXXXXXXXX" type="tel" />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('division')}</Label>
          <Select>
            <SelectTrigger className="font-bangla">
              <SelectValue placeholder={t('division')} />
            </SelectTrigger>
            <SelectContent>
              {divisions.map(d => (
                <SelectItem key={d.en} value={d.en} className="font-bangla">
                  {lang === 'bn' ? d.bn : d.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('district')}</Label>
          <Input placeholder={t('district')} className="font-bangla" />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('upazila')}</Label>
          <Input placeholder={t('upazila')} className="font-bangla" />
        </div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla flex items-center gap-1">
            <Clock className="w-4 h-4" /> {t('openTime')}
          </Label>
          <Input type="time" defaultValue="06:00" />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla flex items-center gap-1">
            <Clock className="w-4 h-4" /> {t('closeTime')}
          </Label>
          <Input type="time" defaultValue="22:00" />
        </div>
      </div>

      {/* Tea Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('teaPrice')} ({t('taka')} min)</Label>
          <Input type="number" placeholder="10" />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('teaPrice')} ({t('taka')} max)</Label>
          <Input type="number" placeholder="30" />
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bangla">{t('descriptionBn')}</Label>
          <Textarea placeholder="বাংলায় বিবরণ লিখুন..." className="font-bangla" rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="font-bangla">{t('descriptionEn')}</Label>
          <Textarea placeholder="Write description in English..." rows={3} />
        </div>
      </div>

      {/* Facilities */}
      <div className="space-y-3">
        <Label className="font-bangla">{t('facilities')}</Label>
        <div className="flex flex-wrap gap-3">
          {facilityOptions.map(f => (
            <label
              key={f.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                facilities.includes(f.key)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <Checkbox
                checked={facilities.includes(f.key)}
                onCheckedChange={() => toggleFacility(f.key)}
              />
              <span className="font-bangla text-sm">{f.icon} {f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Photo upload placeholder */}
      <div className="space-y-2">
        <Label className="font-bangla">{t('photos')}</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-bangla">
            {lang === 'bn' ? 'ছবি টেনে আনুন অথবা ক্লিক করুন' : 'Drag photos or click to upload'}
          </p>
        </div>
      </div>

      {/* Map pin placeholder */}
      <div className="space-y-2">
        <Label className="font-bangla flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {lang === 'bn' ? 'মানচিত্রে অবস্থান নির্বাচন করুন' : 'Select location on map'}
        </Label>
        <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-bangla">
            {lang === 'bn' ? 'মানচিত্রে ক্লিক করে অবস্থান নির্বাচন করুন' : 'Click on map to select location'}
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" size="lg" className="font-bangla gap-2 flex-1 md:flex-none">
          <Check className="w-4 h-4" />
          {t('submit')}
        </Button>
        <Button type="button" variant="outline" size="lg" className="font-bangla">
          {t('cancel')}
        </Button>
      </div>
    </motion.form>
  );
};

export default AddStallForm;
