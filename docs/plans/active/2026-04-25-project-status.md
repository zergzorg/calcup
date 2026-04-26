# PROJECT_STATUS

## Текущая фаза: 5.22 расширение раздела даты и времени

Фактическое состояние на 2026-04-26:

- 10 категорий в реестре.
- 36 ready-калькуляторов.
- 38 soon-карточек.
- `/sport` открыт первым ready-калькулятором `/sport/pace-speed`.
- `/clothing` открыт первым ready-конвертером `/clothing/shoe-size`.
- Главный `README.md` переписан под новую концепцию сайта: Calcup как каталог онлайн-калькуляторов, а не только productivity desktop.

## Готовые калькуляторы

| Фаза | Калькулятор | Путь | Статус |
|------|-------------|------|--------|
| 4.1 | Кредитный | /finance/credit | ✅ ready |
| 4.2 | ИМТ | /health/bmi | ✅ ready |
| 4.2 | Калькулятор процентов | /math/percentage | ✅ ready |
| 4.3 | Конвертер длины | /convert/length | ✅ ready |
| 4.4 | Расход топлива | /transport/fuel | ✅ ready |
| 4.5 | Разница дат | /datetime/date-diff | ✅ ready |
| 4.6 | НДС | /finance/vat | ✅ ready |
| 4.7 | Чаевые / разделение счёта | /everyday/tips | ✅ ready |
| 4.8 | Конвертер температуры | /convert/temperature | ✅ ready |
| 4.9 | Конвертер веса | /convert/weight | ✅ ready |
| 4.10 | Калькулятор скидки | /everyday/discount | ✅ ready |
| 4.12 | Конвертер площади | /convert/area | ✅ ready |
| 4.13 | Калькулятор зарплаты | /finance/salary | ✅ ready |
| 4.14 | Калькулятор стоимости проекта | /finance/project-price | ✅ ready |
| 4.16 | Калькулятор выгодной покупки | /everyday/unit-price | ✅ ready |
| 5.1 | Калькулятор обоев | /construction/wallpaper | ✅ ready |
| 5.3 | Калькулятор темп/скорость | /sport/pace-speed | ✅ ready |
| 5.4 | Калькулятор краски | /construction/paint | ✅ ready |
| 5.5 | Калькулятор дистанция/темп/время | /sport/distance-pace-time | ✅ ready |
| 5.6 | Конвертер размера обуви | /clothing/shoe-size | ✅ ready |
| 5.7 | Пульсовые зоны | /sport/heart-rate-zones | ✅ ready |
| 5.8 | Калькулятор плитки | /construction/tile | ✅ ready |
| 5.9 | Калькулятор ламината | /construction/laminate | ✅ ready |
| 5.10 | Калькулятор стяжки пола | /construction/floor-screed | ✅ ready |
| 5.11 | Калькулятор стоимости поездки | /transport/trip-cost | ✅ ready |
| 5.12 | Калькулятор цены топлива | /transport/fuel-price | ✅ ready |
| 5.13 | Калькулятор средней скорости | /transport/average-speed | ✅ ready |
| 5.14 | Калькулятор сплитов | /sport/race-split | ✅ ready |
| 5.15 | Калькулятор кирпича | /construction/brick | ✅ ready |
| 5.16 | Калькулятор гипсокартона | /construction/drywall | ✅ ready |
| 5.17 | Калькулятор газоблока | /construction/blocks | ✅ ready |
| 5.18 | Калькулятор шпатлёвки | /construction/putty | ✅ ready |
| 5.19 | Калькулятор утеплителя | /construction/insulation | ✅ ready |
| 5.20 | Калькулятор запаса хода EV | /transport/ev-range | ✅ ready |
| 5.21 | Калькулятор бетона | /construction/concrete | ✅ ready |
| 5.22 | Калькулятор возраста | /datetime/age | ✅ ready |

## Sitemap

- / (главная)
- /finance/ · /math/ · /health/ · /convert/ · /construction/ · /transport/ · /sport/ · /clothing/ · /datetime/ · /everyday/
- /finance/credit/ · /finance/vat/ · /finance/salary/ · /finance/project-price/
- /math/percentage/
- /health/bmi/
- /convert/length/ · /convert/temperature/ · /convert/weight/
- /construction/wallpaper/ · /construction/paint/ · /construction/tile/ · /construction/laminate/ · /construction/floor-screed/ · /construction/brick/ · /construction/blocks/ · /construction/drywall/ · /construction/putty/ · /construction/insulation/ · /construction/concrete/
- /transport/fuel/ · /transport/trip-cost/ · /transport/fuel-price/ · /transport/average-speed/ · /transport/ev-range/
- /sport/pace-speed/ · /sport/distance-pace-time/ · /sport/heart-rate-zones/ · /sport/race-split/
- /clothing/shoe-size/
- /datetime/date-diff/ · /datetime/age/
- /everyday/tips/ · /everyday/discount/ · /everyday/unit-price/
- /convert/area/

Примечание: `/sport/` и `/clothing/` добавлены в sitemap после появления первых ready-инструментов.

---

## Сделано (Фаза 5.22) — 2026-04-26

Реализован калькулятор даты и времени `/datetime/age`.

### Реализовано

- Создан feature-модуль:
  - `src/features/age-calculator/`.
- Добавлен расчёт:
  - календарного возраста в годах, месяцах и днях;
  - прожитых дней, полных недель и полных месяцев;
  - следующего дня рождения;
  - дней до дня рождения;
  - возраста на следующий день рождения.
- Для дней рождения 29 февраля в невисокосный год ближайший день рождения считается 28 февраля.
- Добавлены RU/EN локали `age.*`.
- Registry-запись `age` переведена в `ready`.
- В sitemap добавлен `/datetime/age/`.

### Проверки

- `npm run test` — OK, `376/376`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/datetime/age/` title, canonical со slash, `index,follow`;
  - `/datetime/age/` есть в sitemap.
- Mobile smoke — OK:
  - `/datetime/age/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.21) — 2026-04-26

Реализован строительный калькулятор `/construction/concrete`.

### Реализовано

- Создан feature-модуль:
  - `src/features/concrete-calculator/`.
- Добавлен расчёт:
  - площади прямоугольной заливки;
  - объёма бетона без запаса и с запасом;
  - объёма в литрах;
  - количества мешков сухой смеси;
  - покупаемого объёма и остатка;
  - опциональной стоимости по цене за м³.
