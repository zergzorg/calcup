# Архитектурный план: calcup → агрегатор калькуляторов

## Phase 0: Ключевые наблюдения из кодовой базы

1. **Vite multi-entry**: `vite.config.ts` использует `rollupOptions.input` с двумя точками входа (`index.html` и `credit-calc/index.html`). При переходе на Vue Router нужна единая точка входа.
2. **SEO через `useSeo()`**: composable жёстко захардкоден под 2 страницы — нужна параметризация.
3. **DesktopLayout — монолит с детектом маршрута**: вызывает `window.location.pathname` для скрытия nav на кредитном калькуляторе. После Router уйдёт через `useRoute()`.
4. **i18n загружается весь сразу**: оба `ru.json` / `en.json` по ~200 строк. При 60 калькуляторах вырастут до 2000+ — нужна стратегия.
5. **Vue Router не установлен**: директория `src/router/` отсутствует.
6. **GitHub Pages + статика**: SSR невозможен, нужен либо SSG (Vite SSG), либо SPA с динамическими мета-тегами.

---

## 1. Рекомендация UI-кита

### Что не подходит

- **Konsta UI** — для мобильных приложений (iOS/Android), не для веб-сайтов
- **Consta Design System** — React-only, Vue 3 не поддерживается
- **Vuetify** — тянет в Material Design, тяжело сделать свой визуальный язык
- **Element Plus** — enterprise/admin-панельный вид, сложная кастомизация под публичный сайт

### Сравнительная таблица

| Критерий | Plain CSS | Tailwind CSS | shadcn-vue | **PrimeVue 4** | Naive UI |
|---|---|---|---|---|---|
| Размер бандла (gzip) | ~0 KB | ~10-20 KB | ~15-25 KB | **~50-80 KB** | ~40-60 KB |
| Vue 3 поддержка | — | полная | полная | **полная** | полная |
| TypeScript | — | отличный | отличный | **хороший** | отличный |
| InputNumber / Select / Slider | нет | нет | частично | **✅ все есть** | да |
| DatePicker | нет | нет | нет | **✅ есть** | да |
| DataTable | нет | нет | нет | **✅ есть** | да |
| Валидация форм | нет | нет | нет | **✅ PrimeForms** | нет |
| Unstyled mode (своя тема) | — | — | по умолчанию | **✅ есть** | нет |
| Glassmorphism-стиль | нативно | нативно | нативно | **через unstyled** | сложно |
| Готово для калькуляторов | — | частично | частично | **✅ да** | частично |

### Итоговая рекомендация: **PrimeVue 4 + Tailwind CSS**

**Ключевой аргумент**: при 60 калькуляторах каждая форма — это числовые поля, датапикеры, выпадашки, результаты в таблице. PrimeVue даёт `InputNumber`, `DatePicker`, `Select`, `DataTable`, `Slider`, `Tooltip`, `Dialog` из коробки — без написания лишнего кода.

**Страх «PrimeVue сломает glassmorphism-стиль»** снимается через **unstyled mode**: используем только логику и структуру компонентов, визуальные стили — полностью свои.

**Итоговый стек**:
```bash
npm install primevue @primeuix/themes primeicons
npm install @tailwindcss/vite tailwindcss
npm install zod          # валидация схем (опционально, для сложных калькуляторов)
```

**Стратегия двух слоёв**:
- Старый plain CSS остаётся для `/workspace` и `credit-calculator` — не трогаем
- PrimeVue (unstyled) + Tailwind — для новых страниц и новых калькуляторов
- Chart.js или ECharts — для графиков (кривая амортизации, гистограммы)
- Zod — для валидации сложных форм (простые калькуляторы — нативная валидация)

**Когда рассматривать Nuxt UI вместо PrimeVue**: если проект переедет на Nuxt 3 (для SSG/ISR), Nuxt UI — современная альтернатива с 125+ компонентами и Tailwind из коробки.

---

## 2. Полная файловая структура

