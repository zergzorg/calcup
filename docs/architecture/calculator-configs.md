# Calculator Config Architecture

`src/config` is the source of truth for reusable calculator data:

- `rates/*.json` — нормативные ставки, лимиты, финансовые допущения и даты актуальности.
- `units/*.json` — единицы измерения и коэффициенты пересчёта.
- `presets/*.json` — UI-пресеты и быстрые варианты.
- `catalogs/*.json` — справочники материалов, коэффициентов и доменных констант.

Calculator code should import typed facades from `src/config/index.ts` or feature-specific adapters. Formula modules keep pure functions, but no longer own shared rates, unit factors or long-lived reference data.

Rules:

- A config value used by more than one calculator, or likely to change by year/source, lives in `src/config`.
- Defaults that represent an external assumption (tax rate, key rate, inflation, production calendar, material density) live in config even if only one calculator currently uses them.
- JSON stores data only; TypeScript modules adapt it to feature types.
- Tests assert formula behavior and important config constants.
- Text that explains assumptions remains in locales, but should reference the same date/rate as the config.
