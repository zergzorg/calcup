# Calcup Codex Worklog

## 2026-04-26

### Итерация 1: audit и выбор первого milestone

Что выбрано:

- Провести аудит проекта по `MAIN_PLAN.MD`.
- Начать с `/sport/pace-speed`, чтобы открыть первую ready-страницу в пустой категории `sport`.

Что изменено:

- Создан `docs/plans/active/CODEX_MASTER_EXECPLAN.md`.
- Создан `docs/plans/active/CODEX_WORKLOG.md`.

Команды:

- `git status --short`
- `rg --files`
- `sed -n ... README.md AGENTS.md src/features/calculator-design-system.css`
- `sed -n ... docs/plans/active/*.md`
- `node` audit script по `src/data/calculators.ts`

Результат проверок:

- Проверки кода ещё не запускались.

Commit hash:

- 8b7c3cb

Следующий шаг:

- Реализовать `/sport/pace-speed` и запустить `npm run test`, `npm run type-check`, `npm run build`.

### Итерация 2: `/sport/pace-speed`

Что выбрано:

- Первый спортивный ready-калькулятор: перевод темпа `мин/км` в скорость `км/ч` и обратно.

Что изменено:

- Создан `src/features/pace-speed-calculator/`.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- static smoke через `rg` по `dist/sport/pace-speed/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 16 files / 304 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: canonical, robots, route indexes and sitemap entries checked.

Commit hash:

- 8b7c3cb

Следующий шаг:

- Перейти к `/construction/paint`.

### Итерация 3: старт `/construction/paint`

Что выбрано:

- Следующий P0-калькулятор строительного roadmap: `/construction/paint`.

Что изменено:

- Обновлён `CODEX_MASTER_EXECPLAN.md` с критериями готовности и формульными допущениями.

Команды:

- web search по paint coverage formulas и производственным калькуляторам.

Результат проверок:

- `npm run test` — OK, 17 files / 311 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/paint/` canonical, robots, route index and sitemap entries checked.

Commit hash:

- b0dc25e

Следующий шаг:

- Перейти к `/sport/distance-pace-time`.

### Итерация 4: старт `/sport/distance-pace-time`

Что выбрано:

- Следующий спортивный P0-калькулятор: дистанция / темп / время.

Что изменено:

- Обновлён `CODEX_MASTER_EXECPLAN.md` с критериями готовности и формульными допущениями.

Команды:

- Используются уже сверенные формулы pace/speed/time из предыдущего спортивного milestone.

Результат проверок:

- `npm run test` — OK, 18 files / 317 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/sport/distance-pace-time/` canonical, robots, route index and sitemap entries checked.

Commit hash:

- 88d5990

Следующий шаг:

- Перейти к `/clothing/shoe-size`.

### Итерация 5: `/clothing/shoe-size`

Что выбрано:

- Первый ready-инструмент для категории `/clothing`: конвертер размера обуви между длиной стопы, Mondopoint, EU/RU, UK и US.

Что изменено:

- Создан `src/features/shoe-size-converter/`.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.
- Перед реализацией сверены исходные допущения: Mondopoint основан на ISO 9407; остальные системы считаются через длину стопы и стандартные размерные формулы с предупреждением о различиях брендов.

Команды:

- web search по ISO 9407 / Mondopoint и формулам shoe size conversion.
- `npm run test`
- `npm run type-check`
- `npm run build`
- static smoke через `rg` по `dist/clothing/shoe-size/index.html`, `dist/clothing/index.html` и sitemap.
- Playwright mobile smoke 430px по `/clothing/shoe-size/`.

Результат проверок:

- `npm run test` — OK, 19 files / 322 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/clothing/shoe-size/` canonical, robots и sitemap entries checked.
- Mobile smoke — OK: overflow 0, chip-переключатели без наложений, активное состояние полноразмерное.

Commit hash:

- 0fc564f

Следующий шаг:

- Перейти к sitemap/registry guard.

### Итерация 6: sitemap/registry guard

Что выбрано:

- Защитить ручной `public/sitemap.xml` и ready-реестр от рассинхронизации при добавлении новых калькуляторов.

Что изменено:

- Добавлен `src/data/registry-guards.test.ts`.
- Тест проверяет `validateRegistry()`, обязательные поля ready-калькуляторов и соответствие sitemap ready-страницам.
- `soon`/`planned` калькуляторы и категории без ready-контента проверяются на отсутствие в sitemap.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`

Результат проверок:

- `npm run test` — OK, 20 files / 325 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.

Commit hash:

- 95ee3fe

Следующий шаг:

- Выбрать следующий high-value калькулятор из roadmap: `/sport/heart-rate-zones`, `/construction/tile` или `/clothing/clothing-size`.

### Итерация 7: `/sport/heart-rate-zones`

Что выбрано:

- Следующий high-value sport-калькулятор: пульсовые зоны по максимальной ЧСС и резерву пульса.

Что изменено:

- Создан `src/features/heart-rate-zones-calculator/`.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.
- Перед реализацией сверены источники: AHA target heart rate 50-85% и Karvonen/HRR формула.

Команды:

- web search по AHA target heart rate zones и Karvonen formula.
- `npm run test`
- `npm run type-check`
- `npm run build`
- static smoke через `rg` по `dist/sport/heart-rate-zones/index.html` и sitemap.
- Playwright mobile smoke 430px по `/sport/heart-rate-zones/`.

Результат проверок:

- `npm run test` — OK, 21 files / 330 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/sport/heart-rate-zones/` canonical, robots и sitemap entry checked.
- Mobile smoke — OK: overflow 0, chip-переключатели без наложений, активное состояние полноразмерное.

Commit hash:

- 28c10e6

Следующий шаг:

- Выбрать следующий high-value калькулятор: `/construction/tile`, `/clothing/clothing-size` или `/sport/race-split`.

### Итерация 8: `/construction/tile` и визуальная доработка ЧСС

Что выбрано:

- Следующий P0-калькулятор строительного roadmap: `/construction/tile`.
- По пользовательскому фидбеку доработать `/sport/heart-rate-zones`: сделать цветные карточки зон с пояснениями и целевым пульсом.

Что изменено:

- Создан `src/features/tile-calculator/`.
- Добавлен расчёт площади, базового количества плиток, запаса, целых упаковок, остатка и опциональной стоимости.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.
- Для `heart-rate-zones` добавлены цветные карточки Zone 1-5, описания зон и `targetBpm`; зоны уточнены до беговой шкалы 60-70, 70-75, 75-85, 85-95, 95-100%.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/tile/ /tmp/calcup-tile-mobile-cli.png`
- Playwright smoke 430px по `/sport/heart-rate-zones/` для проверки цветных карточек и overflow.

Результат проверок:

- `npm run test` — OK, 22 files / 333 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/tile/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: `/construction/tile/` chip-переключатели полноширинные, активное состояние без наложений.
- Mobile smoke — OK: `/sport/heart-rate-zones/` показывает 5 цветных карточек зон без horizontal overflow.

Commit hash:

- 90d49d2

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/construction/laminate`, `/clothing/clothing-size`, `/sport/race-split` или `/transport/trip-cost`.

### Итерация 9: `/construction/laminate`

Что выбрано:

- Следующий P0-калькулятор строительного roadmap: `/construction/laminate`.

Что изменено:

