# Changelog

## [0.8.0] - 2026-04-24

### Added / Добавлено

- **Планировщик + Помодоро**: Добавлена связка задач с таймером: запуск задачи стартует WORK-таймер, а таймер показывает текущую задачу и задачу, после которой идёт пауза.
  - _Task Planner + Pomodoro_: Added task-to-timer integration: starting a task starts the WORK timer, and the timer shows the current task plus the task associated with the break.
- **Трекинг задач**: Добавлен учёт фокус-времени, пауз, количества завершённых фокус-сессий за день и последних рабочих/перерывных отрезков.
  - _Task Tracking_: Added focus time, break time, daily completed focus session count, and recent work/break segment tracking.
- **Обратный отсчёт**: Добавлены быстрые пресеты цели `+7`, `+30`, `+90 дней`, прогресс-линия и понятные статусы цели.
  - _Date Countdown_: Added `+7`, `+30`, `+90 days` presets, progress line, and clearer target statuses.
- **Змейка**: Добавлен новый виджет классической игры Snake с управлением с клавиатуры, экранными кнопками и локальным топ-10 рекордов.
  - _Snake_: Added a new classic Snake game widget with keyboard controls, on-screen buttons, and a local top-10 leaderboard.
- **Расстановка виджетов**: Добавлена кнопка случайной раскладки виджетов на рабочем столе без пересечений.
  - _Widget Shuffle_: Added a button to randomly arrange desktop widgets without overlaps.
- **Первый запуск**: При первом входе виджеты автоматически получают случайную раскладку без пересечений.
  - _First Launch_: Widgets now automatically receive a random non-overlapping layout on first visit.

### Changed / Изменено

- **Документация**: README переработан в двуязычном формате с навигацией `Русский | English` и актуальным описанием виджетов.
  - _Documentation_: README was refreshed as a bilingual document with `Russian | English` navigation and up-to-date widget descriptions.
- **Настройки**: Обновлён дизайн панели настроек: стеклянная панель, компактные цветовые строки, кастомные чекбоксы, улучшенная кнопка-шестерёнка.
  - _Settings_: Refreshed settings panel design with a glass surface, compact labeled color rows, custom checkboxes, and improved gear button sizing.
- **Слои виджетов**: Активный или перетаскиваемый виджет теперь поднимается поверх остальных и остаётся сверху до выбора другого виджета.
  - _Widget Layers_: The active or dragged widget now moves above the others and stays on top until another widget is selected.
- **Фон по умолчанию**: Новые рабочие столы теперь открываются с цветом `Чертёжный` и паттерном `Инженерная сетка`.
  - _Default Background_: New desks now start with the `Blueprint` color and `Engineering Grid` pattern.
- **Палитра и паттерны**: Заменены цвета фона на более современные приглушённые тона и обновлены паттерны рабочего стола.
  - _Palette and Patterns_: Replaced background colors with modern muted tones and refreshed desktop patterns.
- **Планировщик**: Переработан дизайн в более рабочую панель с прогрессом задач, статистикой дня и компактной историей отрезков.
  - _Task Planner_: Redesigned as a more functional work panel with task progress, daily stats, and compact segment history.
- **Обратный отсчёт**: Старое сжатое flip-табло заменено на читаемую сетку `дни / часы / минуты / секунды` с карточкой цели.
  - _Date Countdown_: Replaced the compressed flip display with a readable `days / hours / minutes / seconds` grid and target card.

### Fixed / Исправлено

- **Расстановка виджетов**: Исправлены пересечения после случайной раскладки: fallback больше не принимает занятые координаты.
  - _Widget Shuffle_: Fixed overlaps after random layout: fallback placement no longer accepts occupied coordinates.
- **Трекинг времени**: Фокус и паузы теперь пишутся каждую секунду активного таймера, а не только при переключении режима.
  - _Time Tracking_: Focus and break time are now recorded every second while the timer is active, not only on mode switches.
- **Обратный отсчёт**: Исправлена работа `datetime-local`: поле получает корректное локальное значение, не ломается на устаревших сохранённых датах и стабильнее открывает выбор даты.
  - _Date Countdown_: Fixed `datetime-local` behavior: it now receives a valid local value, avoids stale expired saved dates, and opens the date picker more reliably.
