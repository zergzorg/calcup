# PROJECT_STATUS

## Текущая фаза
Фаза 4.3 — Length converter

## Текущий шаг
Фаза 4.3 завершена. Ожидание согласования перед следующим калькулятором.

---

## ⚠️ Производственный деплой на GitHub Pages ГОТОВ к тестированию

Блокеры Фазы 2 закрыты:
- ✅ `404.html` fallback — `cp dist/index.html dist/404.html` в postbuild скрипте
- ✅ `noindex` для soon/workspace/not-found — через `route.meta.noindex` в useSeo
- ✅ Параметризованный `canonical` и `sitemap.xml` из реестра
- ✅ Trailing-slash статические entrypoints — `scripts/create-route-indexes.mjs` создаёт `dist/<route>/index.html` для canonical URL со слэшем

---

## Текущее состояние ready-калькуляторов

| URL | Статус | Feature module | Sitemap | Robots |
|-----|--------|----------------|---------|--------|
| `/finance/credit` | ✅ ready | `src/features/credit-calculator` | ✅ `/finance/credit/` | `index,follow,max-image-preview:large` |
| `/math/percentage` | ✅ ready | `src/features/percentage-calculator` | ✅ `/math/percentage/` | `index,follow,max-image-preview:large` |
| `/health/bmi` | ✅ ready | `src/features/health-bmi` | ✅ `/health/bmi/` | `index,follow,max-image-preview:large` |
| `/convert/length` | ✅ ready | `src/features/length-converter` | ✅ `/convert/length/` | `index,follow,max-image-preview:large` |

---

## Текущее состояние sitemap

- `/`
- `/finance/`
- `/finance/credit/`
- `/math/`
- `/math/percentage/`
- `/health/`
- `/health/bmi/`
- `/convert/`
- `/convert/length/`

---

## Сделано (Фаза 4.3 — Length converter)

### Новые файлы
- `src/features/length-converter/index.ts` — entrypoint для `componentLoader`
- `src/features/length-converter/components/LengthConverterView.vue` — экран конвертера длины
- `src/features/length-converter/composables/useLengthConverter.ts` — локальная валидация, состояние формы и swap units
- `src/features/length-converter/lib/calculations.ts` — коэффициенты к метру, `convertLength`, `roundLength`, `isValidLengthValue`
- `src/features/length-converter/lib/calculations.test.ts` — Vitest-покрытие конверсий и невалидных значений
- `src/features/length-converter/types/length.ts` — типы единиц и validation issues

### Изменённые файлы
- `src/data/calculators.ts` — `length` переведён из `soon` в `ready`, добавлен `componentLoader`, aliases, tags и popularity
- `src/locales/ru.json` — добавлены тексты Length UI, единиц, popular conversions и валидации
- `src/locales/en.json` — добавлены английские тексты Length UI, единиц, popular conversions и валидации
- `public/sitemap.xml` — добавлены `/convert/` и `/convert/length/`
- `PROJECT_STATUS.md` — зафиксирован результат Фазы 4.3 и актуальный sitemap

### Единицы
- ✅ `millimeter`, `centimeter`, `meter`, `kilometer`, `inch`, `foot`, `yard`, `mile`.
- ✅ Внутренняя базовая единица — метр.
- ✅ Все конверсии идут через коэффициент к метру.

### Проверки (Фаза 4.3)

| Проверка | Результат |
|----------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run test` | ✅ 3 файла, 18 тестов passed |
| `npm run build` | ✅ SSG: `dist/convert/length.html` и `dist/convert/length/index.html` созданы |
| `dist/convert/length/index.html` robots | ✅ `index,follow,max-image-preview:large` |
| `public/sitemap.xml` | ✅ содержит `https://calcup.ru/convert/` и `https://calcup.ru/convert/length/` |
| Preview `/convert/length/` desktop | ✅ title/h1/result/robots корректны, `SoonPlaceholder` отсутствует |
| Preview `/convert/length/` 360px | ✅ `scrollWidth = 360`, горизонтального overflow нет |
| `м → см` | ✅ `2 м = 200 см` |
| `км → м` | ✅ `3.5 км = 3500 м` |
| `inch → cm` | ✅ `10 inch = 25.4 cm` |
| `foot → meter` | ✅ `3 foot = 0.9144 m` |
| `mile → kilometer` | ✅ `1 mile = 1.609344 km` |
| `0` | ✅ корректно конвертируется в `0` |
| Отрицательное значение | ✅ показывает validation |
| Swap units | ✅ меняет единицы местами и пересчитывает результат |
| SearchModal click-flow в Chromium | ✅ запросы `длина`, `метр`, `сантиметр`, `inch`, `mile`, `length` находят `/convert/length` |