- Добавлены пресеты толщины 80 / 120 / 150 мм.
- Добавлены пресеты запаса 5 / 10 / 15%.
- Добавлены RU/EN локали `concrete.*`.
- Registry-запись `concrete` переведена в `ready`.
- В sitemap добавлен `/construction/concrete/`.

### Проверки

- `npm run test` — OK, `372/372`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/concrete/` title, canonical со slash, `index,follow`;
  - `/construction/concrete/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/concrete/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.20) — 2026-04-26

Реализован транспортный калькулятор `/transport/ev-range`.

### Реализовано

- Создан feature-модуль:
  - `src/features/ev-range-calculator/`.
- Добавлен расчёт:
  - текущая энергия батареи;
  - доступная энергия с резервом;
  - запас хода в километрах и милях;
  - энергия дозарядки до целевого процента;
  - стоимость зарядки;
  - стоимость 100 км.
- Добавлены пресеты текущего заряда 30 / 50 / 80%.
- Добавлены пресеты резерва 5 / 10 / 15%.
- Добавлены RU/EN локали `evRange.*`.
- Registry-запись `ev-range` переведена в `ready`.
- В sitemap добавлен `/transport/ev-range/`.

### Проверки

- `npm run test` — OK, `369/369`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/transport/ev-range/` title, canonical со slash, `index,follow`;
  - `/transport/ev-range/` есть в sitemap.
- Mobile smoke — OK:
  - `/transport/ev-range/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.19) — 2026-04-26

Реализован строительный калькулятор `/construction/insulation`.

### Реализовано

- Создан feature-модуль:
  - `src/features/insulation-calculator/`.
- Добавлен расчёт:
  - площадь работ с вычетом исключаемой зоны;
  - количество плит утеплителя;
  - количество упаковок;
  - покупаемая площадь и остаток;
  - покупаемый объём по толщине утеплителя;
  - опциональная стоимость упаковок.
- Добавлены пресеты размеров плиты 1.2×0.6 / 1.0×0.6 / 1.2×0.5 м.
- Добавлены пресеты толщины 50 / 100 / 150 мм.
- Добавлены RU/EN локали `insulation.*`.
- Registry-запись `insulation` переведена в `ready`.
- В sitemap добавлен `/construction/insulation/`.

### Проверки

- `npm run test` — OK, `366/366`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/insulation/` title, canonical со slash, `index,follow`;
  - `/construction/insulation/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/insulation/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.18) — 2026-04-26

Реализован строительный калькулятор `/construction/putty`.

### Реализовано

- Создан feature-модуль:
  - `src/features/putty-calculator/`.
- Добавлен расчёт:
  - площадь работ с вычетом исключаемой зоны;
  - масса смеси по толщине слоя и расходу кг/м²/мм;
  - количество мешков;
  - покупаемый вес и остаток;
  - опциональная стоимость мешков.
- Добавлены пресеты толщины слоя 1 / 2 / 3 мм.
- Добавлены пресеты веса мешка 5 / 20 / 25 кг.
- Добавлены RU/EN локали `putty.*`.
- Registry-запись `putty` переведена в `ready`.
- В sitemap добавлен `/construction/putty/`.

### Проверки

- `npm run test` — OK, `363/363`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/putty/` title, canonical со slash, `index,follow`;
  - `/construction/putty/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/putty/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.17) — 2026-04-26

Реализован строительный калькулятор `/construction/blocks`.

### Реализовано

- Создан feature-модуль:
  - `src/features/blocks-calculator/`.
- Добавлен расчёт:
  - чистая площадь кладки с вычетом проёмов;
  - количество блоков без запаса и с запасом;
  - объём кладки;
  - объём одного блока;
  - расход клея и количество мешков;
  - опциональная стоимость блоков.
- Добавлены пресеты размеров блока 600×250×300 / 600×200×300 / 600×250×200 мм.
- Добавлены пресеты запаса 3 / 5 / 10%.
- Добавлены RU/EN локали `blocks.*`.
- Registry-запись `blocks` переведена в `ready`.
- В sitemap добавлен `/construction/blocks/`.

### Проверки

- `npm run test` — OK, `360/360`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/blocks/` title, canonical со slash, `index,follow`;
  - `/construction/blocks/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/blocks/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.16) — 2026-04-26

Реализован строительный калькулятор `/construction/drywall`.

### Реализовано

- Создан feature-модуль:
  - `src/features/drywall-calculator/`.
- Добавлен расчёт:
  - чистая площадь стены с вычетом проёмов;
  - площадь с учётом слоёв и запаса;
  - количество листов ГКЛ с округлением вверх;
  - купленная площадь листов;
  - направляющий и стоечный профиль;
  - количество саморезов;
  - опциональная стоимость листов.
- Добавлены пресеты размеров листа 1.2×2.5 / 1.2×3.0 / 1.2×2.7 м.
- Добавлены пресеты запаса 5 / 10 / 15%.
- Добавлены RU/EN локали `drywall.*`.
- Registry-запись `drywall` переведена в `ready`.
- В sitemap добавлен `/construction/drywall/`.

### Проверки

- `npm run test` — OK, `357/357`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/drywall/` title, canonical со slash, `index,follow`;
  - `/construction/drywall/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/drywall/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.15) — 2026-04-26

Реализован строительный калькулятор `/construction/brick`.

### Реализовано

- Создан feature-модуль:
  - `src/features/brick-calculator/`.
- Добавлен расчёт:
  - площадь кладки с вычетом проёмов;
  - кирпичи до и после запаса;
  - количество кирпичей на 1 м² в 0,5 кирпича;
  - объём кладки;
  - ориентировочный объём раствора;
  - опциональная стоимость кирпича.
- Добавлены пресеты размеров кирпича 250×120×65 / 88 / 138 мм.
- Добавлены RU/EN локали `brick.*`.
- Registry-запись `brick` переведена в `ready`.
- В sitemap добавлен `/construction/brick/`.

### Проверки

- `npm run test` — OK, `354/354`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/brick/` title, description, canonical со slash, `index,follow`;
  - `/construction/brick/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/brick/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.14) — 2026-04-26

Реализован спортивный калькулятор `/sport/race-split`.

