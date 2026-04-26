# Construction Calculators Roadmap

Status: active
Created: 2026-04-25
Scope: отдельная продуктовая дорожная карта строительного раздела `/construction`

## Overview

Запустить строительное направление Calcup как отдельную линейку калькуляторов для ремонта, отделки, строительства и инженерных задач. Раздел должен расти от простых бытовых сценариев к более ответственным строительным и нормативным расчётам.

Источник вдохновения по охвату тем: `https://calcup.pro/construction`. Используем только список направлений и рыночный контекст, не копируем структуру, тексты, дизайн, порядок карточек или формулировки.

## Product Positioning

### URL

```txt
/construction
```

### RU

```txt
Строительные калькуляторы
```

### EN

```txt
Construction Calculators
```

### RU Description

```txt
Расчёт материалов для ремонта, отделки, строительства и инженерных работ: обои, краска, плитка, бетон, кирпич, утеплитель, кровля и другие задачи.
```

### EN Description

```txt
Material calculators for renovation, finishing, construction and engineering work: wallpaper, paint, tile, concrete, brick, insulation, roofing and more.
```

## Strategy

Разделить строительную линейку на 5 групп:

1. Ремонт и отделка.
2. Полы и покрытия.
3. Стены и кладка.
4. Фундаменты и бетон.
5. Кровля и инженерка.

Первые релизы должны быть бытовыми, хорошо проверяемыми и низкорисковыми. Нормативные и инженерные калькуляторы переносить в поздние фазы с явными дисклеймерами.

## Roadmap

### P0: Ремонт и отделка

| Путь | Название | Ценность | Риск |
|------|----------|----------|------|
| `/construction/wallpaper` | Калькулятор обоев | Быстрый расчёт рулонов с окнами, дверями, запасом и раппортом | Низкий |
| `/construction/paint` | Калькулятор краски | Литры, банки, слои, расход и стоимость | Низкий, ready |
| `/construction/tile` | Калькулятор плитки | Плитки, упаковки, подрезка, запас и стоимость | Средний, ready |
| `/construction/laminate` | Калькулятор ламината | Площадь, упаковки, запас и стоимость | Низкий, ready |
| `/construction/floor-screed` | Калькулятор стяжки пола | Объём, масса смеси, мешки и стоимость | Средний, ready |

### P1: Стены, кладка и изоляция

| Путь | Название | Ценность | Риск |
|------|----------|----------|------|
| `/construction/brick` | Калькулятор кирпича | Кирпичи, объём кладки, раствор и запас | Средний, ready |
| `/construction/blocks` | Калькулятор газоблока / пеноблока | Блоки, объём, клей, стоимость | Средний, ready |
| `/construction/drywall` | Калькулятор гипсокартона | Листы, профиль, крепёж, запас | Средний, ready |
| `/construction/putty` | Калькулятор шпатлёвки / штукатурки | Смесь, мешки, толщина слоя, стоимость | Низкий, ready |
| `/construction/insulation` | Калькулятор утеплителя | Плиты, упаковки, объём, стоимость | Средний, ready |

### P2: Бетон и несущие конструкции

| Путь | Название | Ценность | Риск |
|------|----------|----------|------|
| `/construction/concrete` | Калькулятор бетона | Объём бетона, простые формы, стоимость | Средний, ready |
| `/construction/strip-foundation` | Ленточный фундамент | Бетон, арматура, опалубка, подушка | Высокий, ready |
| `/construction/slab-foundation` | Плитный фундамент | Бетон, арматурная сетка, подушка | Высокий |
| `/construction/rebar` | Калькулятор арматуры | Прутки, длина, вес, стоимость | Средний |
| `/construction/roof` | Калькулятор кровли | Площадь скатов, листы, нахлёст, запас | Высокий |

### P3: Профессиональные и инженерные

| Путь | Название | Ценность | Риск |
|------|----------|----------|------|
| `/construction/stairs` | Калькулятор лестницы | Ступени, угол, подступёнок, проступь | Высокий |
| `/construction/excavation` | Выемка грунта | Котлован, траншея, разрыхление, рейсы | Средний |
| `/construction/lighting` | Освещение | Световой поток, светильники, мощность | Средний |
| `/construction/ventilation` | Вентиляция | Воздухообмен, кратность, производительность | Высокий |
| `/construction/snow-load` | Снеговая нагрузка | Справочный нормативный расчёт | Очень высокий |
| `/construction/wind-load` | Ветровая нагрузка | Справочный нормативный расчёт | Очень высокий |