### Scope control
- ✅ Другие конвертеры не реализовывались.
- ✅ `credit-calculator`, Percentage, BMI и `workspace` не переписывались.
- ✅ Архитектура роутинга, layout и SEO flow не менялись.

---

## Сделано (Фаза 4.2 — Percentage calculator)

### Новые файлы
- `src/features/percentage-calculator/index.ts` — entrypoint для `componentLoader`
- `src/features/percentage-calculator/components/PercentageCalculatorView.vue` — экран калькулятора процентов с четырьмя режимами
- `src/features/percentage-calculator/composables/usePercentageCalculator.ts` — локальная валидация, состояние формы и переключение режимов
- `src/features/percentage-calculator/lib/calculations.ts` — формулы процентов и округление до 2 знаков
- `src/features/percentage-calculator/lib/calculations.test.ts` — Vitest-покрытие режимов и некорректных входных данных
- `src/features/percentage-calculator/types/percentage.ts` — типы режимов, результата и validation issues

### Изменённые файлы
- `src/data/calculators.ts` — `percentage` переведён из `soon` в `ready`, добавлен `componentLoader`, aliases и popularity
- `src/locales/ru.json` — добавлены тексты Percentage UI, режимов, результатов и валидации
- `src/locales/en.json` — добавлены английские тексты Percentage UI, режимов, результатов и валидации
- `public/sitemap.xml` — добавлены `/math/` и `/math/percentage/`
- `PROJECT_STATUS.md` — зафиксирован результат Фазы 4.2

### Режимы
- ✅ Найти X% от числа.
- ✅ Сколько процентов A от B.
- ✅ Увеличить/уменьшить число на X%.
- ✅ Процентное изменение от старого значения к новому.

### Проверки (Фаза 4.2)

| Проверка | Результат |
|----------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run test` | ✅ 2 файла, 9 тестов passed |
| `npm run build` | ✅ SSG: `dist/math/percentage.html` и `dist/math/percentage/index.html` созданы |
| `dist/math/percentage/index.html` robots | ✅ `index,follow,max-image-preview:large` |
| `public/sitemap.xml` | ✅ содержит `https://calcup.ru/math/percentage/` |
| Preview `/math/percentage/` desktop | ✅ title/h1/result/robots корректны, `SoonPlaceholder` отсутствует |
| Preview `/math/percentage/` 360px | ✅ `scrollWidth = 360`, горизонтального overflow нет |
| Режим `X% от числа` | ✅ `15% от 200 = 30` |
| Режим `A от B` | ✅ `1 от 3 = 33,33%` |
| Режим `увеличить/уменьшить` | ✅ `120 ± 10% = 132 / 108` |
| Режим `процентное изменение` | ✅ `80 → 100 = 25%`, `oldValue = 0` показывает validation |
| SearchModal click-flow в Chromium | ✅ запросы `процент`, `скидка`, `percentage`, `percent` находят `/math/percentage` |

### Scope control
- ✅ Другие калькуляторы не реализовывались.
- ✅ `credit-calculator`, BMI и `workspace` не переписывались.
- ✅ Архитектура роутинга, layout и SEO flow не менялись.

---

## Сделано (Фаза 4.1 — BMI calculator)