```
calcup/
├── index.html                          # Vite-шаблон; vite-ssg генерирует dist/**/index.html
├── vite.config.ts                      # убрать multi-entry, добавить @tailwindcss/vite + ssgOptions
├── package.json
├── tsconfig.app.json
│
├── scripts/
│   └── generate-sitemap.ts             # генерирует sitemap.xml из CALCULATORS/CATEGORIES при сборке
│
├── public/
│   ├── calcup.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── og-image.jpg
│   └── 404.html                        # fallback-копия index.html (только если хостинг требует)
│                                       # sitemap.xml — НЕ хранить вручную, генерируется скриптом
│
└── src/
    ├── main.ts                         # ViteSSG + router + PrimeVue (не createApp)
    ├── App.vue                         # заменить на <RouterView> в layout-обёртке
    ├── i18n.ts                         # без изменений (пока)
    ├── style.css                       # добавить @import "tailwindcss"; @theme {}
    ├── shims-vue.d.ts
    ├── vite-env.d.ts
    │
    ├── router/
    │   └── index.ts                    # все маршруты, редиректы
    │
    ├── data/
    │   ├── types.ts                    # Calculator, Category, CalculatorStatus типы
    │   ├── categories.ts               # описание 8 категорий
    │   └── calculators.ts              # реестр всех калькуляторов
    │
    ├── views/
    │   ├── HomeView.vue                # / — главная с поиском и сеткой категорий
    │   ├── CategoryView.vue            # /finance, /math и т.д.
    │   ├── CalculatorView.vue          # /finance/credit — обёртка для feature-модуля
    │   ├── WorkspaceView.vue           # /workspace — перенесённый рабочий стол
    │   └── NotFoundView.vue            # 404
    │
    ├── components/
    │   ├── layout/
    │   │   ├── SiteLayout.vue          # обёртка для calculator/category/home
    │   │   ├── WorkspaceLayout.vue     # обёртка для /workspace
    │   │   ├── AppHeader.vue           # шапка с навигацией и поиском
    │   │   ├── AppFooter.vue
    │   │   └── AppBreadcrumb.vue       # хлебные крошки
    │   ├── home/
    │   │   ├── HeroSearch.vue          # поисковая строка на главной
    │   │   ├── CategoryGrid.vue        # сетка 8 категорий
    │   │   ├── CategoryCard.vue        # карточка одной категории
    │   │   ├── PopularSection.vue      # блок «Популярные»
    │   │   └── CalculatorCard.vue      # карточка калькулятора (переиспользуется везде)
    │   ├── search/
    │   │   ├── SearchModal.vue         # модальное окно результатов
    │   │   └── SearchResultItem.vue
    │   └── workspace/
    │       └── DesktopLayout.vue       # перемещён (без изменений в логике)
    │       └── ... (все существующие виджеты без изменений)
    │
    ├── lib/
    │   └── formatters/
    │       ├── number.ts               # formatMoney, formatPercent, formatBmi…
    │       ├── currency.ts             # Intl.NumberFormat (RUB / USD)
    │       └── date.ts                 # formatDate, diffDays…
    │
    ├── composables/
    │   ├── useSeo.ts                   # РАСШИРИТЬ: параметризовать
    │   ├── useSearch.ts                # НОВЫЙ: поиск по реестру
    │   ├── useCalculatorRegistry.ts    # НОВЫЙ: хелперы для работы с реестром
    │   └── ... (все существующие без изменений)
    │
    ├── locales/
    │   ├── ru.json                     # добавить секции nav, home, categories
    │   └── en.json
    │
    └── features/
        ├── credit-calculator/          # БЕЗ ИЗМЕНЕНИЙ
        │   └── ...
        │
        ├── bmi-calculator/             # НОВЫЙ (Фаза 4, P0)
        │   ├── components/
        │   │   └── BmiCalculatorView.vue
        │   ├── composables/
        │   │   └── useBmiCalculator.ts
        │   ├── types/
        │   │   └── bmi.ts
        │   ├── index.ts
        │   └── bmi-calculator.css
        │
        └── {category}-{name}/         # шаблон для всех будущих
            ├── components/
            │   └── {Name}View.vue
            ├── composables/
            │   └── use{Name}.ts
            ├── lib/
            │   ├── calculations.ts     # ОБЯЗАТЕЛЬНО: чистые функции формул
            │   └── calculations.test.ts # ОБЯЗАТЕЛЬНО: тесты формул (Vitest)
            ├── types/
            │   └── {name}.ts
            ├── index.ts               # export { default } from './components/{Name}View.vue'
            └── {name}.css
```

---

## 3. Роутинг — детальная схема

### Принцип: реестр — единственный источник правды

**Запрещено** вручную дублировать `path`, `categorySlug`, `toolSlug` в `router/index.ts`, если эти данные уже есть в `CALCULATORS` и `CATEGORIES`. Маршруты генерируются из реестра программно.

### `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { CALCULATORS } from '../data/calculators'

// Статические маршруты (не из реестра)
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { layout: 'site' }
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('../views/WorkspaceView.vue'),
    meta: { layout: 'workspace', noindex: true }
  },
  // Редиректы со старых URL
  { path: '/credit-calc', redirect: '/finance/credit' },
  { path: '/credit-calc/', redirect: '/finance/credit' },
]