## Recommended Implementation Order

### First Wave

1. `/construction/wallpaper`
2. `/construction/paint`
3. `/construction/tile`
4. `/construction/laminate`
5. `/construction/floor-screed`

### Second Wave

1. `/construction/brick`
2. `/construction/drywall`
3. `/construction/putty`
4. `/construction/insulation`
5. `/construction/concrete`

### Later

Фундаменты, кровлю, лестницы и нагрузки делать только после стабилизации базового строительного раздела и отдельной проработки предупреждений, ограничений и тестовых наборов.

## Registry / SEO Rules

Для каждого строительного калькулятора:

- `categorySlug: 'construction'`
- путь строго внутри `/construction/...`
- `status: 'ready'` только после готового feature-модуля, тестов, i18n, SEO и Playwright smoke
- до реализации не добавлять planned routes в sitemap
- для нормативных расчётов добавлять дисклеймер: расчёт справочный и не заменяет проектирование
- не копировать тексты и дизайн внешних источников

## UX Rules

- Desktop: форма слева, результат справа, если нет причины для другого layout.
- Mobile: результат ниже формы, без horizontal overflow на `360px`.
- Поля должны поддерживать быстрый бытовой сценарий, без инженерной перегрузки в P0.
- Для стоимости материалов цена должна быть optional: калькулятор обязан быть полезен и без неё.
- Значения по умолчанию должны помогать начать расчёт, но не подставлять опасные нормативные допущения.

## Testing Strategy

Для каждого калькулятора:

- чистые формулы только в `lib/calculations.ts`
- Vitest unit-тесты на формулы, округление и валидацию
- `npm run type-check`
- `npm run test`
- `npm run build`
- Playwright smoke:
  - desktop
  - mobile `360px`
  - search
  - sitemap / robots / canonical
  - ключевые интерактивные сценарии

## Risks / Open Questions

- Строительные расчёты легко воспринимаются как проектные рекомендации. Для P2/P3 нужен явный справочный статус.
- Для нормативных калькуляторов нужны источники норм, регионы, коэффициенты и дата актуальности.
- В P0 нельзя перегрузить бытовой UX строительной детализацией.
- Нужно решить, стоит ли обновить описание категории `construction` в `src/data/categories.ts` перед первым релизом строительного калькулятора.

## Progress Tracking

- [x] Сформировать отдельную строительную дорожную карту.
- [x] Согласовать первый калькулятор: `/construction/wallpaper`.
- [x] Реализовать Phase 5.1: wallpaper.
- [x] Перенести completed-план `/construction/wallpaper` в `docs/plans/completed/2026-04-25-wallpaper-calculator.md`.
- [x] Добавить P0/P1/P2/P3 строительные `soon`-карточки в реестр.
- [ ] После первого ready-калькулятора проверить категорию `/construction/` в production.
- [x] Реализовать следующий строительный ready-калькулятор: `/construction/paint`.
- [x] Реализовать следующий строительный ready-калькулятор: `/construction/tile`.
- [x] Реализовать следующий строительный ready-калькулятор: `/construction/laminate`.
- [x] Реализовать следующий строительный ready-калькулятор: `/construction/floor-screed`.
- [x] Реализовать P1/P2 ready-калькуляторы: `/construction/brick`, `/construction/blocks`, `/construction/drywall`, `/construction/putty`, `/construction/insulation`, `/construction/concrete`.
- [x] Реализовать ориентировочный P2 ready-калькулятор: `/construction/strip-foundation`.

## Post-Completion

После завершения первых 5 P0-калькуляторов провести отдельную стабилизацию строительного раздела:

- SEO категории;
- поиск;
- mobile;
- единый стиль полей;
- корректность дисклеймеров;
- sitemap и индексация.

## Current Notes

На 2026-04-26 готовы P0/P1-материальные калькуляторы и часть P2: `/construction/wallpaper`, `/construction/paint`, `/construction/tile`, `/construction/laminate`, `/construction/floor-screed`, `/construction/brick`, `/construction/blocks`, `/construction/drywall`, `/construction/putty`, `/construction/insulation`, `/construction/concrete`, `/construction/strip-foundation`. Оставшиеся строительные инструменты опубликованы как `soon`, чтобы категория читалась как дорожная карта, но они не должны попадать в sitemap ready-страниц.