### Новые файлы
- `src/features/health-bmi/index.ts` — entrypoint для `componentLoader`
- `src/features/health-bmi/components/BmiCalculatorView.vue` — экран калькулятора ИМТ
- `src/features/health-bmi/composables/useBmiCalculator.ts` — локальная валидация роста/веса и состояние формы
- `src/features/health-bmi/lib/calculations.ts` — формулы BMI, округление и категории
- `src/features/health-bmi/lib/calculations.test.ts` — Vitest-покрытие формул и граничных значений
- `src/features/health-bmi/types/bmi.ts` — типы результата, категорий и validation issues

### Изменённые файлы
- `src/data/calculators.ts` — `bmi` переведён из `soon` в `ready`, добавлен `componentLoader`, aliases и popularity
- `src/locales/ru.json` — добавлены тексты BMI UI, категорий, валидации и health-disclaimer
- `src/locales/en.json` — добавлены английские тексты BMI UI, категорий, валидации и health-disclaimer
- `public/sitemap.xml` — добавлены `/health/` и `/health/bmi/`
- `package.json` — build вызывает `scripts/create-route-indexes.mjs` после `vite-ssg build`
- `scripts/create-route-indexes.mjs` — создаёт `index.html`-копии для trailing-slash URL на GitHub Pages
- `PROJECT_STATUS.md` — зафиксирован результат Фазы 4.1

### Поведение
- ✅ `/health/bmi` больше не показывает `SoonPlaceholder`.
- ✅ `router/index.ts` автоматически отдаёт `index,follow,max-image-preview:large`, потому что `bmi.status === 'ready'`.
- ✅ `/health/bmi` попадает в SSG build как `dist/health/bmi.html`.
- ✅ `/health` теперь содержит ready-карточку `Калькулятор ИМТ`.
- ✅ Поиск находит BMI по `имт`, `bmi`, `вес`, `рост`.
- ✅ Health-disclaimer отображается на странице калькулятора.

### Проверки (Фаза 4.1)

| Проверка | Результат |
|----------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run test` | ✅ 1 файл, 4 теста passed |
| `npm run build` | ✅ SSG: `dist/health/bmi.html` создан |
| `dist/health/bmi.html` robots | ✅ `index,follow,max-image-preview:large` |
| `public/sitemap.xml` | ✅ содержит `https://calcup.ru/health/bmi/` |
| Preview `/health/bmi` desktop | ✅ title/h1/result/category/disclaimer корректны |
| Preview `/health/bmi` 360px | ✅ `scrollWidth = 360`, горизонтального overflow нет |
| SearchModal click-flow в Chromium | ✅ запросы `имт`, `bmi`, `вес`, `рост` находят `/health/bmi` |
| `find dist/health -maxdepth 3 -type f \| sort` | ✅ `dist/health/bmi.html`, `dist/health/bmi/index.html`, `dist/health/index.html` |
| Preview `/health/bmi/` | ✅ отдаёт BMI HTML с `Калькулятор ИМТ`, не home fallback |

### Scope control
- ✅ Другие калькуляторы не реализовывались.
- ✅ `credit-calculator` и `workspace` не переписывались.
- ✅ Архитектура роутинга, layout и SEO flow не менялись.

---

## Сделано (Фаза 3)

### Новые файлы
- `src/components/layout/AppBreadcrumb.vue` — хлебные крошки для site-страниц и калькуляторов
- `src/components/layout/AppFooter.vue` — footer с категориями и инструментами
- `src/components/layout/AppHeader.vue` — desktop header, mobile hamburger, categories dropdown, search action
- `src/components/layout/SiteLayout.vue` — общий layout публичного сайта + `SearchModal`
- `src/components/ui/CalculatorCard.vue` — карточка калькулятора с состояниями ready/soon
- `src/components/ui/CategoryCard.vue` — карточка категории на главной
- `src/components/ui/SearchModal.vue` — поисковая модалка
- `src/components/ui/SoonPlaceholder.vue` — заглушка для soon-калькуляторов
- `src/composables/useSearch.ts` — debounce-поиск по ready-калькуляторам, тегам и alias

