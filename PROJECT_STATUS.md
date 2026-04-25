# PROJECT_STATUS

## Текущая фаза: 4.9 завершена, ожидание Phase 4.10

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

## Sitemap

- / (главная)
- /finance/
- /math/
- /health/
- /convert/
- /transport/
- /datetime/
- /everyday/
- /everyday/tips/
- /finance/credit/
- /finance/vat/
- /math/percentage/
- /health/bmi/
- /convert/length/
- /convert/temperature/
- /convert/weight/
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

## Внеплановая задача: редизайн главной страницы — 2026-04-25

**Мотивация:** Пользователь сравнил с Omni Calculator — хотел более компактный layout,
одно большое поле поиска прямо в hero, без дублирования поиска в шапке.

**Изменённые файлы:**
- `src/views/HomeView.vue` — полный рефакторинг hero-секции:
  - Убрана кнопка-заглушка, открывавшая SearchModal
  - Добавлен полноширинный поисковый инпут (max-w-2xl, `py-3.5`) с shadow и focus-ring
  - Inline-поиск: результаты показываются в дропдауне прямо под полем, модалка не открывается
  - `useSearch()` подключён напрямую в HomeView; `searchOpen` — локальный ref
  - Дропдаун закрывается через `@focusout` + `@mousedown.prevent` на ссылках (blur-before-click race)
  - Кнопка очистки (×) появляется при наличии текста в поле
  - Отступы в hero: `pt-8 pb-6` вместо `py-16`; секции: `py-8` вместо `py-12`
  - Удалён `inject('openSearch')` — на главной он больше не нужен
- `src/components/layout/AppHeader.vue`:
  - Кнопка «Поиск» скрыта на главной (`v-if="route.path !== '/'"`) — чтобы не было двух полей поиска

**Playwright: 8/8 проверок прошли:**
- Header search hidden on `/` ✅
- Inline search input visible ✅
- Results appear in dropdown (no modal) ✅
- Click navigates to calculator ✅
- Header search visible on `/finance/credit/` ✅
- Desktop + mobile screenshots ✅

**Коммит:** `69e3691 feat: redesign home page hero — inline search, compact layout, single search`

## Сделано (Фаза 4.7) — 2026-04-25

- `src/features/tips-calculator/` — полный модуль: types, calculations, composable, view, index
- Функциональность: базовые чаевые + разделение счёта на N человек
- Быстрые ставки: 0% / 5% / 10% / 15% / 20% / Свой %
- Результат: tipAmount, totalAmount, billPerPerson, tipPerPerson, amountPerPerson
- Блок "На каждого" скрыт если peopleCount=1
- 30 unit-тестов (131/131 всего), type-check, build → `dist/everyday/tips.html` 17.89 KiB
- Playwright: 14/14 проверок прошли
- Все 5 поисковых запросов находят калькулятор: чаевые, разделить счёт, ресторан, tips, split bill
- Registry: `tips` → `status: 'ready'`, `popularity: 78`, теги/алиасы, componentLoader
- Локали: ru.json + en.json ключи `tips.*`
- Sitemap: добавлены `/everyday/` и `/everyday/tips/`
- Открыта новая категория `/everyday`
- Коммит: `8b3b329 feat: phase 4.7 — tips calculator /everyday/tips`

## Исправления после Phase 4.7 — 2026-04-25

- Layout: результат перенесён справа от формы (grid 2 колонки), как у других калькуляторов
- type-check + build прошли

## Сделано (Фаза 4.8) — 2026-04-25

- `src/features/temperature-converter/` — полный модуль: types, calculations, composable, view, index
- Конвертация между °C, °F и K через базовую единицу Celsius
- Swap units кнопка
- Валидация: below absolute zero, NaN/Infinity
- 22 unit-тестов (153/153 всего), type-check, build → `dist/convert/temperature.html` 16.64 KiB
- Registry: `temperature` → `status: 'ready'`, `popularity: 75`, теги/алиасы, componentLoader
- Локали: ru.json + en.json ключи `temperature.*`
- Sitemap: добавлен `/convert/temperature/`
- SEO: index,follow,max-image-preview:large (автоматически из статуса ready)

## Сделано (Фаза 4.9) — 2026-04-25

- `src/features/weight-converter/` — полный модуль: types, calculations, composable, view, index
- Конвертация между всеми единицами веса через базовую единицу kilogram
- 7 единиц: mg, g, kg, t, oz, lb, st
- Swap units кнопка
- Валидация: non-negative, NaN/Infinity
- 17 unit-тестов (170/170 всего), type-check, build → `dist/convert/weight.html` 17.07 KiB
- Registry: `weight` → `status: 'ready'`, `popularity: 72`, теги/алиасы, componentLoader
- Локали: ru.json + en.json ключи `weight.*`
- Sitemap: добавлен `/convert/weight/`
- SEO: index,follow,max-image-preview:large

## Ожидает (Phase 4.10)

Следующий калькулятор не определён. Возможные кандидаты: конвертер площади, конвертер объёма, скидка/наценка.