### Реализовано

- Создан feature-модуль:
  - `src/features/race-split-calculator/`.
- Добавлен расчёт:
  - целевой темп;
  - средняя скорость;
  - контрольные отсечки по выбранному шагу сплита;
  - финальная отсечка даже при неполном последнем шаге.
- Добавлены RU/EN локали `raceSplit.*`.
- Registry-запись `race-split` переведена в `ready`.
- В sitemap добавлен `/sport/race-split/`.

### Проверки

- `npm run test` — OK, `351/351`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/sport/race-split/` title, description, canonical со slash, `index,follow`;
  - `/sport/race-split/` есть в sitemap.
- Mobile smoke — OK:
  - `/sport/race-split/` 430px full-page screenshot без overflow и наложений.

---

## Сделано (Фаза 5.13) — 2026-04-26

Реализован транспортный калькулятор `/transport/average-speed`.

### Реализовано

- Создан feature-модуль:
  - `src/features/average-speed-calculator/`.
- Добавлен расчёт:
  - средняя скорость по расстоянию и времени;
  - скорость в mph;
  - скорость в м/с;
  - темп в мин/км.
- Добавлены RU/EN локали `averageSpeed.*`.
- Registry-запись `average-speed` переведена в `ready`.
- В sitemap добавлен `/transport/average-speed/`.

### Проверки

- `npm run test` — OK, `348/348`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/transport/average-speed/` title, description, canonical со slash, `index,follow`;
  - `/transport/average-speed/` есть в sitemap.
- Mobile smoke — OK:
  - `/transport/average-speed/` 430px screenshot без overflow и наложений.

---

## Сделано (Фаза 5.12) — 2026-04-26

Реализован транспортный калькулятор `/transport/fuel-price`.

### Реализовано

- Создан feature-модуль:
  - `src/features/fuel-price-calculator/`.
- Добавлен расчёт:
  - сколько литров можно купить на бюджет;
  - примерный запас хода по расходу;
  - стоимость 100 км.
- Добавлены RU/EN локали `fuelPrice.*`.
- Registry-запись `fuel-price` переведена в `ready`.
- В sitemap добавлен `/transport/fuel-price/`.

### Проверки

- `npm run test` — OK, `345/345`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/transport/fuel-price/` title, description, canonical со slash, `index,follow`;
  - `/transport/fuel-price/` есть в sitemap.
- Mobile smoke — OK:
  - `/transport/fuel-price/` 430px screenshot без overflow и наложений.

---

## Сделано (Фаза 5.11) — 2026-04-26

Реализован транспортный калькулятор `/transport/trip-cost`.

### Реализовано

- Создан feature-модуль:
  - `src/features/trip-cost-calculator/`.
- Добавлен расчёт:
  - топливо по дистанции и расходу;
  - стоимость топлива;
  - платные дороги, парковка и прочие расходы;
  - итоговая стоимость;
  - стоимость на человека;
  - режимы в одну сторону / туда и обратно.
- Добавлены RU/EN локали `tripCost.*`.
- Registry-запись `trip-cost` переведена в `ready`.
- В sitemap добавлен `/transport/trip-cost/`.

### Проверки

- `npm run test` — OK, `342/342`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/transport/trip-cost/` title, description, canonical со slash, `index,follow`;
  - `/transport/trip-cost/` есть в sitemap.
- Mobile smoke — OK:
  - `/transport/trip-cost/` 430px screenshot без сломанных chip-переключателей.

---

## Сделано (Фаза 5.10) — 2026-04-26

Реализован строительный калькулятор `/construction/floor-screed`.

### Реализовано

- Создан feature-модуль:
  - `src/features/floor-screed-calculator/`.
- Добавлен расчёт:
  - площадь заливки;
  - объём стяжки;
  - масса сухой смеси по настраиваемому расходу кг/м²/мм;
  - количество мешков;
  - остаток смеси;
  - опциональная стоимость покупки.
- Добавлены быстрые пресеты:
  - толщина: 30, 50, 70 мм;
  - вес мешка: 20, 25, 40 кг.
- Добавлены RU/EN локали `floorScreed.*`.
- Registry-запись `floor-screed` переведена в `ready`.
- В sitemap добавлен `/construction/floor-screed/`.

### Проверки

- `npm run test` — OK, `339/339`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/floor-screed/` title, description, canonical со slash, `index,follow`;
  - `/construction/floor-screed/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/floor-screed/` 430px screenshot без сломанных chip-переключателей.

---

## Сделано (Фаза 5.9) — 2026-04-26

Реализован строительный калькулятор `/construction/laminate`.

### Реализовано

- Создан feature-модуль:
  - `src/features/laminate-calculator/`.
- Добавлен расчёт:
  - площадь помещения;
  - исключаемая площадь без укладки;
  - площадь с запасом;
  - количество упаковок;
  - купленная площадь и остаток;
  - опциональная стоимость покупки.
- Добавлены быстрые пресеты:
  - покрытие упаковки: 1.8, 2.13, 2.5 м²;
  - запас: 5, 10, 15%.
- Добавлены RU/EN локали `laminate.*`.
- Registry-запись `laminate` переведена в `ready`.
- В sitemap добавлен `/construction/laminate/`.

### Проверки

- `npm run test` — OK, `336/336`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/laminate/` title, description, canonical со slash, `index,follow`;
  - `/construction/laminate/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/laminate/` 430px screenshot без сломанных chip-переключателей.

---

## Сделано (Фаза 5.8) — 2026-04-26

Реализован строительный калькулятор `/construction/tile` и доработан визуальный результат `/sport/heart-rate-zones`.

### Реализовано

- Создан feature-модуль:
  - `src/features/tile-calculator/`.
- Добавлен расчёт:
  - площадь поверхности;
  - площадь одной плитки;
  - базовое количество плиток;
  - запас на подрезку;
  - округление до целых упаковок;
  - остаток плиток;
  - опциональная стоимость покупки.
- Добавлены быстрые размеры плитки: 20×20, 30×30, 60×60, 60×120 см.
- Добавлены RU/EN локали `tile.*`.
- Registry-запись `tile` переведена в `ready`.
- В sitemap добавлен `/construction/tile/`.
- `/sport/heart-rate-zones` получил цветные карточки Zone 1-5 с пояснениями, диапазоном и целевым пульсом.