### Изменённые файлы
- `src/App.vue` — подключён `SiteLayout` для маршрутов публичного сайта
- `src/main.ts` — интеграция layout/route flow Фазы 3
- `src/router/index.ts` — маршруты site-layout и meta для категорий/калькуляторов
- `src/style.css` — Tailwind подключён глобально; в Phase 3 QA удалён старый глобальный `button` style, который перебивал Tailwind-кнопки
- `src/views/HomeView.vue` — полноценная главная: hero, категории, ready-калькуляторы, workspace promo
- `src/views/CategoryView.vue` — страница категории со списком калькуляторов
- `src/views/CalculatorView.vue` — страница калькулятора, soon-placeholder, breadcrumb; в Phase 3 QA добавлена тёмная оболочка для credit-калькулятора

### SearchModal/useSearch
- ✅ `SearchModal.vue` уже реализован и подключён через `SiteLayout`.
- ✅ `useSearch.ts` уже реализован: debounce 200 мс, поиск по `title`, `tags`, `aliases`, фильтр `status === 'ready'`.
- ✅ Проверено по логике реестра: `кредит` → `/finance/credit`; alias `займ` → `/finance/credit`; soon-запрос `имт` не возвращает результатов.

### Проверки (Фаза 3 QA)

| Команда | Результат |
|---------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run build` | ✅ SSG: 20 страниц + `dist/404.html` |
| `npm run test` | ✅ нет тестов (passWithNoTests) |
| `npm run preview -- --host 0.0.0.0` | ✅ preview поднят на `http://localhost:4173/` |

### Проверенные страницы в preview

| URL | Статус |
|-----|--------|
| `/` | ✅ главная рендерится, header/hero/categories видны |
| `/workspace` | ✅ workspace рендерится, Tailwind preflight критически не сломал основной desktop |
| `/finance` | ✅ категория рендерится, ready/soon карточки различимы, footer виден |
| `/finance/credit` | ✅ после QA-фикса кредитный калькулятор снова читается на тёмной оболочке |
| `/health/bmi` | ✅ soon-placeholder рендерится |
| `/not-existing-url` | ✅ Vue Router показывает 404 страницу |

### Навигация и адаптив
- ✅ Header desktop визуально проверен на 1280px.
- ✅ Mobile header/hamburger визуально проверен на 360px: кнопки больше не получают старый чёрный global style.
- ✅ Footer links визуально проверены на `/finance` и soon/404 страницах.
- ✅ Breadcrumbs визуально проверены на `/finance`, `/finance/credit`, `/health/bmi`.
- ✅ Адаптив 360px / 768px / 1280px проверен screenshots на главной.
- ✅ Tailwind preflight: размеры кнопок/инпутов, шрифты, отступы и overflow проверены на `workspace`, `credit-calculator`, главной и категории.

### Исправлено в Phase 3 QA
- Удалён старый глобальный стиль `button` из `src/style.css`, потому что он перебивал Tailwind utility-классы в header/search/home и искажал кнопки.
- Добавлена тёмная оболочка для credit-калькулятора в `src/views/CalculatorView.vue`, потому что после переноса в site-layout его светлый фон делал hero и часть текста почти невидимыми.

### Оставшиеся визуальные/технические риски
- `workspace` остаётся самостоятельным старым desktop-интерфейсом с абсолютными/фиксированными виджетами; критических regressions от Tailwind preflight не видно, но точная pixel-perfect проверка всех виджетов остаётся визуальной задачей.
- SearchModal визуально подключён и логика поиска проверена по коду/реестру; полноценные клики в Safari automation ограничены настройками окружения (`Allow JavaScript from Apple Events` / WebDriver remote automation выключены).
- На 360px категории на главной идут в две колонки: overflow не обнаружен, но карточки узкие. Это можно улучшать позже, если пользователь захочет более спокойную мобильную сетку.
- Для `/not-existing-url` preview отдаёт HTTP 200 как SPA fallback; визуально Vue Router показывает 404. Для GitHub Pages финальное поведение зависит от `404.html` fallback из build.

---

## Сделано (Фаза 2)

### Новые файлы
- `src/composables/useCalculatorRegistry.ts` — типизированный composable: `getCategoryBySlug`, `getCalculatorBySlug`, `getCalculatorsByCategory`, `getReadyCalculators`, `getPublicCalculators`, `getSitemapCalculators`, `getSitemapCategories`, `isKnownCategory`, `isKnownCalculator`

