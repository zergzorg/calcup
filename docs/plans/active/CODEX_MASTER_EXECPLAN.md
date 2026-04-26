# Calcup Codex Master Execplan

Status: active
Created: 2026-04-26
Updated: 2026-04-26
Owner: Codex

## Краткая Цель

Развивать Calcup как SEO-friendly каталог онлайн-калькуляторов и конвертеров. Каждый milestone должен добавлять проверяемую пользу: новый `ready`-калькулятор, исправление архитектурного ограничения, SEO/UX/accessibility-улучшение или тестовую защиту.

## Текущая Архитектура

- Vue 3 + TypeScript + Vue Router + Vite SSG.
- `src/data/calculators.ts` и `src/data/categories.ts` — источник правды для каталога, карточек, роутов, поиска, breadcrumbs и sitemap-политики.
- `ready`-калькуляторы загружаются через `componentLoader` в `CalculatorView.vue`.
- `soon`-карточки имеют routes-заглушки и `noindex`.
- `/workspace` сохранён как отдельный noindex-инструмент.
- `public/sitemap.xml` ведётся вручную, но защищён registry/sitemap guard-тестом.
- Общий визуальный контракт новых калькуляторов хранится в `src/features/calculator-design-system.css`.

## Правила Реализации

- Feature-модуль: `src/features/<feature-name>/`.
- Чистые формулы: `lib/calculations.ts`.
- Unit-тесты: `lib/calculations.test.ts`.
- Состояние формы в composable, если есть валидация, несколько режимов или derived state.
- RU/EN локали обязательны.
- Registry-запись должна иметь `status: 'ready'`, `componentLoader`, `popularity`, SEO/search tags.
- `ready` route должен быть в `public/sitemap.xml`; `soon`/`planned` route не должен быть в sitemap.
- UI строится по `calculator-design-system.css` и стандартным классам `<prefix>-page`, `<prefix>-heading`, `<prefix>-eyebrow`, `<prefix>-workspace`, `<prefix>-form`, `<prefix>-field`, `<prefix>-input-wrap`, `<prefix>-result`, `<prefix>-result__row`, `<prefix>-formula`, `<prefix>-toggle`.
- Локально не переопределять рамки, радиусы, высоты контролов, focus-ring, result-panel layout, accent colors и spacing primitives.
- Для health, construction, clothing sizes, finance/tax и нормативных расчётов фиксировать assumptions и добавлять дисклеймер, если результат может восприниматься как профессиональная рекомендация.

## Source Of Truth

