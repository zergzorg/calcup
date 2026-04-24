import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

type LocaleSeo = {
  title: string;
  description: string;
  keywords: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  applicationCategory: string;
  featureList: string[];
};

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://calcup.ru').replace(/\/+$/, '');

const SEO_BY_LOCALE: Record<'ru' | 'en', LocaleSeo> = {
  ru: {
    title: 'Calcup — Помодоро-таймер, задачи и звуки для фокуса',
    description: 'Calcup - ретро рабочий стол для продуктивности: Pomodoro-таймер, планировщик задач, фоновые звуки и обратный отсчет.',
    keywords: 'calcup, pomodoro таймер, помодоро, таймер продуктивности, планировщик задач, фокус, фоновые звуки, обратный отсчет',
    ogLocale: 'ru_RU',
    ogLocaleAlternate: 'en_US',
    applicationCategory: 'ProductivityApplication',
    featureList: ['Pomodoro timer', 'Task planner', 'Ambient focus sounds', 'Date countdown'],
  },
  en: {
    title: 'Calcup — Free Retro Pomodoro Timer, Tasks and Focus Sounds',
    description: 'Calcup is a retro productivity desk with a Pomodoro timer, task planner, ambient focus sounds, and countdown.',
    keywords: 'calcup, pomodoro timer, productivity timer, task planner, focus tool, ambient sounds, countdown',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'ru_RU',
    applicationCategory: 'ProductivityApplication',
    featureList: ['Pomodoro timer', 'Task planner', 'Ambient focus sounds', 'Date countdown'],
  },
};

const CREDIT_SEO_BY_LOCALE: Record<'ru' | 'en', LocaleSeo> = {
  ru: {
    title: 'Кредитный калькулятор онлайн с графиком платежей — Calcup',
    description: 'Кредитный калькулятор Calcup считает ежемесячный платеж, переплату, график платежей и досрочное погашение кредита. Расчет можно распечатать или сохранить в PDF.',
    keywords: 'кредитный калькулятор, кредитный калькулятор онлайн, расчет кредита, график платежей, досрочное погашение кредита, аннуитетный платеж',
    ogLocale: 'ru_RU',
    ogLocaleAlternate: 'en_US',
    applicationCategory: 'FinanceApplication',
    featureList: ['Loan payment calculation', 'Payment schedule', 'Early repayment scenarios', 'Printable A4 report'],
  },
  en: {
    title: 'Loan Calculator with Payment Schedule — Calcup',
    description: 'Calcup loan calculator estimates monthly payments, total interest, payment schedule, and early repayment scenarios with a printable report.',
    keywords: 'loan calculator, payment schedule, early repayment calculator, annuity payment, credit calculator',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'ru_RU',
    applicationCategory: 'FinanceApplication',
    featureList: ['Loan payment calculation', 'Payment schedule', 'Early repayment scenarios', 'Printable A4 report'],
  },
};

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    if (hreflang) {
      tag.setAttribute('hreflang', hreflang);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let tag = document.querySelector(`#${id}`);
  if (!tag) {
    tag = document.createElement('script');
    tag.setAttribute('id', id);
    tag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

export function useSeo() {
  const { t, locale } = useI18n();

  watchEffect(() => {
    const localeCode = String(locale.value).startsWith('ru') ? 'ru' : 'en';
    const isCreditCalculatorPage = window.location.pathname.replace(/\/+$/, '') === '/credit-calc';
    const seo = isCreditCalculatorPage ? CREDIT_SEO_BY_LOCALE[localeCode] : SEO_BY_LOCALE[localeCode];
    const title = isCreditCalculatorPage ? seo.title : t('title');
    const canonicalUrl = isCreditCalculatorPage ? `${SITE_URL}/credit-calc/` : `${SITE_URL}/`;

    document.title = title;
    document.documentElement.lang = localeCode;

    upsertMetaByName('description', seo.description);
    upsertMetaByName('keywords', seo.keywords);
    upsertMetaByName('robots', 'index,follow,max-image-preview:large');
    upsertMetaByName('application-name', 'Calcup');
    upsertMetaByName('theme-color', '#263542');
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', seo.description);
    upsertMetaByName('twitter:image', `${SITE_URL}/og-image.jpg`);
    upsertMetaByName('twitter:url', canonicalUrl);

    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'Calcup');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', seo.description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', `${SITE_URL}/og-image.jpg`);
    upsertMetaByProperty('og:image:type', 'image/jpeg');
    upsertMetaByProperty('og:image:width', '1200');
    upsertMetaByProperty('og:image:height', '630');
    upsertMetaByProperty('og:locale', seo.ogLocale);
    upsertMetaByProperty('og:locale:alternate', seo.ogLocaleAlternate);

    upsertLink('canonical', canonicalUrl);
    upsertLink('alternate', canonicalUrl, 'ru');
    upsertLink('alternate', canonicalUrl, 'en');
    upsertLink('alternate', canonicalUrl, 'x-default');
    upsertLink('manifest', `${SITE_URL}/manifest.webmanifest`);

    upsertJsonLd('calcup-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calcup',
      alternateName: 'Calcup Retro Desk',
      url: canonicalUrl,
      applicationCategory: seo.applicationCategory,
      operatingSystem: 'Web',
      inLanguage: ['ru', 'en'],
      description: seo.description,
      image: `${SITE_URL}/og-image.jpg`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: seo.featureList,
    });
  });
}
