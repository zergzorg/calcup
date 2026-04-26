import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { CALCULATORS } from '../data/calculators'
import { CATEGORIES } from '../data/categories'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://calcup.ru').replace(/\/+$/, '')
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DATE_MODIFIED = '2026-04-26'

const APP_CATEGORY_BY_CATEGORY: Record<string, string> = {
  finance: 'FinanceApplication',
  health: 'HealthApplication',
  math: 'UtilityApplication',
  construction: 'UtilityApplication',
  datetime: 'UtilityApplication',
  transport: 'UtilityApplication',
  sport: 'HealthApplication',
  animals: 'UtilityApplication',
  clothing: 'UtilityApplication',
  convert: 'UtilityApplication',
  everyday: 'UtilityApplication',
}

const DEFAULT_TITLE = {
  ru: 'Calcup — онлайн калькуляторы для финансов, здоровья, ремонта и спорта',
  en: 'Calcup — online calculators for finance, health, renovation and sport',
}

const DEFAULT_DESCRIPTION = {
  ru: 'Бесплатные онлайн калькуляторы без регистрации: кредиты, ипотека, НДС, ИМТ, калории, ремонт, спорт, животные, одежда и конвертеры.',
  en: 'Free online calculators without sign-up: loans, mortgage, VAT, BMI, calories, renovation, sport, pets, clothing and converters.',
}

const DEFAULT_KEYWORDS = {
  ru: 'онлайн калькулятор, калькуляторы, кредитный калькулятор, ипотечный калькулятор, калькулятор НДС, ИМТ, калории, ремонт, спорт, животные, конвертер величин',
  en: 'online calculator, calculators, loan calculator, mortgage calculator, VAT calculator, BMI, calories, renovation, sport, pets, unit converter',
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

  const keywords = computed(() => {
    const l = lang.value
    if (calc.value) {
      const terms = [
        calc.value.title[l],
        calc.value.title.ru,
        calc.value.title.en,
        ...calc.value.tags,
        ...(calc.value.aliases ?? []),
      ]
      return [...new Set(terms.map(term => term.trim()).filter(Boolean))].join(', ')
    }
    if (category.value) {
      return `${category.value.title[l]}, ${category.value.description[l]}, онлайн калькуляторы, Calcup`
    }
    return DEFAULT_KEYWORDS[l]
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
  const imageAlt = computed(() => `${title.value}: онлайн калькулятор Calcup`)

  const jsonLd = computed(() => {
    const l = lang.value
    const organization = {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Calcup',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/calcup.svg`,
    }
    const website = {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Calcup',
      url: `${SITE_URL}/`,
      inLanguage: ['ru', 'en'],
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }
    const webpage = {
      '@type': category.value ? 'CollectionPage' : 'WebPage',
      '@id': `${canonical.value}#webpage`,
      url: canonical.value,
      name: title.value,
      description: description.value,
      inLanguage: l,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      dateModified: DATE_MODIFIED,
    }

    if (route.meta.noindex) {
      return {
        '@context': 'https://schema.org',
        '@graph': [organization, website, webpage],
      }
    }

    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Calcup', item: `${SITE_URL}/` },
    ]
    if (category.value) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: category.value.title[l],
        item: canonical.value,
      })
    }
    if (calc.value) {
      const calcCategory = CATEGORIES.find(c => c.slug === calc.value?.categorySlug)
      if (calcCategory) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: calcCategory.title[l],
          item: `${SITE_URL}${calcCategory.path}/`,
        })
      }
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: calc.value.title[l],
        item: canonical.value,
      })
    }
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      '@id': `${canonical.value}#breadcrumb`,
      itemListElement: breadcrumbItems,
    }

    if (!calc.value) {
      return {
        '@context': 'https://schema.org',
        '@graph': category.value
          ? [organization, website, webpage, breadcrumb]
          : [organization, website, webpage],
      }
    }

    const app = {
      '@type': 'SoftwareApplication',
      '@id': `${canonical.value}#calculator`,
      name: calc.value.title[l],
      alternateName: calc.value.title[l === 'ru' ? 'en' : 'ru'],
      url: canonical.value,
      applicationCategory: applicationCategory.value,
      operatingSystem: 'Web',
      inLanguage: ['ru', 'en'],
      description: description.value,
      image: DEFAULT_IMAGE,
      isAccessibleForFree: true,
      publisher: { '@id': `${SITE_URL}/#organization` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        calc.value.title.ru,
        calc.value.title.en,
        ...calc.value.tags.slice(0, 8),
      ],
    }
    return {
      '@context': 'https://schema.org',
      '@graph': [organization, website, webpage, app, breadcrumb],
    }
  })

  useHead(
    computed(() => ({
      title: title.value,
      htmlAttrs: { lang: lang.value },
      meta: [
        { name: 'description', content: description.value },
        { name: 'keywords', content: keywords.value },
        { name: 'robots', content: robots.value },
        { name: 'application-name', content: 'Calcup' },
        { name: 'theme-color', content: '#263542' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Calcup' },
        { property: 'og:title', content: title.value },
        { property: 'og:description', content: description.value },
        { property: 'og:url', content: canonical.value },
        { property: 'og:image', content: DEFAULT_IMAGE },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: imageAlt.value },
        { property: 'og:locale', content: ogLocale.value },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title.value },
        { name: 'twitter:description', content: description.value },
        { name: 'twitter:image', content: DEFAULT_IMAGE },
        { name: 'twitter:image:alt', content: imageAlt.value },
        { name: 'twitter:url', content: canonical.value },
      ],
      link: [
        { rel: 'canonical', href: canonical.value },
        { rel: 'alternate', hreflang: lang.value, href: canonical.value },
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
