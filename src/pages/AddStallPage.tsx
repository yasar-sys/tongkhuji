import { useLanguage } from '@/contexts/LanguageContext';
import AddStallForm from '@/components/AddStallForm';

const AddStallPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-bangla mb-2">
            🍵 {t('addNewStall')}
          </h1>
          <p className="text-muted-foreground font-bangla">
            {lang === 'bn'
              ? 'আপনার পছন্দের চায়ের দোকানটি মানচিত্রে যোগ করুন'
              : 'Add your favorite tea stall to the map'}
          </p>
        </div>
        <AddStallForm />
      </div>
    </div>
  );
};

export default AddStallPage;