- Создан `src/features/laminate-calculator/`.
- Добавлен расчёт чистой площади пола, площади с запасом, количества упаковок, купленной площади, остатка и опциональной стоимости.
- Добавлены пресеты покрытия упаковки 1.8 / 2.13 / 2.5 м² и запаса 5 / 10 / 15%.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- web search по laminate/flooring waste allowance и pack coverage workflow.
- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/laminate/ /tmp/calcup-laminate-mobile.png`
- Static smoke через `rg` по `dist/construction/laminate/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 23 files / 336 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/laminate/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: chip-переключатели полноширинные, активное состояние без наложений.

Commit hash:

- 4131da0

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/construction/floor-screed`, `/clothing/clothing-size`, `/sport/race-split` или `/transport/trip-cost`.

### Итерация 10: `/construction/floor-screed`

Что выбрано:

- Закрыть P0 first wave строительного roadmap калькулятором `/construction/floor-screed`.

Что изменено:

- Создан `src/features/floor-screed-calculator/`.
- Добавлен расчёт площади, объёма, сухой смеси по расходу кг/м²/мм, количества мешков, остатка и опциональной стоимости.
- Добавлены пресеты толщины 30 / 50 / 70 мм и веса мешка 20 / 25 / 40 кг.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- web search по floor screed consumption и формуле area × thickness.
- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/floor-screed/ /tmp/calcup-floor-screed-mobile.png`
- Static smoke через `rg` по `dist/construction/floor-screed/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 24 files / 339 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/floor-screed/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: chip-переключатели полноширинные, активное состояние без наложений.

Commit hash:

- 1388e97

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/construction/brick`, `/construction/drywall`, `/clothing/clothing-size`, `/sport/race-split` или `/transport/trip-cost`.

### Итерация 11: `/transport/trip-cost`

Что выбрано:

- Расширить транспортный раздел вторым ready-инструментом: `/transport/trip-cost`.

Что изменено:

- Создан `src/features/trip-cost-calculator/`.
- Добавлен расчёт топлива, стоимости топлива, платных дорог, парковки, прочих расходов и стоимости на человека.
- Добавлен выбор направления поездки: в одну сторону / туда и обратно через полноширинные chip-кнопки.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/transport/trip-cost/ /tmp/calcup-trip-cost-mobile.png`
- Static smoke через `rg` по `dist/transport/trip-cost/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 25 files / 342 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/transport/trip-cost/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: direction chip-переключатели полноширинные, активное состояние без наложений.

Commit hash:

- 705bdfb

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/transport/fuel-price`, `/transport/average-speed`, `/clothing/clothing-size`, `/sport/race-split` или строительному P1.

### Итерация 12: `/transport/fuel-price`

Что выбрано:

- Расширить транспортный раздел калькулятором покупки топлива по бюджету: `/transport/fuel-price`.

Что изменено:

- Создан `src/features/fuel-price-calculator/`.
- Добавлен расчёт литров по бюджету, примерного запаса хода и стоимости 100 км.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/transport/fuel-price/ /tmp/calcup-fuel-price-mobile.png`
- Static smoke через `rg` по `dist/transport/fuel-price/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 26 files / 345 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/transport/fuel-price/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: поля и результат без overflow и наложений.

Commit hash:

- cde7208

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/transport/average-speed`, `/clothing/clothing-size`, `/sport/race-split` или строительному P1.

### Итерация 13: `/transport/average-speed`

Что выбрано:

- Завершить текущую транспортную пачку калькулятором средней скорости: `/transport/average-speed`.

Что изменено:

- Создан `src/features/average-speed-calculator/`.
- Добавлен расчёт средней скорости по расстоянию и времени, а также mph, м/с и темпа.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/transport/average-speed/ /tmp/calcup-average-speed-mobile.png`
- Static smoke через `rg` по `dist/transport/average-speed/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 27 files / 348 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/transport/average-speed/` canonical, robots и sitemap entry checked.
- Mobile screenshot — OK: поля, i18n-суффиксы и результат без overflow и наложений.

Commit hash:

- 75f9560

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/sport/race-split` или строительному P1.

### Итерация 14: `/sport/race-split`

Что выбрано:

- Закрыть следующий спортивный P1-инструмент: `/sport/race-split`.

Что изменено:

- Создан `src/features/race-split-calculator/`.
- Добавлен расчёт целевого темпа, средней скорости и контрольных отсечек по шагу сплита.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/sport/race-split/ /tmp/calcup-race-split-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/sport/race-split/ /tmp/calcup-race-split-mobile-full.png`
- Static smoke через `rg` по `dist/sport/race-split/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 28 files / 351 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/sport/race-split/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, список сплитов и result rows без overflow и наложений.

Commit hash:

- 17d6823

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size` или строительному P1.

### Итерация 15: `/construction/brick`

Что выбрано:

- Вернуться в строительный P1 roadmap и реализовать `/construction/brick`.

Что изменено:

- Создан `src/features/brick-calculator/`.
- Добавлен расчёт площади кладки, кирпичей до и после запаса, объёма кладки, ориентира раствора и стоимости кирпича.
- Добавлены пресеты стандартных размеров 250×120×65 / 88 / 138 мм.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/brick/ /tmp/calcup-brick-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/brick/ /tmp/calcup-brick-mobile-full.png`
- Static smoke через `rg` по `dist/construction/brick/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 29 files / 354 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/brick/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- 6317139

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/construction/drywall` или `/clothing/clothing-size`.

### Итерация 16: `/construction/drywall`

Что выбрано:

- Продолжить строительный P1 roadmap и реализовать `/construction/drywall`.

Что изменено:

- Создан `src/features/drywall-calculator/`.
- Добавлен расчёт чистой площади стены, листов ГКЛ с учётом слоёв и запаса, купленной площади, направляющего и стоечного профиля, саморезов и стоимости листов.
- Добавлены пресеты размеров листа 1.2×2.5 / 1.2×3.0 / 1.2×2.7 м и запаса 5 / 10 / 15%.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/drywall/ /tmp/calcup-drywall-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/drywall/ /tmp/calcup-drywall-mobile-full.png`
- Static smoke через `rg` по `dist/construction/drywall/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 30 files / 357 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/drywall/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- 1e154e3

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/construction/blocks` или `/construction/putty`.

### Итерация 17: `/construction/blocks`

Что выбрано:

- Продолжить строительный P1 roadmap и реализовать `/construction/blocks`.

Что изменено:

- Создан `src/features/blocks-calculator/`.
- Добавлен расчёт количества газоблоков/пеноблоков, объёма кладки, объёма блока, клея, мешков, запаса и стоимости.
- Добавлены пресеты размеров блока 600×250×300 / 600×200×300 / 600×250×200 мм и запаса 3 / 5 / 10%.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/blocks/ /tmp/calcup-blocks-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/blocks/ /tmp/calcup-blocks-mobile-full.png`
- Static smoke через `rg` по `dist/construction/blocks/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 31 files / 360 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/blocks/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- bcec9ce

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/construction/putty` или `/construction/insulation`.

### Итерация 18: `/construction/putty`

Что выбрано:

- Продолжить строительный P1 roadmap и реализовать `/construction/putty`.

Что изменено:

