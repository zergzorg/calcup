# OmniCalculator Expansion Registry

Status: draft
Created: 2026-04-26
Scope: реестр интересных калькуляторов, которых нет в Calcup, и план разработки новых разделов

## Overview

Цель исследования: посмотреть на OmniCalculator как на конкурентный каталог, выбрать идеи, которых чаще всего нет в текущем Calcup, и превратить их в практичный backlog. Главный продуктовый вывод: раздел про животных выглядит достаточно сильным, чтобы стать новой категорией Calcup, а не набором случайных карточек внутри `health` или `everyday`.

Источники:

- `https://www.omnicalculator.com/` — общий масштаб каталога: 3847 калькуляторов и категории Biology, Food, Ecology, Sports, Finance, Other.
- `https://www.omnicalculator.com/biology` — animal pregnancy, dog, cat, other animals, livestock, gardening.
- `https://www.omnicalculator.com/food` — coffee, baking, pizza, party, Thanksgiving, cooking converters.
- `https://www.omnicalculator.com/ecology` — footprint, renewable energy, sustainable living.
- `https://www.omnicalculator.com/sports` — running, cycling, calories burned, triathlon, watersports, weightlifting.
- `https://www.omnicalculator.com/other` — education, photo/video, earth/weather, hobby/tools.
- `https://www.omnicalculator.com/finance` — personal finance, real estate, investment and business metrics.
- `https://www.omnicalculator.com/health` — body measurements, pediatrics, percentiles, fitness-adjacent health.

## Current Calcup Gap

На 2026-04-26 в `src/data/calculators.ts` есть 11 категорий и 64 ready-калькулятора. Уже закрыты базовые финансы, математика, здоровье, конвертеры, строительство, транспорт, спорт, животные, одежда, даты и быт.

Крупные пробелы:

- категория `animals` создана первыми калькуляторами `dog-age` и `cat-age`, но ей нужен практический pet-care кластер;
- нет категории `food`;
- нет категории `ecology`;
- нет education/photo/weather/tools-калькуляторов;
- спорт уже начат, но нет силовых, вело, калорий по активностям и триатлона;
- здоровье закрывает базу, но нет детских percentiles и расширенных body measurements.

## Category Proposal

### New Category: Animals

Рекомендуемый slug: `animals`

RU:

```txt
Животные
```

EN:

```txt
Animals
```

Описание RU:

```txt
Возраст, питание, беременность, уход и безопасные оценки для питомцев и фермерских животных.
```

Описание EN:

```txt
Age, food, pregnancy, care and safe estimates for pets and livestock.
```

Иконка: `🐾`

Цвет: `#f97316` или `#f59e0b`, чтобы отличаться от health/sport и не спорить с construction.

Принципы безопасности:

- любые дозировки лекарств не брать в первый релиз;
- токсичность шоколада можно делать только как информационный triage с явным предупреждением "свяжитесь с ветеринаром";
- pregnancy/age/food/space calculators безопаснее и полезнее для MVP;
- избегать копирования текстов Omni, использовать свои формулы и ссылки на открытые ветеринарные/аграрные источники.

## Candidate Registry

Оценка:

- `P0` — быстро дает новый раздел и понятную пользу.
- `P1` — сильный SEO/пользовательский спрос, умеренная сложность.
- `P2` — интересный нишевый инструмент.
- `P3` — отложить до зрелой категории.

