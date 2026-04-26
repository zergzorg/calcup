<template>
  <main class="mortgage-page" aria-labelledby="mortgage-title">
    <section class="mortgage-heading">
      <p class="mortgage-eyebrow">{{ t('mortgage.eyebrow') }}</p>
      <h1 id="mortgage-title">{{ t('mortgage.title') }}</h1>
      <p>{{ t('mortgage.intro') }}</p>
    </section>

    <div class="mortgage-workspace">
      <form class="mortgage-form" @submit.prevent>
        <section class="mortgage-section">
          <div class="mortgage-section__header">
            <h2>{{ t('mortgage.form.termsTitle') }}</h2>
            <p>{{ t('mortgage.form.termsHelp') }}</p>
          </div>

          <MortgageField
            id="mortgage-property-price"
            v-model="propertyPrice"
            :label="t('mortgage.form.propertyPrice')"
            :unit="t('mortgage.units.currency')"
            :issue="getIssue('propertyPrice')"
            :min="100000"
            :max="1000000000"
            :step="10000"
          />

          <div class="mortgage-grid--three">
            <MortgageField
              id="mortgage-down-payment"
              v-model="downPaymentPercent"
              :label="t('mortgage.form.downPaymentPercent')"
              unit="%"
              :issue="getIssue('downPaymentPercent')"
              :min="0"
              :max="99"
              :step="1"
            />
            <MortgageField
              id="mortgage-rate"
              v-model="annualRate"
              :label="t('mortgage.form.annualRate')"
              unit="%"
              :issue="getIssue('annualRate')"
              :min="0"
              :max="100"
              :step="0.1"
            />
            <MortgageField
              id="mortgage-term"
              v-model="termYears"
              :label="t('mortgage.form.termYears')"
              :unit="t('mortgage.units.years')"
              :issue="getIssue('termYears')"
              :min="1"
              :max="40"
              :step="1"
            />
          </div>

          <div class="mortgage-chip-list" role="group" :aria-label="t('mortgage.form.downPaymentPresets')">
            <button
              v-for="preset in downPaymentPresets"
              :key="preset"
              type="button"
              class="mortgage-chip"
              :class="{ 'mortgage-chip--active': downPaymentPercent === preset }"
              :aria-pressed="downPaymentPercent === preset"
              @click="downPaymentPercent = preset"
            >
              {{ preset }}%
            </button>
          </div>
        </section>

        <aside class="mortgage-warning-note">
          <strong>{{ t('mortgage.warning.title') }}</strong>
          <span>{{ t('mortgage.warning.body') }}</span>
        </aside>
      </form>

      <section class="mortgage-result" aria-live="polite">
        <p class="mortgage-result__label">{{ t('mortgage.result.label') }}</p>

        <template v-if="result">
          <div class="mortgage-result__total">
            <span>{{ t('mortgage.result.monthlyPayment') }}</span>
            <strong>{{ formatMoney(result.monthlyPayment) }}</strong>
          </div>

          <div class="mortgage-result__rows">
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.principal') }}</span>
              <strong>{{ formatMoney(result.principal) }}</strong>
            </div>
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.downPaymentAmount') }}</span>
              <strong>{{ formatMoney(result.downPaymentAmount) }}</strong>
            </div>
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.totalPayment') }}</span>
              <strong>{{ formatMoney(result.totalPayment) }}</strong>
            </div>
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.overpayment') }}</span>
              <strong>{{ formatMoney(result.overpayment) }}</strong>
            </div>
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.termMonths') }}</span>
              <strong>{{ t('mortgage.units.monthsValue', { value: result.termMonths }) }}</strong>
            </div>
            <div class="mortgage-result__row">
              <span>{{ t('mortgage.result.loanToValue') }}</span>
              <strong>{{ formatPercent(result.loanToValuePercent) }}</strong>
            </div>
          </div>

          <p class="mortgage-formula">{{ t('mortgage.formula') }}</p>
        </template>

        <p v-else class="mortgage-result__empty">{{ t('mortgage.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMortgageCalculator } from '../composables/useMortgageCalculator'
import type { MortgageValidationIssue } from '../types/mortgage'

const MortgageField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => MortgageValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'mortgage-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'mortgage-input-wrap' }, [
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
        ? h('p', { id: errorId, class: 'mortgage-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const downPaymentPresets = [10, 15, 20, 30]

const {
  propertyPrice,
  downPaymentPercent,
  annualRate,
  termYears,
  result,
  getIssue,
} = useMortgageCalculator()

function formatMoney(value: number): string {
  return t('mortgage.units.currencyValue', {
    value: n(value, { maximumFractionDigits: 0 }),
  })
}

function formatPercent(value: number): string {
  return t('mortgage.units.percentValue', {
    value: n(value, { maximumFractionDigits: 1 }),
  })
}
</script>