- Создан `src/features/putty-calculator/`.
- Добавлен расчёт расхода шпатлёвки/штукатурной смеси, количества мешков, покупаемого веса, остатка, запаса и стоимости.
- Добавлены пресеты толщины слоя 1 / 2 / 3 мм и веса мешка 5 / 20 / 25 кг.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/putty/ /tmp/calcup-putty-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/putty/ /tmp/calcup-putty-mobile-full.png`
- Static smoke через `rg` по `dist/construction/putty/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 32 files / 363 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/putty/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- 9c37203

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/construction/insulation`, `/clothing/clothing-size` или `/transport/ev-range`.

### Итерация 19: `/construction/insulation`

Что выбрано:

- Продолжить строительный P1 roadmap и реализовать `/construction/insulation`.

Что изменено:

- Создан `src/features/insulation-calculator/`.
- Добавлен расчёт плит утеплителя, упаковок, покупаемой площади, объёма, остатка и стоимости.
- Добавлены пресеты размеров плиты 1.2×0.6 / 1.0×0.6 / 1.2×0.5 м и толщины 50 / 100 / 150 мм.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/insulation/ /tmp/calcup-insulation-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/insulation/ /tmp/calcup-insulation-mobile-full.png`
- Static smoke через `rg` по `dist/construction/insulation/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 33 files / 366 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/insulation/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- d880d93

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/transport/ev-range`, `/clothing/clothing-size` или `/construction/concrete`.

### Итерация 20: `/transport/ev-range`

Что выбрано:

- Закрыть оставшийся транспортный `soon`-инструмент: `/transport/ev-range`.

Что изменено:

- Создан `src/features/ev-range-calculator/`.
- Добавлен расчёт доступной энергии, запаса хода в км и милях, дозарядки до целевого процента, стоимости зарядки и стоимости 100 км.
- Добавлены пресеты текущего заряда 30 / 50 / 80% и резерва 5 / 10 / 15%.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/transport/ev-range/ /tmp/calcup-ev-range-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/transport/ev-range/ /tmp/calcup-ev-range-mobile-full.png`
- Static smoke через `rg` по `dist/transport/ev-range/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 34 files / 369 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/transport/ev-range/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- f665b29

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/construction/concrete` или `/datetime/age`.

### Итерация 21: `/construction/concrete`

Что выбрано:

- Продолжить строительный roadmap и реализовать `/construction/concrete`.

Что изменено:

- Создан `src/features/concrete-calculator/`.
- Добавлен расчёт площади заливки, объёма бетона без запаса и с запасом, литров, мешков сухой смеси, остатка и стоимости.
- Добавлены пресеты толщины 80 / 120 / 150 мм и запаса 5 / 10 / 15%.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/concrete/ /tmp/calcup-concrete-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/concrete/ /tmp/calcup-concrete-mobile-full.png`
- Static smoke через `rg` по `dist/construction/concrete/index.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 35 files / 372 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/construction/concrete/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, пресеты, result rows и related cards без overflow и наложений.

Commit hash:

- 45c9836

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/datetime/age` или `/construction/strip-foundation`.

### Итерация 22: `/datetime/age`

Что выбрано:

- Усилить категорию `/datetime` вторым ready-инструментом: `/datetime/age`.

Что изменено:

- Создан `src/features/age-calculator/`.
- Добавлен расчёт календарного возраста, прожитых дней, полных недель, полных месяцев и следующего дня рождения.
- Для 29 февраля в невисокосный год следующий день рождения считается 28 февраля.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/datetime/age/ /tmp/calcup-age-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/datetime/age/ /tmp/calcup-age-mobile-full.png`
- Static smoke через `rg` по `dist/datetime/age.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 36 files / 376 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/datetime/age/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, result rows и related card без overflow и наложений.

Commit hash:

- 0bbdcfc

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/construction/strip-foundation` или `/datetime/workdays`.

### Итерация 23: `/datetime/workdays`

Что выбрано:

- Продолжить усиление категории `/datetime` и реализовать `/datetime/workdays`.

Что изменено:

- Создан `src/features/workdays-calculator/`.
- Добавлен расчёт рабочих дней Пн-Пт, выходных, календарных дней, полных недель и направления диапазона.
- Добавлен переключатель включения конечной даты.
- Праздники и переносы выходных не учитываются в первой версии и явно описаны в UI.
- Обновлены `src/data/calculators.ts`, `src/locales/ru.json`, `src/locales/en.json`.
- Обновлены `public/sitemap.xml`, `README.md` и active-планы.

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/datetime/workdays/ /tmp/calcup-workdays-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/datetime/workdays/ /tmp/calcup-workdays-mobile-full.png`
- Static smoke через `rg` по `dist/datetime/workdays.html` и sitemap.

Результат проверок:

- `npm run test` — OK, 37 files / 381 tests.
- `npm run type-check` — OK.
- `npm run build` — OK, Vite SSG rendered 87 pages.
- Static smoke — OK: `/datetime/workdays/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, toggle, result rows и related cards без overflow и наложений.

Commit hash:

- b05e876

Следующий шаг:

- Перейти к следующему high-value калькулятору: `/clothing/clothing-size`, `/construction/strip-foundation` или `/datetime/time-duration`.

### Итерация 24: sync MAIN_PLAN v2 и старт `/datetime/time-duration`

Что выбрано:

- Перечитать обновлённый `MAIN_PLAN.MD`.
- Синхронизировать `CODEX_MASTER_EXECPLAN.md` с новым обязательным backlog-форматом.
- Выбрать следующий низкорисковый milestone: `/datetime/time-duration`.

Почему выбран именно он:

- Категория `/datetime` уже открыта и хорошо масштабируется.
- Формулы длительностей общеизвестные, не требуют внешних нормативных источников.
- Риск ниже, чем у clothing sizes, construction P2/P3 и health/finance задач.

Что изменено:

- `CODEX_MASTER_EXECPLAN.md` приведён к новому формату: `Current Milestone`, `Pending`, `Completed`, `Deferred`, `Assumptions Log`.
- Current Milestone установлен в `datetime/time-duration` со статусом `in_progress`.

Затронутые файлы:

- `docs/plans/active/MAIN_PLAN.MD` прочитан как входной план, в commit не добавляется.
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`.

Команды:

- `git status --short`
- `sed -n ... docs/plans/active/MAIN_PLAN.MD`
- `rg --files docs/plans/active`
- `rg "status: 'ready'"`
- `rg "status: 'soon'"`

Результат проверок:

- Проверки кода не запускались: это подготовительный docs-sync перед реализацией калькулятора.

Commit hash:

- 71ffcea

Следующий шаг:

- Реализовать `/datetime/time-duration`.

### Итерация 25: `/datetime/time-duration`

Выбранный milestone:

- `/datetime/time-duration`.

Почему выбран именно он:

- Низкорисковая арифметика длительностей без внешних источников.
- Усиливает категорию `/datetime`.
- Хорошо покрывается unit-тестами на total seconds и нормализацию.

Что изменено:

- Создан `src/features/time-duration-calculator/`.
- Добавлены чистые функции сложения/вычитания длительностей, нормализации и форматирования `HH:MM:SS`.
- Добавлена поддержка отрицательного результата для вычитания.
- Registry-запись `time-duration` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.

Затронутые файлы:

