import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Get saved locale or default to browser preference/ru (SSG-safe)
const isClient = typeof window !== 'undefined'
const savedLocale = isClient ? localStorage.getItem('user-locale') : null
const browserLocale = isClient ? navigator.language.split('-')[0] : 'ru'
const defaultLocale = savedLocale || (['ru', 'en'].includes(browserLocale) ? browserLocale : 'ru');

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
