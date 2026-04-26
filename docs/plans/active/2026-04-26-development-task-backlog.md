# Calcup Development Task Backlog

Status: active
Created: 2026-04-26
Source: `docs/plans/active/NEW_PLAN_DEV.MD`, current `src/data/calculators.ts`, current active execution plans
Scope: продуктовая декомпозиция развития Calcup по категориям, смыслам, новым фичам и развитию существующих инструментов

## Overview

`NEW_PLAN_DEV.MD` задаёт стратегию: развивать Calcup не как хаотичный каталог, а как набор SEO-кластеров и пользовательских сценариев. На момент декомпозиции в коде уже есть 11 категорий и около 71 ready-калькулятора. Сильнее всего заполнено строительство; слабее всего — учебные калькуляторы, IT/text tools, налоги/работа, продвинутые финансы, валюты и B2B-фичи вроде embed/API.

Главная продуктовая линия:

- закрыть критичные доверительные разрывы: НДС 2026, валюты, рабочий стол/legacy SEO;
- развить кластеры, где уже есть база: финансы, строительство, дата/время, быт, животные;
- добавить новые смысловые направления: налоги и работа, учёба, IT/text tools, виджеты/API;
- усилить старые калькуляторы: формулы, FAQ, примеры, дата актуальности, share/print/PDF, аналитика событий.

## Current Catalog Snapshot

Фактическое состояние по реестру:

| Категория | Ready | Soon | Комментарий |
|---|---:|---:|---|
| finance | 8 | 0 | База сильная, нужен НДС 2026 и продвинутые сценарии. |
| math | 5 | 0 | Есть база, но нет геометрии, статистики, учебных задач. |
| health | 5 | 0 | Хорошо для MVP, нужны аккуратные спортивно-оздоровительные расширения. |
| convert | 7 | 1 | Главный пробел — валюты. |
| construction | 16 | 5 | Сильный кластер; backlog now high/medium risk: нормы, вентиляция, освещение, грунт. |
| transport | 5 | 0 | Нужна стоимость владения авто и автокредит. |
| sport | 5 | 0 | Хорошая база; можно развивать pace charts и силовые расчёты. |
| animals | 6 | 0 | Новый перспективный раздел; нужны growth/size/life-care сценарии. |
| clothing | 2 | 3 | Нужны sneaker/jeans/brand, но с источниками и дисклеймерами. |
| datetime | 5 | 0 | База закрыта; нужен производственный календарь и рабочие часы. |
| everyday | 7 | 0 | Хороший раздел для быстрых бытовых и рецептурных задач. |

## Priority Legend

- P0: критично для доверия, SEO или явно заявленного продукта.
- P1: массовый спрос, высокая польза, хороший кластерный эффект.
- P2: расширение семантики и внутренней перелинковки.
- P3: стратегические/инфраструктурные задачи или задачи с источниками/риском.

## P0 Tasks

### Task P0-1: НДС 2026

Category: `finance`
Type: развитие существующего калькулятора
Goal: обновить `/finance/vat` под актуальные ставки и явно показать дату актуальности.

Scope:

- ставки: 22%, 10%, 0%, 5%, 7%, произвольная;
- режимы: начислить НДС, выделить НДС;
- отдельный блок “УСН 2026”;
- формулы `amount * rate / 100` и выделение через `rate / (100 + rate)`;
- дата актуальности и налоговый дисклеймер;
- SEO/search: `НДС 2026`, `НДС 22`, `УСН НДС 5`, `УСН НДС 7`.

Acceptance:

- обновлены формулы, локали, тесты;
- default/preset больше не вводит в заблуждение про 20%;
- `npm run test`, `npm run type-check`, `npm run build`.

Risk: medium, из-за налоговой актуальности.

### Task P0-2: Конвертер валют MVP

Category: `convert`
Type: новая ready-фича из `soon`
Goal: выпустить `/convert/currency` без внешних секретов/API.

