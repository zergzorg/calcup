# Мобильная адаптация рабочего стола виджетов

Status: draft  
Created: 2026-04-24  
Scope: исправить мобильный UX в `calcup` без изменения продуктовой логики виджетов

## Overview

На мобильных экранах текущий desktop-first layout работает нестабильно: виджеты уменьшаются из-за глобального `scale`, накладываются друг на друга из-за абсолютного позиционирования, часть элементов оказывается вне экрана, а интерактивные зоны слишком мелкие для touch.

Цель плана: ввести отдельный мобильный режим отображения с предсказуемой вертикальной компоновкой, корректными размерами контролов и без потери текущего desktop-поведения.

## Context

Текущее состояние по коду:

- В `DesktopLayout` используется масштабирование поверхности (`transform: scale(...)`) и фиксированный viewport (`overflow: hidden`), что приводит к визуальному «сжатию» интерфейса на телефонах.
- `body` в `src/style.css` имеет `overflow: hidden` и `min-width: 100vw`/`min-height: 100vh` — блокируют вертикальный скролл.
- Виджеты рендерятся как draggable-блоки с `position: absolute` и фиксированными ширинами:
  - `TimerWidget` — 320px
  - `TaskPlanner` — 390px
  - `SoundMachine` — 280px
  - `SnakeGame` — 404px (уже имеет частичный `@media (max-width: 720px)` с экранным D-pad — **не регрессировать**)
  - `DateTimerWidget` — 430px (уже имеет `@media (max-width: 720px)`)
- Логика drag-and-drop и сохранения позиций централизована в `useDraggable.ts` (и `mouse`, и `touch` обработчики) — отключать на mobile нужно здесь, а не в каждом виджете.
- `App.vue` на первом запуске вызывает `applyRandomWidgetLayout()`, который оперирует абсолютными координатами и полагается на `useScale` — на mobile этот код выполнять бессмысленно.
- `DesktopLayout` содержит глобальные контролы: `.lang-container` (top-right, Settings + LanguageSwitcher) и `.desk-controls` (bottom-right, Shuffle + Reset). `.desk-controls` использует hover-opacity, которая на touch работает некорректно.
- Мобильные media-правила существуют фрагментарно: `DateTimerWidget` (720px), `SnakeGame` (720px), `SettingsMenu` (520px) — единой системы нет.

Пользовательский симптом: «элементы мелкие, наслаиваются, не все влезает в экран».

## Development Approach

Подход: **двухрежимная адаптация** с единым breakpoint.

- **Breakpoint**: `768px` (совпадает с `md` в Tailwind и бо́льшинстве tablet-portrait ориентаций). Флаг `isMobileLayout = window.innerWidth < 768`.
- **Desktop / large tablet (≥ 768px)**: сохраняем текущую парадигму «рабочего стола» — drag, absolute-позиционирование, `scale`, shuffle-кнопка.
- **Mobile / small tablet (< 768px)**: потоковая компоновка (stack) через CSS (widgets → `position: static`, вертикальный flex/grid на `.desk-surface`), drag отключён, `scale = 1`, `overflow: auto`, shuffle-кнопка скрыта.

Способ реализации:

- Флаг `isMobileLayout` выставляется как data-атрибут на `<body>` или на `.desktop-layout` (например, `data-layout="mobile"`) — это позволит управлять стилями виджетов через CSS-селектор без пропихивания prop через каждый компонент.
- Отключение drag — одной проверкой в `useDraggable.ts` (gate на `isMobileLayout` в начале `onMouseDown` / `onTouchStart`), без правок в каждом виджете.
- Высоты — `100dvh` с фолбэком на `100vh` для старых браузеров (Safari < 15.4), чтобы адресная строка не обрезала контент.

Почему так:

- Попытка «долечить» текущую desktop-модель только media-правилами не решает системную проблему с абсолютным позиционированием.
- Режимный подход снижает регрессионный риск для desktop и дает контролируемый UX на мобильных.
- CSS-переключение через data-атрибут проще, чем prop-drilling, и быстрее реагирует на resize.

## Testing Strategy

### Автопроверки

- `npm run build` — обязательная проверка после внедрения.

### Ручная проверка (обязательно)

Проверить минимум на viewport:

- `360x800` — мелкий Android (portrait)
- `390x844` — iPhone 14/15 (portrait)
- `412x915` — Pixel 7/8 (portrait)
- `844x390` — iPhone landscape (часто ломает фикс-высоты)
- `768x1024` — iPad portrait (граница breakpoint)
- desktop `>= 1280px` — регрессия desktop

Сценарии:

1. Нет горизонтального скролла на мобильных.
2. Виджеты не накладываются и отображаются последовательно сверху вниз.
3. Все ключевые контролы доступны и кликабельны пальцем (touch-target ≥ 44×44 px).
4. В desktop-режиме drag-and-drop и сохранение позиций продолжают работать как раньше.
5. Верхние/нижние системные кнопки не перекрывают контент и учитывают safe-area.
6. SnakeGame на mobile сохраняет работу экранного D-pad (текущая адаптация не сломана).
7. При показе/скрытии адресной строки в Safari контент не обрезается (`100dvh`).
8. После переключения mobile → desktop через ресайз не сломано позиционирование (drag снова работает).
9. Тест на реальном устройстве (минимум один iPhone и один Android), а не только в DevTools-эмуляции.

## Progress Tracking

- [x] Подтверждена стратегия breakpoints (768px) и правило переключения mobile/desktop режима через data-атрибут.
- [x] Реализован мобильный каркас layout без абсолютного позиционирования (Task 1).
- [x] Drag отключён централизованно в `useDraggable.ts` (Task 2).
- [ ] Приведены к mobile-стандарту размеры и отступы в каждом виджете (Task 3).
- [ ] Глобальные контролы перенесены в безопасные зоны с safe-area (Task 4).
- [ ] Проведен ручной прогон на целевых viewport, включая landscape и реальное устройство.
- [ ] Зафиксированы финальные результаты и residual risks.

## Implementation Steps

### Task 1: Ввести системный mobile-режим на уровне layout

**Files:**
- Modify: `src/composables/useScale.ts` — добавить экспорт `isMobileLayout` (computed/ref на основе resize-listener)
- Modify: `src/components/DesktopLayout.vue` — выставить `data-layout="mobile"` на корне; на mobile зафиксировать `scale=1`, заменить `overflow: hidden` на `overflow-y: auto`, изменить раскладку слота `.desk-surface` на flex-column со `gap` и `padding`
- Modify: `src/style.css` — заменить `body { overflow: hidden }` на условный (через селектор `body:has([data-layout="mobile"])` или класс на body), убрать `min-width: 100vw`, использовать `min-height: 100dvh` с фолбэком `100vh`
- Modify: `src/App.vue` — гейт для `applyRandomWidgetLayout()` на первом mounted: не запускать на mobile; кнопка Shuffle и автолейаут не должны срабатывать в mobile-режиме
- Modify: `index.html` — проверить `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />` (добавить `viewport-fit=cover` для safe-area)

- [x] Добавить экспорт `isMobileLayout` в `useScale.ts` (или вынести в отдельный `useViewport.ts`); breakpoint = 768px.
- [x] Для mobile зафиксировать `scale = 1` и не применять `transform: scale()` к `.desk-surface`.
- [x] На mobile выключить `overflow: hidden` на body/`.desktop-layout`, включить `overflow-y: auto`.
- [x] Заменить `100vh` на `100dvh` с фолбэком `100vh` для совместимости.
- [x] Включить flex-column раскладку слота с виджетами на mobile (gap ~16px, padding ~16px).
- [x] Не запускать `applyRandomWidgetLayout()` и не показывать кнопку Shuffle на mobile.

### Task 2: Развести поведение draggable между desktop и mobile

**Files:**
- Modify: `src/composables/useDraggable.ts` — единственный файл для drag-логики

Подход: отключение делается в одном месте (`useDraggable.ts`). Виджеты не правятся для drag-логики — они продолжают вызывать `onMouseDown` / `onTouchStart`, но внутри композабла на mobile эти обработчики становятся no-op.

- [x] В `onMouseDown` / `onTouchStart`: ранний `return`, если `isMobileLayout.value === true`.
- [x] Не сохранять/не загружать `position` из localStorage на mobile (чтобы при возврате на desktop геометрия восстановилась корректно). Альтернатива: оставить чтение из localStorage, но игнорировать применение `position` в mobile-стилях через CSS (`position: static !important` для `[data-layout="mobile"]`).
- [x] Проверить, что `e.preventDefault()` в `onTouchStart` НЕ вызывается на mobile — иначе блокирует нативный скролл и tap-события.
- [x] Сохранить текущую механику drag на desktop без функциональных изменений.

### Task 3: Перевести виджеты на mobile-safe размеры и отступы

**Files:**
- Modify: `src/components/TimerWidget.vue` — корневая `width: 320px` → `width: min(320px, 100%)`; `position: absolute` нейтрализуется через mobile-селектор
- Modify: `src/components/DateTimerWidget.vue` — `width: 430px` (уже частично адаптирован под 720px, проверить актуальность)
- Modify: `src/components/TaskPlanner.vue` — `width: 390px` → `min(390px, 100%)`
- Modify: `src/components/SoundMachine.vue` — `width: 280px` → `min(280px, 100%)`; внутренние ползунки громкости — touch-friendly размеры
- Modify: `src/components/SnakeGame.vue` — `width: 404px` (уже частично адаптирован, **не ломать существующий D-pad и квадратность поля**)
- Modify: `src/components/TimerControls.vue` — кнопки таймера touch-target ≥ 44px
- Modify: `src/components/TimerDisplay.vue` — SVG circular ring (`r=92`) масштабировать через viewBox/% при необходимости
- Modify: `src/components/TimerSettings.vue` — степпер +/- кнопок touch-friendly
- Modify: `src/components/SessionDots.vue` — проверить размер точек на mobile
- Modify: `src/components/FlipCard.vue` — fixed sizes в countdown — масштабировать или уменьшить на mobile

