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
- Ready: 60.
- Soon: 14.
- Planned: 0.
- Категории с одним ready-калькулятором: нет.
- Next candidates: `/health/pregnancy-due-date`, `/construction/rebar`, `/construction/slab-foundation`.
- Средне/высокорисковые candidates требуют дисклеймеров или источников: construction P2/P3, clothing sizes, health, finance/tax.
- UI-risk: старые калькуляторы местами имеют локальные стили; новые milestones должны держаться shared design-system.
- Process-risk: `MAIN_PLAN.MD` untracked и используется как входной план, его нельзя случайно добавить в commit.

## Current Milestone

- slug: `pregnancy-due-date`
- category: `health`
- goal: перевести `/health/pregnancy-due-date` из `soon` в `ready` и добавить ориентировочный расчёт даты родов.
- reason: продолжает health-кластер после body-fat; P2-сценарий полезный, но требует явного medical warning-note.
- acceptance criteria:
  - registry-запись `pregnancy-due-date` имеет `status: 'ready'`, `componentLoader`, `popularity`, tags;
  - создан `src/features/pregnancy-due-date-calculator/`;
  - чистые функции считают ориентировочную дату родов, срок беременности и триместр;
  - есть unit-тесты на формулы и invalid input;
  - RU/EN локали заполнены;
  - есть health warning-note: расчёт ориентировочный и не заменяет врача;
  - `/health/pregnancy-due-date/` добавлен в sitemap;
  - canonical со slash и `index,follow` проверены через build output;
  - mobile smoke 430px без horizontal overflow;
  - `npm run test`, `npm run type-check`, `npm run build` зелёные;
  - active-планы, product aggregator plan и README синхронизированы.
- expected files:
  - `src/features/pregnancy-due-date-calculator/index.ts`
  - `src/features/pregnancy-due-date-calculator/components/PregnancyDueDateCalculatorView.vue`
  - `src/features/pregnancy-due-date-calculator/composables/usePregnancyDueDateCalculator.ts`
  - `src/features/pregnancy-due-date-calculator/lib/calculations.ts`
  - `src/features/pregnancy-due-date-calculator/lib/calculations.test.ts`
  - `src/features/pregnancy-due-date-calculator/types/pregnancyDueDate.ts`
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
  - `rg -n "Калькулятор срока беременности|Pregnancy Due Date Calculator|canonical|robots|health/pregnancy-due-date" dist/health/pregnancy-due-date.html public/sitemap.xml dist/sitemap.xml`
  - `npm run preview -- --host 127.0.0.1 --port 4173`
  - `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/health/pregnancy-due-date/ /tmp/calcup-pregnancy-due-date-mobile.png`
  - `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/health/pregnancy-due-date/ /tmp/calcup-pregnancy-due-date-mobile-full.png`
- risk level: medium
- status: planned

## Pending