// catch-all ВСЕГДА в самом конце итогового массива
const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
  meta: { layout: 'site', noindex: true }
}

// Маршруты категорий — генерируются из CATEGORIES
const categoryRoutes: RouteRecordRaw[] = CATEGORIES.map(category => ({
  path: category.path,
  name: `category-${category.slug}`,
  component: () => import('../views/CategoryView.vue'),
  meta: { layout: 'site', categorySlug: category.slug }
}))

// Маршруты калькуляторов — генерируются из CALCULATORS (только ready/soon)
// planned — не публикуются как маршруты вообще
const calculatorRoutes: RouteRecordRaw[] = CALCULATORS
  .filter(calc => calc.status !== 'planned')
  .map(calc => ({
    path: calc.path,
    name: `calc-${calc.id}`,
    component: () => import('../views/CalculatorView.vue'),
    meta: {
      layout: 'site',
      categorySlug: calc.categorySlug,
      toolSlug: calc.slug,
      noindex: calc.status === 'soon'   // soon-страницы не индексируются
    }
  }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...staticRoutes, ...categoryRoutes, ...calculatorRoutes, notFoundRoute],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
```

### `App.vue` после рефакторинга

```vue
<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteLayout from './components/layout/SiteLayout.vue'
import WorkspaceLayout from './components/layout/WorkspaceLayout.vue'

const route = useRoute()
const layoutComponent = computed(() =>
  route.meta.layout === 'workspace' ? WorkspaceLayout : SiteLayout
)
</script>
```

### Обработка 404 на GitHub Pages

**Не использовать** простой `window.location.replace` — теряет query/hash и некорректно работает при нестандартном `base`. Используем `vite-ssg` с первого дня.

**vite-ssg** генерирует отдельный `index.html` для каждого маршрута при сборке — прямые URL работают без JavaScript. `includedRoutes` берётся из реестра:

```typescript
// vite.config.ts
import { CATEGORIES } from './src/data/categories'
import { CALCULATORS } from './src/data/calculators'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  ssgOptions: {
    includedRoutes() {
      return [
        '/',
        '/workspace',
        ...CATEGORIES.map(c => c.path),
        ...CALCULATORS
          .filter(c => c.status === 'ready')
          .map(c => c.path),
        // soon: пререндерить с noindex (они кликабельны из CategoryView)
        ...CALCULATORS
          .filter(c => c.status === 'soon')
          .map(c => c.path),
      ]
    }
  }
})
```

`public/404.html` — оставить как fallback-копию `index.html` на случай если хостинг требует (GitHub Pages отдаёт его для путей вне `dist`).

**Когда переходить на SSG**: с первой же сборки — не откладывать.

---

## 4. Реестр калькуляторов

### `src/data/types.ts`

```typescript
import type { Component } from 'vue'

export type CalculatorStatus = 'ready' | 'soon' | 'planned'
export type CalculatorPriority = 'P0' | 'P1' | 'P2' | 'P3'
export type CategorySlug =
  | 'finance' | 'math' | 'construction'
  | 'health' | 'datetime' | 'transport'
  | 'convert' | 'everyday'

export interface CalculatorMeta {
  id: string
  slug: string
  categorySlug: CategorySlug
  /** Метаданные для карточек, SEO, поиска — хранятся в реестре */
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  icon: string
  status: CalculatorStatus
  priority: CalculatorPriority
  /** Теги + aliases для поиска (синонимы, разговорные формы) */
  tags: string[]
  aliases?: string[]
  path: string
  popularity?: number
  /**
   * Loader для defineAsyncComponent — не Component напрямую.
   * Undefined если status !== 'ready'.
   */
  componentLoader?: () => Promise<{ default: Component }>
}

export interface CategoryMeta {
  slug: CategorySlug
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  icon: string
  color: string
  path: string
}
```

### Правило: `status` определяет видимость

| status | Маршрут | Публичный поиск | Sitemap | robots |
|--------|---------|-----------------|---------|--------|
| `ready` | ✅ | ✅ | ✅ | index |
| `soon` | ✅ (страница-заглушка) | ❌ | ❌ | noindex |
| `planned` | ❌ | ❌ | ❌ | — |

`soon`-страницы показываются только в CategoryView как карточки «Скоро», но не добавляются в поиск и не индексируются (`<meta name="robots" content="noindex, follow">`).

### `src/data/calculators.ts` (фрагмент)

```typescript
import type { CalculatorMeta } from './types'

