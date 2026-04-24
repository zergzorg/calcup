# PROJECT_STATUS

## Текущая фаза
Фаза 1 — Роутинг и инфраструктура ✅ ЗАВЕРШЕНА

## Текущий шаг
Все quality gates пройдены. Ожидается согласование Фазы 2.

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
- `src/data/types.ts` — (новый)
- `src/main.ts` — ViteSSG, PrimeVue unstyled, i18n, registry guard в DEV
- `src/App.vue` — тонкая обёртка с `<RouterView />`
- `src/components/DesktopLayout.vue` — убрана `isCreditCalculatorPage` (window.location), nav всегда видна, RouterLink
- `src/composables/useSeo.ts` — `if (typeof document === 'undefined') return` + path из window.location (SSG-safe)
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

## Изменённые файлы (полный список)

| Файл | Тип изменения |
|------|---------------|
| `package.json` | изменён (scripts + deps) |
| `src/vite-env.d.ts` | изменён (Window, RouteMeta) |
| `src/main.ts` | переписан (ViteSSG) |
| `src/App.vue` | переписан (RouterView) |
| `src/components/DesktopLayout.vue` | изменён (убрать window.location) |
| `src/composables/useSeo.ts` | изменён (SSG guard) |
| `src/i18n.ts` | изменён (SSG guard) |
| `vite.config.ts` | переписан (tailwind, ssgOptions) |
| `src/style.css` | изменён (@import tailwindcss) |
| `src/data/types.ts` | создан |
| `src/data/categories.ts` | создан |
| `src/data/calculators.ts` | создан |
| `src/data/registry-guards.ts` | создан |
| `src/router/index.ts` | создан |
| `src/views/WorkspaceView.vue` | создан |
| `src/views/HomeView.vue` | создан |
| `src/views/NotFoundView.vue` | создан |
| `src/views/CategoryView.vue` | создан |
| `src/views/CalculatorView.vue` | создан |
| `src/features/credit-calculator/index.ts` | создан |

---

## Проверки

| Команда | Результат |
|---------|-----------|
| `npm run type-check` | ✅ 0 ошибок |
| `npm run build` | ✅ SSG: 20 страниц предрендерено |
| `npm run test` | ✅ нет тестов (passWithNoTests) |

### Ручная проверка URL (vite preview)

| URL | HTTP | Статус |
|-----|------|--------|
| `/` | 200 | ✅ HomeView stub |
| `/workspace` | 200 | ✅ SPA fallback (не в SSG) |
| `/finance` | 200 | ✅ SSG CategoryView stub |
| `/finance/credit` | 200 | ✅ SSG, CreditCalculatorView |
| `/credit-calc` | 200 | ✅ SSG redirect → finance/credit |

### Дополнительные проверки

| Проверка | Результат |
|----------|-----------|
| planned-калькуляторы без маршрутов | ✅ (не в CALCULATORS с planned) |
| catch-all последним | ✅ в router/index.ts |
| /workspace не имеет SSG HTML | ✅ нет dist/workspace.html |
| soon-страницы — noindex | ⚠️ Фаза 2 (сейчас default из index.html) |
| sitemap | ⚠️ Фаза 2 |
| canonical/JSON-LD | ⚠️ Фаза 2 |

---

## Проблемы и риски

### Решённые в Фазе 1

1. **vite-ssg 28.x + Node.js 22** — несовместимость через `@exodus/bytes`. Использована v27.0.1.
2. **vue-router types** — `declare module 'vue-router'` без `import type {}` в `moduleDetection: force` замещало модуль. Исправлено добавлением `import type {} from 'vue-router'`.
3. **useDesktopSettings** — вызов localStorage на уровне модуля. Решено исключением /workspace из SSG.
4. **vite multi-entry** — убрана, credit-calc/index.html сохранён физически.

### Остаются

1. **noindex для soon/workspace** — нужна параметризация useSeo.ts (Фаза 2)
2. **Нет 404.html fallback** — GitHub Pages не сможет подать /workspace без него. Нужно добавить после деплоя или через vite-ssg plugin (Фаза 2).
3. **Tailwind в workspace** — `@import "tailwindcss"` добавляет preflight, может незначительно влиять на workspace. Требует визуальной проверки в браузере.

---

## Следующий шаг — Фаза 2 (SEO foundation)

После согласования:
1. Параметризовать `useSeo.ts` — canonical, noindex, динамический title/description из реестра
2. robots noindex для `soon` и `/workspace`
3. JSON-LD `SoftwareApplication + BreadcrumbList`
4. Скрипт генерации `sitemap.xml` из ready-калькуляторов
5. `robots.txt` — запретить /workspace
6. Расширить i18n базовыми nav/home ключами
7. Создать `useCalculatorRegistry.ts`
8. Добавить `404.html` в public/ (копия index.html для GitHub Pages)

## Требуется согласование пользователя
**Да** — переход к Фазе 2
