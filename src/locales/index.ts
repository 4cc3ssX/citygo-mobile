import {initReactI18next} from 'react-i18next';

import i18n from 'i18next';

import en from './en.json';
import mm from './mm.json';

const resources = {
  en: {
    translations: en,
  },
  mm: {
    translations: mm,
  },
};

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'translations';
    resources: (typeof resources)['en'];
  }
}

i18n.use(initReactI18next).init({
  returnNull: false,
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources,
  defaultNS: 'translations',
  supportedLngs: ['en', 'mm'],
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18n;