### Проверки

- `npm run test` — OK, `333/333`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/tile/` title, description, canonical со slash, `index,follow`;
  - `/construction/tile/` есть в sitemap.
- Mobile smoke — OK:
  - `/construction/tile/` 430px screenshot без сломанных chip-переключателей;
  - `/sport/heart-rate-zones/` 430px без overflow, 5 цветных карточек зон отображаются корректно.

---

## Сделано (Фаза 5.6) — 2026-04-26

Реализован первый калькулятор раздела одежды и обуви `/clothing/shoe-size`.

### Реализовано

- Создан feature-модуль:
  - `src/features/shoe-size-converter/`.
- Добавлен перевод:
  - длина стопы в сантиметрах;
  - Mondopoint в миллиметрах;
  - EU/RU;
  - UK;
  - US мужской и US женский.
- Добавлены RU/EN локали `shoeSize.*`.
- Registry-запись `shoe-size` переведена в `ready`.
- В sitemap добавлены:
  - `/clothing/`;
  - `/clothing/shoe-size/`.

### Проверки

- `npm run test` — OK, `322/322`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/clothing/shoe-size/` title, description, canonical со slash, `index,follow`;
  - `/clothing/` и `/clothing/shoe-size/` есть в sitemap.
- Mobile smoke — OK:
  - 430px viewport;
  - chip-переключатели без overflow и наложений;
  - активное состояние подсвечивается на всю кнопку.

---

## Сделано (Фаза 5.7) — 2026-04-26

Реализован спортивный калькулятор `/sport/heart-rate-zones`.

### Реализовано

- Создан feature-модуль:
  - `src/features/heart-rate-zones-calculator/`.
- Добавлены методы расчёта:
  - зоны как процент от максимальной ЧСС;
  - зоны по резерву пульса / Karvonen.
- Добавлены RU/EN локали `heartRateZones.*`.
- Registry-запись `heart-rate-zones` переведена в `ready`.
- В sitemap добавлен `/sport/heart-rate-zones/`.

### Проверки

- `npm run test` — OK, `330/330`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/sport/heart-rate-zones/` title, description, canonical со slash, `index,follow`;
  - `/sport/heart-rate-zones/` есть в sitemap.
- Mobile smoke — OK:
  - 430px viewport;
  - chip-переключатели без overflow и наложений;
  - активное состояние подсвечивается на всю кнопку.

---

## Сделано (Фаза 5.3) — 2026-04-26

Реализован первый спортивный калькулятор `/sport/pace-speed`.

### Реализовано

- Создан feature-модуль:
  - `src/features/pace-speed-calculator/`.
- Добавлен перевод:
  - темп `мин/км` → скорость `км/ч` и `mph`;
  - скорость `км/ч` → темп `мин/км` и `мин/миля`.
- Добавлены RU/EN локали `paceSpeed.*`.
- Registry-запись `pace-speed` переведена в `ready`.
- В sitemap добавлены:
  - `/sport/`;
  - `/sport/pace-speed/`.

### Проверки

- `npm run test` — OK, `304/304`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/sport/pace-speed/` title, description, canonical со slash, `index,follow`;
  - `/sport/` и `/sport/pace-speed/` есть в sitemap;
  - на момент фазы 5.3 `/clothing/` ещё не добавлялся в sitemap до первого ready-инструмента.

---

## Сделано (Фаза 5.4) — 2026-04-26

Реализован строительный калькулятор `/construction/paint`.

### Реализовано

- Создан feature-модуль:
  - `src/features/paint-calculator/`.
- Добавлен расчёт:
  - площадь стен по периметру и высоте;
  - вычет окон, дверей и дополнительной площади проёмов;
  - литры по слоям, укрывистости и запасу;
  - округление до целых банок;
  - опциональная стоимость покупки.
- Добавлены RU/EN локали `paint.*`.
- Registry-запись `paint` переведена в `ready`.
- В sitemap добавлен `/construction/paint/`.

### Проверки

- `npm run test` — OK, `311/311`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/construction/paint/` title, description, canonical со slash, `index,follow`;
  - `/construction/paint/` есть в sitemap;
  - результат по умолчанию: 9,83 л, 4 банки по 2,5 л.

---

## Сделано (Фаза 5.5) — 2026-04-26

Реализован спортивный калькулятор `/sport/distance-pace-time`.

### Реализовано

- Создан feature-модуль:
  - `src/features/distance-pace-time-calculator/`.
- Добавлены режимы:
  - найти время по дистанции и темпу;
  - найти темп по дистанции и времени;
  - найти дистанцию по времени и темпу.
- Добавлены быстрые дистанции: 3, 5, 10, 15, 21.1, 42.2 км.
- Добавлены RU/EN локали `distancePaceTime.*`.
- Registry-запись `distance-pace-time` переведена в `ready`.
- В sitemap добавлен `/sport/distance-pace-time/`.

### Проверки

- `npm run test` — OK, `317/317`.
- `npm run type-check` — OK.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.
- Static smoke — OK:
  - `/sport/distance-pace-time/` title, description, canonical со slash, `index,follow`;
  - `/sport/distance-pace-time/` есть в sitemap;
  - результат по умолчанию: 10 км за 0:50:00 при темпе 5:00 мин/км.

---

## Сделано (Фаза 5.2) — 2026-04-25

Подготовлен большой коммит после смены продуктовой концепции и расширения каталога.

### Реализовано

- Расширен реестр `src/data/calculators.ts`:
  - добавлены новые `soon`-инструменты почти по всем категориям;
  - `/finance/hourly-rate` заменён на ready-калькулятор `/finance/salary`;
  - добавлены новые категории `/sport` и `/clothing`;
  - все элементы реестра приведены к обязательному `isPopular`.
- Добавлен ready feature-модуль:
  - `src/features/salary-calculator/`.
- Удалён старый модуль:
  - `src/features/hourly-rate-calculator/`.
- Добавлены похожие калькуляторы на страницах ready-инструментов:
  - `src/components/ui/RelatedCalculators.vue`;
  - подключение в `src/views/CalculatorView.vue`.
- Обновлены:
  - footer со счётчиками ready/soon;
  - главная страница, чтобы категории считали visible-инструменты;
  - SEO application category для `sport` и `clothing`;
  - RU/EN локали;
  - `public/sitemap.xml` для `/finance/salary/`.
- Создан roadmap:
  - `docs/plans/active/2026-04-25-sport-clothing-roadmap.md`.
- Переписан `README.md` под Calcup как агрегатор калькуляторов.

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `297/297`.
- `npm run build` — OK, `vite-ssg` отрендерил 87 страниц.

### Следующий шаг

Один большой commit и push в `origin/main`.

---

## Сделано (Фаза 5.1) — 2026-04-25

Реализован первый строительный калькулятор `/construction/wallpaper`. Вдохновение по пользовательскому сценарию взято из `https://calcup.pro/construction/wallpaper`, без копирования дизайна, текстов, структуры или визуального стиля.

