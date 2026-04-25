# PROJECT_STATUS

## Текущая фаза: 4.12 завершена, ожидание следующей фазы

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

## Sitemap

- / (главная)
- /finance/ · /math/ · /health/ · /convert/ · /transport/ · /datetime/ · /everyday/
- /finance/credit/ · /finance/vat/
- /math/percentage/
- /health/bmi/
- /convert/length/ · /convert/temperature/ · /convert/weight/
- /transport/fuel/
- /datetime/date-diff/
- /everyday/tips/ · /everyday/discount/
- /convert/area/

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
