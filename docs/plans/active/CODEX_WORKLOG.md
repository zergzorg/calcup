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