export const CALCULATORS: CalculatorMeta[] = [
  // ===== FINANCE =====
  {
    id: 'credit',
    slug: 'credit',
    categorySlug: 'finance',
    title: { ru: 'Кредитный калькулятор', en: 'Loan Calculator' },
    description: {
      ru: 'Ежемесячный платёж, переплата, график и досрочное погашение',
      en: 'Monthly payment, total interest, schedule and early repayment'
    },
    icon: '🏦',
    status: 'ready',
    priority: 'P0',
    popularity: 100,
    path: '/finance/credit',
    tags: ['кредит', 'ипотека', 'платеж', 'loan', 'mortgage', 'payment'],
    aliases: ['займ', 'кредит наличными'],
    componentLoader: () => import('../features/credit-calculator')
  },
  {
    id: 'mortgage',
    slug: 'mortgage',
    categorySlug: 'finance',
    title: { ru: 'Ипотечный калькулятор', en: 'Mortgage Calculator' },
    description: {
      ru: 'Расчёт ипотеки с первоначальным взносом',
      en: 'Mortgage calculation with down payment'
    },
    icon: '🏘️',
    status: 'soon',
    priority: 'P1',
    path: '/finance/mortgage',
    tags: ['ипотека', 'жильё', 'mortgage', 'housing']
  },
  // ...
  // ===== HEALTH =====
  {
    id: 'bmi',
    slug: 'bmi',
    categorySlug: 'health',
    title: { ru: 'Калькулятор ИМТ', en: 'BMI Calculator' },
    description: {
      ru: 'Индекс массы тела по росту и весу с интерпретацией',
      en: 'Body mass index with interpretation'
    },
    icon: '⚖️',
    status: 'soon',
    priority: 'P0',
    path: '/health/bmi',
    tags: ['имт', 'вес', 'рост', 'bmi', 'weight', 'height']
  },
  // ... ~60 записей
]

export const getCalculatorsByCategory = (slug: string) =>
  CALCULATORS.filter(c => c.categorySlug === slug)

export const getCalculatorByPath = (path: string) =>
  CALCULATORS.find(c => c.path === path)

export const getReadyCalculators = () =>
  CALCULATORS.filter(c => c.status === 'ready')

// Dev-guard: запускается только в dev-режиме, проверяет уникальность
if (import.meta.env.DEV) {
  const assertUnique = <T>(items: T[], key: (i: T) => string, label: string) => {
    const seen = new Set<string>()
    for (const item of items) {
      const k = key(item)
      if (seen.has(k)) throw new Error(`Duplicate ${label}: "${k}"`)
      seen.add(k)
    }
  }
  assertUnique(CALCULATORS, c => c.id, 'calculator id')
  assertUnique(CALCULATORS, c => c.path, 'calculator path')
  assertUnique(CALCULATORS, c => `${c.categorySlug}/${c.slug}`, 'categorySlug+slug')
  assertUnique(CATEGORIES, c => c.slug, 'category slug')
}
```

### Связь с `CalculatorView.vue`

`componentLoader` оборачивается через `defineAsyncComponent` с `shallowRef + watch` — стабильнее чем внутри `computed` (не пересоздаёт обёртку на каждый рендер):

```typescript
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { CALCULATORS } from '../data/calculators'
import CalculatorLoading from '../components/CalculatorLoading.vue'
import CalculatorLoadError from '../components/CalculatorLoadError.vue'

const route = useRoute()
const calc = computed(() =>
  CALCULATORS.find(c =>
    c.categorySlug === route.meta.categorySlug &&
    c.slug === route.meta.toolSlug
  )
)

const asyncComponent = shallowRef<Component | null>(null)

watch(
  () => calc.value?.id,
  () => {
    asyncComponent.value = calc.value?.componentLoader
      ? defineAsyncComponent({
          loader: calc.value.componentLoader,
          delay: 100,
          timeout: 10_000,
          loadingComponent: CalculatorLoading,
          errorComponent: CalculatorLoadError,
        })
      : null
  },
  { immediate: true }
)
```

```vue
<template>
  <!-- :key гарантирует пересоздание при смене калькулятора -->
  <component :is="asyncComponent" v-if="asyncComponent" :key="calc?.id" />
  <SoonPlaceholder v-else-if="calc?.status === 'soon'" />
  <NotFoundView v-else />
