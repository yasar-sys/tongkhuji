import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, Language, TranslationKey } from '@/i18n/translations';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn');

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'bn' ? 'en' : 'bn');
  }, []);

  const t = useCallback((key: TranslationKey) => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