- empty: все явно выбранные pending milestone перенесены в Current Milestone или Completed; следующие задачи выбирать из актуальных `soon` в реестре и тематических roadmaps.

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
- slug: `speed`; category: `convert`; сделано: конвертер скорости через м/с, включая mph, knots и pace min/km; проверки: test/type-check/build/mobile/static smoke; commit hash: `decfac2`.
- slug: `clothing-size`; category: `clothing`; сделано: ориентировочный конвертер размеров одежды INT/RU/EU/US/UK с дисклеймером; проверки: test/type-check/build/mobile/static smoke; commit hash: `507bfe4`.
- slug: `metronome`; category: `sport`; сделано: BPM, интервал удара, каденс и Web Audio click по действию пользователя; проверки: test/type-check/build/mobile/static smoke; commit hash: `8741b2d`.
- slug: `strip-foundation`; category: `construction`; сделано: бетон, песчаная подушка, опалубка и ориентир арматуры для ленточного фундамента; проверки: test/type-check/build/mobile/static smoke; commit hash: `4755799`.
- slug: `data-size`; category: `convert`; сделано: decimal/binary конвертер bytes, KB/MB/GB/TB и KiB/MiB/GiB/TiB; проверки: test/type-check/build/mobile/static smoke; commit hash: `f1e8bda`.
- slug: `room-area`; category: `everyday`; сделано: площадь пола, потолка, стен, проёмов и периметр комнаты; проверки: test/type-check/build/mobile/static smoke; commit hash: `3c38f5a`.
- slug: `electricity`; category: `everyday`; сделано: расход кВт⋅ч и стоимость прибора по мощности, времени и тарифу; проверки: test/type-check/build/mobile/static smoke; commit hash: `432bbab`.
- slug: `cooking-units`; category: `everyday`; сделано: конвертер кухонных объёмных мер через миллилитры; проверки: test/type-check/build/mobile/static smoke; commit hash: `15328d1`.
- slug: `fraction`; category: `math`; сделано: операции над дробями, сокращение, смешанное число и десятичное приближение; проверки: test/type-check/build/mobile/static smoke; commit hash: `424f442`.
- slug: `average`; category: `math`; сделано: среднее, сумма, медиана, минимум, максимум и размах по списку чисел; проверки: test/type-check/build/mobile/static smoke; commit hash: `eba45a8`.
- slug: `proportion`; category: `math`; сделано: правило трёх, коэффициент, отношение и процентная связь; проверки: test/type-check/build/mobile/static smoke; commit hash: `69aea4d`.
- slug: `equation`; category: `math`; сделано: линейные и квадратные уравнения, дискриминант, действительные корни и вырожденные случаи; проверки: test/type-check/build/mobile/static smoke; commit hash: `14ae2ed`.
- slug: `calorie`; category: `health`; сделано: BMR по Mifflin-St Jeor, TDEE, цель по дневному delta и health warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `38748f4`.
- slug: `ideal-weight`; category: `health`; сделано: Devine/Robinson/Miller/Hamwi, среднее по формулам, BMI-диапазон и health warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `fce19d8`.
- slug: `mortgage`; category: `finance`; сделано: первоначальный взнос, сумма кредита, аннуитетный платёж, общая выплата, переплата и finance warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `a5cd618`.
- slug: `deposit`; category: `finance`; сделано: доход по вкладу без капитализации и с ежемесячной капитализацией, итоговая сумма, рост за срок и finance warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `7c68b46`.
- slug: `compound-interest`; category: `finance`; сделано: рост капитала с ежемесячной капитализацией, регулярными пополнениями, доходом от процентов и warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `c314a72`.
- slug: `refinance`; category: `finance`; сделано: сравнение старого и нового аннуитетного кредита, экономия, месячная разница и окупаемость расходов; проверки: test/type-check/build/mobile/static smoke; commit hash: `d2f9d4a`.
- slug: `body-fat`; category: `health`; сделано: оценка процента жира по US Navy circumference method, категория, жировая/безжировая масса и health warning-note; проверки: test/type-check/build/mobile/static smoke; commit hash: `6107642`.

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
- 2026-04-26: Для `speed` все прямые скорости переводятся через м/с; pace `мин/км` трактуется как обратная скорость и требует значения больше 0.
- 2026-04-26: `clothing-size` выбран следующим milestone по порядку pending; scope будет generic adult sizes с дисклеймером, без обещания брендовой точности.
- 2026-04-26: После `clothing-size` следующим выбран `metronome`, чтобы закрыть последний sport `soon` перед high-risk construction milestone.
- 2026-04-26: После `metronome` следующим выбран `strip-foundation`; task high-risk, поэтому первая версия будет только ориентировочной и с явным строительным дисклеймером.
- 2026-04-26: После `strip-foundation` следующим выбран `data-size`, потому что это низкорисковый converter milestone без внешних данных и нормативных источников.
- 2026-04-26: После `data-size` следующим выбран `room-area`, потому что это низкорисковый everyday-сценарий с простыми геометрическими формулами.
- 2026-04-26: После `room-area` следующим выбран `electricity`, потому что это P1 everyday-сценарий с простыми расчётами мощности, времени и тарифа.
- 2026-04-26: После `electricity` следующим выбран `cooking-units`; scope ограничить объёмными kitchen units, чтобы не обещать точную конверсию граммов без плотности продукта.
- 2026-04-26: После `cooking-units` следующим выбран `fraction`, потому что это низкорисковый P1 math milestone и категория `/math` нуждается в расширении ready-инструментов.
- 2026-04-26: После `fraction` следующим выбран `average`, потому что это низкорисковая статистика по списку чисел и логичное продолжение math-кластера.
- 2026-04-26: После `average` следующим выбран `proportion`, потому что это низкорисковое правило трёх и продолжение math-кластера.
- 2026-04-26: После `proportion` следующим выбран `equation`, потому что это последний math `soon`; scope ограничен линейными и квадратными уравнениями.
- 2026-04-26: После `equation` следующим выбран `calorie`, потому что math-кластер закрыт, а health остаётся категорией с одним ready-инструментом.
- 2026-04-26: После `calorie` следующим выбран `ideal-weight`, потому что это P1 health-карточка и логичное продолжение health-кластера.
- 2026-04-26: После `ideal-weight` следующим выбран `mortgage`, потому что это high-value finance-карточка с низким формульным риском при ручном вводе ставки.
- 2026-04-26: После `mortgage` следующим выбран `deposit`, потому что это P1 finance-карточка без внешних данных и с низким формульным риском.
- 2026-04-26: После `deposit` следующим выбран `compound-interest`, потому что это последняя P1 finance-карточка и полезное продолжение накопительных сценариев.
- 2026-04-26: После `compound-interest` следующим выбран `refinance`, чтобы закрыть оставшийся finance `soon` перед возвратом к construction/health.
- 2026-04-26: После `refinance` следующим выбран `body-fat`, потому что finance-кластер закрыт, а health всё ещё имеет `soon`-карточки.
- 2026-04-26: После `body-fat` следующим выбран `pregnancy-due-date`, чтобы закрыть health `soon` перед возвратом к construction.
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
- `clothing-size`: размеры одежды будут ориентировочными; бренды, посадка, gender-specific и country-specific таблицы могут отличаться.
- `metronome`: браузерный звук должен запускаться только после пользовательского действия; autoplay не используется.
- `strip-foundation`: расчёт будет ориентировочным; грунты, несущая способность, промерзание, нагрузки, армирование и бетон должны проверяться по проекту и нормам.
- `data-size`: decimal mode использует 1000 bytes per step, binary mode использует 1024 bytes per step; `KB/MB/GB/TB` и `KiB/MiB/GiB/TiB` показываются явно.
- `room-area`: комната считается прямоугольной; проёмы вычитаются из площади стен и clamp-ятся так, чтобы отделочная площадь не уходила ниже 0.
- `electricity`: пользователь сам вводит тариф; расчёт не пытается учитывать зоны тарифа, льготы, сетевые надбавки или реальные измерения счётчика.
- `cooking-units`: граммы не конвертировать в объём без выбора продукта/плотности; первая версия работает с объёмом.
- `fraction`: знаменатель не может быть 0; результат всегда нормализуется по знаку и сокращается через GCD.
- `average`: первая версия парсит числа из многострочного/разделённого запятыми ввода; пустые элементы игнорируются только если есть хотя бы одно число.
- `proportion`: первая версия решает одну неизвестную `x` в пропорции; деление на 0 валидируется явно.
- `equation`: первая версия решает только действительные корни; комплексные корни показываются как отсутствие real roots.
- `calorie`: первая версия будет считать BMR по Mifflin-St Jeor, TDEE через activity factor и цель через фиксированный дневной delta; результат является ориентиром, не медицинской рекомендацией.
- `ideal-weight`: первая версия должна показывать диапазон/несколько формул как справочный ориентир, не как медицинскую норму.
- `mortgage`: первая версия будет считать аннуитетный платёж по ручной ставке, цене недвижимости, первоначальному взносу и сроку; комиссии, страховки, субсидии и требования банка не входят в scope.
- `deposit`: первая версия будет считать simple/compound начисление по ручной ставке; налоги, досрочное снятие, бонусные ставки и капитализация по сложным банковским правилам не входят в scope.
- `compound-interest`: первая версия будет считать накопления по регулярному пополнению и ручной ставке; налоги, инфляция, риск, комиссии и прогноз доходности не входят в scope.
- `refinance`: первая версия сравнит старый и новый аннуитетный кредит по текущему остатку; штрафы, страховки, изменение графика и требования банка не входят в scope.
- `body-fat`: первая версия будет справочной оценкой по антропометрическим формулам; медицинская диагностика, калиперы, биоимпеданс и спортивные нормы не входят в scope.
- `pregnancy-due-date`: первая версия будет считать ориентир по LMP/дате зачатия; УЗИ, индивидуальные медицинские факторы и врачебное ведение беременности не входят в scope.
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
- 2026-04-26: Для `/convert/speed` `npm run test` — OK, 42 files / 406 tests.
- 2026-04-26: Для `/convert/speed` `npm run type-check` — OK.
- 2026-04-26: Для `/convert/speed` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/convert/speed.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/convert/speed/` — unit-grid, result rows и popular conversions без overflow и наложений.
- 2026-04-26: Для `/clothing/clothing-size` `npm run test` — OK, 43 files / 409 tests.
- 2026-04-26: Для `/clothing/clothing-size` `npm run type-check` — OK.
- 2026-04-26: Для `/clothing/clothing-size` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/clothing/clothing-size.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/clothing/clothing-size/` — system chips, select, warning note и result rows без overflow и наложений.
- 2026-04-26: Для `/sport/metronome` `npm run test` — OK, 44 files / 413 tests.
- 2026-04-26: Для `/sport/metronome` `npm run type-check` — OK.
- 2026-04-26: Для `/sport/metronome` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/sport/metronome.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/sport/metronome/` — inputs, cadence chips, start button и result rows без overflow и наложений.
- 2026-04-26: Для `/construction/strip-foundation` `npm run test` — OK, 45 files / 417 tests.
- 2026-04-26: Для `/construction/strip-foundation` `npm run type-check` — OK.
- 2026-04-26: Для `/construction/strip-foundation` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/construction/strip-foundation.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/construction/strip-foundation/` — warning note, fields, quick buttons и result rows без overflow и наложений.
- 2026-04-26: Для `/convert/data-size` `npm run test` — OK, 46 files / 423 tests.
- 2026-04-26: Для `/convert/data-size` `npm run type-check` — OK.
- 2026-04-26: Для `/convert/data-size` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/convert/data-size.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/convert/data-size/` — Decimal/Binary chips, selects, result rows и popular conversions без overflow и наложений.
- 2026-04-26: Для `/everyday/room-area` `npm run test` — OK, 47 files / 427 tests.
- 2026-04-26: Для `/everyday/room-area` `npm run type-check` — OK.
- 2026-04-26: Для `/everyday/room-area` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/everyday/room-area.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/everyday/room-area/` — поля, height chips, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/everyday/electricity` `npm run test` — OK, 48 files / 431 tests.
- 2026-04-26: Для `/everyday/electricity` `npm run type-check` — OK.
- 2026-04-26: Для `/everyday/electricity` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/everyday/electricity.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/everyday/electricity/` — power/time chips, tariff suffix, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/everyday/cooking-units` `npm run test` — OK, 49 files / 436 tests.
- 2026-04-26: Для `/everyday/cooking-units` `npm run type-check` — OK.
- 2026-04-26: Для `/everyday/cooking-units` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/everyday/cooking-units.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/everyday/cooking-units/` — selects, swap button, result rows и popular conversions без overflow и наложений.
- 2026-04-26: Для `/math/fraction` `npm run test` — OK, 50 files / 443 tests.
- 2026-04-26: Для `/math/fraction` `npm run type-check` — OK.
- 2026-04-26: Для `/math/fraction` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/math/fraction.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/math/fraction/` — fraction fields, operation chips, result rows и popular examples без overflow и наложений.
- 2026-04-26: Для `/math/average` `npm run test` — OK, 51 files / 449 tests.
- 2026-04-26: Для `/math/average` `npm run type-check` — OK.
- 2026-04-26: Для `/math/average` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/math/average.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/math/average/` — textarea, example chips, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/math/proportion` `npm run test` — OK, 52 files / 454 tests.
- 2026-04-26: Для `/math/proportion` `npm run type-check` — OK.
- 2026-04-26: Для `/math/proportion` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/math/proportion.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/math/proportion/` — fields, result rows, examples и related cards без overflow и наложений.
- 2026-04-26: Для `/math/equation` `npm run test` — OK, 53 files / 461 tests.
- 2026-04-26: Для `/math/equation` `npm run type-check` — OK.
- 2026-04-26: Для `/math/equation` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/math/equation.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/math/equation/` — mode chips, fields, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/health/calorie` `npm run test` — OK, 54 files / 467 tests.
- 2026-04-26: Для `/health/calorie` `npm run type-check` — OK.
- 2026-04-26: Для `/health/calorie` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/health/calorie.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/health/calorie/` — profile/activity/goal chips, warning note, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/health/ideal-weight` `npm run test` — OK, 55 files / 472 tests.
- 2026-04-26: Для `/health/ideal-weight` `npm run type-check` — OK.
- 2026-04-26: Для `/health/ideal-weight` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/health/ideal-weight.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/health/ideal-weight/` — sex chips, height field, warning note, formula rows и related cards без overflow и наложений.
- 2026-04-26: Для `/finance/mortgage` `npm run test` — OK, 56 files / 477 tests.
- 2026-04-26: Для `/finance/mortgage` `npm run type-check` — OK.
- 2026-04-26: Для `/finance/mortgage` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/finance/mortgage.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/finance/mortgage/` — fields, down-payment chips, warning note, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/finance/deposit` `npm run test` — OK, 57 files / 482 tests.
- 2026-04-26: Для `/finance/deposit` `npm run type-check` — OK.
- 2026-04-26: Для `/finance/deposit` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/finance/deposit.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/finance/deposit/` — amount/rate/term fields, term/mode chips, warning note, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/finance/compound-interest` `npm run test` — OK, 58 files / 487 tests.
- 2026-04-26: Для `/finance/compound-interest` `npm run type-check` — OK.
- 2026-04-26: Для `/finance/compound-interest` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/finance/compound-interest.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/finance/compound-interest/` — fields, term chips, warning note, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/finance/refinance` `npm run test` — OK, 59 files / 491 tests.
- 2026-04-26: Для `/finance/refinance` `npm run type-check` — OK.
- 2026-04-26: Для `/finance/refinance` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/finance/refinance.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/finance/refinance/` — fields, warning note, result rows и related cards без overflow и наложений.
- 2026-04-26: Для `/health/body-fat` `npm run test` — OK, 60 files / 496 tests.
- 2026-04-26: Для `/health/body-fat` `npm run type-check` — OK.
- 2026-04-26: Для `/health/body-fat` `npm run build` — OK, Vite SSG rendered 87 pages.
- 2026-04-26: Static smoke по `dist/health/body-fat.html` — title, `index,follow` robots, canonical и sitemap entry OK.
- 2026-04-26: Mobile Playwright full-page screenshot 430px по `/health/body-fat/` — sex chips, measurement fields, warning note, result rows и related cards без overflow и наложений.

