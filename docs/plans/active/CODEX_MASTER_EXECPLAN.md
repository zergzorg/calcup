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
- Ready после текущего milestone: 26.
- Soon после текущего milestone: 48.
- Пустые ready-категории до текущего milestone были `sport`, `clothing`; обе категории теперь имеют ready-инструменты.
- Категории с одним ready-калькулятором: `math`, `health`, `clothing`, `datetime`.
- Категории с малым покрытием, но высоким потенциалом: `construction` (5 ready / 16 soon), `sport` (3 ready / 2 soon), `clothing` (1 ready / 4 soon).
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
7. `construction/tile` — следующий P0-калькулятор строительного roadmap.

## Приоритеты

1. Active-планы и пустые категории.
2. Простые high-value калькуляторы с низким риском формул.
3. SEO/sitemap защита от ручных ошибок.
4. Cleanup только если он помогает текущему milestone.

## Текущий Milestone

Milestone: `transport/fuel-price`.
Status: completed.

Критерии готовности:

- `fuel-price` переведён из `soon` в `ready`.
- Создан `src/features/fuel-price-calculator/`.
- Добавлены чистые формулы и unit-тесты.
- Добавлены RU/EN локали.
- `/transport/fuel-price/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Изменения закоммичены отдельным commit.

Ожидаемые файлы:

- `src/features/fuel-price-calculator/index.ts`
- `src/features/fuel-price-calculator/components/FuelPriceCalculatorView.vue`
- `src/features/fuel-price-calculator/composables/useFuelPriceCalculator.ts`
- `src/features/fuel-price-calculator/lib/calculations.ts`
- `src/features/fuel-price-calculator/lib/calculations.test.ts`
- `src/features/fuel-price-calculator/types/fuel-price.ts`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`

## Completed Milestones

- 2026-04-26: Audit проекта и создание автономных планов Codex.
- 2026-04-26: Реализован `/sport/pace-speed`; каталог стал 17 ready / 57 soon, категория `/sport` получила первый ready-инструмент.
- 2026-04-26: Реализован `/construction/paint`; каталог стал 18 ready / 56 soon, строительный раздел получил второй P0-инструмент.
- 2026-04-26: Реализован `/sport/distance-pace-time`; каталог стал 19 ready / 55 soon, спортивный раздел получил второй P0-инструмент.
- 2026-04-26: Реализован `/clothing/shoe-size`; каталог стал 20 ready / 54 soon, категория `/clothing` получила первый ready-инструмент.
- 2026-04-26: Добавлен registry/sitemap guard test; ready-реестр теперь проверяется на loader/popularity/tags и соответствие `public/sitemap.xml`.
- 2026-04-26: Реализован `/sport/heart-rate-zones`; каталог стал 21 ready / 53 soon, спортивный раздел получил третий ready-инструмент.
- 2026-04-26: Реализован `/construction/tile`; каталог стал 22 ready / 52 soon, строительный раздел получил третий ready-инструмент.
- 2026-04-26: По пользовательскому фидбеку обновлён UI `/sport/heart-rate-zones`: цветные карточки зон, пояснения и целевой пульс.
- 2026-04-26: Реализован `/construction/laminate`; каталог стал 23 ready / 51 soon, строительный раздел получил четвёртый ready-инструмент.
- 2026-04-26: Реализован `/construction/floor-screed`; каталог стал 24 ready / 50 soon, строительный P0 first wave закрыт.
- 2026-04-26: Реализован `/transport/trip-cost`; каталог стал 25 ready / 49 soon, транспортный раздел получил второй ready-инструмент.
- 2026-04-26: Реализован `/transport/fuel-price`; каталог стал 26 ready / 48 soon, транспортный раздел получил третий ready-инструмент.

## Decisions Log

