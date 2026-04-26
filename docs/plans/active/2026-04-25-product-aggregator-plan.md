# Product Plan: Calcup Calculator Aggregator

Status: active
Created: 2026-04-25
Updated: 2026-04-26
Scope: продуктовая модель Calcup как каталога онлайн-калькуляторов

## Current Snapshot

Calcup уже перешёл от концепции одного рабочего стола к каталогу калькуляторов:

- 11 категорий в `src/data/categories.ts`;
- 70 ready-калькуляторов в `src/data/calculators.ts`;
- 10 `soon`-карточек для будущего наполнения;
- `/workspace` сохранён как отдельный productivity-раздел;
- `src/data/calculators.ts` и `src/data/categories.ts` — источник правды для роутов, поиска, карточек, хлебных крошек и sitemap.

## Product Positioning

RU:

```txt
Calcup — бесплатные онлайн-калькуляторы для повседневных расчётов, денег, ремонта, здоровья, спорта, размеров и конвертации величин.
```

EN:

```txt
Calcup is a free online calculator catalog for everyday math, money, renovation, health, sport, sizes and unit conversion.
```

## Site Structure

### `/`

Главная витрина каталога:

- поиск по реестру;
- сетка категорий;
- популярные ready-калькуляторы;
- переход в `/workspace` как дополнительный инструмент, а не основная концепция сайта.

### `/<category>/`

Страница категории показывает все инструменты со статусом `ready` и `soon`, кроме `planned`.

### `/<category>/<tool>/`

Страница калькулятора:

- для `ready` загружает feature-модуль;
- для `soon` показывает `SoonPlaceholder` и `noindex`;
- после ready-калькулятора показывает блок похожих ready-калькуляторов из той же категории.

### `/workspace`

Сохранённый рабочий стол:

- Pomodoro;
- планировщик задач;
- обратный отсчёт;
- SoundMachine;
- Snake.

## Category Catalog

| Категория | Путь | Ready | Soon / roadmap |
|-----------|------|-------|----------------|
| Финансы | `/finance` | credit, vat, salary, project-price, mortgage, deposit, compound-interest, refinance | — |
| Математика | `/math` | percentage, fraction, average, proportion, equation | — |
| Здоровье | `/health` | bmi, calorie, ideal-weight, body-fat, pregnancy-due-date | — |
| Конвертеры | `/convert` | length, temperature, weight, area, volume, speed, data-size | currency |
| Строительство | `/construction` | wallpaper, paint, tile, laminate, floor-screed, brick, blocks, drywall, putty, insulation, concrete, strip-foundation, slab-foundation, rebar, roof | stairs, excavation, lighting, ventilation, snow-load, wind-load |
| Транспорт | `/transport` | fuel, trip-cost, fuel-price, average-speed, ev-range | — |
| Спорт | `/sport` | pace-speed, distance-pace-time, heart-rate-zones, race-split, metronome | — |
| Животные | `/animals` | dog-age, cat-age, dog-food, cat-calorie, dog-pregnancy, cat-pregnancy | dog-size, cat-growth |
| Одежда и обувь | `/clothing` | shoe-size, clothing-size | sneaker-size, jeans-size, brand-size-compare |
| Дата и время | `/datetime` | date-diff, age, workdays, time-duration, countdown | — |
| Быт | `/everyday` | discount, tips, unit-price, bill-split, room-area, electricity, cooking-units | — |

## Ready Calculators

