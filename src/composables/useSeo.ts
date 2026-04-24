import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { CALCULATORS } from '../data/calculators'
import { CATEGORIES } from '../data/categories'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://calcup.ru').replace(/\/+$/, '')

const APP_CATEGORY_BY_CATEGORY: Record<string, string> = {
  finance: 'FinanceApplication',
  health: 'HealthApplication',
  math: 'UtilityApplication',
  construction: 'UtilityApplication',
  datetime: 'UtilityApplication',
  transport: 'UtilityApplication',
  convert: 'UtilityApplication',
  everyday: 'UtilityApplication',
}

const DEFAULT_TITLE = {
  ru: 'Calcup — Онлайн калькуляторы: кредит, ИМТ, проценты',
  en: 'Calcup — Online Calculators: Loan, BMI, Percentage',
}

const DEFAULT_DESCRIPTION = {
  ru: 'Бесплатные онлайн калькуляторы: кредитный, ипотечный, ИМТ, процентов и другие.',
  en: 'Free online calculators: loan, mortgage, BMI, percentage and more.',
}

export function useSeo() {
  const route = useRoute()
  const { locale } = useI18n()

  const lang = computed<'ru' | 'en'>(() =>
    String(locale.value).startsWith('ru') ? 'ru' : 'en',
  )

  const calc = computed(() => {
    const { categorySlug, toolSlug } = route.meta
    if (!categorySlug || !toolSlug) return null
    return CALCULATORS.find(c => c.categorySlug === categorySlug && c.slug === toolSlug) ?? null
  })

  const category = computed(() => {
    const { categorySlug, toolSlug } = route.meta
    if (!categorySlug || toolSlug) return null
    return CATEGORIES.find(c => c.slug === categorySlug) ?? null
  })

  const title = computed(() => {
    const l = lang.value
    if (calc.value) return `${calc.value.title[l]} — Calcup`
    if (category.value) return `${category.value.title[l]} — Calcup`
    return DEFAULT_TITLE[l]
  })

  const description = computed(() => {
    const l = lang.value
    if (calc.value) return calc.value.description[l]
    if (category.value) return category.value.description[l]
    return DEFAULT_DESCRIPTION[l]
  })

  const canonical = computed(() => {
    const path = route.path.replace(/\/+$/, '')
    return `${SITE_URL}${path}/`
  })

  const robots = computed(() =>
    route.meta.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large',
  )

  const applicationCategory = computed(
    () => APP_CATEGORY_BY_CATEGORY[calc.value?.categorySlug ?? ''] ?? 'UtilityApplication',
  )

  const ogLocale = computed(() => (lang.value === 'ru' ? 'ru_RU' : 'en_US'))
  const ogLocaleAlt = computed(() => (lang.value === 'ru' ? 'en_US' : 'ru_RU'))

  const jsonLd = computed(() => {
    if (!calc.value) {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Calcup',
        url: `${SITE_URL}/`,
      }
    }
    const l = lang.value
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Calcup', item: `${SITE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: calc.value.title[l],
          item: canonical.value,
        },
      ],
    }
    const app = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: calc.value.title[l],
      url: canonical.value,
      applicationCategory: applicationCategory.value,
      operatingSystem: 'Web',
      inLanguage: ['ru', 'en'],
      description: description.value,
      image: `${SITE_URL}/og-image.jpg`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }
    return { '@context': 'https://schema.org', '@graph': [app, breadcrumb] }
  })

  useHead(
    computed(() => ({
      title: title.value,
      htmlAttrs: { lang: lang.value },
      meta: [
        { name: 'description', content: description.value },
        { name: 'robots', content: robots.value },
        { name: 'application-name', content: 'Calcup' },
        { name: 'theme-color', content: '#263542' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Calcup' },
        { property: 'og:title', content: title.value },
        { property: 'og:description', content: description.value },
        { property: 'og:url', content: canonical.value },
        { property: 'og:image', content: `${SITE_URL}/og-image.jpg` },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: ogLocale.value },
        { property: 'og:locale:alternate', content: ogLocaleAlt.value },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title.value },
        { name: 'twitter:description', content: description.value },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.jpg` },
        { name: 'twitter:url', content: canonical.value },
      ],
      link: [
        { rel: 'canonical', href: canonical.value },
        { rel: 'alternate', hreflang: 'ru', href: canonical.value },
        { rel: 'alternate', hreflang: 'en', href: canonical.value },
        { rel: 'alternate', hreflang: 'x-default', href: canonical.value },
        { rel: 'manifest', href: `${SITE_URL}/manifest.webmanifest` },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd.value),
        },
      ],
    })),
  )
}
