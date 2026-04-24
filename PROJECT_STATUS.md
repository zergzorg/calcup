# PROJECT_STATUS

## Текущая фаза
Фаза 3 — Home page + UI

## Текущий шаг
Ожидание согласования Phase 3

---

## ⚠️ Производственный деплой на GitHub Pages ГОТОВ к тестированию

Блокеры Фазы 2 закрыты:
- ✅ `404.html` fallback — `cp dist/index.html dist/404.html` в postbuild скрипте
- ✅ `noindex` для soon/workspace/not-found — через `route.meta.noindex` в useSeo
- ✅ Параметризованный `canonical` и `sitemap.xml` из реестра

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

### Проверка `<head>` по страницам

| URL | title | robots | canonical |
|-----|-------|--------|-----------|
| `/` | Calcup — Онлайн калькуляторы: кредит, ИМТ, проценты | index,follow | `calcup.ru/` |
| `/finance` | Финансы — Calcup | index,follow | `calcup.ru/finance/` |
| `/finance/credit` | Кредитный калькулятор — Calcup | index,follow | `calcup.ru/finance/credit/` |
| `/health/bmi` (soon) | Калькулятор ИМТ — Calcup | **noindex,nofollow** | `calcup.ru/health/bmi/` |
| catch-all (not-found) | Calcup — Онлайн калькуляторы... | **noindex,nofollow** | — |
| `404.html` (fallback) | Calcup — Онлайн калькуляторы... | index,follow | — |

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
**Переход к Фазе 3** — согласовать содержимое и приоритеты