- 2026-04-26: Первым milestone выбран `sport/pace-speed`, потому что категория `sport` пока не имеет ready-инструментов, а формулы низкорисковые и хорошо тестируются.
- 2026-04-26: Для `pace-speed` используются формулы `speedKmH = 60 / paceMinPerKm`, `paceMinPerKm = 60 / speedKmH`, `paceMinPerMile = paceMinPerKm * 1.609344`, `speedMph = speedKmH / 1.609344`. Базовая связь скорости, расстояния и времени сверена с общедоступными учебными источниками; специализированная формула `min/km = 60 / km/h` сверена с running pace conversion references.
- 2026-04-26: Для `shoe-size` базовой величиной выбрана длина стопы в сантиметрах. Mondopoint основан на ISO 9407 как маркировка по длине стопы в миллиметрах; EU/RU считается через Paris point с припуском 1.5 см, UK/US adult — через last length в barleycorn. Это ориентировочная конверсия, поэтому UI показывает предупреждение о различиях брендов и колодок.
- 2026-04-26: Для `heart-rate-zones` после визуального уточнения используются беговые зоны 60-70, 70-75, 75-85, 85-95, 95-100%. Метод `% от максимума` опирается на target heart rate ranges от max HR; метод `reserve` использует Karvonen/HRR: `resting + (max - resting) * intensity`.
- 2026-04-26: Для `tile` расчёт ведётся от площади поверхности и площади одной плитки: базовые плитки округляются вверх, затем добавляется запас, итоговая покупка округляется до целых упаковок; цена считается только если задана цена упаковки.
- 2026-04-26: Для `laminate` расчёт ведётся от чистой площади пола, покрытия одной упаковки и процента запаса. Типовой запас на подрезку оставлен настраиваемым, с быстрыми пресетами 5/10/15%.
- 2026-04-26: Для `floor-screed` расчёт сухой смеси ведётся по настраиваемому расходу `кг/м²/мм`; дефолт 1.8 кг/м²/мм взят как типичный паспортный ориентир, но UI прямо просит сверять значение с мешком или data sheet.
- 2026-04-26: Для `trip-cost` формула использует `fuelLiters = distance * consumption / 100`; дополнительные расходы прибавляются отдельной строкой, а стоимость на человека считается делением итоговой суммы на целое число пассажиров.
- 2026-04-26: Для `fuel-price` расчёт идёт от бюджета: `liters = budget / pricePerLiter`, `distanceKm = liters / consumptionPer100Km * 100`, `costPer100Km = consumptionPer100Km * pricePerLiter`.

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
- 2026-04-26: Для `/sport/distance-pace-time` `npm run test` — OK, 18 files / 317 tests.
- 2026-04-26: Для `/sport/distance-pace-time` `npm run type-check` — OK.
- 2026-04-26: Для `/sport/distance-pace-time` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/sport/distance-pace-time/index.html` — title, description, `index,follow` robots и canonical `https://calcup.ru/sport/distance-pace-time/` OK.
- 2026-04-26: Static smoke по `dist/sitemap.xml` и `public/sitemap.xml` — `/sport/distance-pace-time/` присутствует.
- 2026-04-26: Для `/clothing/shoe-size` `npm run test` — OK, 19 files / 322 tests.
- 2026-04-26: Для `/clothing/shoe-size` `npm run type-check` — OK.
- 2026-04-26: Для `/clothing/shoe-size` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/clothing/shoe-size/index.html` и `dist/clothing/index.html` — canonical, robots и sitemap entries для `/clothing/` и `/clothing/shoe-size/` OK.
- 2026-04-26: Mobile Playwright smoke 430px по `/clothing/shoe-size/` — overflow 0, chip-переключатели 360x46, наложений нет, активное состояние полноразмерное.
- 2026-04-26: Registry/sitemap guard `npm run test` — OK, 20 files / 325 tests.
- 2026-04-26: Registry/sitemap guard `npm run type-check` — OK.
- 2026-04-26: Registry/sitemap guard `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Для `/sport/heart-rate-zones` `npm run test` — OK, 21 files / 330 tests.
- 2026-04-26: Для `/sport/heart-rate-zones` `npm run type-check` — OK.
- 2026-04-26: Для `/sport/heart-rate-zones` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/sport/heart-rate-zones/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright smoke 430px по `/sport/heart-rate-zones/` — overflow 0, chip-переключатели 360x46, наложений нет, активное состояние полноразмерное.
- 2026-04-26: Для `/construction/tile` и HR visual polish `npm run test` — OK, 22 files / 333 tests.
- 2026-04-26: Для `/construction/tile` и HR visual polish `npm run type-check` — OK.
- 2026-04-26: Для `/construction/tile` и HR visual polish `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/construction/tile/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright screenshot 430px по `/construction/tile/` — chip-переключатели на всю ширину, активное состояние полноразмерное.
- 2026-04-26: Mobile Playwright smoke 430px по `/sport/heart-rate-zones/` после раскраски — overflow 0, 5 цветных карточек зон, активная кнопка одна, наложений нет.
- 2026-04-26: Для `/construction/laminate` `npm run test` — OK, 23 files / 336 tests.
- 2026-04-26: Для `/construction/laminate` `npm run type-check` — OK.
- 2026-04-26: Для `/construction/laminate` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/construction/laminate/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright screenshot 430px по `/construction/laminate/` — chip-переключатели полноширинные, активное состояние без наложений.
- 2026-04-26: Для `/construction/floor-screed` `npm run test` — OK, 24 files / 339 tests.
- 2026-04-26: Для `/construction/floor-screed` `npm run type-check` — OK.
- 2026-04-26: Для `/construction/floor-screed` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/construction/floor-screed/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright screenshot 430px по `/construction/floor-screed/` — chip-переключатели полноширинные, активное состояние без наложений.
- 2026-04-26: Для `/transport/trip-cost` `npm run test` — OK, 25 files / 342 tests.
- 2026-04-26: Для `/transport/trip-cost` `npm run type-check` — OK.
- 2026-04-26: Для `/transport/trip-cost` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/transport/trip-cost/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright screenshot 430px по `/transport/trip-cost/` — direction chips полноширинные, активное состояние без наложений.
- 2026-04-26: Для `/transport/fuel-price` `npm run test` — OK, 26 files / 345 tests.
- 2026-04-26: Для `/transport/fuel-price` `npm run type-check` — OK.
- 2026-04-26: Для `/transport/fuel-price` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/transport/fuel-price/index.html` — title, description, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright screenshot 430px по `/transport/fuel-price/` — поля и результат без overflow и наложений.