1. `src/data/calculators.ts`
2. `src/data/categories.ts`
3. feature-модули в `src/features/`
4. `src/locales/ru.json` и `src/locales/en.json`
5. router / SSG output / route indexes
6. `public/sitemap.xml`
7. `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
8. `docs/plans/active/CODEX_WORKLOG.md`

Если active-roadmap противоречит коду, сначала проверять реестр, sitemap и feature-модули, затем синхронизировать документ.

## Audit Snapshot

Дата аудита: 2026-04-26.

- Категорий: 10.
- Всего карточек: 74.
- Ready: 41.
- Soon: 33.
- Planned: 0.
- Категории с одним ready-калькулятором: `math`, `health`, `clothing`.
- Низкорисковые next candidates: `/convert/speed`.
- Средне/высокорисковые candidates требуют дисклеймеров или источников: construction P2/P3, clothing sizes, health, finance/tax.
- UI-risk: старые калькуляторы местами имеют локальные стили; новые milestones должны держаться shared design-system.
- Process-risk: `MAIN_PLAN.MD` untracked и используется как входной план, его нельзя случайно добавить в commit.

## Current Milestone

- slug: `speed`
- category: `convert`
- goal: перевести `/convert/speed` из `soon` в `ready` и добавить конвертер скорости.
- reason: низкорисковый справочный конвертер; продолжает закрывать базовые `soon`-карточки `/convert`.
- acceptance criteria:
  - registry-запись `speed` имеет `status: 'ready'`, `componentLoader`, `popularity`, tags;
  - создан `src/features/speed-converter/`;
  - чистые функции переводят км/ч, м/с, mph, knots и pace min/km через базовую единицу;
  - есть unit-тесты на metric/imperial/pace-конверсии, округление и invalid input;
  - RU/EN локали заполнены;
  - `/convert/speed/` добавлен в sitemap;
  - canonical со slash и `index,follow` проверены через build output;
  - mobile smoke 430px без horizontal overflow;
  - `npm run test`, `npm run type-check`, `npm run build` зелёные;
  - active-планы, тематические roadmaps и README синхронизированы.
- expected files:
  - `src/features/speed-converter/index.ts`
  - `src/features/speed-converter/components/SpeedConverterView.vue`
  - `src/features/speed-converter/composables/useSpeedConverter.ts`
  - `src/features/speed-converter/lib/calculations.ts`
  - `src/features/speed-converter/lib/calculations.test.ts`
  - `src/features/speed-converter/types/speed.ts`
  - `src/data/calculators.ts`
  - `src/locales/ru.json`
  - `src/locales/en.json`
  - `public/sitemap.xml`
  - `README.md`
  - `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
  - `docs/plans/active/CODEX_WORKLOG.md`
  - `docs/plans/active/2026-04-25-project-status.md`
  - `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- verification commands:
  - `npm run test`
  - `npm run type-check`
  - `npm run build`
  - `rg -n "Конвертер скорости|Speed Converter|canonical|robots|convert/speed" dist/convert/speed.html public/sitemap.xml dist/sitemap.xml`
  - `npm run preview -- --host 127.0.0.1 --port 4173`
  - `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/convert/speed/ /tmp/calcup-speed-mobile.png`
  - `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/convert/speed/ /tmp/calcup-speed-mobile-full.png`
- risk level: low
- status: planned

## Pending

- slug: `clothing-size`; category: `clothing`; цель: базовый конвертер размеров одежды; причина приоритета: категория `clothing` пока с одним ready; expected scope: generic RU/EU/US/UK/XS-XXL with disclaimer; риск: high.
- slug: `strip-foundation`; category: `construction`; цель: ориентировочный расчёт ленточного фундамента; причина приоритета: roadmap construction P2; expected scope: concrete volume, sand cushion, formwork, disclaimer; риск: high.
- slug: `metronome`; category: `sport`; цель: тренировочный BPM/cadence helper; причина приоритета: последний sport soon; expected scope: BPM, cadence, no autoplay assumptions; риск: medium.

## Completed

- slug: `pace-speed`; category: `sport`; сделано: темп/скорость; проверки: test/type-check/build/mobile/static smoke; commit hash: `8b7c3cb`.
- slug: `paint`; category: `construction`; сделано: расход краски; проверки: test/type-check/build/static smoke; commit hash: `b0dc25e`.
- slug: `distance-pace-time`; category: `sport`; сделано: дистанция/темп/время; проверки: test/type-check/build/static smoke; commit hash: `88d5990`.
- slug: `shoe-size`; category: `clothing`; сделано: базовый конвертер обуви; проверки: test/type-check/build/mobile/static smoke; commit hash: `0fc564f`.
- slug: `registry-sitemap-guards`; category: `data`; сделано: guard-тесты реестра и sitemap; проверки: test/type-check/build; commit hash: `95ee3fe`.
- slug: `heart-rate-zones`; category: `sport`; сделано: пульсовые зоны и цветные карточки; проверки: test/type-check/build/mobile/static smoke; commit hash: `28c10e6`.
- slug: `tile`; category: `construction`; сделано: плитка, упаковки, запас; проверки: test/type-check/build/mobile/static smoke; commit hash: `90d49d2`.
- slug: `laminate`; category: `construction`; сделано: ламинат, упаковки, запас; проверки: test/type-check/build/mobile/static smoke; commit hash: `4131da0`.
- slug: `floor-screed`; category: `construction`; сделано: стяжка пола; проверки: test/type-check/build/mobile/static smoke; commit hash: `1388e97`.
- slug: `trip-cost`; category: `transport`; сделано: стоимость поездки; проверки: test/type-check/build/mobile/static smoke; commit hash: `705bdfb`.
- slug: `fuel-price`; category: `transport`; сделано: топливо по бюджету; проверки: test/type-check/build/mobile/static smoke; commit hash: `cde7208`.
- slug: `average-speed`; category: `transport`; сделано: средняя скорость; проверки: test/type-check/build/mobile/static smoke; commit hash: `75f9560`.
- slug: `race-split`; category: `sport`; сделано: сплиты забега; проверки: test/type-check/build/mobile/static smoke; commit hash: `17d6823`.
- slug: `brick`; category: `construction`; сделано: кирпич, кладка, раствор; проверки: test/type-check/build/mobile/static smoke; commit hash: `6317139`.
- slug: `drywall`; category: `construction`; сделано: ГКЛ, профиль, крепёж; проверки: test/type-check/build/mobile/static smoke; commit hash: `1e154e3`.
- slug: `blocks`; category: `construction`; сделано: газоблок, клей, объём; проверки: test/type-check/build/mobile/static smoke; commit hash: `bcec9ce`.
- slug: `putty`; category: `construction`; сделано: шпатлёвка/штукатурка; проверки: test/type-check/build/mobile/static smoke; commit hash: `9c37203`.
- slug: `insulation`; category: `construction`; сделано: утеплитель, плиты, упаковки; проверки: test/type-check/build/mobile/static smoke; commit hash: `d880d93`.
- slug: `ev-range`; category: `transport`; сделано: запас хода EV; проверки: test/type-check/build/mobile/static smoke; commit hash: `f665b29`.
- slug: `concrete`; category: `construction`; сделано: бетон, мешки, запас; проверки: test/type-check/build/mobile/static smoke; commit hash: `45c9836`.
- slug: `age`; category: `datetime`; сделано: возраст, прожитые дни, день рождения; проверки: test/type-check/build/mobile/static smoke; commit hash: `0bbdcfc`.
- slug: `workdays`; category: `datetime`; сделано: рабочие/выходные дни; проверки: test/type-check/build/mobile/static smoke; commit hash: `b05e876`.
- slug: `time-duration`; category: `datetime`; сделано: сложение и вычитание длительностей в часах, минутах и секундах; проверки: test/type-check/build/mobile/static smoke; commit hash: `22935a2`.
- slug: `countdown`; category: `datetime`; сделано: дни до события, прошедшие дни, опциональное включение даты отсчёта; проверки: test/type-check/build/mobile/static smoke; commit hash: `a057264`.
- slug: `bill-split`; category: `everyday`; сделано: разделение счёта с чаевыми, сервисным сбором и округлением на человека; проверки: test/type-check/build/mobile/static smoke; commit hash: `80c4117`.
- slug: `volume`; category: `convert`; сделано: конвертер объёма через литры с metric и US liquid единицами; проверки: test/type-check/build/mobile/static smoke; commit hash: `4d9567d`.

## Deferred

- slug: `snow-load`; причина откладывания: нормативный high-risk расчёт требует источников норм, региональных коэффициентов и даты актуальности; что нужно для возврата: отдельная проработка источников и дисклеймеров.
- slug: `wind-load`; причина откладывания: нормативный high-risk расчёт; что нужно для возврата: источники норм, региональная модель и тестовые наборы.
- slug: `brand-size-compare`; причина откладывания: брендовые таблицы меняются и требуют источников с датой актуальности; что нужно для возврата: typed reference data по брендам.
- slug: `sneaker-size`; причина откладывания: брендовые сетки и gender-specific шкалы повышают риск; что нужно для возврата: ограничить scope или собрать источники.
- slug: `currency`; причина откладывания: актуальные курсы требуют внешнего API или явного manual-rate UX; что нужно для возврата: выбрать модель данных без секретов/API.

## Decisions Log

- 2026-04-26: `time-duration` выбран следующим milestone, потому что это низкорисковый datetime-калькулятор на общеизвестной арифметике длительностей.
- 2026-04-26: Для `time-duration` первая версия использует две длительности и операцию add/subtract; результат может быть отрицательным и показывается с явным знаком.
- 2026-04-26: `countdown` выбран следующим milestone, потому что это низкорисковый date-only сценарий без нормативных источников.
- 2026-04-26: Для `countdown` расчёт выполняется по date-only значениям через UTC; опция включения даты отсчёта добавляет 1 день только к ненулевой разнице.
- 2026-04-26: `bill-split` выбран следующим milestone, потому что это низкорисковый бытовой сценарий и расширяет категорию `/everyday`.
- 2026-04-26: Для `bill-split` первая версия считает равное деление общего счёта, фиксированный сервисный сбор, чаевые процентом и округление доли вверх.
- 2026-04-26: `volume` выбран следующим milestone, потому что это низкорисковый unit-converter и закрывает базовую `soon`-карточку `/convert/volume`.
- 2026-04-26: Для `volume` все конверсии идут через литры; imperial-единицы ограничены US liquid.
- 2026-04-26: `speed` выбран следующим milestone, потому что это низкорисковый unit-converter и логичное продолжение `/convert/volume`.
- 2026-04-26: Для `workdays` считаются только будни Пн-Пт без государственных праздников и переносов; конечная дата включается опциональным переключателем.
- 2026-04-26: Для `age` возраст считается календарно; для 29 февраля в невисокосный год ближайший день рождения считается 28 февраля.
- 2026-04-26: Для `concrete` расчёт прямоугольной заливки использует `volume = length * width * thicknessM * (1 + waste / 100)`.
- 2026-04-26: Для high-risk construction/clothing/health/finance задач обязательно фиксировать assumptions и дисклеймер.

## Assumptions Log

- `time-duration`: часы, минуты и секунды вводятся как неотрицательные числа; минуты и секунды нормализуются через общий total seconds.
- `time-duration`: отрицательный результат допустим только для вычитания и отображается как `−HH:MM:SS`.
- `time-duration`: расчёт не зависит от часовых поясов, календарных дат и DST.
- `countdown`: date-only расчёт выполняется через UTC; пользовательская временная зона не влияет на количество календарных дней.
- `countdown`: для одинаковых дат опция включения даты отсчёта не превращает результат в 1 день, чтобы не ломать статус `today`.
- `bill-split`: первая версия будет считать равное деление счёта; индивидуальные позиции участников не входят в initial scope.
- `volume`: конверсия будет идти через литры как базовую единицу; US liquid gallon = 3.785411784 л, US cup = 0.2365882365 л.
- `speed`: конверсия будет идти через м/с как базовую единицу; pace min/km трактуется как обратная скорость.
- `workdays`: праздники и переносы выходных не учитываются.
- `age`: date-only расчёты выполняются через UTC, чтобы избежать DST-сдвигов.
- `MAIN_PLAN.MD`: входной untracked план, не добавлять в commit без отдельного решения.

## Risks / Blockers

- `MAIN_PLAN.MD` untracked и не должен случайно попасть в commit.
- Ручной `public/sitemap.xml` может расходиться с реестром; guard-тест снижает риск, но не заменяет генерацию.
- Некоторые thematic roadmaps устарели относительно фактических completed milestones и должны синхронизироваться при релевантных изменениях.

## Verification Log

- 2026-04-26: До старта `time-duration` `git status --short` показывает только untracked `docs/plans/active/MAIN_PLAN.MD`.
- 2026-04-26: Фактические счётчики после `/datetime/time-duration`: 38 ready / 36 soon / 0 planned.
- 2026-04-26: Последний полный milestone `/datetime/workdays`: `npm run test`, `npm run type-check`, `npm run build`, static smoke и mobile Playwright smoke прошли.
- 2026-04-26: Для `/datetime/time-duration` `npm run test` — OK, 38 files / 386 tests.
- 2026-04-26: Для `/datetime/time-duration` `npm run type-check` — OK.
- 2026-04-26: Для `/datetime/time-duration` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/datetime/time-duration.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/datetime/time-duration/` — поля, operation chips, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/datetime/countdown` `npm run test` — OK, 39 files / 391 tests.
- 2026-04-26: Для `/datetime/countdown` `npm run type-check` — OK.
- 2026-04-26: Для `/datetime/countdown` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/datetime/countdown.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/datetime/countdown/` — date inputs, toggle, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/everyday/bill-split` `npm run test` — OK, 40 files / 395 tests.
- 2026-04-26: Для `/everyday/bill-split` `npm run type-check` — OK.
- 2026-04-26: Для `/everyday/bill-split` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/everyday/bill-split.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/everyday/bill-split/` — inputs, chips, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/convert/volume` `npm run test` — OK, 41 files / 400 tests.
- 2026-04-26: Для `/convert/volume` `npm run type-check` — OK.
- 2026-04-26: Для `/convert/volume` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/convert/volume.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/convert/volume/` — unit-grid, result rows и popular conversions без overflow и наложений.

## Commit Log

- `4d9567d` — `feat(convert): add volume converter`.
- `80c4117` — `feat(everyday): add bill split calculator`.
- `a057264` — `feat(datetime): add countdown calculator`.
- `22935a2` — `feat(datetime): add time duration calculator`.
- `ff6df26` — `docs(plans): record workdays milestone`.
- `b05e876` — `feat(datetime): add workdays calculator`.
- `13aff52` — `docs(plans): record age milestone`.
- `0bbdcfc` — `feat(datetime): add age calculator`.
- `e3b6f56` — `docs(plans): record concrete milestone`.
- `45c9836` — `feat(construction): add concrete calculator`.
- `cd35d79` — `docs(plans): record ev range milestone`.
- `f665b29` — `feat(transport): add ev range calculator`.

## Next Action

Реализовать Current Milestone `/convert/speed`, затем перенести его в `Completed`, записать commit hash, удалить или обновить соответствующий `Pending`, выбрать следующий milestone и оставить `Current Milestone` не в `completed`, а в `planned`/`in_progress` для следующей задачи.