Scope:

- ручной курс + быстрые пары RUB/USD/EUR/CNY;
- режим “из валюты в валюту”;
- поле “курс обновлён вручную”;
- дисклеймер: справочный расчёт, пользователь сам задаёт курс;
- позже можно заменить на API-источник.

Acceptance:

- `currency` переведён из `soon` в `ready`;
- добавлен в sitemap;
- есть тесты конверсии и invalid input.

Risk: medium, если обещать live-курсы. MVP должен быть manual-rate.

### Task P0-3: Workspace / legacy product cleanup

Category: `platform`
Type: развитие старого функционала
Goal: убрать продуктовую неопределённость вокруг `/workspace` и старых Pomodoro-страниц.

Scope:

- проверить, что `/workspace` реально доступен в SSG/build или убрать публичную ссылку;
- оставить `/workspace` `noindex`;
- legacy productivity pages держать `noindex,follow` или оформить отдельный осмысленный раздел;
- проверить footer/header links.

Acceptance:

- нет битых ссылок в навигации;
- noindex-страницы не попадают в sitemap;
- regression-тест на sitemap/noindex сохраняется.

Risk: low.

## P1 Tasks: Финансы, Налоги И Работа

### Task P1-1: Кластер “Налоги и работа”

Category: new cluster
Type: новые калькуляторы
Goal: создать отдельный смысловой кластер для регулярных российских рабочих и налоговых расчётов.

Tasks:

- `vacation-pay`: отпускные;
- `sick-leave`: больничный;
- `self-employed-tax`: налог самозанятого;
- `usn-tax`: УСН доходы / доходы минус расходы;
- `ip-insurance`: страховые взносы ИП;
- `penalty-interest`: пени по ключевой ставке;
- `dismissal-pay`: расчёт при увольнении;
- `work-hours-month`: рабочие часы по месяцу;
- `work-experience`: стаж работы.

Shared requirements:

- дата актуальности;
- источник/assumptions в тексте;
- дисклеймер “не является бухгалтерской или налоговой консультацией”;
- тесты формул;
- внутренняя перелинковка с зарплатой, НДС, рабочими днями и project-price.

Risk: high for legal/tax актуальность. Делать малыми MVP и фиксировать assumptions.

### Task P1-2: Расширенная ипотека

Category: `finance`
Type: развитие существующего калькулятора
Goal: усилить `/finance/mortgage` до сценарного калькулятора.

Scope:

- материнский капитал / дополнительный взнос;
- досрочные платежи;
- страховка/комиссии;
- сравнение двух сценариев;
- “уменьшить срок или платёж”;
- график платежей;
- печать/PDF.

Risk: medium.

### Task P1-3: Бюджет, инфляция, вычеты

Category: `finance`
Type: новые калькуляторы
Goal: расширить финансовое планирование вокруг кредитов, вкладов и сложного процента.

Tasks:

- `budget`: доходы, расходы, долги, накопления, свободный остаток;
- `inflation`: покупательная способность и реальная доходность;
- `tax-deduction`: вычеты лечение/обучение/ИИС/жильё;
- `debt-load`: долговая нагрузка;
- `rent-vs-buy`: аренда или покупка.

Risk: medium/high для вычетов; low/medium для бюджета и инфляции.

## P1 Tasks: Учёба И Математика

### Task P1-4: Учебный math-кластер

Category: `math`
Type: новые калькуляторы
Goal: закрыть крупную пустую SEO-зону “Учёба и наука”.

First wave:

- `geometry-area`: площадь и периметр фигур;
- `solid-volume`: объём тел;
- `pythagorean`: теорема Пифагора;
- `triangle`: треугольник по сторонам/углам;
- `quadratic-equation-steps`: квадратные уравнения с шагами;
- `gcd-lcm`: НОД/НОК;
- `prime-number`: простые числа;
- `decimal-to-fraction`: десятичная дробь в обычную;
- `statistics`: дисперсия, стандартное отклонение, квартили;
- `combinatorics`: перестановки, сочетания, размещения.

