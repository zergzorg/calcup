<template>
  <main v-if="config" class="edu-math-page" :aria-labelledby="`${config.id}-title`">
    <section class="edu-math-heading">
      <p class="edu-math-eyebrow">{{ lang === 'ru' ? 'Учебная математика' : 'Study Math' }}</p>
      <h1 :id="`${config.id}-title`">{{ text(config.title) }}</h1>
      <p>{{ text(config.intro) }}</p>
    </section>

    <div class="edu-math-workspace">
      <form class="edu-math-form" @submit.prevent>
        <section class="edu-math-section">
          <h2>{{ text(config.formTitle) }}</h2>

          <div v-if="config.options" class="edu-math-field">
            <label for="edu-math-mode">{{ text(config.optionLabel!) }}</label>
            <div class="edu-math-input-wrap">
              <select id="edu-math-mode" v-model="mode">
                <option v-for="option in config.options" :key="option.value" :value="option.value">
                  {{ text(option.label) }}
                </option>
              </select>
            </div>
          </div>

          <div v-for="field in visibleFields" :key="field.key" class="edu-math-field">
            <label :for="`edu-math-${field.key}`">{{ text(field.label) }}</label>
            <div class="edu-math-input-wrap">
              <textarea
                v-if="field.type === 'textarea'"
                :id="`edu-math-${field.key}`"
                v-model="textValues[field.key]"
                rows="4"
                :placeholder="field.placeholder ? text(field.placeholder) : ''"
              />
              <input
                v-else-if="field.type === 'text'"
                :id="`edu-math-${field.key}`"
                v-model="textValues[field.key]"
                type="text"
                :placeholder="field.placeholder ? text(field.placeholder) : ''"
              >
              <input
                v-else
                :id="`edu-math-${field.key}`"
                v-model.number="values[field.key]"
                type="number"
                :step="field.step ?? 'any'"
                inputmode="decimal"
              >
              <span v-if="field.unit">{{ text(field.unit) }}</span>
            </div>
          </div>
        </section>
      </form>

      <section class="edu-math-result" aria-live="polite">
        <p class="edu-math-result__label">{{ lang === 'ru' ? 'Результат' : 'Result' }}</p>

        <template v-if="result">
          <div class="edu-math-result__total">
            <span>{{ label(result.primary.key) }}</span>
            <strong>{{ result.primary.value }}</strong>
          </div>

          <div class="edu-math-result__rows">
            <div v-for="row in result.rows" :key="row.key" class="edu-math-result__row">
              <span>{{ label(row.key) }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>

          <div v-if="result.steps?.length" class="edu-math-note">
            <strong>{{ lang === 'ru' ? 'Шаги' : 'Steps' }}</strong>
            <span v-for="step in result.steps" :key="step">{{ step }}</span>
          </div>

          <p class="edu-math-formula">{{ result.formula }}</p>
        </template>

        <p v-else class="edu-math-result__empty">
          {{ lang === 'ru' ? 'Введите корректные значения.' : 'Enter valid values.' }}
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  combinatorics,
  decimalToFraction,
  gcdLcm,
  geometryArea,
  parseNumberList,
  primeNumber,
  pythagorean,
  quadraticEquation,
  solidVolume,
  statistics,
  triangleBySides,
} from '../lib/calculations'
import type { CalculationResult, MissingPythagoreanSide, Shape2D, Solid3D } from '../lib/calculations'

type Lang = 'ru' | 'en'
type Text = Record<Lang, string>
type NumericInputValue = number | ''

interface FieldConfig {
  key: string
  label: Text
  defaultValue?: number
  defaultText?: string
  unit?: Text
  type?: 'number' | 'text' | 'textarea'
  step?: number
  modes?: string[]
  placeholder?: Text
}

interface OptionConfig {
  value: string
  label: Text
}

interface CalculatorConfig {
  id: string
  title: Text
  intro: Text
  formTitle: Text
  fields: FieldConfig[]
  options?: OptionConfig[]
  optionLabel?: Text
  labels: Record<string, Text>
  calculate: (mode: string, values: Record<string, number>, textValues: Record<string, string>) => CalculationResult | null
}