### Изменённые файлы
- `src/composables/useSeo.ts` — полностью переписан: `useHead()` из `@unhead/vue` (SSG-native), динамический title/description/canonical из реестра, `robots` из `route.meta.noindex`, JSON-LD `SoftwareApplication + BreadcrumbList` для калькуляторов, `WebSite` schema для остальных
- `public/robots.txt` — добавлен `Disallow: /workspace`
- `public/sitemap.xml` — перегенерирован из реестра: только `/` + `/finance/` + `/finance/credit/`
- `package.json` — build добавлен `&& cp dist/index.html dist/404.html`

### Архитектурные решения Фазы 2

1. **useHead() вместо DOM-манипуляций**: vite-ssg@27 автоматически регистрирует `@unhead/vue` (`createHead` server/client в зависимости от окружения). `useHead(computed(...))` корректно рендерит мета в HTML при SSG.

2. **404.html**: `cp dist/index.html dist/404.html` в конце команды build. dist/index.html — это pre-rendered home page + SPA-скрипты. При открытии несуществующего URL GitHub Pages отдаёт 404.html, Vue Router берёт управление и рендерит нужный маршрут.

3. **noindex flow**: router/index.ts проставляет `meta.noindex: true` для `/workspace`, `soon`-калькуляторов, catch-all. useSeo.ts читает `route.meta.noindex` → `noindex,nofollow` в robots мета.

4. **sitemap.xml**: статический файл, перегенерируется вручную при добавлении ready-калькуляторов. `useCalculatorRegistry.getSitemapCalculators()` и `.getSitemapCategories()` дают правильный набор для автоматической генерации в будущем.

5. **⚠️ useDesktopSettings**: localStorage на уровне модуля — риск при добавлении /workspace в SSG. TODO: рефакторинг на lazy init при переходе к SSR/hydration workspace.

---

## Сделано (Фаза 1)

### Зависимости
- Установлены: `vue-router@4.4.5`, `vite-ssg@27.0.1`, `primevue`, `@primeuix/themes`, `@primevue/forms`, `primeicons`, `@tailwindcss/vite`, `tailwindcss`, `zod`
- Dev: `vitest`
- Примечание: `vite-ssg@28.x` несовместима с Node.js 22 из-за `html-encoding-sniffer@6.0.0` → `@exodus/bytes` ESM bug. Использована `v27.0.1` (jsdom 26 → html-encoding-sniffer 4)

### Новые файлы
- `src/data/types.ts` — типы `CalculatorMeta`, `CategoryMeta`, `CalculatorStatus` и др.
- `src/data/categories.ts` — 8 категорий из Product Plan
- `src/data/calculators.ts` — 1 ready (credit) + 8 soon калькуляторов
- `src/data/registry-guards.ts` — `validateRegistry()` (вызывается из main.ts в DEV, не при импорте)
- `src/router/index.ts` — маршруты из реестра, catch-all последний
- `src/views/WorkspaceView.vue` — весь workspace-контент (с DesktopLayout внутри)
- `src/views/HomeView.vue` — минимальная заглушка
- `src/views/NotFoundView.vue` — минимальная заглушка
- `src/views/CategoryView.vue` — минимальная заглушка
- `src/views/CalculatorView.vue` — функциональный (загружает componentLoader)
- `src/features/credit-calculator/index.ts` — точка входа для componentLoader

### Изменённые файлы
- `package.json` — добавлены `type-check`, `test`, `build` → `vite-ssg build`
- `src/vite-env.d.ts` — `import type {} from 'vue-router'` + `declare global { interface Window }` + `RouteMeta` augmentation
- `src/main.ts` — ViteSSG, PrimeVue unstyled, i18n, registry guard в DEV
- `src/App.vue` — тонкая обёртка с `<RouterView />`
- `src/components/DesktopLayout.vue` — убрана `isCreditCalculatorPage` (window.location), nav всегда видна, RouterLink
- `src/composables/useSeo.ts` — параметризован (Фаза 2 перезаписала)
- `src/i18n.ts` — `typeof window !== 'undefined'` guard для localStorage/navigator
- `vite.config.ts` — tailwind plugin, ssgOptions (исключает /workspace из SSG), убрана multi-entry
- `src/style.css` — `@import "tailwindcss"` добавлен первым