Second wave:

- `exam-score`: ЕГЭ/ОГЭ перевод баллов;
- `average-grade`: средний балл аттестата;
- `gpa`: GPA / международные оценки.

Risk: low/medium. Хороший кандидат для быстрой серии калькуляторов.

## P1 Tasks: IT / Text Tools

### Task P1-5: Новый раздел “Инструменты”

Category: new `tools` or split into `text` and `dev`
Type: новая категория
Goal: добавить быстрые рабочие инструменты без регистрации.

Text tools:

- `character-counter`: символы, слова, строки;
- `case-converter`: регистр текста;
- `find-replace`: поиск и замена;
- `sort-lines`: сортировка строк;
- `list-compare`: сравнение списков.

Developer tools:

- `json-formatter`: formatter/minifier;
- `yaml-json`: YAML ↔ JSON;
- `url-encode`: URL encode/decode;
- `base64`: Base64 encode/decode;
- `timestamp`: Unix timestamp converter;
- `uuid`: UUID generator;
- `password-generator`: генератор паролей;
- `color-converter`: HEX/RGB/HSL;
- `cron-parser`: cron parser;
- `ip-subnet`: subnet/IP calculator.

Marketing tools:

- `qr-generator`: QR;
- `utm-generator`: UTM.

Risk: low for local-only tools, medium for QR if добавлять canvas/export.

## P2 Tasks: Строительство И Ремонт

### Task P2-1: Завершить remaining construction soon

Category: `construction`
Type: новые ready-фичи из `soon`
Goal: добить оставшиеся карточки строительного backlog.

Tasks:

- `lighting`: освещение помещения, люмены, количество светильников;
- `ventilation`: воздухообмен, объём помещения, кратность;
- `excavation`: котлован/траншея, разрыхление, вывоз;
- `snow-load`: справочный расчёт снеговой нагрузки;
- `wind-load`: справочный расчёт ветровой нагрузки.

Risk:

- `lighting`, `ventilation`, `excavation`: medium;
- `snow-load`, `wind-load`: high, требуют источников норм и даты актуальности.

### Task P2-2: Электрика и инженерка

Category: `construction`
Type: новые калькуляторы
Goal: расширить ремонтный кластер практичными бытовыми задачами.

Tasks:

- `cable-section`: сечение кабеля по мощности/току;
- `breaker-size`: автомат по нагрузке;
- `radiators`: радиаторы отопления;
- `warm-floor`: тёплый пол;
- `pipe-flow`: трубы/водопровод;
- `septic-drainage`: септик/дренаж.

Risk: medium/high, нужны дисклеймеры и ограниченный MVP.

### Task P2-3: Смета и материалы

Category: `construction`
Type: новые калькуляторы + развитие старых
Goal: превратить строительный раздел в сценарий “ремонт квартиры”.

Tasks:

- `repair-estimate-room`: смета ремонта комнаты;
- `materials-delivery`: доставка материалов;
- `tile-grout`: затирка для плитки;
- `self-leveling-floor`: наливной пол;
- `sand-gravel`: песок/щебень;
- развитие существующих `tile`, `paint`, `wallpaper`, `laminate`: добавить примеры, FAQ, share/print.

Risk: medium.

## P2 Tasks: Быт, Транспорт, Животные, Одежда

### Task P2-4: Быт и рецепты

Category: `everyday`
Type: новые калькуляторы

Tasks:

- `recipe-scale`: масштабирование рецепта на N порций;
- `dish-cost`: стоимость блюда;
- `event-food`: продукты для мероприятия;
- `meters-utilities`: вода/электричество/отопление по счётчикам;
- `parcel-volume`: размер коробки/объём посылки;
- `tariff-compare`: сравнение тарифов интернета/связи;
- `device-charge-time`: время зарядки устройства;
- `home-budget`: домашний бюджет на неделю/месяц.