### Animals MVP

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P0 | `dog-age` | Калькулятор возраста собаки | `/animals/dog-age` | Популярный, простой, хороший вход в раздел. |
| P0 | `cat-age` | Калькулятор возраста кошки | `/animals/cat-age` | Парный к dog-age, понятный массовый спрос. |
| P0 | `dog-food` | Калькулятор корма для собаки | `/animals/dog-food` | Практичная ежедневная задача, можно строить на RER/MER. |
| P0 | `cat-calorie` | Калькулятор калорий для кошки | `/animals/cat-calorie` | Практичная задача для владельцев кошек. |
| P0 | `dog-pregnancy` | Калькулятор беременности собаки | `/animals/dog-pregnancy` | Omni выделяет animal pregnancy как отдельный блок; простая дата родов. |
| P0 | `cat-pregnancy` | Калькулятор беременности кошки | `/animals/cat-pregnancy` | Быстрый аналог, формирует кластер pregnancy. |
| P1 | `dog-size` | Прогноз размера щенка | `/animals/dog-size` | Интересный viral-инструмент, но формула приблизительная. |
| P1 | `cat-growth` | Прогноз веса котенка | `/animals/cat-growth` | Аналог "How big will my cat get", полезно для владельцев. |
| P1 | `dog-bmi` | Индекс массы собаки | `/animals/dog-bmi` | Нужна аккуратная подача как оценка, не диагноз. |
| P1 | `cat-bmi` | Индекс массы кошки | `/animals/cat-bmi` | Хорошая пара к dog-bmi. |
| P1 | `chocolate-toxicity-dog` | Шоколад и собака | `/animals/chocolate-toxicity-dog` | Очень полезно, но нужен сильный warning и sources. |
| P1 | `chocolate-toxicity-cat` | Шоколад и кошка | `/animals/chocolate-toxicity-cat` | Менее частый, но важный triage-калькулятор. |
| P1 | `rabbit-cage-size` | Размер клетки для кролика | `/animals/rabbit-cage-size` | Простая бытовая польза, хороший "other animals" старт. |
| P1 | `turtle-tank-size` | Размер аквариума для черепахи | `/animals/turtle-tank-size` | Практичный и визуально понятный расчет. |
| P2 | `rat-cage-size` | Размер клетки для крыс | `/animals/rat-cage-size` | Нишевый, но хорошо расширяет pets beyond cats/dogs. |
| P2 | `bird-age` | Возраст птицы | `/animals/bird-age` | Легкий контент, но нужна таблица видов. |
| P2 | `horse-weight` | Вес лошади по меркам | `/animals/horse-weight` | Более сложный, но отличный фермерский/конный кейс. |
| P2 | `rabbit-gestation` | Беременность кролика | `/animals/rabbit-gestation` | Продолжение animal pregnancy cluster. |
| P2 | `cow-gestation` | Отел коровы | `/animals/cow-gestation` | Уже ближе к livestock, нужен отдельный тон. |
| P2 | `goat-gestation` | Окот козы | `/animals/goat-gestation` | Нишевый, но формула простая. |

### Animals Later

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P2 | `sheep-gestation` | Окот овцы | `/animals/sheep-gestation` | Хороший livestock-tail. |
| P2 | `swine-gestation` | Опорос свиньи | `/animals/swine-gestation` | Простая дата, фермерская польза. |
| P2 | `mare-gestation` | Жеребость кобылы | `/animals/mare-gestation` | Нужны диапазоны пород/вариативность. |
| P2 | `guinea-pig-pregnancy` | Беременность морской свинки | `/animals/guinea-pig-pregnancy` | Pet niche. |
| P2 | `pet-sitter-rates` | Стоимость пет-ситтера | `/animals/pet-sitter-rates` | Можно связать с finance/everyday. |
| P3 | `animal-mortality-rate` | Смертность животных на ферме | `/animals/animal-mortality-rate` | Более B2B, пригодится после livestock. |
| P3 | `cattle-per-acre` | Коров на пастбище | `/animals/cattle-per-acre` | Сложнее по региональным нормам. |
| P3 | `feed-conversion-ratio` | Конверсия корма | `/animals/feed-conversion-ratio` | Фермерский калькулятор, нужен хороший контекст. |
| P3 | `livestock-fence-cost` | Забор для животных | `/animals/livestock-fence-cost` | Пересекается со строительством. |

### Food Category Candidates

Рекомендуемый будущий slug: `food`.

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P0 | `coffee-ratio` | Кофе-вода | `/food/coffee-ratio` | Очень понятный, регулярный, компактный. |
| P0 | `pizza-size` | Размер пиццы | `/food/pizza-size` | Viral + практично сравнивать диаметр/цену. |
| P0 | `pizza-party` | Сколько пиццы на компанию | `/food/pizza-party` | Сильный everyday/party сценарий. |
| P0 | `egg-boiling` | Варка яиц | `/food/egg-boiling` | Маленький, полезный, хорошо выглядит. |
| P1 | `cake-pan-converter` | Пересчет формы для торта | `/food/cake-pan-converter` | Частая задача в рецептах. |
| P1 | `dry-cooked-pasta` | Сухая и готовая паста | `/food/dry-cooked-pasta` | Быстрый бытовой конвертер. |
| P1 | `rice-water-ratio` | Рис и вода | `/food/rice-water-ratio` | Практичный и SEO-friendly. |
| P1 | `pancake-recipe` | Рецепт блинов по порциям | `/food/pancake-recipe` | Хорошо для RU-аудитории. |
| P1 | `party-drinks` | Напитки на вечеринку | `/food/party-drinks` | Массовый сценарий, но алкогольные тексты аккуратно. |
| P2 | `bbq-party` | BBQ на компанию | `/food/bbq-party` | Сезонный, но полезный. |

### Ecology Category Candidates