### Реализовано

- Создан feature-модуль:
  - `src/features/wallpaper-calculator/index.ts`
  - `src/features/wallpaper-calculator/components/WallpaperCalculatorView.vue`
  - `src/features/wallpaper-calculator/composables/useWallpaperCalculator.ts`
  - `src/features/wallpaper-calculator/lib/calculations.ts`
  - `src/features/wallpaper-calculator/lib/calculations.test.ts`
  - `src/features/wallpaper-calculator/types/wallpaper.ts`
- Расчёт рулонов по двум основаниям:
  - площадь стен с вычетом проёмов и запасом;
  - количество целых полос из рулона.
- Итог берёт более осторожное значение из расчёта по площади и по полосам.
- Добавлены:
  - окна и двери;
  - дополнительная площадь проёмов;
  - запас в процентах;
  - цена рулона и итоговая стоимость;
  - пресеты ширины/длины рулона;
  - раппорт / подгонка рисунка;
  - предупреждение, если площадь проёмов больше площади стен.
- Добавлены RU/EN локали `wallpaper.*`.
- Добавлена registry-запись `wallpaper`:
  - categorySlug: `construction`;
  - path: `/construction/wallpaper`;
  - status: `ready`;
  - popularity: `84`;
  - SEO/search tags для запросов про обои, рулоны, расход, раппорт и wallpaper.
- Обновлена категория `construction`.
- Обновлён `public/sitemap.xml`:
  - `/construction/`;
  - `/construction/wallpaper/`.

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `297/297`.
- `npm run build` — OK.
- Playwright smoke — OK:
  - `/construction/wallpaper/`;
  - desktop;
  - mobile `360px` без horizontal overflow;
  - SearchModal по запросам `обои`, `рулоны обоев`, `сколько обоев нужно`, `расход обоев`, `раппорт`, `wallpaper`;
  - sitemap;
  - robots `index,follow,max-image-preview:large`;
  - canonical со slash;
  - сценарий с раппортом;
  - сценарий с ценой рулона.

### Итог

Phase 5.1 завершена. Следующий логичный шаг — либо production deploy QA для `/construction/wallpaper`, либо Phase 5.2 `/construction/paint`.

---

## Сделано (Фаза 5.0) — 2026-04-25

Планирование строительного направления. Реализация новых калькуляторов не начиналась.

- Изучен внешний ориентир по охвату тем: `https://calcup.pro/construction`.
- Решение: использовать только рыночный охват и идеи направлений, не копировать структуру, тексты, дизайн и порядок.
- Создан отдельный active-roadmap:
  - `docs/plans/active/2026-04-25-construction-roadmap.md`
- Создан active-план первого строительного калькулятора:
  - `docs/plans/active/2026-04-25-wallpaper-calculator.md`
- Зафиксирована продуктовая линейка `/construction`:
  - P0: обои, краска, плитка, ламинат, стяжка пола;
  - P1: кирпич, блоки, гипсокартон, шпатлёвка/штукатурка, утеплитель;
  - P2: бетон, ленточный фундамент, плитный фундамент, арматура, кровля;
  - P3: лестница, выемка грунта, освещение, вентиляция, снеговая и ветровая нагрузка.
- Рекомендованный первый калькулятор: `/construction/wallpaper`.
- Для `/construction/wallpaper` проработаны:
  - route, category, naming RU/EN;
  - feature-module структура;
  - поля формы;
  - формулы по площади и по полосам;
  - раппорт / подгонка рисунка;
  - валидация;
  - unit-тесты;
  - UI/UX;
  - i18n;
  - registry / SEO / sitemap;
  - Playwright smoke.

### Следующий шаг

Phase 5.1 — реализация `/construction/wallpaper` по active-плану.

---

## Сделано (Фаза 4.18) — 2026-04-25

GitHub Pages deploy QA. Новый калькулятор не начинался, UX polish и архитектурные изменения не выполнялись.

### Деплой

- Production URL: `https://calcup.ru/`
- Репозиторий: `https://github.com/zergzorg/calcup`
- Коммит деплоя: `59955ab feat: stabilize MVP calculators`
- GitHub Actions workflow: `Deploy to GitHub Pages`
- Run ID: `24936774306`
- Publish branch: `gh-pages`
- Workflow завершился успешно.

### Перед деплоем

- Рабочее дерево было не чистым: были незакоммиченные изменения фаз 4.13–4.17.
- Изменения были явно проверены, добавлены в git и зафиксированы одним коммитом.
- Проверены scripts в `package.json`:
  - `build`: `vue-tsc -b && vite-ssg build && node scripts/create-route-indexes.mjs && cp dist/index.html dist/404.html`
  - `deploy`: `gh-pages -d dist`
- Проверено, что build создаёт:
  - `dist/404.html`
  - `dist/sitemap.xml`
  - `dist/robots.txt`
  - trailing-slash `index.html` для ready routes

### Проверено на production

- Главная `/` загружается без ошибок.
- Ассеты JS/CSS не отдают 404.
- Категории открываются:
  - `/finance/`
  - `/math/`
  - `/health/`
  - `/convert/`
  - `/transport/`
  - `/datetime/`
  - `/everyday/`
- Ready-калькуляторы открываются:
  - `/finance/credit/`
  - `/finance/vat/`
  - `/finance/salary/`
  - `/finance/project-price/`
  - `/math/percentage/`
  - `/health/bmi/`
  - `/convert/length/`
  - `/convert/temperature/`
  - `/convert/weight/`
  - `/convert/area/`
  - `/transport/fuel/`
  - `/datetime/date-diff/`
  - `/everyday/tips/`
  - `/everyday/discount/`
  - `/everyday/unit-price/`