const configs: Record<string, CalculatorConfig> = {
  'geometry-area': {
    id: 'geometry-area',
    title: { ru: 'Площадь и периметр фигур', en: 'Area and Perimeter Calculator' },
    intro: { ru: 'Рассчитайте площадь, периметр и дополнительные параметры базовых фигур.', en: 'Calculate area, perimeter and extra measures for common shapes.' },
    formTitle: { ru: 'Фигура и размеры', en: 'Shape and dimensions' },
    optionLabel: { ru: 'Фигура', en: 'Shape' },
    options: [
      { value: 'rectangle', label: { ru: 'Прямоугольник', en: 'Rectangle' } },
      { value: 'circle', label: { ru: 'Круг', en: 'Circle' } },
      { value: 'triangle', label: { ru: 'Треугольник по основанию', en: 'Triangle by base' } },
      { value: 'trapezoid', label: { ru: 'Трапеция', en: 'Trapezoid' } },
    ],
    fields: [
      { key: 'a', label: { ru: 'Сторона A / основание A', en: 'Side A / base A' }, defaultValue: 5, modes: ['rectangle', 'trapezoid'] },
      { key: 'b', label: { ru: 'Сторона B / основание B', en: 'Side B / base B' }, defaultValue: 3, modes: ['rectangle', 'trapezoid'] },
      { key: 'radius', label: { ru: 'Радиус', en: 'Radius' }, defaultValue: 4, modes: ['circle'] },
      { key: 'base', label: { ru: 'Основание', en: 'Base' }, defaultValue: 6, modes: ['triangle'] },
      { key: 'height', label: { ru: 'Высота', en: 'Height' }, defaultValue: 4, modes: ['triangle', 'trapezoid'] },
    ],
    labels: defaultLabels(),
    calculate: (mode, values) => geometryArea(mode as Shape2D, values),
  },
  'solid-volume': {
    id: 'solid-volume',
    title: { ru: 'Объём геометрических тел', en: 'Solid Volume Calculator' },
    intro: { ru: 'Объём и площадь поверхности кубоида, цилиндра, сферы и конуса.', en: 'Volume and surface area for boxes, cylinders, spheres and cones.' },
    formTitle: { ru: 'Тело и размеры', en: 'Solid and dimensions' },
    optionLabel: { ru: 'Тело', en: 'Solid' },
    options: [
      { value: 'box', label: { ru: 'Параллелепипед', en: 'Box' } },
      { value: 'cylinder', label: { ru: 'Цилиндр', en: 'Cylinder' } },
      { value: 'sphere', label: { ru: 'Сфера', en: 'Sphere' } },
      { value: 'cone', label: { ru: 'Конус', en: 'Cone' } },
    ],
    fields: [
      { key: 'a', label: { ru: 'Длина', en: 'Length' }, defaultValue: 4, modes: ['box'] },
      { key: 'b', label: { ru: 'Ширина', en: 'Width' }, defaultValue: 3, modes: ['box'] },
      { key: 'c', label: { ru: 'Высота', en: 'Height' }, defaultValue: 2, modes: ['box'] },
      { key: 'radius', label: { ru: 'Радиус', en: 'Radius' }, defaultValue: 3, modes: ['cylinder', 'sphere', 'cone'] },
      { key: 'height', label: { ru: 'Высота', en: 'Height' }, defaultValue: 8, modes: ['cylinder', 'cone'] },
    ],
    labels: defaultLabels(),
    calculate: (mode, values) => solidVolume(mode as Solid3D, values),
  },
  pythagorean: {
    id: 'pythagorean',
    title: { ru: 'Теорема Пифагора', en: 'Pythagorean Theorem' },
    intro: { ru: 'Найдите неизвестную сторону прямоугольного треугольника.', en: 'Find the missing side of a right triangle.' },
    formTitle: { ru: 'Что найти', en: 'Find side' },
    optionLabel: { ru: 'Неизвестная сторона', en: 'Missing side' },
    options: [
      { value: 'c', label: { ru: 'Гипотенуза c', en: 'Hypotenuse c' } },
      { value: 'a', label: { ru: 'Катет a', en: 'Leg a' } },
      { value: 'b', label: { ru: 'Катет b', en: 'Leg b' } },
    ],
    fields: [
      { key: 'a', label: { ru: 'Катет a', en: 'Leg a' }, defaultValue: 3, modes: ['c', 'b'] },
      { key: 'b', label: { ru: 'Катет b', en: 'Leg b' }, defaultValue: 4, modes: ['c', 'a'] },
      { key: 'c', label: { ru: 'Гипотенуза c', en: 'Hypotenuse c' }, defaultValue: 5, modes: ['a', 'b'] },
    ],
    labels: defaultLabels(),
    calculate: (mode, values) => pythagorean(mode as MissingPythagoreanSide, values),
  },
  triangle: {
    id: 'triangle',
    title: { ru: 'Треугольник по сторонам', en: 'Triangle Calculator' },
    intro: { ru: 'Площадь, периметр и углы треугольника по трём сторонам.', en: 'Area, perimeter and angles from three sides.' },
    formTitle: { ru: 'Стороны', en: 'Sides' },
    fields: sideFields(),
    labels: defaultLabels(),
    calculate: (_, values) => triangleBySides(values.a, values.b, values.c),
  },
  'quadratic-equation-steps': {
    id: 'quadratic-equation-steps',
    title: { ru: 'Квадратное уравнение с шагами', en: 'Quadratic Equation With Steps' },
    intro: { ru: 'Дискриминант, корни и короткое пошаговое решение.', en: 'Discriminant, roots and short step-by-step solution.' },
    formTitle: { ru: 'Коэффициенты ax² + bx + c = 0', en: 'Coefficients ax² + bx + c = 0' },
    fields: [
      { key: 'a', label: { ru: 'a', en: 'a' }, defaultValue: 1 },
      { key: 'b', label: { ru: 'b', en: 'b' }, defaultValue: -5 },
      { key: 'c', label: { ru: 'c', en: 'c' }, defaultValue: 6 },
    ],
    labels: defaultLabels(),
    calculate: (_, values) => quadraticEquation(values.a, values.b, values.c),
  },
  'gcd-lcm': {
    id: 'gcd-lcm',
    title: { ru: 'НОД и НОК', en: 'GCD and LCM Calculator' },
    intro: { ru: 'Наибольший общий делитель и наименьшее общее кратное для списка чисел.', en: 'Greatest common divisor and least common multiple for a list.' },
    formTitle: { ru: 'Числа', en: 'Numbers' },
    fields: [{ key: 'numbers', label: { ru: 'Список чисел', en: 'Number list' }, type: 'textarea', defaultText: '12 18 30', placeholder: { ru: '12 18 30', en: '12 18 30' } }],
    labels: defaultLabels(),
    calculate: (_, __, textValues) => gcdLcm(parseNumberList(textValues.numbers)),
  },
  'prime-number': {
    id: 'prime-number',
    title: { ru: 'Проверка простого числа', en: 'Prime Number Calculator' },
    intro: { ru: 'Проверьте число и получите разложение на простые множители.', en: 'Check primality and get prime factorization.' },
    formTitle: { ru: 'Число', en: 'Number' },
    fields: [{ key: 'n', label: { ru: 'n', en: 'n' }, defaultValue: 97, step: 1 }],
    labels: defaultLabels(),
    calculate: (_, values) => primeNumber(values.n),
  },
  'decimal-to-fraction': {
    id: 'decimal-to-fraction',
    title: { ru: 'Десятичная дробь в обычную', en: 'Decimal to Fraction' },
    intro: { ru: 'Преобразуйте десятичное число в сокращённую обыкновенную дробь.', en: 'Convert a decimal to a simplified common fraction.' },
    formTitle: { ru: 'Десятичное число', en: 'Decimal' },
    fields: [{ key: 'decimal', label: { ru: 'Число', en: 'Number' }, type: 'text', defaultText: '1,25' }],
    labels: defaultLabels(),
    calculate: (_, __, textValues) => decimalToFraction(textValues.decimal),
  },
  statistics: {
    id: 'statistics',
    title: { ru: 'Статистика', en: 'Statistics Calculator' },
    intro: { ru: 'Среднее, медиана, квартили, дисперсия и стандартное отклонение.', en: 'Mean, median, quartiles, variance and standard deviation.' },
    formTitle: { ru: 'Набор данных', en: 'Dataset' },
    fields: [{ key: 'numbers', label: { ru: 'Значения', en: 'Values' }, type: 'textarea', defaultText: '10 12 14 16 18', placeholder: { ru: '10 12 14 16 18', en: '10 12 14 16 18' } }],
    labels: defaultLabels(),
    calculate: (_, __, textValues) => statistics(parseNumberList(textValues.numbers)),
  },
  combinatorics: {
    id: 'combinatorics',
    title: { ru: 'Комбинаторика', en: 'Combinatorics Calculator' },
    intro: { ru: 'Сочетания, размещения и перестановки для n и k.', en: 'Combinations, arrangements and permutations for n and k.' },
    formTitle: { ru: 'Параметры', en: 'Inputs' },
    fields: [
      { key: 'n', label: { ru: 'n', en: 'n' }, defaultValue: 5, step: 1 },
      { key: 'k', label: { ru: 'k', en: 'k' }, defaultValue: 2, step: 1 },
    ],
    labels: defaultLabels(),
    calculate: (_, values) => combinatorics(values.n, values.k),
  },
}

