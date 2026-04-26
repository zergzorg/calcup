# Calcup

Calcup — каталог бесплатных онлайн-калькуляторов и конвертеров. Главная концепция проекта больше не ограничивается рабочим столом продуктивности: сайт развивается как SEO-friendly агрегатор быстрых расчётов для финансов, математики, здоровья, строительства, транспорта, дат, конвертеров, спорта, одежды и бытовых задач.

Рабочий стол с Pomodoro, задачами, звуками, обратным отсчётом и Snake сохранён как отдельный инструмент по адресу `/workspace`.

## Текущее состояние

- 10 категорий в реестре.
- 45 готовых калькуляторов.
- 29 запланированных `soon`-карточек для расширения каталога.
- Vue Router + Vite SSG генерируют статические страницы и fallback для GitHub Pages.
- `src/data/calculators.ts` и `src/data/categories.ts` являются источником правды для каталога, роутов, поиска, карточек, хлебных крошек и sitemap.

## Готовые разделы

- `/finance/` — кредит, НДС, зарплата, стоимость проекта.
- `/math/` — проценты.
- `/health/` — ИМТ.
- `/convert/` — длина, температура, вес, площадь, объём, скорость.
- `/construction/` — обои, краска, плитка, ламинат, стяжка пола, кирпич, газоблок, гипсокартон, шпатлёвка, утеплитель, бетон, ленточный фундамент.
- `/transport/` — расход топлива, стоимость поездки, цена топлива, средняя скорость, запас хода EV.
- `/sport/` — темп, скорость, дистанция, время бега, сплиты, пульсовые зоны и метроном.
- `/clothing/` — конвертер размера обуви и размеров одежды.
- `/datetime/` — разница между датами, возраст, рабочие дни, длительность времени и дни до даты.
- `/everyday/` — чаевые, разделение счёта, скидка, выгодная покупка.

Новое направление `/clothing/` уже открыто конвертерами размера обуви и одежды; следующие size-инструменты остаются в roadmap.

## Готовые калькуляторы

- `/finance/credit/` — кредитный калькулятор.
- `/finance/vat/` — НДС.
- `/finance/salary/` — зарплата после НДФЛ, дополнительный доход и ставка за час.
- `/finance/project-price/` — стоимость проекта и фриланс-оценка.
- `/math/percentage/` — проценты.
- `/health/bmi/` — индекс массы тела.
- `/convert/length/` — длина.
- `/convert/temperature/` — температура.
- `/convert/weight/` — вес.
- `/convert/area/` — площадь.
- `/convert/volume/` — объём.
- `/convert/speed/` — скорость.
- `/construction/wallpaper/` — расход обоев.
- `/construction/paint/` — расход краски.
- `/construction/tile/` — плитка, упаковки, запас и стоимость.
- `/construction/laminate/` — ламинат, упаковки, запас и стоимость.
- `/construction/floor-screed/` — стяжка пола, сухая смесь и мешки.
- `/construction/brick/` — кирпич, кладка, раствор и запас.
- `/construction/blocks/` — газоблоки, объём, клей и запас.
- `/construction/drywall/` — листы ГКЛ, профиль, крепёж и запас.
- `/construction/putty/` — шпатлёвка, мешки, слой, запас и стоимость.
- `/construction/insulation/` — плиты утеплителя, упаковки, объём и запас.
- `/construction/concrete/` — объём бетона, мешки, запас и стоимость.
- `/construction/strip-foundation/` — бетон, подушка, опалубка и арматура для ленточного фундамента.
- `/transport/fuel/` — расход топлива.
- `/transport/trip-cost/` — стоимость поездки с топливом и дополнительными расходами.
- `/transport/fuel-price/` — литры и запас хода по бюджету на топливо.
- `/transport/average-speed/` — средняя скорость по расстоянию и времени.
- `/transport/ev-range/` — запас хода электромобиля по батарее и расходу.
- `/sport/pace-speed/` — перевод темпа мин/км в скорость км/ч и обратно.
- `/sport/distance-pace-time/` — дистанция, темп и время забега.
- `/sport/race-split/` — контрольные сплиты и целевой темп забега.
- `/sport/heart-rate-zones/` — пульсовые зоны по максимальной ЧСС или резерву пульса.
- `/sport/metronome/` — BPM, интервал удара и ориентир каденса для тренировок.
- `/clothing/shoe-size/` — перевод размера обуви между EU/RU, UK, US, сантиметрами и Mondopoint.
- `/clothing/clothing-size/` — ориентировочный перевод размеров одежды между INT, RU, EU, US и UK.
- `/datetime/date-diff/` — разница дат.
- `/datetime/age/` — возраст, прожитые дни и дни до дня рождения.
- `/datetime/workdays/` — рабочие и выходные дни между датами.
- `/datetime/time-duration/` — сложение и вычитание часов, минут и секунд.
- `/datetime/countdown/` — дни до события или дедлайна.
- `/everyday/tips/` — чаевые и разделение счёта.
- `/everyday/bill-split/` — разделение общего счёта с чаевыми и округлением.
- `/everyday/discount/` — скидка.
- `/everyday/unit-price/` — выгодная покупка.