Risk: low/medium.

### Task P2-5: Авто и транспорт

Category: `transport`
Type: новые калькуляторы

Tasks:

- `car-ownership-cost`: стоимость владения авто;
- `car-loan`: автокредит;
- `lease-vs-buy-car`: лизинг/кредит/покупка;
- `tire-size`: размер шин;
- `ev-charging-cost`: стоимость зарядки EV.

Risk: medium.

### Task P2-6: Animals expansion

Category: `animals`
Type: новые калькуляторы

Tasks:

- `dog-size`: прогноз взрослого веса щенка;
- `cat-growth`: рост/вес котёнка по возрасту;
- `pet-water`: вода для питомца;
- `pet-med-dose-note`: справочный шаблон расчёта дозировки только с явным “по назначению ветеринара”;
- `pet-age-birthday`: календарь важных дат питомца.

Risk: medium/high for health-like pet dosage. Не давать медицинских рекомендаций.

### Task P2-7: Clothing completion

Category: `clothing`
Type: новые ready-фичи из `soon` + улучшения

Tasks:

- `sneaker-size`: кроссовки, длина стопы, US/EU/UK/CM;
- `jeans-size`: джинсы W/L, талия/длина;
- `brand-size-compare`: сравнение брендов, только после выбора источников;
- улучшить `shoe-size` и `clothing-size`: добавить печать, таблицу, дату источника, дисклеймер.

Risk: medium/high for brand sizes.

## P2 Tasks: Health And Sport

### Task P2-8: Аккуратное здоровье

Category: `health`
Type: новые калькуляторы и развитие

Tasks:

- `bmr-tdee`: выделить/расширить BMR/TDEE как отдельный сценарий, если calorie становится перегруженным;
- `recipe-calories`: калорийность рецепта;
- `activity-calories`: расход энергии на активность;
- `water-intake`: вода в день, только справочно;
- улучшить `bmi`, `calorie`, `ideal-weight`, `body-fat`: добавить больше нейтральных пояснений и FAQ.

Risk: medium/high. Тон только справочный, без медицинских обещаний.

### Task P2-9: Sport expansion

Category: `sport`
Type: новые калькуляторы

Tasks:

- `one-rep-max`: 1RM;
- `vo2max-estimate`: оценка VO2 max;
- `pace-chart`: pace chart для 5 км / 10 км / half / marathon;
- `min-km-min-mile`: мин/км ↔ мин/миля;
- `training-paces`: зоны тренировочного темпа.

Risk: low/medium.

## P3 Platform And SEO Tasks

### Task P3-1: Страницы-хабы и подкатегории

Category: `platform/seo`
Type: новая навигация и SEO-структура

Goal: перейти от плоских категорий к сценарным кластерам.

Hubs:

- `/finance/loans`
- `/finance/taxes`
- `/finance/planning`
- `/construction/renovation`
- `/construction/materials`
- `/math/geometry`
- `/math/statistics`
- `/tools/text`
- `/tools/developer`
- `/everyday/recipes`
- `/animals`

Acceptance:

- hub-страницы не дублируют категории, а собирают сценарии, тексты, FAQ и related links;
- sitemap и breadcrumbs обновлены.

Risk: medium.

### Task P3-2: Calculator page content upgrade

Category: `platform/seo`
Type: развитие всех старых калькуляторов

Goal: каждый top-калькулятор должен быть мини-лендингом, а не только формой.

Rollout:

1. top-10: credit, vat, mortgage, bmi, percentage, date-diff, tile, paint, salary, age;
2. finance/tax;
3. construction;
4. health/sport;
5. long tail.

Required blocks:

- как пользоваться;
- формула;
- пример расчёта;
- частые ошибки;
- FAQ;
- дата актуальности, если применимо;
- related calculators;
- copy/share/print.

Risk: medium.