## Commit Log

- 8b7c3cb — `feat(sport): add pace-speed calculator`.
- b0dc25e — `feat(construction): add paint calculator`.
- 88d5990 — `feat(sport): add distance-pace-time calculator`.
- 0fc564f — `feat(clothing): add shoe size converter`.
- 95ee3fe — `test(registry): guard sitemap ready routes`.
- 28c10e6 — `feat(sport): add heart rate zones calculator`.
- 90d49d2 — `feat(construction): add tile calculator and polish hr zones`.
- 4131da0 — `feat(construction): add laminate calculator`.
- 1388e97 — `feat(construction): add floor screed calculator`.
- 705bdfb — `feat(transport): add trip cost calculator`.
- cde7208 — `feat(transport): add fuel price calculator`.

## Next Action

Перейти к следующему backlog item: выбрать следующий high-value ready-калькулятор из roadmap. Кандидаты: `/construction/brick`, `/construction/drywall`, `/clothing/clothing-size`, `/sport/race-split`, `/transport/average-speed`.

Завершённый milestone `transport/fuel-price`:

- `fuel-price` переведён из `soon` в `ready`.
- Создан `src/features/fuel-price-calculator/`.
- Добавлены формулы и unit-тесты для литров по бюджету, запаса хода и стоимости 100 км.
- Добавлены RU/EN локали.
- `/transport/fuel-price/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `liters = budget / pricePerLiter`, `distanceKm = liters / consumptionPer100Km * 100`, `costPer100Km = consumptionPer100Km * pricePerLiter`.

Завершённый milestone `transport/trip-cost`:

- `trip-cost` переведён из `soon` в `ready`.
- Создан `src/features/trip-cost-calculator/`.
- Добавлены формулы и unit-тесты для топлива, стоимости топлива, дополнительных расходов, round trip и стоимости на человека.
- Добавлены RU/EN локали.
- `/transport/trip-cost/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `fuelLiters = effectiveDistanceKm * consumptionPer100Km / 100`, `totalCost = fuelLiters * fuelPricePerLiter + tolls + parking + otherCosts`.

Завершённый milestone `construction/floor-screed`:

