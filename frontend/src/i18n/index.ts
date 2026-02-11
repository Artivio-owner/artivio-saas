import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

const lang =
  localStorage.getItem('lang') ||
  navigator.language.split('-')[0] ||
  'ru';

i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;