### Task P3-3: Analytics and internal search intelligence

Category: `platform/analytics`
Type: новая инфраструктура

Scope:

- события поиска: query, result count, clicked calculator, zero results;
- события калькуляторов: calculate, copy result, print, share, related click;
- без хранения персональных значений;
- агрегировать нулевые запросы в backlog идей.

Risk: medium, из-за приватности.

### Task P3-4: Suggest calculator

Category: `platform/product`
Type: новая фича

Scope:

- форма “предложить калькулятор”;
- поля: тема, задача, email optional, комментарий;
- без публичной регистрации;
- backend отсутствует, поэтому MVP: mailto/form endpoint/static issue template или local-only not available notice;
- позже: moderation/admin backlog.

Risk: medium because no backend.

### Task P3-5: Widgets and embed

Category: `platform/b2b`
Type: стратегическая фича

Scope:

- выбрать 5–10 популярных калькуляторов: VAT, credit, mortgage, tile, BMI, percentage, age, electricity, bill split, currency;
- isolated widget build;
- embed code;
- configurable theme;
- canonical backlink;
- usage docs.

Risk: high. Требует архитектурной проработки сборки и стилей.

### Task P3-6: API

Category: `platform/b2b`
Type: стратегическая фича

Scope:

- formula-only API для части калькуляторов;
- versioning formulas;
- rate limits / auth strategy;
- docs and examples.

Risk: high. Нужен backend или serverless.

## Cross-Cutting Requirements

Для каждого нового калькулятора:

- чистая формула в `lib/calculations.ts`;
- unit-тесты формул;
- RU/EN локали;
- registry `tags`/`aliases`;
- sitemap для `ready`;
- `noindex` для `soon`;
- mobile smoke без horizontal overflow;
- shared calculator design-system без локального визуального зоопарка;
- дисклеймеры для finance/tax/health/construction/clothing/animals, если результат может быть воспринят как рекомендация;
- SEO metadata через `useSeo`.

Для развития старых калькуляторов:

- не ломать существующие сценарии;
- добавлять regression-тесты перед расширением формул;
- сохранять backward-compatible defaults;
- если меняется смысл расчёта, обновлять SEO description/tags и docs.

## Recommended Execution Order

### 7 дней

1. `vat-2026`
2. `currency`
3. `workspace-cleanup`
4. top-10 SEO content skeleton
5. analytics event plan

### 30 дней

1. налогово-рабочий кластер: отпускные, больничный, УСН, самозанятый, пени;
2. учебный кластер: geometry-area, solid-volume, pythagorean, statistics;
3. IT/text tools first wave: character-counter, json-formatter, base64, timestamp, qr, utm;
4. hubs MVP for finance/taxes, construction/materials, math/geometry, tools.

### 60 дней

1. расширенная ипотека;
2. бюджет, инфляция, налоговый вычет;
3. construction remaining: lighting, ventilation, excavation;
4. animals and clothing expansion.

### 90 дней

1. widgets MVP for 5 calculators;
2. embed docs;
3. analytics-driven backlog from internal search;
4. pages “для ремонта”, “для ИП”, “для школьника”, “для автомобилиста”, “для фрилансера”.

## Top 10 Next Development Tasks

1. `vat-2026`
2. `currency`
3. `vacation-pay`
4. `sick-leave`
5. `usn-tax`
6. `character-counter`
7. `json-formatter`
8. `geometry-area`
9. `lighting`
10. `dog-size`

## Risks / Open Questions

- Налоговые расчёты требуют актуальных источников и даты обновления.
- Валюты нельзя обещать live без источника курсов.
- Брендовые размеры одежды требуют источников и периодического обновления.
- Нормативные строительные расчёты требуют ограниченного scope и дисклеймеров.
- Widgets/API требуют отдельной архитектурной проработки.
- В worktree уже есть несвязанные кодовые изменения; этот документ не должен случайно смешиваться с коммитом реализации.

