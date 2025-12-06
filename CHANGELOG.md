# Changelog / История изменений

All notable changes to this project will be documented in this file. / Все заметные изменения этого проекта будут задокументированы в этом файле.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