- **Git hygiene**: `.DS_Store` и другой локальный хлам вынесены в `.gitignore`; уже попавшие `.DS_Store` удалены из индекса.
  - _Git Hygiene_: Added `.DS_Store` and other local junk to `.gitignore`; previously tracked `.DS_Store` files were removed from the index.

## [0.7.0] - 2025-12-06

### Changed / Изменено

- **Иконка**: Полный редизайн фавиконки (public/calcup.svg) в ретро-стиле (скевоморфизм).
  - _Icon_: Complete redesign of favicon (public/calcup.svg) in retro style (skeuomorphism).
- **Иконка**: Исправлен layout кнопок в иконке, чтобы они не выходили за границы корпуса.
  - _Icon_: Fixed button layout in icon to prevent overflow beyond the chassis.

## [0.6.0] - 2025-12-06

### Changed / Изменено

- **Планировщик**: Полный редизайн в скевоморфном стиле кожаного ежедневника.
  - _Task Planner_: Complete redesign in skeuomorphic leather journal style.
- **Планировщик**: Чекбоксы вынесены за красную линейку (как в настоящем блокноте).
  - _Task Planner_: Checkboxes moved outside the red margin (like a real notebook).
- **Планировщик**: Помидоры Pomodoro теперь эмодзи 🍅 для оценки сложности задачи.
  - _Task Planner_: Pomodoro tomatoes are now 🍅 emojis for task complexity estimation.
- **Планировщик**: Длинные названия задач переносятся на несколько строк.
  - _Task Planner_: Long task names now wrap to multiple lines.

### Fixed / Исправлено

- **Планировщик**: Исправлен overflow — элементы больше не выходят за границы виджета.
  - _Task Planner_: Fixed overflow — elements no longer escape widget bounds.

## [0.5.5] - 2025-12-06

### Added / Добавлено

- **Локализация**: Добавлены переводы для настроек фона (цвета и паттерны) на русский и английский.
  - _Localization_: Added translations for background settings (colors and patterns) in Russian and English.

### Changed / Изменено

- **Цвета фона**: Заменены светлые пастельные цвета на более насыщенные: Терракота, Шиферный, Бордовый.
  - _Background Colors_: Replaced light pastel colors with richer alternatives: Terracotta, Slate, Wine.

## [0.5.4] - 2025-12-06

### Fixed / Исправлено

- **Яндекс.Метрика**: ID счётчика теперь захардкожен в коде для корректной работы на GitHub Pages (без .env файла).
  - _Yandex Metrika_: Counter ID is now hardcoded for proper GitHub Pages deployment (no .env file needed).

## [0.5.3] - 2025-12-06

### Fixed / Исправлено

- **Звуковая машина**: Исправлено воспроизведение фоновых звуков на iPad (переход на HTMLAudioElement вместо AudioBuffer).
  - _Sound Machine_: Fixed background sounds playback on iPad (switched to HTMLAudioElement instead of AudioBuffer).
- **Радио**: Заменён нерабочий Lofi стрим на Zeno FM.
  - _Radio_: Replaced broken Lofi stream with Zeno FM.

## [0.5.2] - 2025-12-06

### Added / Добавлено

- **Виджет Помодоро**: Добавлены звуковые уведомления при переключении режимов (начало/конец перерыва).
  - _Pomodoro Widget_: Added sound notifications when switching modes (break start/end).

## [0.5.1] - 2025-12-06

### Fixed / Исправлено

- **Звуковая машина**: Исправлено воспроизведение фоновых звуков (Ветер, Дождь, Лес) на iPad/iOS (переход на AudioBuffer).
  - _Sound Machine_: Fixed background sounds playback (Wind, Rain, Forest) on iPad/iOS (switched to AudioBuffer).
- **Звуковая машина**: Индикатор загрузки для больших аудиофайлов.
  - _Sound Machine_: Loading indicator for large audio files.

## [0.5.0] - 2025-12-06

### Added / Добавлено

- **Кастомизация фона**: Добавлена возможность менять цвет и паттерн фона стола через настройки.
  - _Background Customization_: Added ability to change desk background color and pattern via settings.
