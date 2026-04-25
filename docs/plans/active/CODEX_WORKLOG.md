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
