<template>
  <main class="vacation-pay-page" aria-labelledby="vacation-pay-title">
    <section class="vacation-pay-heading">
      <p class="vacation-pay-eyebrow">{{ t('vacationPay.eyebrow') }}</p>
      <h1 id="vacation-pay-title">{{ t('vacationPay.title') }}</h1>
      <p>{{ t('vacationPay.intro') }}</p>
    </section>

    <div class="vacation-pay-workspace">
      <form class="vacation-pay-form" @submit.prevent>
        <section class="vacation-pay-section">
          <h2>{{ t('vacationPay.form.periodTitle') }}</h2>

          <div class="vacation-pay-field">
            <label for="vacation-pay-earnings">{{ t('vacationPay.form.earnings') }}</label>
            <div class="vacation-pay-input-wrap">
              <input
                id="vacation-pay-earnings"
                v-model.number="earnings"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('earnings'))"
                aria-describedby="vacation-pay-earnings-error"
                @blur="touch('earnings')"
              >
              <span>{{ t('vacationPay.units.currency') }}</span>
            </div>
            <p v-if="getIssue('earnings')" id="vacation-pay-earnings-error" class="vacation-pay-error">
              {{ t(getIssue('earnings')!.messageKey) }}
            </p>
          </div>

          <div class="vacation-pay-grid--two">
            <div class="vacation-pay-field">
              <label for="vacation-pay-full-months">{{ t('vacationPay.form.fullMonths') }}</label>
              <div class="vacation-pay-input-wrap">
                <input
                  id="vacation-pay-full-months"
                  v-model.number="fullMonths"
                  type="number"
                  min="0"
                  max="12"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getIssue('fullMonths'))"
                  aria-describedby="vacation-pay-full-months-error"
                  @blur="touch('fullMonths')"
                >
                <span>{{ t('vacationPay.units.months') }}</span>
              </div>
              <p v-if="getIssue('fullMonths')" id="vacation-pay-full-months-error" class="vacation-pay-error">
                {{ t(getIssue('fullMonths')!.messageKey) }}
              </p>
            </div>

            <div class="vacation-pay-field">
              <label for="vacation-pay-partial-days">{{ t('vacationPay.form.partialMonthDays') }}</label>
              <div class="vacation-pay-input-wrap">
                <input
                  id="vacation-pay-partial-days"
                  v-model.number="partialMonthDays"
                  type="number"
                  min="0"
                  max="31"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('partialMonthDays'))"
                  aria-describedby="vacation-pay-partial-days-error"
                  @blur="touch('partialMonthDays')"
                >
                <span>{{ t('vacationPay.units.days') }}</span>
              </div>
              <p v-if="getIssue('partialMonthDays')" id="vacation-pay-partial-days-error" class="vacation-pay-error">
                {{ t(getIssue('partialMonthDays')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <section class="vacation-pay-section">
          <h2>{{ t('vacationPay.form.vacationTitle') }}</h2>

          <div class="vacation-pay-grid--two">
            <div class="vacation-pay-field">
              <label for="vacation-pay-days">{{ t('vacationPay.form.vacationDays') }}</label>
              <div class="vacation-pay-input-wrap">
                <input
                  id="vacation-pay-days"
                  v-model.number="vacationDays"
                  type="number"
                  min="1"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('vacationDays'))"
                  aria-describedby="vacation-pay-days-error"
                  @blur="touch('vacationDays')"
                >
                <span>{{ t('vacationPay.units.days') }}</span>
              </div>
              <p v-if="getIssue('vacationDays')" id="vacation-pay-days-error" class="vacation-pay-error">
                {{ t(getIssue('vacationDays')!.messageKey) }}
              </p>
            </div>

            <div class="vacation-pay-field">
              <label for="vacation-pay-tax">{{ t('vacationPay.form.taxPercent') }}</label>
              <div class="vacation-pay-input-wrap">
                <input
                  id="vacation-pay-tax"
                  v-model.number="taxPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('taxPercent'))"
                  aria-describedby="vacation-pay-tax-error"
                  @blur="touch('taxPercent')"
                >
                <span>%</span>
              </div>
              <p v-if="getIssue('taxPercent')" id="vacation-pay-tax-error" class="vacation-pay-error">
                {{ t(getIssue('taxPercent')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="vacation-pay-warning-note">
          <strong>{{ t('vacationPay.warning.title') }}</strong>
          <span>{{ t('vacationPay.warning.body') }}</span>
        </aside>
      </form>

      <section class="vacation-pay-result" aria-live="polite">
        <p class="vacation-pay-result__label">{{ t('vacationPay.result.label') }}</p>

        <template v-if="result">
          <div class="vacation-pay-result__total">
            <span>{{ t('vacationPay.result.net') }}</span>
            <strong>{{ formatMoney(result.netVacationPay) }}</strong>
          </div>

          <div class="vacation-pay-result__rows">
            <div class="vacation-pay-result__row">
              <span>{{ t('vacationPay.result.gross') }}</span>
              <strong>{{ formatMoney(result.grossVacationPay) }}</strong>
            </div>
            <div class="vacation-pay-result__row">
              <span>{{ t('vacationPay.result.averageDaily') }}</span>
              <strong>{{ formatMoney(result.averageDailyEarnings) }}</strong>
            </div>
            <div class="vacation-pay-result__row">
              <span>{{ t('vacationPay.result.accountingDays') }}</span>
              <strong>{{ n(result.accountingDays, { maximumFractionDigits: 2 }) }}</strong>
            </div>
            <div class="vacation-pay-result__row">
              <span>{{ t('vacationPay.result.tax') }}</span>
              <strong>{{ formatMoney(result.taxAmount) }}</strong>
            </div>
          </div>

          <p class="vacation-pay-formula">{{ t('vacationPay.formula') }}</p>
        </template>

        <p v-else class="vacation-pay-result__empty">{{ t('vacationPay.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useVacationPayCalculator } from '../composables/useVacationPayCalculator'

const { t, n } = useI18n()

const {
  earnings,
  fullMonths,
  partialMonthDays,
  vacationDays,
  taxPercent,
  result,
  touch,
  getIssue,
} = useVacationPayCalculator()

function formatMoney(value: number): string {
  return t('vacationPay.units.currencyValue', {
    value: n(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  })
}
</script>
