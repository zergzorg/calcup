<template>
  <main class="deposit-page" aria-labelledby="deposit-title">
    <section class="deposit-heading">
      <p class="deposit-eyebrow">{{ t('deposit.eyebrow') }}</p>
      <h1 id="deposit-title">{{ t('deposit.title') }}</h1>
      <p>{{ t('deposit.intro') }}</p>
    </section>

    <div class="deposit-workspace">
      <form class="deposit-form" @submit.prevent>
        <section class="deposit-section">
          <div class="deposit-section__header">
            <h2>{{ t('deposit.form.termsTitle') }}</h2>
            <p>{{ t('deposit.form.termsHelp') }}</p>
          </div>

          <DepositField
            id="deposit-initial-amount"
            v-model="initialAmount"
            :label="t('deposit.form.initialAmount')"
            :unit="t('deposit.units.currency')"
            :issue="getIssue('initialAmount')"
            :min="1000"
            :max="1000000000"
            :step="1000"
          />

          <div class="deposit-grid--two">
            <DepositField
              id="deposit-rate"
              v-model="annualRate"
              :label="t('deposit.form.annualRate')"
              unit="%"
              :issue="getIssue('annualRate')"
              :min="0"
              :max="100"
              :step="0.1"
            />
            <DepositField
              id="deposit-term"
              v-model="termMonths"
              :label="t('deposit.form.termMonths')"
              :unit="t('deposit.units.months')"
              :issue="getIssue('termMonths')"
              :min="1"
              :max="600"
              :step="1"
            />
          </div>

          <div class="deposit-chip-list" role="group" :aria-label="t('deposit.form.termPresets')">
            <button
              v-for="preset in termPresets"
              :key="preset"
              type="button"
              class="deposit-chip"
              :class="{ 'deposit-chip--active': termMonths === preset }"
              :aria-pressed="termMonths === preset"
              @click="termMonths = preset"
            >
              {{ t('deposit.units.monthsValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="deposit-section">
          <div class="deposit-section__header deposit-section__header--tight">
            <h2>{{ t('deposit.form.modeTitle') }}</h2>
          </div>

          <div class="deposit-chip-list" role="group" :aria-label="t('deposit.form.modeTitle')">
            <button
              v-for="option in modeOptions"
              :key="option"
              type="button"
              class="deposit-chip"
              :class="{ 'deposit-chip--active': mode === option }"
              :aria-pressed="mode === option"
              @click="mode = option"
            >
              {{ t(`deposit.modes.${option}`) }}
            </button>
          </div>
        </section>

        <aside class="deposit-warning-note">
          <strong>{{ t('deposit.warning.title') }}</strong>
          <span>{{ t('deposit.warning.body') }}</span>
        </aside>
      </form>

      <section class="deposit-result" aria-live="polite">
        <p class="deposit-result__label">{{ t('deposit.result.label') }}</p>

        <template v-if="result">
          <div class="deposit-result__total">
            <span>{{ t('deposit.result.finalAmount') }}</span>
            <strong>{{ formatMoney(result.finalAmount) }}</strong>
          </div>

          <div class="deposit-result__rows">
            <div class="deposit-result__row">
              <span>{{ t('deposit.result.initialAmount') }}</span>
              <strong>{{ formatMoney(result.initialAmount) }}</strong>
            </div>
            <div class="deposit-result__row">
              <span>{{ t('deposit.result.income') }}</span>
              <strong>{{ formatMoney(result.income) }}</strong>
            </div>
            <div class="deposit-result__row">
              <span>{{ t('deposit.result.effectiveGrowth') }}</span>
              <strong>{{ formatPercent(result.effectiveGrowthPercent) }}</strong>
            </div>
            <div class="deposit-result__row">
              <span>{{ t('deposit.result.term') }}</span>
              <strong>{{ t('deposit.units.monthsValue', { value: result.termMonths }) }}</strong>
            </div>
            <div class="deposit-result__row">
              <span>{{ t('deposit.result.mode') }}</span>
              <strong>{{ t(`deposit.modes.${result.mode}`) }}</strong>
            </div>
          </div>

          <p class="deposit-formula">{{ t('deposit.formula') }}</p>
        </template>

        <p v-else class="deposit-result__empty">{{ t('deposit.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useDepositCalculator } from '../composables/useDepositCalculator'
import type { DepositInterestMode, DepositValidationIssue } from '../types/deposit'

const DepositField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => DepositValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'deposit-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'deposit-input-wrap' }, [
        h('input', {
          id: props.id,
          value: Number.isNaN(props.modelValue) ? '' : props.modelValue,
          type: 'number',
          inputmode: 'decimal',
          min: props.min,
          max: props.max,
          step: props.step,
          'aria-invalid': Boolean(props.issue),
          'aria-describedby': errorId,
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value
            emit('update:modelValue', value === '' ? Number.NaN : Number(value))
          },
        }),
        h('span', props.unit),
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'deposit-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const termPresets = CALCULATOR_PRESETS_CONFIG.deposit.termMonths
const modeOptions: DepositInterestMode[] = ['simple', 'monthlyCapitalization']

const {
  initialAmount,
  annualRate,
  termMonths,
  mode,
  result,
  getIssue,
} = useDepositCalculator()

function formatMoney(value: number): string {
  return t('deposit.units.currencyValue', {
    value: n(value, { maximumFractionDigits: 0 }),
  })
}

function formatPercent(value: number): string {
  return t('deposit.units.percentValue', {
    value: n(value, { maximumFractionDigits: 2 }),
  })
}
</script>
