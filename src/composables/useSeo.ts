import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

type LocaleSeo = {
  description: string;
  keywords: string;
  ogLocale: string;
  ogLocaleAlternate: string;
};

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://calcup.ru').replace(/\/+$/, '');

const SEO_BY_LOCALE: Record<'ru' | 'en', LocaleSeo> = {
  ru: {
    description: 'Calcup - ретро рабочий стол для продуктивности: Pomodoro-таймер, планировщик задач, фоновые звуки и обратный отсчет.',
    keywords: 'calcup, pomodoro таймер, помодоро, таймер продуктивности, планировщик задач, фокус, фоновые звуки, обратный отсчет',
    ogLocale: 'ru_RU',
    ogLocaleAlternate: 'en_US',
  },
  en: {
    description: 'Calcup is a retro productivity desk with a Pomodoro timer, task planner, ambient focus sounds, and countdown.',
    keywords: 'calcup, pomodoro timer, productivity timer, task planner, focus tool, ambient sounds, countdown',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'ru_RU',
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
    const seo = SEO_BY_LOCALE[localeCode];
    const title = t('title');
    const canonicalUrl = `${SITE_URL}/`;

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
    upsertMetaByName('twitter:image', `${SITE_URL}/og-image.png`);
    upsertMetaByName('twitter:url', canonicalUrl);

    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'Calcup');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', seo.description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', `${SITE_URL}/og-image.png`);
    upsertMetaByProperty('og:image:type', 'image/png');
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
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      inLanguage: ['ru', 'en'],
      description: seo.description,
      image: `${SITE_URL}/og-image.png`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Pomodoro timer',
        'Task planner',
        'Ambient focus sounds',
        'Date countdown',
      ],
    });
  });
}