Рекомендуемый будущий slug: `ecology`.

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P1 | `plastic-footprint` | Пластиковый след | `/ecology/plastic-footprint` | Понятная экологическая привычка. |
| P1 | `flight-carbon-footprint` | CO₂ перелета | `/ecology/flight-carbon-footprint` | Полезно и современно. |
| P1 | `drip-faucet` | Сколько воды утекает из крана | `/ecology/drip-faucet` | Очень бытовой, простой и наглядный. |
| P1 | `solar-panel` | Солнечные панели | `/ecology/solar-panel` | Практично, но требует больше входных данных. |
| P2 | `bag-footprint` | Сколько раз использовать сумку | `/ecology/bag-footprint` | Хороший микро-инструмент. |
| P2 | `meat-footprint` | Экослед мяса | `/ecology/meat-footprint` | Чувствительная тема, нужен нейтральный тон. |
| P2 | `ai-water-footprint` | Водный след AI-запросов | `/ecology/ai-water-footprint` | Актуально, но формулы быстро устаревают. |

### Sport Expansion Candidates

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P0 | `one-rep-max` | Одноповторный максимум | `/sport/one-rep-max` | Сильный недостающий спорт-инструмент. |
| P1 | `bench-press` | Жим лежа | `/sport/bench-press` | Популярный силовой калькулятор. |
| P1 | `vo2-max` | VO₂ max | `/sport/vo2-max` | Логично рядом с бегом и пульсом. |
| P1 | `running-calories` | Калории при беге | `/sport/running-calories` | Практично, связка с уже готовым беговым кластером. |
| P1 | `walking-calories` | Калории при ходьбе | `/sport/walking-calories` | Массовый сценарий. |
| P1 | `bike-size` | Размер велосипеда | `/sport/bike-size` | Хороший evergreen. |
| P1 | `bike-gear` | Велопередачи | `/sport/bike-gear` | Нишевый, но полезный для cycling-кластера. |
| P2 | `triathlon-nutrition` | Питание на триатлон | `/sport/triathlon-nutrition` | Более сложный, отложить. |

### Health Expansion Candidates

| Priority | ID | RU title | Path | Why |
|----------|----|----------|------|-----|
| P1 | `bsa` | Площадь поверхности тела | `/health/bsa` | Простая формула, медицинский warning. |
| P1 | `waist-hip-ratio` | Талия-бедра | `/health/waist-hip-ratio` | Популярный body measurements. |
| P1 | `waist-height-ratio` | Талия-рост | `/health/waist-height-ratio` | Быстрый и полезный. |
| P1 | `lean-body-mass` | Сухая масса тела | `/health/lean-body-mass` | Логично рядом с body-fat. |
| P1 | `baby-percentile` | Перцентили ребенка | `/health/baby-percentile` | Сильный семейный инструмент, но нужны источники таблиц. |
| P2 | `fetal-weight-percentile` | Перцентиль веса плода | `/health/fetal-weight-percentile` | Чувствительный медицинский контекст. |

### Other Useful Candidates

| Priority | ID | RU title | Path | Category | Why |
|----------|----|----------|------|----------|-----|
| P0 | `gpa` | GPA | `/education/gpa` | education | Полезно для студентов, новый раздел возможен позже. |
| P0 | `grade` | Оценка за тест | `/education/grade` | education | Очень простой evergreen. |
| P1 | `final-grade` | Что нужно на финальном экзамене | `/education/final-grade` | education | Ясный сценарий. |
| P1 | `aspect-ratio` | Соотношение сторон | `/media/aspect-ratio` | media | Нужен дизайнерам/контенту. |
| P1 | `contrast-ratio` | Контрастность текста | `/media/contrast-ratio` | media | Практично для accessibility. |
| P1 | `camera-field-of-view` | Угол обзора камеры | `/media/camera-field-of-view` | media | Хороший photo/video инструмент. |
| P1 | `rainfall` | Объем дождя на участке | `/weather/rainfall` | weather | Быт + сад/участок. |
| P1 | `wind-chill` | Ощущаемая температура | `/weather/wind-chill` | weather | Понятно и компактно. |
| P2 | `antipode` | Антипод точки Земли | `/tools/antipode` | tools | Интересный, но менее практичный. |
| P2 | `age-on-planets` | Возраст на других планетах | `/tools/age-on-planets` | tools | Viral/fun, можно позже. |

## Recommended First 20

Первую волну стоит сделать как продуктовый пакет, а не случайный набор. Цель: запустить `animals`, затем добавить один новый массовый раздел `food`, и параллельно усилить уже существующий `sport`.

1. `/animals/dog-age`
2. `/animals/cat-age`
3. `/animals/dog-food`
4. `/animals/cat-calorie`
5. `/animals/dog-pregnancy`
6. `/animals/cat-pregnancy`
7. `/animals/dog-size`
8. `/animals/cat-growth`
9. `/animals/dog-bmi`
10. `/animals/cat-bmi`
11. `/animals/chocolate-toxicity-dog`
12. `/animals/rabbit-cage-size`
13. `/animals/turtle-tank-size`
14. `/food/coffee-ratio`
15. `/food/pizza-size`
16. `/food/pizza-party`
17. `/food/egg-boiling`
18. `/sport/one-rep-max`
19. `/sport/vo2-max`
20. `/ecology/drip-faucet`