- GitHub Pages fallback:
  - `/not-existing-url` отдаёт 404-страницу приложения;
  - 404 имеет `robots: noindex,nofollow`.
- SEO:
  - `/sitemap.xml` открывается;
  - `/robots.txt` открывается;
  - ready-страницы имеют `index,follow,max-image-preview:large`;
  - canonical со slash;
  - `/workspace` остаётся `noindex,nofollow`.
- Mobile `360px` проверен:
  - `/`
  - `/everyday/unit-price/`
  - `/finance/credit/`
  - `/finance/salary/`
- Production search проверен по запросам:
  - `кредит`
  - `НДС`
  - `стоимость часа`
  - `выгодная покупка`
  - `площадь`
  - `температура`

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `279/279`.
- `npm run build` — OK.
- `curl` smoke на production — OK:
  - `/`
  - `/sitemap.xml`
  - `/robots.txt`
  - `/everyday/unit-price/`
  - `/not-existing-url`
- Playwright production smoke — OK.

### Найденные проблемы

- Проблем приложения на production не найдено.
- GitHub Actions показал предупреждение о будущей deprecation Node.js 20 для actions runner. Это не ломает текущий деплой, но позже workflow стоит обновить на Node.js 24-compatible actions.

### Итог

MVP deployed and verified.

Следующее решение:

- продолжить с новым калькулятором;
- сделать отдельный UX polish;
- настроить дальнейшую эксплуатацию деплоя / мониторинг.

---

## Сделано (Фаза 4.17) — 2026-04-25

MVP stabilization before deploy. Новый калькулятор не начинался, редизайн и архитектура не менялись.

### Проверено

- Все текущие страницы MVP:
  - `/`
  - `/finance/`, `/math/`, `/health/`, `/convert/`, `/transport/`, `/datetime/`, `/everyday/`
  - `/finance/credit/`, `/finance/vat/`, `/finance/salary/`, `/finance/project-price/`
  - `/math/percentage/`, `/health/bmi/`
  - `/convert/length/`, `/convert/temperature/`, `/convert/weight/`, `/convert/area/`
  - `/transport/fuel/`, `/datetime/date-diff/`
  - `/everyday/tips/`, `/everyday/discount/`, `/everyday/unit-price/`
- Все ready-страницы открываются в preview.
- Нет сырых i18n-ключей вида `unitPrice.*`, `weight.*`, `salary.*`.
- Нет `[object Object]`, `NaN`, `Invalid Date` в проверенных пользовательских сценариях.
- Mobile `360px` и `768px` без horizontal overflow на ready-калькуляторах.
- Header/hamburger на mobile открывается.
- Inline-search на главной и SearchModal работают.
- Динамические формы проверены:
  - `/everyday/unit-price`: добавление до 5 товаров, удаление, смешанные `кг + л`, warning без winner.
  - `/finance/salary`: добавление/удаление доп. дохода, пустая строка не ломает расчёт.
  - `/everyday/tips`: `peopleCount = 1` и `peopleCount > 1`.
  - `/finance/project-price`: `projectHours = 0`.
  - `/datetime/date-diff`: поля после mount корректны.
- GitHub Pages readiness:
  - `dist/404.html` создан.
  - trailing-slash `index.html` создан для проверенных маршрутов.
  - `/not-existing-url` открывает 404/fallback и остаётся `noindex,nofollow`.

### SEO / Sitemap

- Все ready-страницы есть в `sitemap.xml`.
- `/everyday/unit-price/` есть в `sitemap.xml`.
- Soon/planned страницы не попадают в sitemap.
- Все ready-страницы имеют `robots: index,follow,max-image-preview:large`.
- Canonical у ready-страниц со slash.
- `/workspace` и 404 остаются `noindex,nofollow`.

### Search

Поиск проверен по запросам:

- `кредит`
- `НДС`
- `стоимость часа`
- `стоимость проекта`
- `процент`
- `ИМТ`
- `длина`
- `температура`
- `вес`
- `площадь`
- `расход топлива`
- `разница дат`
- `чаевые`
- `скидка`
- `выгодная покупка`
- `цена за кг`
- `unit price`

Soon/planned в результатах поиска не появляются.

### Найденные проблемы

- Проблем в приложении по Phase 4.17 не найдено.
- Код приложения не менялся в рамках стабилизации; обновлён только `PROJECT_STATUS.md`.

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `279/279`.
- `npm run build` — OK, SSG `27` страниц, `dist/404.html` создан.
- Playwright MVP smoke — OK:
  - page basics / i18n;
  - SEO / sitemap / fallback;
  - search;
  - mobile `360px` / `768px`;
  - dynamic forms.

### Следующее решение

Остановиться и выбрать дальнейшее направление:

- деплой на GitHub Pages;
- следующий калькулятор;
- отдельный UX polish.

---

## Сделано (Фаза 4.16) — 2026-04-25

Отдельная задача: калькулятор выгодной покупки для сравнения товаров в супермаркете.

- `src/features/unit-price-calculator/` — полный отдельный модуль
- Путь: `/everyday/unit-price`
- Назначение: сравнить товары по цене за базовую единицу
- Поддержаны группы единиц: масса (`г`, `кг`), объём (`мл`, `л`), количество (`шт`)
- Базовые единицы сравнения: `кг`, `л`, `шт`
- По умолчанию 2 товара; товары можно добавлять и удалять, минимум 1 товар остаётся
- Название товара необязательно; при пустом названии показывается `Товар N`
- Форма ускорена для расчёта в магазине: одна цена на товар, без отдельной цены со скидкой и заметки
- Поле количества в UI подстраивается под единицу: `Вес`, `Объём`, `Штук`
- Внизу страницы добавлена памятка, как сохранить калькулятор на экран Домой в iOS и Android
- Если группы единиц смешаны, общий победитель не выбирается и показывается warning
- Если валиден только один товар, показывается цена за единицу без winner
- Реестр: `unit-price` → `status: 'ready'`, `popularity: 76`, `/everyday/unit-price`
- Sitemap: `/everyday/unit-price/`
- Поиск: запросы `выгодная покупка`, `цена за кг`, `цена за литр`, `сравнить товары`, `супермаркет`, `unit price`, `supermarket`
- Unit-тесты: `src/features/unit-price-calculator/lib/calculations.test.ts`
- i18n: RU/EN

