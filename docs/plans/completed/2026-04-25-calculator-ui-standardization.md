# Calculator UI Standardization

Status: completed
Created: 2026-04-25
Scope: привести страницы калькуляторов Calcup к единому визуальному стандарту и зафиксировать правила для будущих калькуляторов

## Overview

Задача началась с визуального расхождения между калькуляторами: разные поля ввода, селекторы, переключатели, кнопки, правые итоговые блоки и печатная форма кредитного калькулятора. Нужно было сделать один стандарт интерфейса для всех текущих и будущих калькуляторов, привести к нему существующие страницы и проверить результат во всех основных состояниях.

## What Changed

- Добавлен единый CSS-контракт калькуляторов:
  - `src/features/calculator-design-system.css`
- Глобально подключён стандарт:
  - `src/style.css`
- Добавлены правила для будущих агентов и калькуляторов:
  - `AGENTS.md`
- Кредитный калькулятор перестроен под общий layout:
  - левый рабочий стол формы;
  - правый итоговый блок;
  - единый стиль result rows;
  - удалён лишний PDF-инфоблок;
  - график платежей получил корректную кнопку раскрытия.
- Печатная форма кредитного калькулятора приведена к A4-документу:
  - скрыта обычная шапка сайта;
  - добавлен компактный бренд Calcup;
  - добавлен адрес `calcup.ru`;
  - убран watermark;
  - таблица оставлена плотной и полезной для печати.
- Меню `Калькуляторы` в шапке переписано на стабильное pointer-поведение:
  - без flicker на кнопке;
  - без мёртвой зоны между кнопкой и выпадашкой;
  - закрывается только после выхода курсора из кнопки/моста/меню.

## Files

### Created

- `AGENTS.md`
- `src/features/calculator-design-system.css`
- `docs/plans/completed/2026-04-25-calculator-ui-standardization.md`

### Modified

- `src/style.css`
- `src/components/layout/AppHeader.vue`
- `src/features/credit-calculator/components/CreditCalculatorView.vue`
- `src/features/credit-calculator/components/CreditResults.vue`
- `src/features/credit-calculator/components/CreditScheduleTable.vue`
- `src/features/credit-calculator/components/CreditPrintView.vue`
- `src/features/credit-calculator/credit-calculator.css`

## Validation

- `npm run type-check` — OK.
- `npm test` — OK, 15 files / 297 tests.
- `npm run build` — OK.
- Playwright full audit — OK:
  - 28 routes;
  - 3 viewports: desktop, tablet, mobile;
  - 84 checks total;
  - 0 failures;
  - 0 console errors;
  - 0 page errors.
- Playwright credit regression — OK:
  - result panel does not overlap actions;
  - PDF-info block is absent;
  - at 60 months there is no `Show all` button;
  - at 72 months the button appears below the table, full width, and expands to 72 rows.
- Playwright header menu regression — OK:
  - moving inside the `Калькуляторы` button does not flicker;
  - moving directly into the dropdown keeps it open;
  - moving outside closes it.
- Playwright print regression — OK:
  - site header hidden in print;
  - print header visible;
  - logo renders as 24x24;
  - `Calcup` and `calcup.ru` are present;
  - print grid and schedule table do not overlap.

## Residual Notes

- `tableOverflowX: true` is expected for wide payment schedule tables: the table is intentionally horizontally scrollable inside `.credit-table-wrap`, while the page itself has no horizontal overflow in the full-route audit.
- Older roadmap documents remain active because they describe broader product/architecture work and are not completed by this UI standardization task.

## Completion Notes

Completed on 2026-04-25 after final project audit. The UI contract is now documented in code and referenced from `AGENTS.md`; current calculator pages are aligned with it, and future calculators have a single source of visual rules.