## Архитектура каталога

Реестр калькуляторов хранится в `src/data/calculators.ts`. Каждый готовый калькулятор должен иметь:

- запись в реестре со статусом `ready`;
- feature-модуль в `src/features/<feature-name>/`;
- чистые расчётные функции в `lib/calculations.ts`;
- unit-тесты в `lib/calculations.test.ts`;
- RU/EN локали;
- SEO-данные и поисковые теги.

Карточки со статусом `soon` показываются в категориях и могут иметь маршруты-заглушки, но не считаются готовыми инструментами и не должны индексироваться как полноценные калькуляторы.

## UI-контракт калькуляторов

Перед созданием или рестайлингом калькулятора нужно свериться с:

```txt
src/features/calculator-design-system.css
```

Новые калькуляторы используют стандартную форму классов:

- `<prefix>-page`
- `<prefix>-heading`
- `<prefix>-eyebrow`
- `<prefix>-workspace`
- `<prefix>-form`
- `<prefix>-field`
- `<prefix>-input-wrap`
- `<prefix>-result`
- `<prefix>-result__row`
- `<prefix>-formula`
- `<prefix>-toggle`

Локальные переопределения рамок, радиусов, высот контролов, focus-ring, result-panel layout и акцентных цветов не добавляются без изменения общего design system файла.

## SEO и статическая сборка

- `vite-ssg` собирает статические страницы.
- `public/sitemap.xml` содержит главную, категории с готовым содержимым и ready-калькуляторы.
- Ready-страницы индексируются с canonical URL со slash.
- `/workspace`, 404 и `soon`-страницы остаются `noindex`.
- `scripts/create-route-indexes.mjs` создаёт route indexes и `404.html` для GitHub Pages fallback.

## Быстрый старт

```bash
npm install
npm run dev
```

Обычно Vite поднимается на `http://localhost:5173/`.

## Скрипты

```bash
npm run dev        # режим разработки
npm run type-check # проверка TypeScript/Vue типов
npm run test       # unit-тесты Vitest
npm run build      # type-check + vite-ssg build + route indexes + 404 fallback
npm run preview    # локальный preview production-сборки
npm run deploy     # публикация dist через gh-pages
```

## Переменные окружения

```bash
VITE_SITE_URL=https://calcup.ru
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_YANDEX_METRIKA_ID=105706802
```

- `VITE_SITE_URL` используется для canonical, Open Graph и Twitter URL.
- `VITE_GA_MEASUREMENT_ID` опциональна.
- `VITE_YANDEX_METRIKA_ID` имеет дефолт в коде, но может быть переопределена.

## Технологии

- Vue 3
- TypeScript
- Vite
- Vite SSG
- Vue Router
- Vue I18n
- Vitest
- Tailwind CSS
- PrimeVue в unstyled-режиме для будущих сложных форм

## Данные пользователя

Калькуляторы работают локально в браузере и не отправляют введённые значения на сервер. Состояние отдельных инструментов и рабочего стола может сохраняться в `localStorage`: настройки виджетов, задачи, параметры таймера, рекорды Snake и последние значения некоторых форм.

## Лицензия

MIT