### UX-доработки после первичной реализации

- После просмотра `https://t-j.ru/supermarket-calc/` форма упрощена под быстрый расчёт в магазине.
- Удалены отдельные поля `Цена со скидкой` и `Заметка`.
- Скрытая логика `discountPrice` полностью удалена из типов, расчётов, валидации, локалей и тестов.
- Добавлена памятка “Как держать калькулятор под рукой”:
  - iOS: открыть в Safari → Поделиться → На экран Домой;
  - Android: открыть в Chrome → меню → Добавить на главный экран / Установить приложение.

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `279/279`.
- `npm run build` — OK, SSG `27` страниц.
- Playwright smoke — OK: `/everyday/unit-price/`, поиск, SEO/sitemap, mixed units, add/remove, упрощённая форма без второй цены, mobile `360px`.

---

## Сделано (Фаза 4.15 QA) — 2026-04-25

Короткая QA-проверка финансовой логики `/finance/salary` и `/finance/project-price`. Новый калькулятор не начинался.

### Проверено `/finance/salary`

- Зарплата вводится до НДФЛ; это явно видно в warning-плашке.
- Warning-плашка оформлена как предупреждение, не как ошибка.
- Расчёт после НДФЛ корректен: при `120 000 ₽` до НДФЛ базовая ставка считается от `104 400 ₽` после НДФЛ и даёт около `634 ₽/ч`.
- Прогрессивная шкала НДФЛ РФ 2025+ покрыта unit-тестами и проверена в UI.
- Свой процент налога работает.
- Дополнительные доходы можно добавлять и удалять.
- Пустые строки дополнительного дохода считаются как `0` и не ломают результат.
- Помесячная разбивка НДФЛ проверена на mobile `360px` без horizontal overflow.
- Privacy-текст отображается корректно: данные не хранятся и никуда не передаются.

### Проверено `/finance/project-price`

- Формула `ставка × часы × сложность × срочность` работает корректно.
- Расходы добавляются после расчёта труда.
- Налог/комиссия считается от `subtotal`.
- `projectHours = 0` не ломает расчёт.
- Коэффициенты сложности и срочности видны в UI.

### Проверено поиск / SEO / sitemap

- Поиск находит нужные страницы по запросам: `стоимость часа`, `зарплата после ндфл`, `ндфл`, `подработка`, `фриланс`, `стоимость проекта`, `оценить проект`, `hourly rate`, `project price`.
- `/finance/salary/` и `/finance/project-price/` есть в `sitemap.xml`.
- Обе страницы отдают `robots: index,follow,max-image-preview:large`.
- Canonical у обеих страниц со slash.

### Исправлено в ходе QA

- В `/finance/salary` добавлено удаление строк дополнительного дохода.
- Уточнена warning-плашка: зарплата указывается до НДФЛ, а расчёт выполняется только в браузере.

### Проверки

- `npm run type-check` — OK.
- `npm run test` — OK, `263/263`.
- `npm run build` — OK, SSG `26` страниц.
- Playwright smoke — OK: обе финансовые страницы, поиск, SEO/sitemap, mobile `360px`.

---

## Сделано (Фаза 4.14) — 2026-04-25

Отдельная задача: вынести оценку подработки / проекта из калькулятора зарплаты.

- `src/features/project-price-calculator/` — полный отдельный модуль
- Путь: `/finance/project-price`
- Назначение: оценка проекта или подработки без смешения с зарплатой и НДФЛ
- Поля: ставка за час, часы проекта, сложность, срочность, расходы, налог или комиссия
- Формула: `стоимость = ставка × часы × сложность × срочность + расходы + налог`
- Коэффициенты сложности: simple ×1, normal ×1.2, complex ×1.5, expert ×2
- Коэффициенты срочности: normal ×1, soon ×1.25, urgent ×1.5
- Реестр: `project-price` → `status: 'ready'`, `popularity: 81`, `/finance/project-price`
- Sitemap: `/finance/project-price/`
- Поиск: запросы `подработка`, `стоимость проекта`, `оценить проект`, `фриланс`, `project price`
- Unit-тесты: `src/features/project-price-calculator/lib/calculations.test.ts`

---

## Сделано (Фаза 4.13) — 2026-04-25

Отдельная задача: калькулятор зарплаты, НДФЛ, дополнительного дохода и базовой стоимости часа.

- `src/features/salary-calculator/` — полный модуль
- Путь: `/finance/salary`
- Назначение: рассчитать зарплату после НДФЛ, дополнительный доход и базовую стоимость рабочего часа
- Зарплата вводится до НДФЛ; это явно указано в warning-плашке
- НДФЛ: прогрессивная шкала РФ 2025+ или свой процент
- Для прогрессивной шкалы показывается помесячная разбивка НДФЛ
- Дополнительные доходы задаются строками `сумма + налог`, строки можно добавлять и удалять
- Пустые поля дополнительного дохода считаются как `0` и не ломают расчёт
- Базовая часовая ставка считается через общий доход после налогов, график, рабочие дни в году и часы в рабочем дне
- Графики: 5/2 — 247 дней, 2/2 — 183 дня, сутки через трое — 92 дня, свой график
- Privacy: данные не хранятся и никуда не передаются, расчёт выполняется в браузере
- Реестр: `salary` → `status: 'ready'`, `popularity: 82`, `/finance/salary`
- Sitemap: `/finance/salary/`
- Поиск: запросы `ндфл`, `зарплата после ндфл`, `зарплата до ндфл`, `ставка за час`, `salary`
- Unit-тесты: `src/features/salary-calculator/lib/calculations.test.ts`
- i18n: RU/EN

---

## Сделано (Фаза 4.12) — 2026-04-25

- `src/features/area-converter/` — полный модуль
- 10 единиц: мм², см², м², км², га, а (сотка), дюйм², фут², ярд², акр; конвертация через squareMeter
- Округление до 8 значащих цифр; корректная работа с очень малыми и большими значениями
- 27 unit-тестов (233/233 всего)
- Swap button, популярные значения, layout как у length/weight converter
- Registry: `area` → `status: 'ready'`, `popularity: 70`
- Sitemap: `/convert/area/`
- Playwright 18/19 (1 — ложное: тест проверял `площадь`, заголовок правильно использует `площади`)

