import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Get saved locale or default to browser preference/en
const savedLocale = localStorage.getItem('user-locale');
const browserLocale = navigator.language.split('-')[0];
const defaultLocale = savedLocale || (['ru', 'en'].includes(browserLocale) ? browserLocale : 'en');

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
});

export default i18n;
