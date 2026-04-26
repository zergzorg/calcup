<template>
  <main class="equation-page" aria-labelledby="equation-title">
    <section class="equation-heading">
      <p class="equation-eyebrow">{{ t('equation.eyebrow') }}</p>
      <h1 id="equation-title">{{ t('equation.title') }}</h1>
      <p>{{ t('equation.intro') }}</p>
    </section>

    <div class="equation-workspace">
      <form class="equation-form" @submit.prevent>
        <section class="equation-section">
          <div class="equation-chip-list" role="group" :aria-label="t('equation.form.mode')">
            <button
              v-for="option in modeOptions"
              :key="option"
              type="button"
              class="equation-chip"
              :class="{ 'equation-chip--active': mode === option }"
              :aria-pressed="mode === option"
              @click="mode = option"
            >
              {{ t(`equation.modes.${option}`) }}
            </button>
          </div>
        </section>

        <section v-if="mode === 'linear'" class="equation-section">
          <div class="equation-section__header">
            <h2>{{ t('equation.form.linearTitle') }}</h2>
            <p>{{ t('equation.form.linearHelp') }}</p>
          </div>
          <div class="equation-grid--two">
            <EquationField
              id="equation-linear-a"
              v-model="linearA"
              :label="t('equation.form.a')"
              :issue="getIssue('linearA')"
            />
            <EquationField
              id="equation-linear-b"
              v-model="linearB"
              :label="t('equation.form.b')"
              :issue="getIssue('linearB')"
            />
          </div>
        </section>

        <section v-else class="equation-section">
          <div class="equation-section__header">
            <h2>{{ t('equation.form.quadraticTitle') }}</h2>
            <p>{{ t('equation.form.quadraticHelp') }}</p>
          </div>
          <div class="equation-grid--three">
            <EquationField
              id="equation-quadratic-a"
              v-model="quadraticA"
              :label="t('equation.form.a')"
              :issue="getIssue('quadraticA')"
            />
            <EquationField
              id="equation-quadratic-b"
              v-model="quadraticB"
              :label="t('equation.form.b')"
              :issue="getIssue('quadraticB')"
            />
            <EquationField
              id="equation-quadratic-c"
              v-model="quadraticC"
              :label="t('equation.form.c')"
              :issue="getIssue('quadraticC')"
            />
          </div>
        </section>
      </form>

      <section class="equation-result" aria-live="polite">
        <p class="equation-result__label">{{ t('equation.result.label') }}</p>

        <template v-if="result">
          <div class="equation-result__total">
            <span>{{ t('equation.result.summary') }}</span>
            <strong>{{ summaryText }}</strong>
          </div>

          <div class="equation-result__rows">
            <div class="equation-result__row">
              <span>{{ t('equation.result.equation') }}</span>
              <strong>{{ equationText }}</strong>
            </div>
            <div v-if="mode === 'quadratic' && 'discriminant' in result" class="equation-result__row">
              <span>{{ t('equation.result.discriminant') }}</span>
              <strong>{{ Number.isNaN(result.discriminant) ? '—' : formatNumber(result.discriminant) }}</strong>
            </div>
            <div class="equation-result__row">
              <span>{{ t('equation.result.roots') }}</span>
              <strong>{{ rootsText }}</strong>
            </div>
          </div>

          <p class="equation-formula">{{ formulaText }}</p>
        </template>

        <p v-else class="equation-result__empty">{{ t('equation.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEquationCalculator } from '../composables/useEquationCalculator'
import type { EquationMode, EquationValidationIssue } from '../types/equation'

const EquationField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    issue: { type: Object as () => EquationValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'equation-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'equation-input-wrap' }, [
        h('input', {
          id: props.id,
          value: Number.isNaN(props.modelValue) ? '' : props.modelValue,
          type: 'number',
          inputmode: 'decimal',
          step: 'any',
          'aria-invalid': Boolean(props.issue),
          'aria-describedby': errorId,
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value
            emit('update:modelValue', value === '' ? Number.NaN : Number(value))
          },
        }),
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'equation-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const modeOptions: EquationMode[] = ['linear', 'quadratic']

const {
  mode,
  linearA,
  linearB,
  quadraticA,
  quadraticB,
  quadraticC,
  result,
  getIssue,
} = useEquationCalculator()

const equationText = computed(() => {
  if (mode.value === 'linear') {
    return `${formatTerm(linearA.value, 'x')} ${formatSigned(linearB.value)} = 0`
  }

  return `${formatTerm(quadraticA.value, 'x²')} ${formatSignedTerm(quadraticB.value, 'x')} ${formatSigned(quadraticC.value)} = 0`
})

const summaryText = computed(() => {
  if (!result.value) return ''

  if (result.value.type === 'infinite') return t('equation.result.infinite')
  if (result.value.type === 'none') return t('equation.result.noRealRoots')
  if (result.value.type === 'linear') return t('equation.result.linearFallback')
  if (result.value.type === 'one') return t('equation.result.oneRoot')
  return t('equation.result.twoRoots')
})

const rootsText = computed(() => {
  if (!result.value) return ''

  if ('root' in result.value) {
    return result.value.root === null ? '—' : `x = ${formatNumber(result.value.root)}`
  }

  if (result.value.roots.length === 0) return '—'

  return result.value.roots
    .map((root, index) => `x${result.value && 'roots' in result.value && result.value.roots.length > 1 ? index + 1 : ''} = ${formatNumber(root)}`)
    .join(', ')
})

const formulaText = computed(() =>
  mode.value === 'linear'
    ? t('equation.formula.linear')
    : t('equation.formula.quadratic'),
)

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  })
}

function formatTerm(value: number, variable: string): string {
  if (value === 1) return variable
  if (value === -1) return `-${variable}`
  return `${formatNumber(value)}${variable}`
}

function formatSigned(value: number): string {
  return value < 0
    ? `- ${formatNumber(Math.abs(value))}`
    : `+ ${formatNumber(value)}`
}

function formatSignedTerm(value: number, variable: string): string {
  if (value < 0) return `- ${formatTerm(Math.abs(value), variable)}`
  return `+ ${formatTerm(value, variable)}`
}
</script>
