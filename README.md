# Calcup

Calcup - это веб-инструмент для продуктивности в эстетике ретро-рабочего стола. Проект объединяет таймер Pomodoro, задачи, звуковое окружение и обратный отсчет.

## Функционал

- **Pomodoro Timer**: Таймер с режимами фокуса, короткого и длинного перерыва.
- **Task Planner**: Список задач для трекинга рабочего дня.
- **Sound Machine**: Фоновые звуки для концентрации.
- **Date Countdown**: Виджет обратного отсчета до выбранной даты.

## Запуск проекта

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```

## Переменные окружения

Создайте `.env` (или задайте переменные в CI/CD):

```bash
VITE_SITE_URL=https://calcup.ru
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_YANDEX_METRIKA_ID=105706802
```

- `VITE_GA_MEASUREMENT_ID` опциональна: если не задана, Google Analytics не инициализируется.
- `VITE_SITE_URL` используется для canonical/OG/Twitter URL.

## Технологии

- Vue 3
- TypeScript
- Vite

## Лицензия

MIT