</template>
```

---

## 5. Архитектура поиска

### Подход: нативный фильтр (без Fuse.js на старте)

60 записей в реестре → нативный поиск с нормализацией достаточен. Fuse.js добавить только если появятся жалобы на качество. В поиск включаются только `ready`-калькуляторы.

### `src/composables/useSearch.ts`

```typescript
import { ref, computed } from 'vue'
import { CALCULATORS } from '../data/calculators'
import type { CalculatorMeta } from '../data/types'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')  // убираем спецсимволы, кроме букв/цифр/пробелов

export function useSearch() {
  const query = ref('')
  const debouncedQuery = ref('')
  let timer: ReturnType<typeof setTimeout>

  const setQuery = (val: string) => {
    query.value = val
    clearTimeout(timer)
    timer = setTimeout(() => { debouncedQuery.value = val }, 200)
  }

  const results = computed<CalculatorMeta[]>(() => {
    const q = normalize(debouncedQuery.value)
    if (q.length < 2) return []

    return CALCULATORS
      .filter(calc => calc.status === 'ready')  // только готовые в поиске
      .filter(calc => {
        const haystack = [
          calc.title.ru, calc.title.en,
          calc.description.ru, calc.description.en,
          ...(calc.tags ?? []),
          ...(calc.aliases ?? [])              // aliases — синонимы, разговорные формы
        ].map(normalize).join(' ')
        return haystack.includes(q)
      })
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 12)
  })

  const hasResults = computed(() => results.value.length > 0)
  const isSearching = computed(() => debouncedQuery.value.length >= 2)

  return { query, setQuery, results, hasResults, isSearching }
}
```

**`aliases` vs `tags`**: `tags` — ключевые слова по теме (для хаястека), `aliases` — разговорные синонимы и распространённые опечатки которые неудобно класть в tags:
```ts
// Пример:
tags: ['кредит', 'платеж', 'loan'],
aliases: ['займ', 'кредит наличными', 'рассрочка']
```

### UX поиска

- **Где**: Hero-секция на главной (приоритет) + кнопка в AppHeader на остальных страницах
- **Поведение**: debounce 200ms, минимум 2 символа, выпадающий список / модалка
- **Навигация**: стрелки + Enter для перехода, Escape для закрытия
- **Выделение**: `<mark>` + CSS без внешних библиотек

---

## 6. Шаблон feature-модуля калькулятора

```
src/features/{category}-{name}/
├── components/
│   ├── {Name}View.vue       # корневой компонент (импортируется через реестр)
│   ├── {Name}Form.vue       # форма ввода (если сложная)
│   └── {Name}Results.vue    # блок результатов
├── composables/
│   └── use{Name}.ts         # реактивная логика
├── lib/
│   └── calculations.ts      # чистые функции (легко тестировать)
├── types/
│   └── {name}.ts
├── index.ts                 # export { default } from './components/{Name}View.vue'
└── {name}.css               # только если нельзя обойтись Tailwind
```

### Конвенции

1. **`{Name}View.vue`** — единственный компонент, который знает о роутере. Содержит `<main>`.
2. **`use{Name}.ts`** — вся реактивная логика, возвращает только примитивы и `ref`.
3. **`lib/calculations.ts`** — чистые функции без Vue, тестируются без фреймворка.
4. **`index.ts`** — единственная публичная точка для lazy-import в реестре.
5. **CSS**: если простой калькулятор — только Tailwind-утилиты, `.css` файл не создаётся.
6. **PrimeVue в unstyled mode**: использовать `InputNumber`, `Select`, `DatePicker`, `Slider` из PrimeVue — логику берём из библиотеки, стили пишем сами через Tailwind или `.css`. Не использовать дефолтные PrimeVue-темы в публичных страницах — сайт не должен выглядеть как админка.

### Компоненты PrimeVue по типам калькуляторов

| Тип | PrimeVue компоненты |
|-----|---------------------|
| Числовые поля | `InputNumber` (locale, min, max, step, prefix/suffix) |
| Дата | `DatePicker` (range, locale ru) |
| Результат в таблице | `DataTable` (платёжный график, сравнение) |
| Выбор варианта | `Select` (тип платежа, единица измерения) |
| Ползунок | `Slider` (диапазон значений) |
| Подсказки | `Tooltip` (директива `v-tooltip`) |
| Валидация | `Form` из `@primevue/forms` + Zod-схема |
| Графики | Chart.js через `<Chart>` компонент PrimeVue (обёртка) |

---

## 7. i18n стратегия

### Разделение источников правды

**Реестр (`calculators.ts`)** — хранит `title` и `description` для карточек, SEO и поиска. Это не дублирование с локалями, это разные слои:

```
реестр  → карточки каталога, SEO title/description, поиск, sitemap
locales → UI-тексты внутри самого калькулятора (label полей, кнопки, подсказки)
```

Пример правильного разделения:
```typescript
// calculators.ts — метаданные
{ title: { ru: 'Калькулятор ИМТ', en: 'BMI Calculator' } }