### Внеплановое улучшение (та же сессия)

- Подсказка «Сторона квадрата с такой площадью» в карточке результата
- Авто-перевод единицы: мм / см / м / км в зависимости от величины
- Примеры: 1 м² → 1 м, 100 м² → 10 м, 1 га → 100 м, 1 км² → 1 км
- Коммиты: `1ad74ac` (базовый модуль) + `796a2cb` (подсказка стороны)

---

## Сделано (Фаза 4.11) — 2026-04-25 — Stabilization / UI consistency audit

Проверено: 19 страниц (/, 7 категорий, 11 калькуляторов). Playwright 104/107 (3 — ложные срабатывания теста).

### Найдено и исправлено

| Баг | Файл | Исправление |
|-----|------|-------------|
| Credit mobile overflow (812px на 360px) | `credit-calculator.css` | `grid-template-columns: minmax(0, 1fr)` на `.credit-main-column` — таблица теперь скроллится внутри контейнера |
| Temperature summary bug: `97.88 Цельсий = Фаренгейт` | `TemperatureConverterView.vue` | Прямая интерполяция: `{{ value }} {{ fromUnit }} = {{ result }} {{ toUnit }}` вместо `{ value: result }` |

### Ложные срабатывания (не баги)

- `credit layout`: мой тест использовал `form`/`result` CSS-селекторы; кредитный калькулятор использует `.credit-page`, `.credit-panel` — своя система классов
- `i18n 373.15K36.6`: конкатенация соседних flex-элементов при `textContent()` — визуально корректно
- `i18n 24.03.2031`: даты платёжного графика совпали с паттерном `word.word.word`

### Итоговое состояние

- 206/206 unit-тестов
- type-check чистый
- Build OK
- Mobile 360px: все страницы без overflow
- i18n: нет сырых ключей, нет `[object Object]`
- Search: все 11 запросов находят нужный калькулятор; soon-калькуляторы скрыты
- SEO: все ready-страницы в sitemap, index,follow; soon — нет в sitemap

---

## Сделано (Фаза 4.10) — 2026-04-25

- `src/features/discount-calculator/` — 4 режима: скидка, наценка, % изменения, исходная цена
- Быстрые пресеты: 5/10/15/20/25/50% + свой%; side-by-side workspace layout
- 35 unit-тестов (206/206 всего); Playwright 18/18
- Registry: `discount` → `status: 'ready'`, `popularity: 80`
- Sitemap: `/everyday/discount/`
- Исправлен `v-model` с тернарным оператором (не поддерживается Vue) → два отдельных `v-if`-input

---

## Сделано (Фаза 4.9) — 2026-04-25

- `src/features/weight-converter/` — полный модуль (другая сессия модели)
- 7 единиц: мг, г, кг, т, унц, фунт, ст; конвертация через базовую kg
- 17 unit-тестов (170/170 всего)
- Registry: `weight` → `status: 'ready'`, `popularity: 72`
- Sitemap: `/convert/weight/`

### Исправления при приёмке (эта сессия) — 2026-04-25

| Баг | Причина | Исправление |
|-----|---------|-------------|
| `weight.unitShort.gram` буквально в UI | Ключи `weight.unitShort.*` не добавлены в локали | Добавлены в ru.json и en.json |
| `1 кг = [object Object] г` | View использовал `result` (ref-объект) в script computed | Убраны сломанные computed; `{{ result }}` в template (auto-unwrap) |
| Нет CSS — всё в столбик | Отсутствовал `<style scoped>` | Добавлен полный блок стилей |
| Layout чаевых — результат снизу | Другая модель не добавила workspace grid | `.tips-workspace` с `grid-template-columns: 1fr 420px` |

- Коммит: `4ccd18a feat: weight & temperature converters; fix tips layout, weight unitShort i18n`
- 170/170 тестов · type-check чистый · build OK

---

## Сделано (Фаза 4.8) — 2026-04-25

- `src/features/temperature-converter/` — полный модуль (другая сессия модели)
- Конвертация °C ↔ °F ↔ K; валидация ниже абсолютного нуля
- 22 unit-тестов; build → `dist/convert/temperature.html`
- Registry: `temperature` → `status: 'ready'`, `popularity: 75`
- Sitemap: `/convert/temperature/`
- Коммит: `4ccd18a` (вместе с weight)

---

## Сделано (Фаза 4.7) — 2026-04-25

- `src/features/tips-calculator/` — полный модуль
- Быстрые ставки: 0/5/10/15/20/custom%; блок "На каждого" при peopleCount > 1
- 30 unit-тестов, Playwright 14/14; все 5 запросов поиска работают
- Registry: `tips` → `status: 'ready'`, `popularity: 78`
- Sitemap: `/everyday/` + `/everyday/tips/`; открыта новая категория
- Коммит: `8b3b329 feat: phase 4.7 — tips calculator /everyday/tips`

---

## Внеплановые задачи — 2026-04-25

### Редизайн главной страницы (`69e3691`)

- Hero: полноширинный inline-поиск с дропдауном вместо кнопки-заглушки
- Отступы поджаты; Playwright 8/8

### Стабильность шапки (`298319a`)

- Удалена кнопка "Главная" из nav
- Кнопка "Поиск" — `visibility: hidden` вместо `v-if` → nav position стабилен (diff=0px)
- `scrollbar-gutter: stable` — нет прыжка при появлении скролбара

---

## Сделано (Фаза 4.6) — 2026-04-25

- `src/features/vat-calculator/` — начислить/выделить НДС, ставки 20/10/0/custom
- 26 unit-тестов, Playwright 7/7
- Коммит: `0fc2fab feat: phase 4.6 — VAT calculator /finance/vat`

## Сделано (Фаза 4.5) — 2026-04-25

- `src/features/date-diff-calculator/` — UTC-safe парсинг, breakdown г/м/д, SSG hydration fix
- 28 unit-тестов, Playwright 8/8

## Сделано (Фаза 4.4) — 2026-04-25

- `src/features/fuel-calculator/` — расход/литры/стоимость поездки, prefilled defaults
- `src/style.css`: глобальное скрытие спиннеров number input

---

## Ожидает

Следующий калькулятор не определён — ожидание согласования.