- `src/features/time-duration-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор времени|Time Duration Calculator|canonical|robots|datetime/time-duration" dist/datetime/time-duration.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/datetime/time-duration/ /tmp/calcup-time-duration-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/datetime/time-duration/ /tmp/calcup-time-duration-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 38 files / 386 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/datetime/time-duration/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, operation chips, result rows и related cards без overflow и наложений.

Commit hash:

- 22935a2

Следующий шаг:

- Перейти к следующему low-risk milestone: `/datetime/countdown`.

### Итерация 26: `/datetime/countdown`

Выбранный milestone:

- `/datetime/countdown`.

Почему выбран именно он:

- Низкорисковая date-only арифметика без внешних источников.
- Закрывает оставшуюся `soon`-карточку в категории `/datetime`.
- Продолжает линейку дат после `date-diff`, `age`, `workdays` и `time-duration`.

Что изменено:

- Создан `src/features/countdown-calculator/`.
- Добавлены чистые функции расчёта дней до события, прошедших дней и статуса направления.
- Добавлена опция включения даты отсчёта для ненулевой разницы.
- Registry-запись `countdown` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/everyday/bill-split`.

Затронутые файлы:

- `src/features/countdown-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор дней до даты|Countdown Calculator|canonical|robots|datetime/countdown" dist/datetime/countdown.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/datetime/countdown/ /tmp/calcup-countdown-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/datetime/countdown/ /tmp/calcup-countdown-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 39 files / 391 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/datetime/countdown/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: date inputs, toggle, result rows и related cards без overflow и наложений.

Commit hash:

- a057264

Следующий шаг:

- Перейти к следующему low-risk milestone: `/everyday/bill-split`.

### Итерация 27: `/everyday/bill-split`

Выбранный milestone:

- `/everyday/bill-split`.

Почему выбран именно он:

- Низкорисковый бытовой high-value сценарий.
- Усиливает категорию `/everyday`, где уже есть `tips`, `discount` и `unit-price`.
- Не требует внешних нормативных источников.

Что изменено:

- Создан `src/features/bill-split-calculator/`.
- Добавлены чистые функции расчёта чаевых, сервисного сбора, общей суммы и доли на человека.
- Добавлено округление доли вверх до выбранного шага с расчётом запаса от округления.
- Registry-запись `bill-split` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/convert/volume`.

Затронутые файлы:

- `src/features/bill-split-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор разделения счёта|Bill Split Calculator|canonical|robots|everyday/bill-split" dist/everyday/bill-split.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/everyday/bill-split/ /tmp/calcup-bill-split-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/everyday/bill-split/ /tmp/calcup-bill-split-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 40 files / 395 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/everyday/bill-split/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: inputs, chips, result rows и related cards без overflow и наложений.

Commit hash:

- 80c4117

Следующий шаг:

- Перейти к следующему low-risk milestone: `/convert/volume`.

### Итерация 28: `/convert/volume`

Выбранный milestone:

- `/convert/volume`.

Почему выбран именно он:

- Низкорисковый справочный конвертер.
- Закрывает базовую `soon`-карточку в категории `/convert`.
- Не требует внешнего API или актуальных данных.

Что изменено:

- Создан `src/features/volume-converter/`.
- Добавлены чистые функции перевода объёма через литры.
- Поддержаны metric units и US liquid units.
- Registry-запись `volume` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/convert/speed`.

Затронутые файлы:

- `src/features/volume-converter/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Конвертер объёма|Volume Converter|canonical|robots|convert/volume" dist/convert/volume.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/convert/volume/ /tmp/calcup-volume-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/convert/volume/ /tmp/calcup-volume-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 41 files / 400 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/convert/volume/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: unit-grid, result rows и popular conversions без overflow и наложений.

Commit hash:

- 4d9567d

Следующий шаг:

- Перейти к следующему low-risk milestone: `/convert/speed`.

### Итерация 29: `/convert/speed`

Выбранный milestone:

- `/convert/speed`.

Почему выбран именно он:

- Низкорисковый справочный конвертер.
- Продолжает закрывать базовые `soon`-карточки в категории `/convert`.
- Не требует внешнего API или актуальных данных.

Что изменено:

- Создан `src/features/speed-converter/`.
- Добавлены чистые функции перевода скоростей через м/с.
- Поддержаны `km/h`, `m/s`, `mph`, `knots`, `ft/s` и `min/km`.
- Для pace `min/km` добавлена защита от нулевого значения.
- Registry-запись `speed` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/clothing/clothing-size`.

Затронутые файлы:

- `src/features/speed-converter/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Конвертер скорости|Speed Converter|canonical|robots|convert/speed" dist/convert/speed.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/convert/speed/ /tmp/calcup-speed-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/convert/speed/ /tmp/calcup-speed-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 42 files / 406 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/convert/speed/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: unit-grid, result rows и popular conversions без overflow и наложений.

Commit hash:

- decfac2

Следующий шаг:

- Перейти к следующему milestone: `/clothing/clothing-size`.

### Итерация 30: `/clothing/clothing-size`

Выбранный milestone:

- `/clothing/clothing-size`.

Почему выбран именно он:

- Следующий milestone из активного execplan.
- Усиливает категорию `/clothing`, где был только один готовый инструмент.
- High-risk часть ограничена: без брендов, с generic adult table и явным дисклеймером.

Что изменено:

- Создан `src/features/clothing-size-converter/`.
- Добавлена ориентировочная таблица INT, RU, EU, US, UK для XS-XXL.
- Добавлены диапазоны базовых мерок: грудь, талия, бёдра.
- Добавлен заметный warning-note про различия брендов, посадок и категорий изделий.
- Registry-запись `clothing-size` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- Shared `calculator-design-system.css` получил небольшой grid-gap для warning notes, чтобы текст предупреждений не слипался.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/sport/metronome`.

Затронутые файлы:

- `src/features/clothing-size-converter/**`
- `src/features/calculator-design-system.css`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-25-sport-clothing-roadmap.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Конвертер размеров одежды|Clothing Size Converter|canonical|robots|clothing/clothing-size" dist/clothing/clothing-size.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/clothing/clothing-size/ /tmp/calcup-clothing-size-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/clothing/clothing-size/ /tmp/calcup-clothing-size-mobile-full-2.png`

Результат тестов:

- `npm run test` — OK, 43 files / 409 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/clothing/clothing-size/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: system chips, select, warning note и result rows без overflow и наложений.

Commit hash:

- 507bfe4

Следующий шаг:

- Перейти к следующему milestone: `/sport/metronome`.

### Итерация 31: `/sport/metronome`

Выбранный milestone:

- `/sport/metronome`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Закрывает последний `soon` в категории `/sport`.
- Medium-risk из-за аудио: звук запускается только пользовательским действием, без autoplay.

Что изменено:

- Создан `src/features/metronome-calculator/`.
- Добавлены чистые функции расчёта BPM, интервала удара, длины такта, общего количества ударов и целевого каденса.
- Добавлен Web Audio click: высокий звук на первый удар такта, обычный звук на остальные.
- Добавлен старт/стоп, который работает только после клика пользователя.
- Registry-запись `metronome` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/construction/strip-foundation`.

Затронутые файлы:

- `src/features/metronome-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-25-sport-clothing-roadmap.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Метроном|Metronome|canonical|robots|sport/metronome" dist/sport/metronome.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/sport/metronome/ /tmp/calcup-metronome-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/sport/metronome/ /tmp/calcup-metronome-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 44 files / 413 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/sport/metronome/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: inputs, cadence chips, start button и result rows без overflow и наложений.
- Дополнительный click-smoke через Node `require('playwright')` не выполнен: в локальном окружении доступен CLI `npx playwright screenshot`, но пакет не резолвится как Node-модуль.