## Commit Log

- `4755799` — `feat(construction): add strip foundation calculator`.
- `f1e8bda` — `feat(convert): add data size converter`.
- `3c38f5a` — `feat(everyday): add room area calculator`.
- `432bbab` — `feat(everyday): add electricity calculator`.
- `15328d1` — `feat(everyday): add cooking units calculator`.
- `424f442` — `feat(math): add fraction calculator`.
- `eba45a8` — `feat(math): add average calculator`.
- `69aea4d` — `feat(math): add proportion calculator`.
- `14ae2ed` — `feat(math): add equation calculator`.
- `38748f4` — `feat(health): add calorie calculator`.
- `fce19d8` — `feat(health): add ideal weight calculator`.
- `a5cd618` — `feat(finance): add mortgage calculator`.
- `7c68b46` — `feat(finance): add deposit calculator`.
- `c314a72` — `feat(finance): add compound interest calculator`.
- `d2f9d4a` — `feat(finance): add refinance calculator`.
- `6107642` — `feat(health): add body fat calculator`.
- `507bfe4` — `feat(clothing): add clothing size converter`.
- `8741b2d` — `feat(sport): add metronome calculator`.
- `decfac2` — `feat(convert): add speed converter`.
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

Реализовать Current Milestone `/health/pregnancy-due-date`, затем перенести его в `Completed`, записать commit hash, удалить или обновить соответствующий `Pending`, выбрать следующий milestone и оставить `Current Milestone` не в `completed`, а в `planned`/`in_progress` для следующей задачи.