### НЕ изменено (намеренно)
- Весь `src/features/credit-calculator/` — только добавлен `index.ts`
- Все виджеты workspace — перенесены в WorkspaceView.vue без изменений
- `credit-calc/index.html` — файл сохранён, убран только из Vite input

---

## Архитектурные решения Фазы 1

1. **WorkspaceLayout vs DesktopLayout**: WorkspaceLayout не создавался — DesktopLayout уже является layout для workspace. WorkspaceView.vue содержит DesktopLayout напрямую, без двойной обёртки.

2. **/workspace исключён из SSG**: `useDesktopSettings.ts` вызывает `localStorage` на уровне модуля → сломал бы SSG при рендере. Workspace — noindex, SPA fallback работает.

3. **vite-env.d.ts fix**: С `moduleDetection: "force"` файл стал модулем. `declare module 'vue-router' {}` без `import` заменяло модуль (вместо дополнения) → все экспорты vue-router пропадали. Исправлено: `import type {} from 'vue-router'` + `declare global { interface Window }`.

4. **Registry guards**: Вынесены в `registry-guards.ts`, вызов только из `main.ts` в DEV. Не импортируются в `vite.config.ts`.

5. **vite.config.ts**: Не импортирует реестр. SSG-маршруты определяются динамически из Vue Router (vite-ssg берёт все роуты, затем filterуем /workspace).

---

## Проверки (Фаза 2)

| Команда | Результат |
|---------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run build` | ✅ SSG: 20 страниц + dist/404.html |
| `npm run test` | ✅ нет тестов (passWithNoTests) |

### Историческая проверка `<head>` по страницам на конец Фазы 2

| URL | title | robots | canonical |
|-----|-------|--------|-----------|
| `/` | Calcup — Онлайн калькуляторы: кредит, ИМТ, проценты | index,follow | `calcup.ru/` |
| `/finance` | Финансы — Calcup | index,follow | `calcup.ru/finance/` |
| `/finance/credit` | Кредитный калькулятор — Calcup | index,follow | `calcup.ru/finance/credit/` |
| `/health/bmi` (soon) | Калькулятор ИМТ — Calcup | **noindex,nofollow** | `calcup.ru/health/bmi/` |
| catch-all (not-found) | Calcup — Онлайн калькуляторы... | **noindex,nofollow** | — |
| `404.html` (fallback) | Calcup — Онлайн калькуляторы... | index,follow | — |

Примечание: строка `/health/bmi (soon)` выше является исторической записью Фазы 2. После Фазы 4.1 актуальное состояние BMI: `ready`, `index,follow,max-image-preview:large`, есть в sitemap и в блоке ready-калькуляторов выше.

### Проверка robots.txt и sitemap.xml

| Файл | Статус |
|------|--------|
| `public/robots.txt` | ✅ `Disallow: /workspace`, sitemap: указан |
| `public/sitemap.xml` | ✅ только `/`, `/finance/`, `/finance/credit/` |

---

## Остаются (известные риски)

1. **Tailwind в workspace** — `@import "tailwindcss"` добавляет preflight, может незначительно влиять на workspace. Требует визуальной проверки в браузере.
2. **useDesktopSettings** — localStorage на уровне модуля. Если /workspace когда-либо добавят в SSG — упадёт. TODO оставлен в коде.
3. **404.html noindex** — GitHub Pages отдаёт 404.html с кодом 404, но мета содержит index,follow (это home page content). Боты теоретически могут это индексировать, но на практике код 404 предотвращает индексацию.

---

## Требуется согласование пользователя
**Перед следующим калькулятором нужна отдельная команда пользователя.** Фаза 4.3 закрыта только для `/convert/length`; остальные инструменты не начинать автоматически.