- `floor-screed` переведён из `soon` в `ready`.
- Создан `src/features/floor-screed-calculator/`.
- Добавлены формулы и unit-тесты для площади, объёма, сухой смеси, мешков, остатка и стоимости.
- Добавлены RU/EN локали.
- `/construction/floor-screed/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `dryMixKg = area * thicknessMm * consumptionKgPerM2Mm * (1 + wastePercent / 100)`, `bagsNeeded = ceil(dryMixKg / bagWeight)`.

Завершённый milestone `construction/laminate`:

- `laminate` переведён из `soon` в `ready`.
- Создан `src/features/laminate-calculator/`.
- Добавлены формулы и unit-тесты для площади пола, запаса, упаковок, купленной площади, остатка и стоимости.
- Добавлены RU/EN локали.
- `/construction/laminate/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `materialArea = (roomLength * roomWidth - excludedArea) * (1 + wastePercent / 100)`, `packsNeeded = ceil(materialArea / packCoverage)`.

Завершённый milestone `construction/tile` + HR zones visual polish:

- `tile` переведён из `soon` в `ready`.
- Создан `src/features/tile-calculator/`.
- Добавлены формулы и unit-тесты для площади, количества плиток, запаса, упаковок, остатка и стоимости.
- Добавлены RU/EN локали.
- `/construction/tile/` добавлен в sitemap.
- `/sport/heart-rate-zones/` получил цветные карточки зон с пояснением и целевым пульсом.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула плитки: `baseTiles = ceil(surfaceArea / tileArea)`, `tilesWithWaste = ceil(baseTiles * (1 + wastePercent / 100))`, `boxesNeeded = ceil(tilesWithWaste / tilesPerBox)`.

Завершённый milestone `sport/heart-rate-zones`:

- `heart-rate-zones` переведён из `soon` в `ready`.
- Создан `src/features/heart-rate-zones-calculator/`.
- Добавлены формулы и unit-тесты для `% от максимума` и Karvonen/HRR.
- Добавлены RU/EN локали.
- `/sport/heart-rate-zones/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формулы: `maxHr = 220 - age`, zone by max = `maxHr * percent`, zone by HRR = `restingHr + (maxHr - restingHr) * percent`.

Завершённый milestone `registry-sitemap-guards`:

- Добавлен `src/data/registry-guards.test.ts`.
- Проверяется `validateRegistry()`.
- Ready-калькуляторы проверяются на `componentLoader`, числовой `popularity` и непустые `tags`.
- `public/sitemap.xml` проверяется на наличие всех ready-калькуляторов и категорий с ready-контентом.
- `soon`/`planned` калькуляторы и пустые категории проверяются на отсутствие в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.

Завершённый milestone `clothing/shoe-size`:

- `shoe-size` переведён из `soon` в `ready`.
- Создан `src/features/shoe-size-converter/`.
- Добавлены формулы и unit-тесты для длины стопы, Mondopoint, EU/RU, UK, US men и US women.
- Добавлены RU/EN локали.
- `/clothing/` и `/clothing/shoe-size/` добавлены в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формулы: Mondopoint = длина стопы в мм; `EU/RU = (footLengthCm + 1.5) * 1.5`; `UK = 3 * (footLengthIn + 2/3) - 25`; `US men = UK + 1`; `US women = UK + 2`.

Завершённый milestone `sport/distance-pace-time`:

- `distance-pace-time` переведён из `soon` в `ready`.
- Создан `src/features/distance-pace-time-calculator/`.
- Добавлены формулы и unit-тесты для времени, темпа и дистанции.
- Добавлены RU/EN локали.
- `/sport/distance-pace-time/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формулы: `time = distance * pace`, `pace = time / distance`, `distance = time / pace`.

Завершённый milestone `construction/paint`:

- `paint` переведён из `soon` в `ready`.
- Создан `src/features/paint-calculator/`.
- Добавлены формулы и unit-тесты для площади, вычета проёмов, литров, банок и стоимости.
- Добавлены RU/EN локали.
- `/construction/paint/` добавлен в sitemap.
- Проверки `npm run test`, `npm run type-check`, `npm run build` зелёные.
- Формула: `liters = paintableArea * coats / coveragePerLiter * (1 + wastePercent / 100)`, банки округляются вверх до целой упаковки.
