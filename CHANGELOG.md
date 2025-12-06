# Changelog

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
