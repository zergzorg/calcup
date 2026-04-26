<template>
  <main class="compound-interest-page" aria-labelledby="compound-interest-title">
    <section class="compound-interest-heading">
      <p class="compound-interest-eyebrow">{{ t('compoundInterest.eyebrow') }}</p>
      <h1 id="compound-interest-title">{{ t('compoundInterest.title') }}</h1>
      <p>{{ t('compoundInterest.intro') }}</p>
    </section>

    <div class="compound-interest-workspace">
      <form class="compound-interest-form" @submit.prevent>
        <section class="compound-interest-section">
          <div class="compound-interest-section__header">
            <h2>{{ t('compoundInterest.form.termsTitle') }}</h2>
            <p>{{ t('compoundInterest.form.termsHelp') }}</p>
          </div>

          <CompoundInterestField
            id="compound-interest-initial"
            v-model="initialAmount"
            :label="t('compoundInterest.form.initialAmount')"
            :unit="t('compoundInterest.units.currency')"
            :issue="getIssue('initialAmount')"
            :min="0"
            :max="1000000000"
            :step="1000"
          />

          <CompoundInterestField
            id="compound-interest-contribution"
            v-model="monthlyContribution"
            :label="t('compoundInterest.form.monthlyContribution')"
            :unit="t('compoundInterest.units.currency')"
            :issue="getIssue('monthlyContribution')"
            :min="0"
            :max="100000000"
            :step="1000"
          />

          <div class="compound-interest-grid--two">
            <CompoundInterestField
              id="compound-interest-rate"
              v-model="annualRate"
              :label="t('compoundInterest.form.annualRate')"
              unit="%"
              :issue="getIssue('annualRate')"
              :min="0"
              :max="100"
              :step="0.1"
            />
            <CompoundInterestField
              id="compound-interest-term"
              v-model="termYears"
              :label="t('compoundInterest.form.termYears')"
              :unit="t('compoundInterest.units.years')"
              :issue="getIssue('termYears')"
              :min="1"
              :max="60"
              :step="1"
            />
          </div>

          <div class="compound-interest-chip-list" role="group" :aria-label="t('compoundInterest.form.termPresets')">
            <button
              v-for="preset in termPresets"
              :key="preset"
              type="button"
              class="compound-interest-chip"
              :class="{ 'compound-interest-chip--active': termYears === preset }"
              :aria-pressed="termYears === preset"
              @click="termYears = preset"
            >
              {{ t('compoundInterest.units.yearsValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <aside class="compound-interest-warning-note">
          <strong>{{ t('compoundInterest.warning.title') }}</strong>
          <span>{{ t('compoundInterest.warning.body') }}</span>
        </aside>
      </form>

      <section class="compound-interest-result" aria-live="polite">
        <p class="compound-interest-result__label">{{ t('compoundInterest.result.label') }}</p>

        <template v-if="result">
          <div class="compound-interest-result__total">
            <span>{{ t('compoundInterest.result.finalAmount') }}</span>
            <strong>{{ formatMoney(result.finalAmount) }}</strong>
          </div>

          <div class="compound-interest-result__rows">
            <div class="compound-interest-result__row">
              <span>{{ t('compoundInterest.result.ownContributions') }}</span>
              <strong>{{ formatMoney(result.ownContributions) }}</strong>
            </div>
            <div class="compound-interest-result__row">
              <span>{{ t('compoundInterest.result.interestEarned') }}</span>
              <strong>{{ formatMoney(result.interestEarned) }}</strong>
            </div>
            <div class="compound-interest-result__row">
              <span>{{ t('compoundInterest.result.effectiveGrowth') }}</span>
              <strong>{{ formatPercent(result.effectiveGrowthPercent) }}</strong>
            </div>
            <div class="compound-interest-result__row">
              <span>{{ t('compoundInterest.result.term') }}</span>
              <strong>{{ t('compoundInterest.units.monthsValue', { value: result.termMonths }) }}</strong>
            </div>
            <div class="compound-interest-result__row">
              <span>{{ t('compoundInterest.result.monthlyContribution') }}</span>
              <strong>{{ formatMoney(result.monthlyContribution) }}</strong>
            </div>
          </div>

          <p class="compound-interest-formula">{{ t('compoundInterest.formula') }}</p>
        </template>

        <p v-else class="compound-interest-result__empty">{{ t('compoundInterest.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useCompoundInterestCalculator } from '../composables/useCompoundInterestCalculator'
import type { CompoundInterestValidationIssue } from '../types/compoundInterest'

const CompoundInterestField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => CompoundInterestValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'compound-interest-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'compound-interest-input-wrap' }, [
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
        ? h('p', { id: errorId, class: 'compound-interest-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const termPresets = CALCULATOR_PRESETS_CONFIG.compoundInterest.termYears

const {
  initialAmount,
  monthlyContribution,
  annualRate,
  termYears,
  result,
  getIssue,
} = useCompoundInterestCalculator()

function formatMoney(value: number): string {
  return t('compoundInterest.units.currencyValue', {
    value: n(value, { maximumFractionDigits: 0 }),
  })
}

function formatPercent(value: number): string {
  return t('compoundInterest.units.percentValue', {
    value: n(value, { maximumFractionDigits: 2 }),
  })
}
</script>