Commit hash:

- 8741b2d

Следующий шаг:

- Перейти к следующему milestone: `/construction/strip-foundation`.

### Итерация 32: `/construction/strip-foundation`

Выбранный milestone:

- `/construction/strip-foundation`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Закрывает важную construction-карточку после стабилизации базовых строительных материалов.
- High-risk scope ограничен ориентировочным материальным расчётом с явным дисклеймером.

Что изменено:

- Создан `src/features/strip-foundation-calculator/`.
- Добавлены чистые функции расчёта объёма бетона, песчаной подушки, площади опалубки, длины и веса продольной арматуры.
- Добавлены optional-стоимости бетона и арматуры.
- Добавлен warning-note: расчёт справочный и не заменяет проектирование, нормы и проверку специалистом.
- Registry-запись `strip-foundation` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/convert/data-size`.

Затронутые файлы:

- `src/features/strip-foundation-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-25-construction-roadmap.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Ленточный фундамент|Strip Foundation|canonical|robots|construction/strip-foundation" dist/construction/strip-foundation.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/construction/strip-foundation/ /tmp/calcup-strip-foundation-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/strip-foundation/ /tmp/calcup-strip-foundation-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 45 files / 417 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/construction/strip-foundation/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: warning note, поля, quick buttons и result rows без overflow и наложений.

Commit hash:

- 4755799

Следующий шаг:

- Перейти к следующему milestone: `/convert/data-size`.

### Итерация 33: `/convert/data-size`

Выбранный milestone:

- `/convert/data-size`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый конвертер без внешних API и нормативных источников.
- Закрывает ещё одну базовую карточку в категории `/convert`.

Что изменено:

- Создан `src/features/data-size-converter/`.
- Добавлены чистые функции конвертации через байты.
- Добавлены decimal-единицы KB/MB/GB/TB и binary-единицы KiB/MiB/GiB/TiB.
- Добавлен переключатель Decimal/Binary на shared chip-control без локального CSS.
- Registry-запись `data-size` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/everyday/room-area`.

Затронутые файлы:

- `src/features/data-size-converter/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Конвертер данных|Data Size Converter|canonical|robots|convert/data-size" dist/convert/data-size.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/convert/data-size/ /tmp/calcup-data-size-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/convert/data-size/ /tmp/calcup-data-size-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 46 files / 423 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/convert/data-size/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: Decimal/Binary chips, selects, result rows и popular conversions без overflow и наложений.

Commit hash:

- f1e8bda

Следующий шаг:

- Перейти к следующему milestone: `/everyday/room-area`.

### Итерация 34: `/everyday/room-area`

Выбранный milestone:

- `/everyday/room-area`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый бытовой сценарий с простыми геометрическими формулами.
- Усиливает категорию `/everyday` после `bill-split`.

Что изменено:

- Создан `src/features/room-area-calculator/`.
- Добавлены чистые функции расчёта площади пола, потолка, стен, проёмов и периметра.
- Добавлен clamp площади стен под отделку к 0, если проёмы больше площади стен.
- Добавлены быстрые высоты 2,5 / 2,7 / 3 м.
- Registry-запись `room-area` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/everyday/electricity`.

Затронутые файлы:

- `src/features/room-area-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор площади комнаты|Room Area Calculator|canonical|robots|everyday/room-area" dist/everyday/room-area.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/everyday/room-area/ /tmp/calcup-room-area-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/everyday/room-area/ /tmp/calcup-room-area-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 47 files / 427 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/everyday/room-area/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: поля, height chips, result rows и related cards без overflow и наложений.

Commit hash:

- 3c38f5a

Следующий шаг:

- Перейти к следующему milestone: `/everyday/electricity`.

### Итерация 35: `/everyday/electricity`

Выбранный milestone:

- `/everyday/electricity`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- P1 бытовой сценарий с простыми формулами мощности, времени и тарифа.
- Закрывает ещё одну карточку `/everyday` без внешних данных.

Что изменено:

- Создан `src/features/electricity-calculator/`.
- Добавлены чистые функции расчёта кВт⋅ч и стоимости в день, месяц и год.
- Добавлены быстрые пресеты мощности 60 / 1000 / 2000 Вт и времени 1 / 4 / 8 ч.
- Registry-запись `electricity` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/everyday/cooking-units`.

Затронутые файлы:

- `src/features/electricity-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор электроэнергии|Electricity Calculator|canonical|robots|everyday/electricity" dist/everyday/electricity.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/everyday/electricity/ /tmp/calcup-electricity-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/everyday/electricity/ /tmp/calcup-electricity-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 48 files / 431 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/everyday/electricity/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: power/time chips, tariff suffix, result rows и related cards без overflow и наложений.

Commit hash:

- 432bbab

Следующий шаг:

- Перейти к следующему milestone: `/everyday/cooking-units`.

### Итерация 36: `/everyday/cooking-units`

Выбранный milestone:

- `/everyday/cooking-units`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый бытовой конвертер без внешних данных.
- Закрывает последнюю `soon`-карточку в категории `/everyday`.

Что изменено:

- Создан `src/features/cooking-units-calculator/`.
- Добавлены чистые функции конвертации объёмных кухонных мер через миллилитры.
- Добавлены мл, л, чайные/столовые ложки, cup, US fl oz, pint и quart.
- Добавлено предупреждение, что граммы не переводятся без продукта и плотности.
- Registry-запись `cooking-units` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/math/fraction`.

Затронутые файлы:

- `src/features/cooking-units-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор мер для кухни|Cooking Units Calculator|canonical|robots|everyday/cooking-units" dist/everyday/cooking-units.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/everyday/cooking-units/ /tmp/calcup-cooking-units-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/everyday/cooking-units/ /tmp/calcup-cooking-units-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 49 files / 436 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/everyday/cooking-units/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: selects, swap button, result rows и popular conversions без overflow и наложений.

Commit hash:

- 15328d1

Следующий шаг:

- Перейти к следующему milestone: `/math/fraction`.

### Итерация 37: `/math/fraction`

Выбранный milestone:

- `/math/fraction`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый P1 math-инструмент без внешних данных.
- Усиливает категорию `/math`, где до этого был один ready-калькулятор.

Что изменено:

- Создан `src/features/fraction-calculator/`.
- Добавлены чистые функции GCD, нормализации дроби и операций add/subtract/multiply/divide.
- Добавлены сокращённая дробь, смешанное число для неправильной дроби и десятичное значение.
- Добавлена валидация целых чисел, нулевого знаменателя и деления на нулевую дробь.
- Registry-запись `fraction` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/math/average`.

Затронутые файлы:

- `src/features/fraction-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор дробей|Fraction Calculator|canonical|robots|math/fraction" dist/math/fraction.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/math/fraction/ /tmp/calcup-fraction-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/math/fraction/ /tmp/calcup-fraction-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 50 files / 443 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/math/fraction/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: fraction fields, operation chips, result rows и popular examples без overflow и наложений.

Commit hash:

- 424f442

Следующий шаг:

- Перейти к следующему milestone: `/math/average`.

### Итерация 38: `/math/average`

Выбранный milestone:

- `/math/average`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый P1 math-инструмент на базовой статистике.
- Продолжает расширение категории `/math` после дробей.

Что изменено:

- Создан `src/features/average-calculator/`.
- Добавлены чистые функции парсинга списка чисел и расчёта count, sum, mean, median, min, max и range.
- Добавлена поддержка пробелов, строк, `;`, запятой с пробелом и десятичной запятой.
- Общий `calculator-design-system.css` расширен поддержкой textarea для калькуляторов со списками.
- Registry-запись `average` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/math/proportion`.

Затронутые файлы:

- `src/features/average-calculator/**`
- `src/features/calculator-design-system.css`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор среднего|Average Calculator|canonical|robots|math/average" dist/math/average.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/math/average/ /tmp/calcup-average-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/math/average/ /tmp/calcup-average-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 51 files / 449 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/math/average/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: textarea, example chips, result rows и related cards без overflow и наложений.

Commit hash:

- eba45a8

Следующий шаг:

- Перейти к следующему milestone: `/math/proportion`.

### Итерация 39: `/math/proportion`

Выбранный milestone:

- `/math/proportion`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Низкорисковый P1 math-инструмент.
- Продолжает закрывать math-кластер после дробей и среднего.

Что изменено:

- Создан `src/features/proportion-calculator/`.
- Добавлены чистые функции для правила трёх, упрощения integer ratio и GCD.
- Добавлены результат X, коэффициент B/A, отношение A:B и C как процент от A.
- Добавлена валидация finite input и запрет A = 0.
- Registry-запись `proportion` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/math/equation`.

Затронутые файлы:

- `src/features/proportion-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор пропорций|Proportion Calculator|canonical|robots|math/proportion" dist/math/proportion.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/math/proportion/ /tmp/calcup-proportion-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/math/proportion/ /tmp/calcup-proportion-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 52 files / 454 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/math/proportion/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: fields, result rows, examples и related cards без overflow и наложений.

Commit hash:

- 69aea4d

Следующий шаг:

- Перейти к следующему milestone: `/math/equation`.

### Итерация 40: `/math/equation`

Выбранный milestone:

- `/math/equation`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Последняя `soon`-карточка в категории `/math`.
- Низкорисковый математический сценарий без внешних источников.

Что изменено:

- Создан `src/features/equation-calculator/`.
- Добавлены чистые функции для линейного `ax + b = 0` и квадратного `ax² + bx + c = 0`.
- Добавлены вырожденные случаи: нет решений, бесконечно много решений, квадратное с `a = 0`.
- Добавлены дискриминант, действительные корни и формула решения.
- Registry-запись `equation` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/health/calorie`.

Затронутые файлы:

- `src/features/equation-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор уравнений|Equation Calculator|canonical|robots|math/equation" dist/math/equation.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/math/equation/ /tmp/calcup-equation-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/math/equation/ /tmp/calcup-equation-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 53 files / 461 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/math/equation/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: mode chips, fields, result rows и related cards без overflow и наложений.

Commit hash:

- 14ae2ed

Следующий шаг:

- Перейти к следующему milestone: `/health/calorie`.

### Итерация 41: `/health/calorie`

Выбранный milestone:

- `/health/calorie`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Health оставался категорией с одним ready-инструментом.
- P1-карточка с понятным scope: BMR, TDEE и цель по дневному delta.

Что изменено:

- Создан `src/features/calorie-calculator/`.
- Добавлены чистые функции для BMR по Mifflin-St Jeor, TDEE через activity factor и целевых калорий.
- Добавлены activity chips, goal chips, профиль пользователя и health warning-note.
- Registry-запись `calorie` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/health/ideal-weight`.

Затронутые файлы:

- `src/features/calorie-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор калорий|Calorie Calculator|canonical|robots|health/calorie" dist/health/calorie.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/health/calorie/ /tmp/calcup-calorie-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/health/calorie/ /tmp/calcup-calorie-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 54 files / 467 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/health/calorie/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: profile/activity/goal chips, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- 38748f4

Следующий шаг:

- Перейти к следующему milestone: `/health/ideal-weight`.

### Итерация 42: `/health/ideal-weight`

Выбранный milestone:

- `/health/ideal-weight`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- P1 health-инструмент и логичное продолжение после `/health/calorie`.
- Scope ограничен справочными формулами и BMI-диапазоном с дисклеймером.

Что изменено:

- Создан `src/features/ideal-weight-calculator/`.
- Добавлены чистые функции для Devine, Robinson, Miller, Hamwi и BMI-диапазона 18.5-24.9.
- Добавлены среднее по формулам, диапазон формул и health warning-note.
- Registry-запись `ideal-weight` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/finance/mortgage`.

Затронутые файлы:

- `src/features/ideal-weight-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор идеального веса|Ideal Weight Calculator|canonical|robots|health/ideal-weight" dist/health/ideal-weight.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/health/ideal-weight/ /tmp/calcup-ideal-weight-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/health/ideal-weight/ /tmp/calcup-ideal-weight-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 55 files / 472 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/health/ideal-weight/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: sex chips, height field, warning note, formula rows и related cards без overflow и наложений.

Commit hash:

- fce19d8

Следующий шаг:

- Перейти к следующему milestone: `/finance/mortgage`.

### Итерация 43: `/finance/mortgage`

Выбранный milestone:

- `/finance/mortgage`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- High-value finance-карточка.
- Формула аннуитетного платежа уже соответствует существующей кредитной математике.

Что изменено:

- Создан `src/features/mortgage-calculator/`.
- Добавлены чистые функции для первоначального взноса, суммы кредита, аннуитетного платежа, общей выплаты и переплаты.
- Добавлены быстрые пресеты первоначального взноса 10 / 15 / 20 / 30%.
- Добавлен finance warning-note про комиссии, страховки, субсидии и условия банка.
- Registry-запись `mortgage` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/finance/deposit`.

Затронутые файлы:

- `src/features/mortgage-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Ипотечный калькулятор|Mortgage Calculator|canonical|robots|finance/mortgage" dist/finance/mortgage.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/finance/mortgage/ /tmp/calcup-mortgage-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/finance/mortgage/ /tmp/calcup-mortgage-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 56 files / 477 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/finance/mortgage/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: fields, down-payment chips, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- a5cd618

Следующий шаг:

- Перейти к следующему milestone: `/finance/deposit`.

### Итерация 44: `/finance/deposit`

Выбранный milestone:

- `/finance/deposit`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Продолжает finance-кластер после ипотеки.
- Формулы простого процента и ежемесячной капитализации не требуют внешних ставок.

Что изменено:

- Создан `src/features/deposit-calculator/`.
- Добавлены чистые функции для дохода без капитализации, суммы с ежемесячной капитализацией, итоговой суммы и роста за срок.
- Добавлены быстрые пресеты срока 3 / 6 / 12 / 24 месяца.
- Добавлен выбор режима начисления: без капитализации или ежемесячная капитализация.
- Добавлен finance warning-note про налоги, комиссии, пополнения, снятия, бонусные ставки и условия банка.
- Registry-запись `deposit` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/finance/compound-interest`.

Затронутые файлы:

- `src/features/deposit-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор вклада|Deposit Calculator|canonical|robots|finance/deposit" dist/finance/deposit.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/finance/deposit/ /tmp/calcup-deposit-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/finance/deposit/ /tmp/calcup-deposit-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 57 files / 482 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/finance/deposit/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: amount/rate/term fields, term/mode chips, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- 7c68b46

Следующий шаг:

- Перейти к следующему milestone: `/finance/compound-interest`.

### Итерация 45: `/finance/compound-interest`

Выбранный milestone:

- `/finance/compound-interest`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Продолжает накопительные finance-сценарии после вклада.
- Добавляет отдельный сценарий с регулярными пополнениями, не дублируя депозит.

Что изменено:

- Создан `src/features/compound-interest-calculator/`.
- Добавлены чистые функции для собственных взносов, будущей стоимости, процентного дохода и роста к взносам.
- Использована ежемесячная капитализация с пополнением в конце месяца.
- Добавлены быстрые пресеты срока 1 / 3 / 5 / 10 лет.
- Добавлен finance warning-note про налоги, комиссии, инфляцию, риск, изменение ставки и фактическую доходность.
- Registry-запись `compound-interest` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/finance/refinance`.

Затронутые файлы:

- `src/features/compound-interest-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор сложного процента|Compound Interest Calculator|canonical|robots|finance/compound-interest" dist/finance/compound-interest.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/finance/compound-interest/ /tmp/calcup-compound-interest-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/finance/compound-interest/ /tmp/calcup-compound-interest-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 58 files / 487 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/finance/compound-interest/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: initial/contribution/rate/term fields, term chips, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- c314a72

Следующий шаг:

- Перейти к следующему milestone: `/finance/refinance`.

### Итерация 46: `/finance/refinance`

Выбранный milestone:

- `/finance/refinance`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Закрывает последний finance `soon`.
- Полезен после кредитного, ипотечного и накопительных сценариев.

Что изменено:

- Создан `src/features/refinance-calculator/`.
- Добавлены чистые функции для аннуитетного платежа, старой/новой общей выплаты, экономии, месячной разницы и окупаемости расходов.
- Добавлен finance warning-note про штрафы, страховки, изменение графика, досрочные погашения и условия банка.
- Registry-запись `refinance` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/health/body-fat`.

Затронутые файлы:

- `src/features/refinance-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор рефинансирования|Refinance Calculator|canonical|robots|finance/refinance" dist/finance/refinance.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/finance/refinance/ /tmp/calcup-refinance-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/finance/refinance/ /tmp/calcup-refinance-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 59 files / 491 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/finance/refinance/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: loan fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- d2f9d4a

Следующий шаг:

- Перейти к следующему milestone: `/health/body-fat`.

### Итерация 47: `/health/body-fat`

Выбранный milestone:

- `/health/body-fat`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Finance-кластер закрыт, а в health оставались `soon`-карточки.
- Сценарий полезный, но требует осторожного health warning-note.

Что изменено:

- Создан `src/features/body-fat-calculator/`.
- Добавлены чистые функции для оценки процента жира по US Navy circumference method.
- Добавлена категория результата, а также жировая и безжировая масса при указанном весе.
- Добавлен health warning-note про справочный характер расчёта и ограничения метода.
- Registry-запись `body-fat` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/health/pregnancy-due-date`.

Затронутые файлы:

- `src/features/body-fat-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор процента жира|Body Fat Calculator|canonical|robots|health/body-fat" dist/health/body-fat.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 http://127.0.0.1:4173/health/body-fat/ /tmp/calcup-body-fat-mobile.png`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/health/body-fat/ /tmp/calcup-body-fat-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 60 files / 496 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/health/body-fat/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: sex chips, measurement fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- 6107642

Следующий шаг:

- Перейти к следующему milestone: `/health/pregnancy-due-date`.

### Итерация 48: `/health/pregnancy-due-date`

Выбранный milestone:

- `/health/pregnancy-due-date`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Закрывает оставшуюся health `soon`-карточку.
- Health-сценарий полезный, но требует осторожного warning-note и ограниченного scope.

Что изменено:

- Создан `src/features/pregnancy-due-date-calculator/`.
- Добавлены чистые date-only функции для расчёта ориентировочной даты родов по LMP и дате зачатия.
- Добавлены расчёт срока беременности, триместра, дней до ПДР и статуса timeline.
- Добавлен health warning-note: расчёт ориентировочный и не заменяет УЗИ, врача и индивидуальное ведение беременности.
- Registry-запись `pregnancy-due-date` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/construction/rebar`.

Затронутые файлы:

- `src/features/pregnancy-due-date-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор срока беременности|Pregnancy Due Date Calculator|canonical|robots|health/pregnancy-due-date" dist/health/pregnancy-due-date.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/health/pregnancy-due-date/ /tmp/calcup-pregnancy-due-date-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 61 files / 503 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/health/pregnancy-due-date/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: method chips, date fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- f2d4795

Следующий шаг:

- Перейти к следующему milestone: `/construction/rebar`.

### Итерация 49: `/construction/rebar`

Выбранный milestone:

- `/construction/rebar`.

Почему выбран именно он:

- Текущий milestone из `CODEX_MASTER_EXECPLAN.md`.
- Health `soon` закрыт, поэтому работа вернулась к самому большому construction backlog.
- Rebar полезен как отдельный закупочный ориентир и как база для плитного фундамента.

Что изменено:

- Создан `src/features/rebar-calculator/`.
- Добавлены чистые функции для подсчёта линий прямоугольной сетки, длины, закупочных прутков, массы и стоимости.
- Масса считается через площадь круга и плотность стали 7850 кг/м³.
- Добавлен construction warning-note: расчёт не заменяет проект, нормы, анкеровку, нахлёсты, защитный слой и инженерную проверку.
- Registry-запись `rebar` переведена в `ready`.
- Обновлены RU/EN локали, sitemap и README.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий Current Milestone `/construction/slab-foundation`.

Затронутые файлы:

- `src/features/rebar-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`

Команды:

- `npm run test`
- `npm run type-check`
- `npm run build`
- `rg -n "Калькулятор арматуры|Rebar Calculator|canonical|robots|construction/rebar" dist/construction/rebar.html public/sitemap.xml dist/sitemap.xml`
- `npx playwright screenshot --viewport-size=430,932 --full-page http://127.0.0.1:4173/construction/rebar/ /tmp/calcup-rebar-mobile-full.png`

Результат тестов:

- `npm run test` — OK, 62 files / 508 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 87 pages.

Результат smoke-проверок:

- Static smoke — OK: `/construction/rebar/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: spacing/diameter/waste chips, fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- c13fdf5

Следующий шаг:

- Перейти к следующему milestone: `/construction/slab-foundation`.

### Итерация 50: `/animals/dog-age` + `/animals/cat-age`

Выбранный milestone:

- Запуск нового раздела `/animals` через первые два безопасных age-калькулятора.

Почему выбран именно он:

- Пользователь попросил приступить к реализации реестра OmniCalculator expansion.
- В новом плане `2026-04-26-omnicalculator-expansion-registry.md` первыми стоят `/animals/dog-age` и `/animals/cat-age`.
- Age-калькуляторы дают разделу реальную пользу без ветеринарных рисков дозировок и экстренных рекомендаций.

Что изменено:

- Добавлена категория `animals` / «Животные».
- Создан `src/features/dog-age-calculator/`.
- Создан `src/features/cat-age-calculator/`.
- Добавлены формулы:
  - dog age: 15/24 и +4/+5/+6/+7 человеческих лет за год после 2 лет в зависимости от размера;
  - cat age: 15/24/+4.
- Добавлен life stage для собаки и кошки.
- Добавлены animal-care warning notes.
- Registry получил `dog-age` и `cat-age` в статусе `ready`.
- Обновлены RU/EN локали, sitemap, README и active-планы.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий animal milestone `/animals/dog-food`.

Затронутые файлы:

- `src/features/dog-age-calculator/**`
- `src/features/cat-age-calculator/**`
- `src/data/types.ts`
- `src/data/categories.ts`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-26-omnicalculator-expansion-registry.md`

Команды:

- `npm run test -- dog-age cat-age registry`
- `npm run test`
- `npm run type-check`
- `npm run build`

Результат тестов:

- Точечный `npm run test -- dog-age cat-age registry` — OK, 3 files / 10 tests.
- `npm run test` — OK, 64 files / 515 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 90 pages.

Результат smoke-проверок:

- Static smoke — OK: `/animals/dog-age/` и `/animals/cat-age/` canonical, robots и sitemap entries checked.
- Mobile full-page screenshots — OK: dog size chips, age fields, warning notes, result rows и related cards без overflow и наложений.

Commit hash:

- `0c435fa`

Следующий шаг:

- После зелёных проверок закоммитить запуск `animals` и перейти к `/animals/dog-food`.

### Итерация 51: `/animals/dog-food`

Выбранный milestone:

- `/animals/dog-food`.

Почему выбран именно он:

- Это следующий P0 из OmniCalculator expansion registry после запуска `dog-age` и `cat-age`.
- Делает раздел `/animals` практичным: не только "интересный возраст", но и ежедневный pet-care расчёт.
- Формулы можно держать прозрачными и тестируемыми без назначения лечебного питания.

Что изменено:

- Создан `src/features/dog-food-calculator/`.
- Добавлены чистые функции для RER, множителя профиля, дневных калорий и граммов корма.
- Добавлены профили активности/возраста: weight loss, neutered adult, intact adult, active, puppies and senior.
- Добавлен вычет доли лакомств из калорий основного корма.
- Добавлен animal-care warning-note.
- Registry-запись `dog-food` добавлена в `ready`.
- Обновлены RU/EN локали, sitemap, README и active-планы.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий animal milestone `/animals/cat-calorie`.

Затронутые файлы:

- `src/features/dog-food-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-26-omnicalculator-expansion-registry.md`

Команды:

- `npm run test -- dog-food registry`
- `npm run test`
- `npm run type-check`
- `npm run build`

Результат тестов:

- Точечный `npm run test -- dog-food registry` — OK, 2 files / 8 tests.
- `npm run test` — OK, 65 files / 520 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 91 pages.

Результат smoke-проверок:

- Static smoke — OK: `/animals/dog-food/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: profile chips, food fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- `69192b5`

Следующий шаг:

- После зелёных проверок закоммитить `/animals/dog-food` и перейти к `/animals/cat-calorie`.

### Итерация 52: `/animals/cat-calorie`

Выбранный milestone:

- `/animals/cat-calorie`.

Почему выбран именно он:

- Это следующий P0 из OmniCalculator expansion registry после `/animals/dog-food`.
- Закрывает симметричную pet-care пару для кошек: калории и граммы корма по весу, профилю и калорийности.
- Формула RER прозрачна, легко тестируется и может быть подана как ориентир без лечебных назначений.

Что изменено:

- Создан `src/features/cat-calorie-calculator/`.
- Добавлены чистые функции для RER, множителя профиля, дневных калорий и граммов корма.
- Добавлены профили: снижение веса, стерилизованная взрослая, нестерилизованная взрослая, активная, котёнок до 4 месяцев, котёнок 4-12 месяцев, пожилая.
- Добавлен вычет доли лакомств из калорий основного корма.
- Добавлен animal-care warning-note про плавные изменения рациона и сверку с ветеринаром.
- Registry-запись `cat-calorie` добавлена в `ready`.
- Обновлены RU/EN локали, sitemap, README и active-планы.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий animal milestone `/animals/dog-pregnancy`.

Затронутые файлы:

- `src/features/cat-calorie-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-26-omnicalculator-expansion-registry.md`

Команды:

- `npm run test -- cat-calorie registry`
- `npm run test`
- `npm run type-check`
- `npm run build`

Результат тестов:

- Точечный `npm run test -- cat-calorie registry` — OK, 2 files / 8 tests.
- `npm run test` — OK, 66 files / 525 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 92 pages.

Результат smoke-проверок:

- Static smoke — OK: `/animals/cat-calorie/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: profile chips, food fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- `60b715f`

Следующий шаг:

- После зелёных проверок закоммитить `/animals/cat-calorie` и перейти к `/animals/dog-pregnancy`.

### Итерация 53: `/animals/dog-pregnancy`

Выбранный milestone:

- `/animals/dog-pregnancy`.

Почему выбран именно он:

- Это следующий P0 из OmniCalculator expansion registry после age/food animal-блока.
- Калькулятор date-based и не требует дозировок, поэтому его можно безопасно подать как ориентир с ветеринарным warning-note.
- Источники по срокам сверены перед реализацией: Merck Veterinary Manual указывает около 62-64 дней, VCA — 57-65 дней со средним 63, Cornell — среднее около 63 дней от овуляции.

Что изменено:

- Создан `src/features/dog-pregnancy-calculator/`.
- Добавлены date-only функции для ISO-дат, прибавления дней и расчёта разницы в UTC.
- Добавлены режимы: дата вязки и дата подтверждённой овуляции.
- Добавлен расчёт средней даты родов, окна щенения, дня от выбранной даты, дней до средней даты и этапа timeline.
- Для даты вязки используется окно 57-65 дней; для овуляции — 62-64 дня.
- Добавлен animal-care warning-note с признаками срочного обращения к ветеринару.
- Registry-запись `dog-pregnancy` добавлена в `ready`.
- Обновлены RU/EN локали, sitemap, README и active-планы.
- `CODEX_MASTER_EXECPLAN.md` переведён на следующий animal milestone `/animals/cat-pregnancy`.

Затронутые файлы:

- `src/features/dog-pregnancy-calculator/**`
- `src/data/calculators.ts`
- `src/locales/ru.json`
- `src/locales/en.json`
- `public/sitemap.xml`
- `README.md`
- `docs/plans/active/CODEX_MASTER_EXECPLAN.md`
- `docs/plans/active/CODEX_WORKLOG.md`
- `docs/plans/active/2026-04-25-project-status.md`
- `docs/plans/active/2026-04-25-product-aggregator-plan.md`
- `docs/plans/active/2026-04-26-omnicalculator-expansion-registry.md`

Команды:

- `npm run test -- dog-pregnancy registry`
- `npm run test`
- `npm run type-check`
- `npm run build`

Результат тестов:

- Точечный `npm run test -- dog-pregnancy registry` — OK, 2 files / 11 tests.
- `npm run test` — OK, 67 files / 533 tests.

Результат type-check:

- `npm run type-check` — OK.

Результат build:

- `npm run build` — OK, Vite SSG rendered 93 pages.

Результат smoke-проверок:

- Static smoke — OK: `/animals/dog-pregnancy/` canonical, robots и sitemap entry checked.
- Mobile full-page screenshot — OK: mode chips, date fields, warning note, result rows и related cards без overflow и наложений.

Commit hash:

- `713a201`

Следующий шаг:

- После зелёных проверок закоммитить `/animals/dog-pregnancy` и перейти к `/animals/cat-pregnancy`.
