<template>
  <main class="fraction-page" aria-labelledby="fraction-title">
    <section class="fraction-heading">
      <p class="fraction-eyebrow">{{ t('fraction.eyebrow') }}</p>
      <h1 id="fraction-title">{{ t('fraction.title') }}</h1>
      <p>{{ t('fraction.intro') }}</p>
    </section>

    <div class="fraction-workspace">
      <form class="fraction-form" @submit.prevent>
        <section class="fraction-section">
          <div class="fraction-section__header">
            <h2>{{ t('fraction.form.leftTitle') }}</h2>
          </div>
          <div class="fraction-grid--two">
            <FractionField
              id="fraction-left-numerator"
              v-model="leftNumerator"
              :label="t('fraction.form.numerator')"
              :issue="getIssue('leftNumerator')"
            />
            <FractionField
              id="fraction-left-denominator"
              v-model="leftDenominator"
              :label="t('fraction.form.denominator')"
              :issue="getIssue('leftDenominator')"
            />
          </div>
        </section>

        <section class="fraction-section">
          <div class="fraction-section__header">
            <h2>{{ t('fraction.form.operation') }}</h2>
          </div>
          <div class="fraction-chip-list" role="group" :aria-label="t('fraction.form.operation')">
            <button
              v-for="option in operatorOptions"
              :key="option"
              type="button"
              class="fraction-chip"
              :class="{ 'fraction-chip--active': operator === option }"
              :aria-pressed="operator === option"
              @click="operator = option"
            >
              {{ t(`fraction.operators.${option}`) }}
            </button>
          </div>
        </section>

        <section class="fraction-section">
          <div class="fraction-section__header">
            <h2>{{ t('fraction.form.rightTitle') }}</h2>
          </div>
          <div class="fraction-grid--two">
            <FractionField
              id="fraction-right-numerator"
              v-model="rightNumerator"
              :label="t('fraction.form.numerator')"
              :issue="getIssue('rightNumerator')"
            />
            <FractionField
              id="fraction-right-denominator"
              v-model="rightDenominator"
              :label="t('fraction.form.denominator')"
              :issue="getIssue('rightDenominator')"
            />
          </div>
        </section>
      </form>

      <section class="fraction-result" aria-live="polite">
        <p class="fraction-result__label">{{ t('fraction.result.label') }}</p>

        <template v-if="result">
          <div class="fraction-result__total">
            <span>{{ t('fraction.result.simplified') }}</span>
            <strong>{{ formatFraction(result.fraction) }}</strong>
          </div>

          <div class="fraction-result__rows">
            <div class="fraction-result__row">
              <span>{{ t('fraction.result.expression') }}</span>
              <strong>{{ expressionText }}</strong>
            </div>
            <div v-if="result.mixed" class="fraction-result__row">
              <span>{{ t('fraction.result.mixed') }}</span>
              <strong>{{ formatMixed(result.mixed) }}</strong>
            </div>
            <div class="fraction-result__row">
              <span>{{ t('fraction.result.decimal') }}</span>
              <strong>{{ formatDecimal(result.decimal) }}</strong>
            </div>
          </div>

          <p class="fraction-formula">{{ t('fraction.formula') }}</p>
        </template>

        <p v-else class="fraction-result__empty">{{ t('fraction.result.empty') }}</p>
      </section>
    </div>

    <section class="fraction-popular" aria-labelledby="fraction-popular-title">
      <h2 id="fraction-popular-title">{{ t('fraction.popular.title') }}</h2>
      <ul>
        <li v-for="item in popularExamples" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { calculateFractions } from '../lib/calculations'
import { useFractionCalculator } from '../composables/useFractionCalculator'
import type {
  FractionOperator,
  FractionValidationIssue,
  FractionValue,
  MixedFraction,
} from '../types/fraction'

const FractionField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    issue: { type: Object as () => FractionValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'fraction-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'fraction-input-wrap' }, [
        h('input', {
          id: props.id,
          value: Number.isNaN(props.modelValue) ? '' : props.modelValue,
          type: 'number',
          inputmode: 'numeric',
          step: '1',
          'aria-invalid': Boolean(props.issue),
          'aria-describedby': errorId,
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value
            emit('update:modelValue', value === '' ? Number.NaN : Number(value))
          },
        }),
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'fraction-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()

const operatorOptions: FractionOperator[] = ['add', 'subtract', 'multiply', 'divide']
const operatorSymbols: Record<FractionOperator, string> = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷',
}

const {
  operator,
  leftNumerator,
  leftDenominator,
  rightNumerator,
  rightDenominator,
  result,
  getIssue,
} = useFractionCalculator()

const expressionText = computed(() =>
  [
    formatFraction({ numerator: leftNumerator.value, denominator: leftDenominator.value }),
    operatorSymbols[operator.value],
    formatFraction({ numerator: rightNumerator.value, denominator: rightDenominator.value }),
  ].join(' '),
)

const popularExamples = computed(() => {
  const examples: Array<[FractionValue, FractionValue, FractionOperator]> = [
    [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, 'add'],
    [{ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 8 }, 'subtract'],
    [{ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 5 }, 'multiply'],
    [{ numerator: 5, denominator: 6 }, { numerator: 2, denominator: 3 }, 'divide'],
  ]

  return examples
    .map(([left, right, action]) => {
      const exampleResult = calculateFractions(left, right, action)
      if (!exampleResult) return ''

      return t('fraction.popular.item', {
        left: formatFraction(left),
        operator: operatorSymbols[action],
        right: formatFraction(right),
        result: formatFraction(exampleResult.fraction),
      })
    })
    .filter(Boolean)
})

function formatFraction(fraction: FractionValue): string {
  if (!Number.isFinite(fraction.numerator) || !Number.isFinite(fraction.denominator)) {
    return '—'
  }

  if (fraction.denominator === 1) {
    return String(fraction.numerator)
  }

  return `${fraction.numerator}/${fraction.denominator}`
}

function formatMixed(mixed: MixedFraction): string {
  const sign = mixed.sign < 0 ? '-' : ''

  if (mixed.numerator === 0) {
    return `${sign}${mixed.whole}`
  }

  return `${sign}${mixed.whole} ${mixed.numerator}/${mixed.denominator}`
}

function formatDecimal(value: number): string {
  return n(value, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  })
}
</script>