- [ ] Убрать критичные жесткие ширины, заменить на `min(NNNpx, 100%)` для корней виджетов.
- [ ] Увеличить touch-target до минимально комфортного размера (≥ 44×44 px).
- [ ] Пересобрать внутренние сетки, которые ломаются на узких экранах (таймер, планировщик, радио, управление змейкой).
- [ ] Проверить контраст и читабельность мелких подписей после масштабирования.
- [ ] Использовать единые mobile-стили через селектор `[data-layout="mobile"]` в каждом виджете, без дублирования media-queries.

### Task 4: Доработать системные контролы и safe-area

**Files:**
- Modify: `src/components/DesktopLayout.vue` — `.lang-container` и `.desk-controls`: на mobile перенести из `position: absolute` в нормальный поток (например, sticky-header сверху и fixed-footer снизу с safe-area)
- Modify: `src/components/SettingsMenu.vue` — на mobile панель настроек разворачивается на полную ширину (вместо absolute popover)
- Modify: `src/components/LanguageSwitcher.vue` — увеличить touch-target

- [ ] На mobile: `.lang-container` (Settings + LanguageSwitcher) — sticky/fixed top с фоном; убрать абсолютное позиционирование.
- [ ] На mobile: `.desk-controls` (Reset) — fixed bottom с safe-area; кнопка Shuffle скрыта (см. Task 1).
- [ ] Заменить hover-opacity для `.desk-controls` на полную видимость на touch-устройствах (через `@media (hover: none)`).
- [ ] Добавить отступы через `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` для глобальных контролов.
- [ ] Исключить перекрытие глобальных контролов с карточками виджетов (учесть высоту sticky-header в `padding-top` стека).
- [ ] Settings popover на mobile: full-width / bottom-sheet вместо абсолютного позиционирования с фиксированной шириной.

### Task 5: Валидация и фиксация результатов

**Files:**
- Modify: `CHANGELOG.md` (если изменение отражается в правилах проекта)
- Modify: `README.md` (при необходимости обновить описание UX/ограничений)

- [ ] Выполнить `npm run build`.
- [ ] Пройти ручной чеклист по viewport.
- [ ] Зафиксировать, что осталось за рамками итерации (если будет).

## Technical Notes

- Приоритет итерации: стабильность mobile UX и сохранение desktop-поведения.
- Продуктовая логика таймера/задач/змейки/аудио не меняется.
- Если в процессе выявится, что drag на планшетах нужен частично, добавить дополнительный брейкпоинт и отдельный режим `tablet`.

## Risks / Open Questions

- ⚠️ Возможен конфликт между mobile-скроллом и текущими touch-обработчиками внутри виджетов (`onTouchStart` с `e.preventDefault()` блокирует тап на input). Митигируется ранним `return` в `useDraggable` для mobile.
- ⚠️ Визуальные стили «desktop-стола» могут требовать частичной деградации на mobile ради читаемости.
- ⚠️ Нужно решить, сохраняем ли пользовательский порядок виджетов на mobile (в рамках этой итерации предлагается **фиксированный порядок**: Timer → DateTimer → Tasks → Sound → Snake — соответствует порядку в `App.vue` template).
- ⚠️ Hover-стили (`.desk-controls:hover`, и аналогичные) на mobile срабатывают «залипанием» после tap — оборачивать в `@media (hover: hover)`.
- ⚠️ Видимость виджетов через `useWidgets()` (toggle в SettingsMenu) — проверить, что скрытие виджета на mobile не оставляет «дыру» в стеке.
- ⚠️ Resize между mobile и desktop в одной сессии: localStorage позиции виджетов могут конфликтовать. Решение — игнорировать сохранённые позиции, пока активен mobile-режим, и применять при возврате на desktop.
- ⚠️ Тестирование на реальном Safari iOS (DevTools-эмуляция не воспроизводит quirks с `100vh`/keyboard/safe-area).
- ❓ **Open Q**: оставить ли SnakeGame на mobile или скрывать (поле может быть слишком мелким для touch). Предлагается оставить — у виджета уже есть mobile-адаптация.
- ❓ **Open Q**: shuffle-кнопка скрыта или показывается без эффекта? Предлагается **скрыть** на mobile.

## Post-Completion

Заполняется после реализации:

- фактические изменения относительно плана;
- результаты проверок;
- остаточные ограничения;
- ссылка на commit/PR.

## Completion Notes

Не заполнено: план создан до начала реализации и ожидает ревью.
