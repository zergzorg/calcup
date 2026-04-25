# Wallpaper Calculator Plan

Status: completed
Created: 2026-04-25
Scope: реализовать первый строительный калькулятор `/construction/wallpaper`

## Overview

Первый калькулятор строительного направления: расчёт количества рулонов обоев для комнаты. Цель — быстрый бытовой расчёт для ремонта без нормативных рисков: размеры комнаты, высота стен, окна/двери, параметры рулона, запас и опциональная подгонка рисунка.

## Route

```txt
/construction/wallpaper
```

## Category

```txt
construction
```

## Naming

RU:

```txt
Калькулятор обоев
```

EN:

```txt
Wallpaper Calculator
```

## User Goal

Пользователь хочет быстро понять:

- сколько рулонов обоев купить;
- какая площадь стен получается;
- сколько площади вычесть за окна и двери;
- как запас и раппорт влияют на итог.

## Non-Goals

- Не считать стоимость поклейки работ.
- Не считать клей, грунтовку и шпаклёвку в первой версии.
- Не делать сложную раскладку по каждой стене.
- Не копировать дизайн, тексты или структуру внешних калькуляторов.
- Не начинать другие строительные калькуляторы.

## Feature Module

Создать:

```txt
src/features/wallpaper-calculator/index.ts
src/features/wallpaper-calculator/components/WallpaperCalculatorView.vue
src/features/wallpaper-calculator/composables/useWallpaperCalculator.ts
src/features/wallpaper-calculator/lib/calculations.ts
src/features/wallpaper-calculator/lib/calculations.test.ts
src/features/wallpaper-calculator/types/wallpaper.ts
```

## Inputs

### Room

- `roomLength` — длина комнаты, м
- `roomWidth` — ширина комнаты, м
- `wallHeight` — высота стен, м

### Openings

MVP-вариант без динамического списка:

- `windowsCount`
- `windowWidth`
- `windowHeight`
- `doorsCount`
- `doorWidth`
- `doorHeight`

После MVP можно расширить до списка проёмов. В Phase 5.1 дополнительно добавлено поле `extraOpeningsArea`, чтобы быстро вычитать нестандартные проёмы без динамического списка.

### Roll

- `rollWidth` — ширина рулона, м
- `rollLength` — длина рулона, м

Дефолты:

- `rollWidth = 1.06`
- `rollLength = 10`

Также стоит дать быстрые presets:

- `0.53 × 10 м`
- `1.06 × 10 м`

### Reserve / Pattern

- `wastePercent` — запас, %
- `usePatternRepeat` — учитывать подгонку рисунка
- `patternRepeat` — раппорт, м

Дефолты:

- `wastePercent = 10`
- `usePatternRepeat = false`
- `patternRepeat = 0.64`

## Calculations

Все формулы держать только в `lib/calculations.ts`.

### Geometry

```txt
perimeter = 2 × (roomLength + roomWidth)
grossWallArea = perimeter × wallHeight
windowsArea = windowsCount × windowWidth × windowHeight
doorsArea = doorsCount × doorWidth × doorHeight
openingsArea = windowsArea + doorsArea + extraOpeningsArea
netWallArea = max(grossWallArea - openingsArea, 0)
areaWithWaste = netWallArea × (1 + wastePercent / 100)
```

### Basic Roll Area

```txt
rollArea = rollWidth × rollLength
rollsByArea = ceil(areaWithWaste / rollArea)
```

### Strip-Based Estimate

Для обоев важнее считать полосы, потому что рулон режется по высоте стены.

```txt
stripHeight = wallHeight
stripsNeeded = ceil(perimeter / rollWidth)
stripsPerRoll = floor(rollLength / stripHeight)
rollsByStrips = ceil(stripsNeeded / stripsPerRoll)
```

Если включён раппорт:

```txt
adjustedStripHeight = ceil(wallHeight / patternRepeat) × patternRepeat
stripsPerRoll = floor(rollLength / adjustedStripHeight)
```

Итог:

```txt
recommendedRolls = max(rollsByArea, rollsByStrips)
```

Если `stripsPerRoll < 1`, результат невалиден: рулон слишком короткий для высоты стены с учётом раппорта.

## Output

Показать:

- большая цифра: рекомендуемое количество рулонов;
- площадь стен до вычета;
- площадь проёмов;
- площадь после вычета;
- площадь с запасом;
- полос нужно;
- полос из одного рулона;
- расчёт по площади;
- расчёт по полосам;
- короткое пояснение, что итог берётся как более осторожная оценка.

## Validation

Без Zod, локальная проверка в composable.

Правила:

- `roomLength > 0`
- `roomWidth > 0`
- `wallHeight > 0`
- `rollWidth > 0`
- `rollLength > 0`
- `windowsCount >= 0`, integer
- `doorsCount >= 0`, integer
- размеры окон/дверей `>= 0`
- `wastePercent >= 0 && wastePercent <= 100`
- если `usePatternRepeat`, то `patternRepeat > 0`
- NaN / Infinity невалидны
- пустые значения не должны ломать UI
- если площадь проёмов больше площади стен, `netWallArea = 0`, но показать предупреждение

## Rounding / Formatting

- площади — до 2 знаков;
- длины — до 2 знаков;
- рулоны и полосы — целые;
- проценты — до 1–2 знаков;
- не округлять промежуточные значения до финального форматирования.

## Minimal Calculation Functions

```txt
calculatePerimeter(length, width)
calculateWallArea(perimeter, height)
calculateOpeningsArea(input)
calculateNetWallArea(grossWallArea, openingsArea)
applyWaste(area, wastePercent)
calculateAdjustedStripHeight(wallHeight, usePatternRepeat, patternRepeat)
calculateStripsNeeded(perimeter, rollWidth)
calculateStripsPerRoll(rollLength, stripHeight)
calculateRollsByArea(areaWithWaste, rollArea)
calculateRollsByStrips(stripsNeeded, stripsPerRoll)
calculateWallpaper(input)
isValidPositiveNumber(value)
isValidNonNegativeNumber(value)
isValidNonNegativeInteger(value)
```

## Types

```txt
WallpaperInput
WallpaperResult
WallpaperValidationIssue
RollPreset
```

## Unit Tests

### Geometry

- `5 × 4 м`, высота `2.7 м` → периметр `18 м`, площадь стен `48.6 м²`.
- Окно `1.5 × 1.4`, дверь `0.9 × 2.0` → проёмы `3.9 м²`.
- Площадь после вычета корректна.
- Проёмы больше стен → `netWallArea = 0`.

### Rolls

- Рулон `1.06 × 10 м`, высота `2.7 м`: `floor(10 / 2.7) = 3` полосы.
- Периметр `18 м`, ширина `1.06 м`: `ceil(18 / 1.06) = 17` полос.
- `17` полос / `3` полосы из рулона → `6` рулонов.
- Запас 10% влияет на расчёт по площади.
- Итог берёт максимум из расчёта по площади и полосам.

### Pattern Repeat

- Высота `2.7 м`, раппорт `0.64 м` → adjusted strip height `3.2 м`.
- `floor(10 / 3.2) = 3` полосы.
- Если adjusted strip height больше длины рулона → invalid.

### Validation

- `roomLength = 0` invalid.
- `wallHeight = 0` invalid.
- `rollWidth = 0` invalid.
- `rollLength = 0` invalid.
- `windowsCount = -1` invalid.
- fractional windows count invalid.
- `wastePercent < 0` invalid.
- `wastePercent > 100` invalid.
- NaN / Infinity invalid.

## UI

Layout как у новых калькуляторов:

- desktop: форма слева, результат справа;
- mobile: результат ниже формы;
- карточки без вложенных card-inside-card.

### Form Sections

1. Размеры комнаты.
2. Окна и двери.
3. Рулон.
4. Запас и рисунок.

### UX

- Дефолтные значения должны сразу давать понятный результат.
- Presets рулонов переключаются одной кнопкой.
- Раппорт скрыт, пока `usePatternRepeat = false`.
- Проёмы можно оставить нулевыми.
- Пояснение короткое: калькулятор считает и по площади, и по полосам, чтобы не занизить количество рулонов.

## i18n

Добавить ключи:

- `wallpaper.*` в `ru.json` и `en.json`.
- Metadata title/description оставить в `calculators.ts`.
- Проверить отсутствие сырых ключей.

## Registry

Добавить:

```ts
{
  id: 'wallpaper',
  slug: 'wallpaper',
  categorySlug: 'construction',
  title: { ru: 'Калькулятор обоев', en: 'Wallpaper Calculator' },
  description: {
    ru: 'Расчёт количества рулонов обоев по размерам комнаты, проёмам, запасу и раппорту',
    en: 'Calculate wallpaper rolls from room dimensions, openings, waste and pattern repeat',
  },
  icon: '🏗️',
  status: 'ready',
  priority: 'P0',
  popularity: 84,
  path: '/construction/wallpaper',
  tags: [
    'обои',
    'рулоны обоев',
    'сколько обоев нужно',
    'расход обоев',
    'ремонт',
    'отделка',
    'раппорт',
    'wallpaper',
    'wallpaper rolls',
    'wallpaper calculator',
    'renovation',
  ],
  aliases: [
    'калькулятор обоев',
    'расчет обоев',
    'расчёт обоев',
    'сколько рулонов купить',
  ],
  componentLoader: () => import('../features/wallpaper-calculator'),
}
```

## SEO / Sitemap

После `ready`:

- `/construction/wallpaper/` в sitemap;
- `index,follow,max-image-preview:large`;
- canonical со slash;
- поиск должен находить по запросам:
  - `обои`
  - `рулоны обоев`
  - `сколько обоев нужно`
  - `расход обоев`
  - `раппорт`
  - `wallpaper`

## Checks

- `npm run type-check`
- `npm run test`
- `npm run build`
- Playwright smoke:
  - `/construction/wallpaper/`
  - mobile `360px`
  - search
  - sitemap
  - robots/canonical
  - presets рулонов
  - раппорт on/off
  - проёмы больше площади стен

## Implementation Steps

### Task 1: Calculation Core

**Files:**

- Create: `src/features/wallpaper-calculator/lib/calculations.ts`
- Create: `src/features/wallpaper-calculator/types/wallpaper.ts`
- Create: `src/features/wallpaper-calculator/lib/calculations.test.ts`

- [x] Описать типы.
- [x] Реализовать геометрию.
- [x] Реализовать расчёт рулонов по площади и полосам.
- [x] Реализовать раппорт.
- [x] Покрыть unit-тестами.

### Task 2: Composable

**Files:**

- Create: `src/features/wallpaper-calculator/composables/useWallpaperCalculator.ts`

- [x] Добавить state с дефолтами.
- [x] Добавить touched validation.
- [x] Добавить roll presets.
- [x] Вернуть computed result.

### Task 3: View

**Files:**

- Create: `src/features/wallpaper-calculator/components/WallpaperCalculatorView.vue`
- Create: `src/features/wallpaper-calculator/index.ts`

- [x] Собрать форму.
- [x] Собрать результат.
- [x] Добавить warning для проёмов больше площади стен.
- [x] Проверить mobile layout.

### Task 4: Registry / i18n / SEO

**Files:**

- Modify: `src/data/calculators.ts`
- Modify: `src/locales/ru.json`
- Modify: `src/locales/en.json`
- Modify: `public/sitemap.xml`

- [x] Добавить запись `wallpaper`.
- [x] Добавить локали.
- [x] Добавить sitemap.
- [x] Проверить search.

### Task 5: Verification

- [x] `npm run type-check`
- [x] `npm run test`
- [x] `npm run build`
- [x] Playwright smoke.
- [x] Обновить `PROJECT_STATUS.md`.

## Risks / Open Questions

- Считать только прямоугольную комнату в MVP или сразу дать ручную площадь стен? Рекомендация: MVP с размерами комнаты, позже добавить режим ручной площади.
- Нужен ли список отдельных окон/дверей? Рекомендация: MVP с количеством и типовым размером; dynamic list позже.
- Раппорт сильно зависит от рисунка и раскладки. Нужно дать пояснение, что расчёт справочный.
- Значок `🧻` может ассоциироваться не с обоями. Перед реализацией можно выбрать альтернативу, например `🧱` или `🏠`, если в UI будет смотреться лучше.

## Post-Completion

После релиза `/construction/wallpaper`:

- проверить категорию `/construction/` в sitemap и production;
- обновить construction roadmap progress;
- решить, идти ли дальше в `/construction/paint`.