| Путь | Название |
|------|----------|
| `/finance/credit` | Кредитный калькулятор |
| `/finance/vat` | Калькулятор НДС |
| `/finance/salary` | Калькулятор зарплаты |
| `/finance/project-price` | Калькулятор стоимости проекта |
| `/finance/mortgage` | Ипотечный калькулятор |
| `/finance/deposit` | Калькулятор вклада |
| `/finance/compound-interest` | Калькулятор сложного процента |
| `/finance/refinance` | Калькулятор рефинансирования |
| `/math/percentage` | Калькулятор процентов |
| `/math/fraction` | Калькулятор дробей |
| `/math/average` | Калькулятор среднего |
| `/math/proportion` | Калькулятор пропорций |
| `/math/equation` | Калькулятор уравнений |
| `/health/bmi` | Калькулятор ИМТ |
| `/health/calorie` | Калькулятор калорий |
| `/health/ideal-weight` | Калькулятор идеального веса |
| `/health/body-fat` | Калькулятор процента жира |
| `/health/pregnancy-due-date` | Калькулятор срока беременности |
| `/convert/length` | Конвертер длины |
| `/convert/temperature` | Конвертер температуры |
| `/convert/weight` | Конвертер веса |
| `/convert/area` | Конвертер площади |
| `/convert/volume` | Конвертер объёма |
| `/convert/speed` | Конвертер скорости |
| `/convert/data-size` | Конвертер данных |
| `/construction/wallpaper` | Калькулятор обоев |
| `/construction/paint` | Калькулятор краски |
| `/construction/tile` | Калькулятор плитки |
| `/construction/laminate` | Калькулятор ламината |
| `/construction/floor-screed` | Калькулятор стяжки пола |
| `/construction/brick` | Калькулятор кирпича |
| `/construction/blocks` | Калькулятор газоблока |
| `/construction/drywall` | Калькулятор гипсокартона |
| `/construction/putty` | Калькулятор шпатлёвки |
| `/construction/insulation` | Калькулятор утеплителя |
| `/construction/concrete` | Калькулятор бетона |
| `/construction/strip-foundation` | Калькулятор ленточного фундамента |
| `/construction/slab-foundation` | Калькулятор плитного фундамента |
| `/construction/rebar` | Калькулятор арматуры |
| `/construction/roof` | Калькулятор кровли |
| `/transport/fuel` | Калькулятор расхода топлива |
| `/transport/trip-cost` | Калькулятор стоимости поездки |
| `/transport/fuel-price` | Калькулятор цены топлива |
| `/transport/average-speed` | Калькулятор средней скорости |
| `/transport/ev-range` | Калькулятор запаса хода EV |
| `/sport/heart-rate-zones` | Пульсовые зоны |
| `/sport/pace-speed` | Калькулятор темп/скорость |
| `/sport/distance-pace-time` | Калькулятор дистанция/темп/время |
| `/sport/race-split` | Калькулятор сплитов |
| `/sport/metronome` | Метроном |
| `/animals/dog-age` | Калькулятор возраста собаки |
| `/animals/cat-age` | Калькулятор возраста кошки |
| `/animals/dog-food` | Калькулятор корма для собаки |
| `/animals/cat-calorie` | Калькулятор калорий для кошки |
| `/animals/dog-pregnancy` | Калькулятор беременности собаки |
| `/animals/cat-pregnancy` | Калькулятор беременности кошки |
| `/clothing/shoe-size` | Конвертер размера обуви |
| `/clothing/clothing-size` | Конвертер размеров одежды |
| `/datetime/date-diff` | Разница между датами |
| `/datetime/age` | Калькулятор возраста |
| `/datetime/workdays` | Калькулятор рабочих дней |
| `/datetime/time-duration` | Калькулятор времени |
| `/datetime/countdown` | Калькулятор дней до даты |
| `/everyday/tips` | Чаевые и разделение счёта |
| `/everyday/bill-split` | Калькулятор разделения счёта |
| `/everyday/discount` | Калькулятор скидки |
| `/everyday/unit-price` | Калькулятор выгодной покупки |
| `/everyday/room-area` | Калькулятор площади комнаты |
| `/everyday/electricity` | Калькулятор электроэнергии |
| `/everyday/cooking-units` | Калькулятор мер для кухни |

## Source Of Truth Rules

- Не дублировать список маршрутов вручную вне реестра.
- Ready-калькулятор обязан иметь feature-модуль, формулы, unit-тесты, локали, SEO/search tags.
- `soon`-карточки можно показывать в категориях, но они не должны попадать в sitemap как ready-инструменты.
- `planned` не публикуется в пользовательском каталоге.
- Категории с одними `soon`-инструментами могут быть видимы в навигации, но не считаются готовыми продуктовыми разделами до первого ready-калькулятора.

## Near-Term Roadmap

1. Закрыть текущий большой коммит каталога: README, планы, реестр, related calculators, sport/clothing roadmap.
2. Пройти build/test перед push.
3. После деплоя проверить production для ready-страниц и категорий.
4. Для расширения за пределы текущих категорий использовать `docs/plans/active/2026-04-26-omnicalculator-expansion-registry.md`.
5. Следующий ready-калькулятор выбрать из:
   - `/construction/stairs`.
   - `/animals/dog-size` или `/animals/cat-growth`, если приоритет смещается на развитие нового раздела `animals`.

## Non-Goals

- Не делать backend/API.
- Не копировать тексты, структуру и дизайн конкурентов.
- Не обещать медицинскую, инженерную или размерную точность без источников, даты актуальности и дисклеймеров.
- Не переписывать рабочий кредитный калькулятор без отдельной причины.
