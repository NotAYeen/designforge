import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('es'); // Default

  useEffect(() => {
    // Auto-detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('en')) {
      setLang('en');
    } else {
      setLang('es');
    }
  }, []);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['es']?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
