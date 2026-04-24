# Calcup

**Language / Язык:** [Русский](#русский) | [English](#english)

---

## Русский

Calcup — веб-рабочий стол для фокуса и личной продуктивности в ретро-эстетике. На одном экране собраны Pomodoro-таймер, планировщик задач, звуковая машина, обратный отсчёт до даты и классическая змейка.

### Возможности

- **Pomodoro** — таймер фокуса с короткими и длинными перерывами.
- **Планировщик задач** — список задач, активная задача для текущей Pomodoro-сессии, дневная статистика и история отрезков.
- **Звуковая машина** — фоновые звуки и радиопотоки для концентрации.
- **Обратный отсчёт** — виджет до выбранной даты с быстрыми пресетами.
- **Змейка** — классическая игра Snake с локальным топ-10 рекордов.
- **Рабочий стол** — перетаскиваемые виджеты, настройка цвета и паттерна, случайная раскладка без пересечений.
- **Локализация** — русский и английский интерфейс.

### Быстрый старт

```bash
npm install
npm run dev
```

После запуска Vite откроет локальный адрес в терминале, обычно `http://localhost:5173/`.

### Скрипты

```bash
npm run dev      # режим разработки
npm run build    # type-check + production build
npm run preview  # локальный preview production-сборки
npm run deploy   # публикация dist через gh-pages
```

### Переменные окружения

Создайте `.env` локально или задайте переменные в CI/CD:

```bash
VITE_SITE_URL=https://calcup.ru
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_YANDEX_METRIKA_ID=105706802
```

- `VITE_SITE_URL` используется для canonical, Open Graph и Twitter URL.
- `VITE_GA_MEASUREMENT_ID` опциональна: если значение пустое, Google Analytics не подключается.
- `VITE_YANDEX_METRIKA_ID` имеет дефолт в коде, но может быть переопределена через окружение.

### Технологии

- Vue 3
- TypeScript
- Vite
- Vue I18n

### Данные пользователя

Calcup хранит пользовательские настройки локально в браузере: позиции виджетов, выбранный фон, состояние виджетов, задачи, настройки таймера и рекорды змейки. Кнопка очистки рабочего стола сбрасывает локальное состояние.

### Лицензия

MIT

---

## English

Calcup is a web desktop for focus and personal productivity with a retro desk feel. It brings together a Pomodoro timer, task planner, sound machine, date countdown, and a classic Snake game on one draggable workspace.

### Features

- **Pomodoro** — focus timer with short and long breaks.
- **Task Planner** — task list, active task handoff to Pomodoro, daily stats, and recent session history.
- **Sound Machine** — ambient sounds and radio streams for concentration.
- **Date Countdown** — countdown widget for a chosen date with quick presets.
- **Snake** — classic Snake game with a local top-10 leaderboard.
- **Desktop Workspace** — draggable widgets, color and pattern customization, and random non-overlapping layouts.
- **Localization** — Russian and English interface.

### Quick Start

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173/`.

### Scripts

```bash
npm run dev      # development mode
npm run build    # type-check + production build
npm run preview  # local production preview
npm run deploy   # publish dist with gh-pages
```

### Environment Variables

Create a local `.env` file or set these values in CI/CD:

```bash
VITE_SITE_URL=https://calcup.ru
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_YANDEX_METRIKA_ID=105706802
```

- `VITE_SITE_URL` is used for canonical, Open Graph, and Twitter URLs.
- `VITE_GA_MEASUREMENT_ID` is optional: Google Analytics is skipped when it is empty.
- `VITE_YANDEX_METRIKA_ID` has a code default, but can be overridden through the environment.

### Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue I18n

### User Data

Calcup stores user state locally in the browser: widget positions, selected desktop style, widget visibility, tasks, timer settings, and Snake scores. The reset desk button clears local state.

### License

MIT