// ru.json — интерфейс калькулятора
{ "calc": { "bmi": { "height_label": "Рост (см)", "result_normal": "Норма" } } }
```

### Фаза 1-3 (до 20 калькуляторов): расширить существующие файлы

```json
{
  "nav": {
    "home": "Главная",
    "workspace": "Рабочий стол"
  },
  "home": {
    "hero_title": "Все калькуляторы в одном месте",
    "hero_subtitle": "Ищите среди {count} калькуляторов",
    "search_placeholder": "Найти калькулятор...",
    "popular_title": "Популярные"
  },
  "calc": {
    "credit": { ... },
    "bmi": {
      "height_label": "Рост (см)",
      "weight_label": "Вес (кг)",
      "result_normal": "Норма"
    }
  }
}
```

### Фаза 4+ (20+ калькуляторов): per-feature локали

```typescript
// В BmiView.vue при монтировании:
const { mergeLocaleMessage } = useI18n({ useScope: 'global' })
mergeLocaleMessage('ru', { calc: { bmi: bmiRu } })
mergeLocaleMessage('en', { calc: { bmi: bmiEn } })
```

**Правило**: ключи вида `calc.{slug}.{key}` — предсказуемы, не конфликтуют.

---

## 8. Мета-теги и SEO

### Расширение `useSeo.ts`

```typescript
export interface SeoOptions {
  title?: string
  description?: string
  canonicalPath?: string
  applicationCategory?: string
  jsonLdType?: 'WebApplication' | 'WebPage'
}

// Использование в CalculatorView:
useSeo(computed(() => ({
  title: calc.value?.title[locale.value] + ' — Calcup',
  description: calc.value?.description[locale.value],
  canonicalPath: calc.value?.path
})))
```

### SEO — ранняя фаза, не откладывать

Калькуляторы ищут из Google/Яндекса по конкретным запросам ("кредитный калькулятор", "калькулятор ИМТ"). SEO — один из главных каналов трафика, не "Фаза 5".

**SEO foundation входит в Фазу 1-2**:
- canonical URL для каждой страницы
- title / description из реестра через параметризованный `useSeo()`
- `robots` с `noindex` для `soon`-страниц
- JSON-LD (`SoftwareApplication` + `BreadcrumbList`)
- sitemap.xml, генерируемый из реестра при сборке
- корректный `base` в `vite.config.ts` для GitHub Pages

### SPA vs SSG

| Подход | SEO | Сложность | Рекомендация |
|--------|-----|-----------|--------------|
| SPA (текущий) | Googlebot рендерит JS | 0 | Нет — при публичных URL прямые ссылки могут давать 404 |
| vite-ssg | Статический HTML для каждого маршрута | низкая | **Рекомендуется с Фазы 1** |
| Nuxt 3 | Полноценный SSG + ISR + API | высокая | Только при нужде в серверном API |

**Рекомендация**: `vite-ssg` с самого начала — минимальное изменение (один пакет, `ViteSSG` вместо `createApp`), но гарантирует прямые URL и SEO с первого дня.

### JSON-LD для каждого калькулятора

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Кредитный калькулятор — Calcup",
  "applicationCategory": "FinanceApplication",
  "url": "https://calcup.ru/finance/credit",
  "offers": { "@type": "Offer", "price": "0" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://calcup.ru/" },
      { "@type": "ListItem", "position": 2, "name": "Финансовые", "item": "https://calcup.ru/finance" },
      { "@type": "ListItem", "position": 3, "name": "Кредитный калькулятор" }
    ]
  }
}
```

---

## 9. Приоритизированный роадмап

### Граф зависимостей

```
Фаза 1 (Роутер + Tailwind + SSG)  ──→  всё остальное
Фаза 2 (Реестр + SEO foundation)  ──→  Фазы 3, 4
Фаза 3 (Home + Category)          ──→  Фаза 4
Фаза 4 (Калькуляторы)             ──→  итерационно
```

SEO больше не отдельная фаза — он входит в Фазы 1-2 как обязательная составляющая.

---

### Фаза 1 — Роутинг и инфраструктура ⚠️ БЛОКИРУЕТ ВСЁ

**Оценка**: 2-3 дня

