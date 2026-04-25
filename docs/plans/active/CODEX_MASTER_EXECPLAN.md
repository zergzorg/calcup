# Calcup Codex Master Execplan

Status: active
Created: 2026-04-26
Updated: 2026-04-26
Owner: Codex

## Краткая цель проекта

Развивать Calcup как SEO-friendly каталог онлайн-калькуляторов и конвертеров. Каждый milestone должен добавлять проверяемую пользу: новый ready-калькулятор, исправление архитектурного ограничения, SEO/UX-улучшение или тестовое покрытие.

## Текущая архитектура

- Vue 3 + TypeScript + Vue Router + Vite SSG.
- `src/data/calculators.ts` и `src/data/categories.ts` — источник правды для каталога, карточек, роутов, поиска, breadcrumbs и sitemap-политики.
- Ready-калькуляторы загружаются через `componentLoader` в `CalculatorView.vue`.
- `soon`-карточки имеют routes-заглушки и `noindex`.
- `/workspace` сохранён как отдельный noindex-инструмент.
- `public/sitemap.xml` ведётся вручную и содержит только главную, категории с ready-содержимым и ready-калькуляторы.

## Правила реализации калькуляторов

- Feature-модуль в `src/features/<feature-name>/`.
- Чистые формулы в `lib/calculations.ts`.
- Unit-тесты в `lib/calculations.test.ts`.
- Состояние формы в composable, если есть валидация или несколько режимов.
- RU/EN локали.
- Запись в `src/data/calculators.ts` со статусом `ready`, SEO tags и `componentLoader`.
- При первом ready-калькуляторе категории добавить категорию и страницу калькулятора в `public/sitemap.xml`.
- UI строить по `src/features/calculator-design-system.css` и стандартной форме классов `<prefix>-page`, `<prefix>-heading`, `<prefix>-eyebrow`, `<prefix>-workspace`, `<prefix>-form`, `<prefix>-field`, `<prefix>-input-wrap`, `<prefix>-result`, `<prefix>-result__row`, `<prefix>-formula`, `<prefix>-toggle`.

## Audit Snapshot

Дата аудита: 2026-04-26.

- Всего карточек: 74.
- Ready до текущего milestone: 16.
- Soon до текущего milestone: 58.
- Пустые ready-категории до текущего milestone: `sport`, `clothing`.
- Категории с одним ready-калькулятором: `math`, `health`, `construction`, `transport`, `datetime`.
- Категории с малым покрытием, но высоким потенциалом: `construction` (1 ready / 20 soon), `sport` (0 / 5), `clothing` (0 / 5).
- Архитектурно критичных блокеров для расширения каталога не найдено.
- Главный SEO gap: `public/sitemap.xml` обновляется вручную и может расходиться с реестром при росте каталога.
- UI gap: часть старых калькуляторов содержит локальные стили, но shared design-system перекрывает основной контракт. Новые калькуляторы должны избегать локальных визуальных переопределений.

## Backlog задач

1. `sport/pace-speed` — первый ready-калькулятор в пустой категории `sport`.
2. `construction/paint` — следующий P0-калькулятор из строительного roadmap.
3. `sport/distance-pace-time` — продолжение спортивной линейки.
4. `clothing/shoe-size` — первый ready-калькулятор в пустой категории `clothing`.
5. Автоматизировать генерацию sitemap из реестра или добавить тест на соответствие sitemap ready-страницам.
6. Усилить registry guards: ready-калькулятор должен иметь `componentLoader`, `popularity`, tags и не быть пропущенным в sitemap.

## Приоритеты

1. Active-планы и пустые категории.
2. Простые high-value калькуляторы с низким риском формул.
3. SEO/sitemap защита от ручных ошибок.
4. Cleanup только если он помогает текущему milestone.

## Текущий Milestone

Milestone: `sport/pace-speed`.
Status: completed.

Критерии готовности:

