<template>
  <main class="refinance-page" aria-labelledby="refinance-title">
    <section class="refinance-heading">
      <p class="refinance-eyebrow">{{ t('refinance.eyebrow') }}</p>
      <h1 id="refinance-title">{{ t('refinance.title') }}</h1>
      <p>{{ t('refinance.intro') }}</p>
    </section>

    <div class="refinance-workspace">
      <form class="refinance-form" @submit.prevent>
        <section class="refinance-section">
          <div class="refinance-section__header">
            <h2>{{ t('refinance.form.balanceTitle') }}</h2>
            <p>{{ t('refinance.form.balanceHelp') }}</p>
          </div>

          <RefinanceField
            id="refinance-balance"
            v-model="outstandingBalance"
            :label="t('refinance.form.outstandingBalance')"
            :unit="t('refinance.units.currency')"
            :issue="getIssue('outstandingBalance')"
            :min="1000"
            :max="1000000000"
            :step="1000"
          />
        </section>

        <section class="refinance-section">
          <div class="refinance-section__header refinance-section__header--tight">
            <h2>{{ t('refinance.form.oldLoanTitle') }}</h2>
          </div>

          <div class="refinance-grid--two">
            <RefinanceField
              id="refinance-old-rate"
              v-model="oldAnnualRate"
              :label="t('refinance.form.oldAnnualRate')"
              unit="%"
              :issue="getIssue('oldAnnualRate')"
              :min="0"
              :max="100"
              :step="0.1"
            />
            <RefinanceField
              id="refinance-old-term"
              v-model="oldTermMonths"
              :label="t('refinance.form.oldTermMonths')"
              :unit="t('refinance.units.months')"
              :issue="getIssue('oldTermMonths')"
              :min="1"
              :max="600"
              :step="1"
            />
          </div>
        </section>

        <section class="refinance-section">
          <div class="refinance-section__header refinance-section__header--tight">
            <h2>{{ t('refinance.form.newLoanTitle') }}</h2>
          </div>

          <div class="refinance-grid--two">
            <RefinanceField
              id="refinance-new-rate"
              v-model="newAnnualRate"
              :label="t('refinance.form.newAnnualRate')"
              unit="%"
              :issue="getIssue('newAnnualRate')"
              :min="0"
              :max="100"
              :step="0.1"
            />
            <RefinanceField
              id="refinance-new-term"
              v-model="newTermMonths"
              :label="t('refinance.form.newTermMonths')"
              :unit="t('refinance.units.months')"
              :issue="getIssue('newTermMonths')"
              :min="1"
              :max="600"
              :step="1"
            />
          </div>

          <RefinanceField
            id="refinance-cost"
            v-model="refinancingCost"
            :label="t('refinance.form.refinancingCost')"
            :unit="t('refinance.units.currency')"
            :issue="getIssue('refinancingCost')"
            :min="0"
            :max="100000000"
            :step="1000"
          />
        </section>

        <aside class="refinance-warning-note">
          <strong>{{ t('refinance.warning.title') }}</strong>
          <span>{{ t('refinance.warning.body') }}</span>
        </aside>
      </form>

      <section class="refinance-result" aria-live="polite">
        <p class="refinance-result__label">{{ t('refinance.result.label') }}</p>

        <template v-if="result">
          <div class="refinance-result__total">
            <span>{{ result.isBeneficial ? t('refinance.result.savings') : t('refinance.result.loss') }}</span>
            <strong>{{ formatMoney(Math.abs(result.totalSavings)) }}</strong>
          </div>

          <div class="refinance-result__rows">
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.oldMonthlyPayment') }}</span>
              <strong>{{ formatMoney(result.oldMonthlyPayment) }}</strong>
            </div>
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.newMonthlyPayment') }}</span>
              <strong>{{ formatMoney(result.newMonthlyPayment) }}</strong>
            </div>
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.monthlySavings') }}</span>
              <strong>{{ formatSignedMoney(result.monthlySavings) }}</strong>
            </div>
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.oldTotalPayment') }}</span>
              <strong>{{ formatMoney(result.oldTotalPayment) }}</strong>
            </div>
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.newTotalPayment') }}</span>
              <strong>{{ formatMoney(result.newTotalPayment) }}</strong>
            </div>
            <div class="refinance-result__row">
              <span>{{ t('refinance.result.paybackMonths') }}</span>
              <strong>{{ result.paybackMonths === null ? t('refinance.result.noPayback') : t('refinance.units.monthsValue', { value: result.paybackMonths }) }}</strong>
            </div>
          </div>

          <p class="refinance-formula">{{ t('refinance.formula') }}</p>
        </template>

        <p v-else class="refinance-result__empty">{{ t('refinance.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRefinanceCalculator } from '../composables/useRefinanceCalculator'
import type { RefinanceValidationIssue } from '../types/refinance'

const RefinanceField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => RefinanceValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'refinance-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'refinance-input-wrap' }, [
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
        ? h('p', { id: errorId, class: 'refinance-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()

const {
  outstandingBalance,
  oldAnnualRate,
  oldTermMonths,
  newAnnualRate,
  newTermMonths,
  refinancingCost,
  result,
  getIssue,
} = useRefinanceCalculator()

function formatMoney(value: number): string {
  return t('refinance.units.currencyValue', {
    value: n(value, { maximumFractionDigits: 0 }),
  })
}

function formatSignedMoney(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${formatMoney(Math.abs(value))}`
}
</script>