| # | Задача | Файл |
|---|--------|------|
| 1 | `npm install vue-router@4 vite-ssg primevue @primeuix/themes @primevue/forms primeicons @tailwindcss/vite tailwindcss zod` + `npm install -D vitest` | package.json |
| 2 | Создать `src/data/types.ts`, `categories.ts`, `calculators.ts` (реестр — нужен до router) | новый |
| 3 | Создать `src/router/index.ts` — маршруты генерируются из реестра | новый |
| 4 | Обновить `src/main.ts`: `ViteSSG` вместо `createApp`, `app.use(router)` | изменить |
| 5 | Переписать `src/App.vue`: layout-компонент + `<RouterView>` | изменить |
| 6 | Создать `WorkspaceView.vue` (перенести контент из App.vue) | новый |
| 7 | Исправить `DesktopLayout.vue`: убрать pathname, добавить `useRoute()` | изменить |
| 8 | Изменить `vite.config.ts`: убрать multi-entry, добавить tailwind plugin, `ssgOptions` | изменить |
| 9 | Добавить `@import "tailwindcss"` в `style.css` | изменить |

**Проверка**: `npm run build` генерирует HTML-файлы для каждого маршрута. `/`, `/workspace`, `/finance/credit`, `/credit-calc` — все работают как прямые URL.

---

### Фаза 2 — SEO foundation + расширение реестра

**Оценка**: 1-2 дня

| # | Задача | Файл |
|---|--------|------|
| 1 | Параметризовать `useSeo.ts` (canonical, noindex для soon) | изменить |
| 2 | Добавить JSON-LD `SoftwareApplication + BreadcrumbList` в `useSeo` | изменить |
| 3 | Build-скрипт для генерации `sitemap.xml` из реестра (только `ready`) | новый |
| 4 | `robots.txt`: запрет индексации `/workspace` | изменить |
| 5 | Расширить `ru.json` / `en.json` секциями `nav`, `home` | изменить |
| 6 | Создать `useCalculatorRegistry.ts` | новый |

**Проверка**: TypeScript без ошибок. В `<head>` каждой страницы есть canonical, title, description. `soon`-страницы имеют `noindex`.

---

### Фаза 3 — Главная страница и навигация

**Оценка**: 3-4 дня

| # | Задача |
|---|--------|
| 1 | `AppHeader.vue` с навигацией и кнопкой поиска |
| 2 | `AppFooter.vue` |
| 3 | `HomeView.vue` (Hero + CategoryGrid + Popular) |
| 4 | `CategoryCard.vue` и `CategoryGrid.vue` |
| 5 | `CalculatorCard.vue` (переиспользуется в Popular и CategoryView) |
| 6 | `CategoryView.vue` (список инструментов раздела) |
| 7 | `CalculatorView.vue` (обёртка + lazy-import по реестру) |
| 8 | `NotFoundView.vue` |
| 9 | `useSearch.ts` + `SearchModal.vue` |
| 10 | Убедиться, что все 8 категорий из `CATEGORIES` автоматически появились в роутере и sitemap (не добавлять вручную!) |

**Проверка**: главная отображает категории, `/finance` показывает кредитный калькулятор, поиск находит "кредит".

---

### Фаза 4 — Новые калькуляторы (итерационно)

**Оценка**: 1-2 дня на простой калькулятор

Порядок реализации (ROI: трафик × простота):

| # | Калькулятор | Путь | Сложность |
|---|-------------|------|-----------|
| 1 | ИМТ | `/health/bmi` | простой (3 поля) |
| 2 | Калькулятор % | `/math/percentage` | простой (3 режима) |
| 3 | Конвертер длины | `/convert/length` | простой |
| 4 | Расход топлива | `/transport/fuel` | простой |
| 5 | Разница дат | `/datetime/date-diff` | средний (переработка useDateCalculator) |
| 6 | НДС | `/finance/vat` | простой |
| 7 | Чаевые | `/everyday/tips` | простой |

Для каждого: создать `src/features/{category}-{name}/`, добавить запись в реестр со статусом `ready`, написать `calculations.ts` + `calculations.test.ts`, добавить i18n-ключи. Маршруты добавляются автоматически через реестр.

---

### Фаза 5 — SEO enhancement (расширение, не foundation)

Foundation (canonical, noindex, JSON-LD, sitemap) сделан в Фазах 1-2. Здесь — улучшения:

| # | Задача |
|---|--------|
| 1 | OG-изображения для топовых калькуляторов |
| 2 | `FAQPage` JSON-LD при наличии FAQ-блоков |
| 3 | `HowTo` разметка для калькуляторов с методологией |
| 4 | Проверка индексации через Яндекс.Вебмастер / Google Search Console |
| 5 | Улучшение сниппетов (title ≤ 60 символов, description ≤ 155) |