Почему так:

- первые 13 дают новый, узнаваемый animal-кластер;
- food быстро расширяет повседневную пользу и дает "легкие победы";
- sport продолжает уже начатый кластер;
- `drip-faucet` проверяет ecology без большого методологического риска.

## Implementation Approach

### Phase 1: Registry Skeleton

**Files:**

- Modify: `src/data/categories.ts`
- Modify: `src/data/calculators.ts`
- Modify: `src/locales/ru.json`
- Modify: `src/locales/en.json`
- Modify: `public/sitemap.xml`
- Modify: `README.md`
- Modify: `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- Modify: `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- Modify: `docs/plans/active/CODEX_WORKLOG.md`

Tasks:

- [x] Add `animals` category.
- [ ] Add `food` category only when first food calculator is ready.
- [ ] Add `ecology` category only when first ecology calculator is ready.
- [ ] Keep `planned` items hidden until there is a clear implementation slot.
- [ ] Add only `ready` calculators to sitemap.

### Phase 2: Animals MVP

Create calculators in small commits:

- [x] `dog-age`
- [x] `cat-age`
- [ ] `dog-food`
- [ ] `cat-calorie`
- [ ] `dog-pregnancy`
- [ ] `cat-pregnancy`
- [ ] `dog-size`
- [ ] `cat-growth`
- [ ] `dog-bmi`
- [ ] `cat-bmi`
- [ ] `chocolate-toxicity-dog`
- [ ] `rabbit-cage-size`
- [ ] `turtle-tank-size`

Shared patterns:

- use `src/features/calculator-design-system.css`;
- one folder per calculator under `src/features/<id>-calculator`;
- `types`, `lib/calculations.ts`, `lib/calculations.test.ts`, `composables`, `components`, `index.ts`;
- RU/EN locale namespace per calculator;
- safety note for health/pet-care interpretations.

### Phase 3: Food + Sport + Ecology Probe

- [ ] `coffee-ratio`
- [ ] `pizza-size`
- [ ] `pizza-party`
- [ ] `egg-boiling`
- [ ] `one-rep-max`
- [ ] `vo2-max`
- [ ] `drip-faucet`

Food implementation note:

- avoid recipe-copying;
- prefer formula-driven conversion and quantity planning;
- make the UI compact and practical.

Sport implementation note:

- keep estimates clearly informational;
- show formulas and assumptions.

Ecology implementation note:

- store source assumptions in code comments/tests where formulas can drift;
- avoid moralizing tone.

## Formula / Source Requirements

Перед реализацией каждого калькулятора собрать открытые источники формул:

- pet food: RER `70 * weightKg^0.75`, activity/life-stage multipliers;
- dog/cat pregnancy: average gestation periods plus allowed range;
- dog/cat age: use transparent approximation tables by life stage/size;
- chocolate toxicity: theobromine/caffeine mg per kg thresholds with emergency warning;
- cage/tank sizes: conservative husbandry guidelines, mark as minimum estimate;
- one-rep max: Epley/Brzycki/Lombardi variants;
- VO₂ max: Cooper test or heart-rate formula variants;
- drip faucet: drops/minute to volume per day/month using ml/drop assumption.

## Risks / Open Questions

- Veterinary calculators can be mistaken for medical advice. Add strong warning, no treatment instructions, and no medication dosage in MVP.
- Animal age conversions vary by breed, size and source. Prefer ranges and explain assumptions.
- Livestock calculators may require regional units and local norms; keep them P2/P3.
- New categories require category navigation and sitemap review.
- Food calculators can turn into content-heavy recipes; keep them formula-first.
- Ecology calculators may depend on country-specific coefficients; choose universal physics/volume calculators first.

## Acceptance Criteria

For each ready calculator:

- [ ] route opens in SSG build;
- [ ] registry entry has `componentLoader`, tags, aliases, `popularity`;
- [ ] RU/EN locales complete and synchronized;
- [ ] calculation unit tests cover normal, boundary and invalid inputs;
- [ ] no local visual overrides for shared calculator controls;
- [ ] result panel includes assumptions/formula note;
- [ ] warning is present where needed;
- [ ] `npm run test`, `npm run type-check`, `npm run build` pass before push.

## Next Action

Start with `animals` category and implement `/animals/dog-age` + `/animals/cat-age` as the smallest safe slice. After that implement `/animals/dog-food` and `/animals/cat-calorie`, because they make the category practically useful rather than decorative.