- **Палитра**: Добавлены новые цвета (пастельные и темные профессиональные темы) и паттерны (клетка, линейка).
  - _Palette_: Added new colors (pastel and dark professional themes) and patterns (grid, notebook lines).
- **Пользовательский цвет**: Добавлен выбор произвольного цвета (Color Picker).
  - _Custom Color_: Added custom color picker.

## [0.4.0] - 2025-12-06

### Added / Добавлено

- **Звуковая машина**: Добавлен новый звуковой режим "Лес".
  - _Sound Machine_: Added a new "Forest" sound environment.
- **Звуковая машина**: Сгенерированный шум заменен реалистичными аудио-лупами для Дождя и Океана.
  - _Sound Machine_: Replaced generated noise with realistic looping audio files for Rain and Ocean.
- **Звуковая машина**: Добавен звук "Ветер" (вместо статического шума).
  - _Sound Machine_: Added "Wind" sound (replacing Static).
- **Радио**: "Chill Radio" обновлено на поток "Lofi Girl" для соблюдения авторских прав.
  - _Radio_: Updated "Chill Radio" to use "Lofi Girl" stream for copyright safety.
- **Локализация**: Добавлены переводы на русский и английский для нового звука "Лес".
  - _Localization_: Added Russian and English translations for the new Forest sound.

## [0.3.2] - 2025-12-06

### Added / Добавлено

- **Документация**: Добавлен `CHANGELOG.md` с двуязычной поддержкой.
  - _Docs_: Added `CHANGELOG.md` with bilingual support.

## [0.3.1] - 2025-12-06

### Added / Добавлено

- **Виджет Помодоро**: Добавлено сохранение настроек и состояния при перезагрузке.
  - _Pomodoro Widget_: Added persistence for settings and state across reloads.
- **Виджет Помодоро**: Редизайн, виджет стал более компактным и "лаконичным".
  - _Pomodoro Widget_: Redesigned to be more compact and "laconic".
- **Таймер Дат**: Новый виджет для обратного отсчета до конкретных дат (по умолчанию до Нового Года).
  - _Date Timer Widget_: New widget to count down to specific dates (defaults to New Year).
- **Настройки**: Глобальный виджет настроек с поддержкой локализации (Русский/Английский) и переключателями виджетов.
  - _Settings_: Global settings widget with localization support (Russian/English) and widget toggles.
- **Поддержка планшетов**: Адаптирована верстка для iPad и планшетов.
  - _Tablet Support_: Adapted layout for iPad and tablet screens.
- **Поддержка планшетов**: Добавлена поддержка тач-событий для перетаскиваемых виджетов (`useDraggable`).
  - _Tablet Support_: Added touch event support for draggable widgets (`useDraggable`).

### Fixed / Исправлено

- **Радио**: Восстановлен HTTP-поток "Радио Книга".
  - _Radio_: Restored "Radio Kniga" HTTP stream.
- **Радио**: Добавлен "FluxFM Chillhop" как HTTPS-альтернатива.
  - _Radio_: Added "FluxFM Chillhop" as an HTTPS-friendly alternative.
- **Радио**: Исправлено взаимодействие с выбором каналов на iOS (тач-события).
  - _Radio_: Fixed touch interaction on iOS for channel selection.
- **Очистка**: Удалены неиспользуемые файлы (мусор).
  - _Cleanup_: Removed unused files (trash).

## [0.2.0] - 2025-12-06

### Added / Добавлено

- **Безопасность**: Отключено глобальное контекстное меню (правый клик).
  - _Security_: Disabled global right-click context menu.
- **SEO**: Обновлен заголовок веб-сайта и добавлены SEO мета-теги.
  - _SEO_: Updated website title and added SEO meta tags.
- **Документация**: Обновлен README.md.
  - _Docs_: Updated README.md.

## [0.1.0] - 2025-12-06

### Added / Добавлено

- **UI**: Первый релиз с дизайном в стиле ретро перекидных часов.
  - _UI_: Initial release with Retro Analog Flip Clock design.
- **Архитектура**: Миграция на Vue 3 Composition API.
  - _Architecture_: Migration to Vue 3 Composition API.