---

### Фаза 6 — Масштабирование (по мере роста)

- Per-feature i18n локали (при 20+ калькуляторах)
- Fuse.js для нечёткого поиска (если нативный недостаточен)
- Code splitting по категориям в `vite.config.ts`
- Аналитика популярности через GA4 → обновление `popularity` в реестре

---

### Что НЕ делать

- Не переписывать `credit-calculator` — он рабочий
- Не применять PrimeVue-тему глобально к `/workspace` — оставить plain CSS как есть
- Не переходить на Nuxt — overhead не оправдан, `vite-ssg` закрывает SEO-потребности
- Не прописывать маршруты вручную в `router/index.ts` — только генерация из реестра
- Не публиковать `planned`-калькуляторы как страницы — только внутренний roadmap
- Не откладывать SEO на «потом» — canonical и noindex настраиваются в Фазе 1-2
- Не использовать простой `window.location.replace` в `404.html` — только vite-ssg
- Не делать следующую фазу, пока quality gates текущей не зелёные
- Не пропускать `calculations.test.ts` — формулы обязаны быть покрыты тестами

### Quality gates — после каждой фазы

```
1. npm run type-check       — ноль ошибок TypeScript
2. npm run build            — сборка без ошибок
3. npm run test             — все тесты зелёные (Vitest)
4. Прямые URL работают:
   /  /workspace  /finance  /finance/credit  /credit-calc
5. <head> каждой страницы содержит:
   title, description, canonical, robots, json-ld
6. soon-страницы: robots = noindex, follow
7. sitemap.xml содержит только ready-калькуляторы
8. Мобильная вёрстка: 360px / 768px / 1280px
```

### Vitest — обязательный инструмент

```bash
npm install -D vitest
```

Каждый калькулятор обязан иметь `lib/calculations.test.ts`. UI не тестируем на старте, формулы — обязательно. Одна ошибка в формуле кредита или ИМТ разрушает доверие к сайту.

### Health-дисклеймер

Для всех калькуляторов с `categorySlug === 'health'` показывать компонент `CalculatorDisclaimer.vue`:

```txt
Результат носит справочный характер и не является медицинской рекомендацией.
Обратитесь к специалисту.
```

Это касается: ИМТ, калорий, пульса, беременности, идеального веса.

### Правила валидации по сложности

```txt
Простые калькуляторы (ИМТ, %) → HTML constraints + локальная проверка в composable
Сложные формы (кредит, ипотека, вклад) → Zod-схема + @primevue/forms
```

Zod не нужен везде — не усложнять простые калькуляторы.

### Форматирование чисел — единый модуль `src/lib/formatters/`

```typescript
// number.ts
export const formatMoney = (value: number, locale = 'ru-RU') =>
  new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'RUB', maximumFractionDigits: 0
  }).format(value)

export const formatPercent = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value) + '%'
```

Правила округления по категориям:
- Деньги → 0-2 знака после запятой
- Проценты → 1-2 знака
- ИМТ → 1 знак
- Даты → целые числа
- Строительство → с запасом +5-15% (в логике, не в форматтере)

### Tailwind v4 — браузерная поддержка

Tailwind 4 требует: Safari 16.4+, Chrome 111+, Firefox 128+. Для публичного сайта калькуляторов с современной аудиторией — приемлемо. Если аудитория включает корпоративные устаревшие браузеры, проверить аналитику перед деплоем.

---

## Критические файлы для старта

| Файл | Действие |
|------|----------|
| `src/data/types.ts` | СОЗДАТЬ (реестр нужен до router) |
| `src/data/calculators.ts` | СОЗДАТЬ |
| `src/data/categories.ts` | СОЗДАТЬ |
| `src/router/index.ts` | СОЗДАТЬ (маршруты из реестра) |
| `src/App.vue` | ПЕРЕПИСАТЬ |
| `src/composables/useSeo.ts` | РАСШИРИТЬ (canonical, noindex, JSON-LD) |
| `vite.config.ts` | ИЗМЕНИТЬ (убрать multi-entry, vite-ssg + includedRoutes, Tailwind plugin) |
| `src/main.ts` | ИЗМЕНИТЬ (ViteSSG + router + PrimeVue unstyled) |
| `scripts/generate-sitemap.ts` | СОЗДАТЬ (sitemap из реестра, только `ready`) |
| `src/lib/formatters/number.ts` | СОЗДАТЬ (formatMoney, formatPercent) |
