import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import config from '@/config';
import { prepareTranslationObj } from '@/utils/translation.ts';
import translations from './constants/translations';

const resources = config.availableLanguages.reduce(
  (acc, item) => {
    acc[item] = {
      translation: prepareTranslationObj(translations, item),
    };
    return acc;
  },
  {} as Record<string, any>,
);

void i18n.use(initReactI18next).init({
  resources,
  lng: config.defaultLanguage,
  fallbackLng: config.defaultLanguage,
  debug: false,

  interpolation: {
    escapeValue: false, // react сам делает escape
  },
  react: {
    bindI18nStore: 'added',
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'x-nowrap'],
  },
});

export default i18n;