const route = useRoute()
const { locale } = useI18n()
const values = reactive<Record<string, NumericInputValue>>({})
const textValues = reactive<Record<string, string>>({})
const mode = ref('')

const lang = computed<Lang>(() => String(locale.value).startsWith('ru') ? 'ru' : 'en')
const config = computed(() => configs[String(route.meta.toolSlug)])
const visibleFields = computed(() => {
  const current = config.value
  if (!current) return []
  return current.fields.filter(field => !field.modes || field.modes.includes(mode.value))
})

watchEffect(() => {
  const current = config.value
  if (!current) return
  mode.value = mode.value || current.options?.[0]?.value || 'default'
  for (const field of current.fields) {
    if (field.type === 'text' || field.type === 'textarea') {
      if (textValues[field.key] === undefined) textValues[field.key] = field.defaultText ?? ''
    } else if (values[field.key] === undefined) {
      values[field.key] = field.defaultValue ?? 0
    }
  }
})

const numericValues = computed<Record<string, number>>(() => {
  const normalized: Record<string, number> = {}
  for (const [key, value] of Object.entries(values)) {
    normalized[key] = value === '' ? Number.NaN : Number(value)
  }
  return normalized
})

const result = computed(() => config.value?.calculate(mode.value, numericValues.value, textValues) ?? null)

