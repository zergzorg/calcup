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
