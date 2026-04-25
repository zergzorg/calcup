# PROJECT_STATUS

## Текущая фаза: 4.6 завершена, ожидание Phase 4.7

## Готовые калькуляторы

| Фаза | Калькулятор | Путь | Статус |
|------|-------------|------|--------|
| 4.1 | Кредитный | /finance/credit | ✅ ready |
| 4.2 | ИМТ | /health/bmi | ✅ ready |
| 4.3 | Конвертер длины | /convert/length | ✅ ready |
| 4.4 | Расход топлива | /transport/fuel | ✅ ready |
| 4.5 | Разница дат | /datetime/date-diff | ✅ ready |
| 4.6 | НДС | /finance/vat | ✅ ready |
| 4.3 | Калькулятор процентов | /math/percentage | ✅ ready |

## Sitemap

- / (главная)
- /finance/
- /math/
- /health/
- /convert/
- /transport/
- /datetime/
- /finance/credit/
- /finance/vat/
- /math/percentage/
- /health/bmi/
- /convert/length/
- /transport/fuel/
- /datetime/date-diff/

## Сделано (Фаза 4.6) — 2026-04-25

- `src/features/vat-calculator/` — полный модуль: types, calculations, composable, view, index
- Режимы: начислить НДС (add) и выделить НДС (extract)
- Ставки: 20%, 10%, 0%, произвольная (custom)
- Точные финансовые расчёты: `round2()`, формула выделения через деление
- 26 unit-тестов (101/101 с предыдущими), тип-чек, сборка
- Playwright: 7/7 проверок прошли
- Registry: `vat` → `status: 'ready'`, `popularity: 86`, теги/алиасы
- Локали: ru.json + en.json ключи `vat.*`
- Sitemap: добавлен `/finance/vat/`
- Коммит: `0fc2fab feat: phase 4.6 — VAT calculator /finance/vat`

## Сделано (Фаза 4.5) — 2026-04-25

- `src/features/date-diff-calculator/` — полный модуль
- UTC-safe парсинг: `Date.UTC()` + round-trip `getUTC*` валидация
- Breakdown: годы → месяцы → дни с учётом коротких месяцев и високосных лет
- SSG hydration fix: инициализация в `onMounted`, не на уровне модуля
- 28 unit-тестов (101 всего), тип-чек, сборка, Playwright 8/8
- Коммит: `ca0cded Add ready calculators`

## Сделано (Фаза 4.4) — 2026-04-25

- `src/features/fuel-calculator/` — полный модуль
- Режимы: расход л/100км, нужно литров, стоимость поездки
- Дефолты заполнены на старте (prefilled defaults)
- `src/style.css`: глобальное скрытие спиннеров number input
- Sitemap: /transport/ + /transport/fuel/

## Ожидает (Phase 4.7)

Следующий калькулятор не определён. Возможные кандидаты: ипотечный (/finance/mortgage), конвертер веса, конвертер температуры.