function text(value: Text): string {
  return value[lang.value]
}

function label(key: string): string {
  return config.value?.labels[key]?.[lang.value] ?? key
}

function sideFields(): FieldConfig[] {
  return [
    { key: 'a', label: { ru: 'Сторона a', en: 'Side a' }, defaultValue: 3 },
    { key: 'b', label: { ru: 'Сторона b', en: 'Side b' }, defaultValue: 4 },
    { key: 'c', label: { ru: 'Сторона c', en: 'Side c' }, defaultValue: 5 },
  ]
}

function defaultLabels(): Record<string, Text> {
  return {
    area: { ru: 'Площадь', en: 'Area' },
    perimeter: { ru: 'Периметр', en: 'Perimeter' },
    diagonal: { ru: 'Диагональ', en: 'Diagonal' },
    diameter: { ru: 'Диаметр', en: 'Diameter' },
    doubleArea: { ru: 'Основание × высота', en: 'Base × height' },
    middleLine: { ru: 'Средняя линия', en: 'Midline' },
    volume: { ru: 'Объём', en: 'Volume' },
    surface: { ru: 'Площадь поверхности', en: 'Surface area' },
    surfaceBase: { ru: 'Площадь основания', en: 'Base area' },
    sideA: { ru: 'Катет a', en: 'Leg a' },
    sideB: { ru: 'Катет b', en: 'Leg b' },
    sideC: { ru: 'Гипотенуза c', en: 'Hypotenuse c' },
    squareSum: { ru: 'Сумма квадратов', en: 'Square sum' },
    squareDiff: { ru: 'Разность квадратов', en: 'Square difference' },
    angleA: { ru: 'Угол A', en: 'Angle A' },
    angleB: { ru: 'Угол B', en: 'Angle B' },
    angleC: { ru: 'Угол C', en: 'Angle C' },
    roots: { ru: 'Корни', en: 'Roots' },
    discriminant: { ru: 'Дискриминант', en: 'Discriminant' },
    sqrtD: { ru: '√D', en: '√D' },
    gcd: { ru: 'НОД', en: 'GCD' },
    lcm: { ru: 'НОК', en: 'LCM' },
    isPrime: { ru: 'Простое число', en: 'Is prime' },
    factors: { ru: 'Множители', en: 'Factors' },
    divisorsCount: { ru: 'Количество делителей', en: 'Divisors count' },
    fraction: { ru: 'Дробь', en: 'Fraction' },
    decimal: { ru: 'Десятичное значение', en: 'Decimal value' },
    mixed: { ru: 'Смешанная дробь', en: 'Mixed fraction' },
    mean: { ru: 'Среднее', en: 'Mean' },
    median: { ru: 'Медиана', en: 'Median' },
    q1: { ru: 'Q1', en: 'Q1' },
    q3: { ru: 'Q3', en: 'Q3' },
    variance: { ru: 'Дисперсия', en: 'Variance' },
    sampleVariance: { ru: 'Выборочная дисперсия', en: 'Sample variance' },
    stdev: { ru: 'Стандартное отклонение', en: 'Standard deviation' },
    combinations: { ru: 'Сочетания C(n,k)', en: 'Combinations C(n,k)' },
    arrangements: { ru: 'Размещения A(n,k)', en: 'Arrangements A(n,k)' },
    permutations: { ru: 'Перестановки n!', en: 'Permutations n!' },
    factorialK: { ru: 'k!', en: 'k!' },
  }
}
</script>