- `pace-speed` переведён из `soon` в `ready`.
- Создан `src/features/pace-speed-calculator/`.
- Добавлены чистые формулы и unit-тесты.
- Добавлены RU/EN локали.
- `/sport/` и `/sport/pace-speed/` добавлены в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Изменения закоммичены отдельным commit.

Ожидаемые файлы:

- `src/features/pace-speed-calculator/index.ts`
- `src/features/pace-speed-calculator/components/PaceSpeedCalculatorView.vue`
- `src/features/pace-speed-calculator/composables/usePaceSpeedCalculator.ts`
- `src/features/pace-speed-calculator/lib/calculations.ts`
- `src/features/pace-speed-calculator/lib/calculations.test.ts`
- `src/features/pace-speed-calculator/types/pace-speed.ts`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`

## Completed Milestones

- 2026-04-26: Audit проекта и создание автономных планов Codex.
- 2026-04-26: Реализован `/sport/pace-speed`; каталог стал 17 ready / 57 soon, категория `/sport` получила первый ready-инструмент.
- 2026-04-26: Реализован `/construction/paint`; каталог стал 18 ready / 56 soon, строительный раздел получил второй P0-инструмент.

## Decisions Log

- 2026-04-26: Первым milestone выбран `sport/pace-speed`, потому что категория `sport` пока не имеет ready-инструментов, а формулы низкорисковые и хорошо тестируются.
- 2026-04-26: Для `pace-speed` используются формулы `speedKmH = 60 / paceMinPerKm`, `paceMinPerKm = 60 / speedKmH`, `paceMinPerMile = paceMinPerKm * 1.609344`, `speedMph = speedKmH / 1.609344`. Базовая связь скорости, расстояния и времени сверена с общедоступными учебными источниками; специализированная формула `min/km = 60 / km/h` сверена с running pace conversion references.

## Risks / Blockers

- `MAIN_PLAN.MD` untracked на старте. Он используется как входной план, но не должен случайно попасть в commit без решения.
- Ручной sitemap может расходиться с реестром при следующих ready-калькуляторах.

## Verification Log

- 2026-04-26: `git status --short` показал только untracked `docs/plans/active/MAIN_PLAN.MD` до начала правок.
- 2026-04-26: `npm run test` — OK, 16 files / 304 tests.
- 2026-04-26: `npm run type-check` — OK.
- 2026-04-26: `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/sport/pace-speed/index.html` — title, description, `index,follow` robots и canonical `https://calcup.ru/sport/pace-speed/` OK.
- 2026-04-26: Static smoke по `dist/sitemap.xml` и `public/sitemap.xml` — `/sport/` и `/sport/pace-speed/` присутствуют, `/clothing/` не добавлен в sitemap.
- 2026-04-26: Для `/construction/paint` `npm run test` — OK, 17 files / 311 tests.
- 2026-04-26: Для `/construction/paint` `npm run type-check` — OK.
- 2026-04-26: Для `/construction/paint` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/construction/paint/index.html` — title, description, `index,follow` robots и canonical `https://calcup.ru/construction/paint/` OK.
- 2026-04-26: Static smoke по `dist/sitemap.xml` и `public/sitemap.xml` — `/construction/paint/` присутствует.

## Commit Log

- 8b7c3cb — `feat(sport): add pace-speed calculator`.

## Next Action

Сделать атомарный commit `feat(construction): add paint calculator`, затем перейти к следующему backlog item: `sport/distance-pace-time`.

Завершённый milestone `construction/paint`:

- `paint` переведён из `soon` в `ready`.
- Создан `src/features/paint-calculator/`.
- Добавлены формулы и unit-тесты для площади, вычета проёмов, литров, банок и стоимости.
- Добавлены RU/EN локали.
- `/construction/paint/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `liters = paintableArea * coats / coveragePerLiter * (1 + wastePercent / 100)`, банки округляются вверх до целой упаковки.
