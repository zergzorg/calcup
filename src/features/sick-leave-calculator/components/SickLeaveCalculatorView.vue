<template>
  <main class="sick-leave-page" aria-labelledby="sick-leave-title">
    <section class="sick-leave-heading">
      <p class="sick-leave-eyebrow">{{ t('sickLeave.eyebrow') }}</p>
      <h1 id="sick-leave-title">{{ t('sickLeave.title') }}</h1>
      <p>{{ t('sickLeave.intro') }}</p>
    </section>

    <div class="sick-leave-workspace">
      <form class="sick-leave-form" @submit.prevent>
        <section class="sick-leave-section">
          <h2>{{ t('sickLeave.form.incomeTitle') }}</h2>

          <div class="sick-leave-grid--two">
            <div class="sick-leave-field">
              <label for="sick-leave-income-2024">{{ t('sickLeave.form.income2024') }}</label>
              <div class="sick-leave-input-wrap">
                <input
                  id="sick-leave-income-2024"
                  v-model.number="income2024"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('income2024'))"
                  aria-describedby="sick-leave-income-2024-error"
                  @blur="touch('income2024')"
                >
                <span>{{ t('sickLeave.units.currency') }}</span>
              </div>
              <p v-if="getIssue('income2024')" id="sick-leave-income-2024-error" class="sick-leave-error">
                {{ t(getIssue('income2024')!.messageKey) }}
              </p>
            </div>

            <div class="sick-leave-field">
              <label for="sick-leave-income-2025">{{ t('sickLeave.form.income2025') }}</label>
              <div class="sick-leave-input-wrap">
                <input
                  id="sick-leave-income-2025"
                  v-model.number="income2025"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('income2025'))"
                  aria-describedby="sick-leave-income-2025-error"
                  @blur="touch('income2025')"
                >
                <span>{{ t('sickLeave.units.currency') }}</span>
              </div>
              <p v-if="getIssue('income2025')" id="sick-leave-income-2025-error" class="sick-leave-error">
                {{ t(getIssue('income2025')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <section class="sick-leave-section">
          <h2>{{ t('sickLeave.form.caseTitle') }}</h2>

          <div class="sick-leave-field">
            <label for="sick-leave-experience">{{ t('sickLeave.form.experience') }}</label>
            <select id="sick-leave-experience" v-model="experience">
              <option value="under5">{{ t('sickLeave.experience.under5') }}</option>
              <option value="from5to8">{{ t('sickLeave.experience.from5to8') }}</option>
              <option value="over8">{{ t('sickLeave.experience.over8') }}</option>
            </select>
          </div>

          <div class="sick-leave-grid--two">
            <div class="sick-leave-field">
              <label for="sick-leave-days">{{ t('sickLeave.form.sickDays') }}</label>
              <div class="sick-leave-input-wrap">
                <input
                  id="sick-leave-days"
                  v-model.number="sickDays"
                  type="number"
                  min="1"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('sickDays'))"
                  aria-describedby="sick-leave-days-error"
                  @blur="touch('sickDays')"
                >
                <span>{{ t('sickLeave.units.days') }}</span>
              </div>
              <p v-if="getIssue('sickDays')" id="sick-leave-days-error" class="sick-leave-error">
                {{ t(getIssue('sickDays')!.messageKey) }}
              </p>
            </div>

            <div class="sick-leave-field">
              <label for="sick-leave-tax">{{ t('sickLeave.form.taxPercent') }}</label>
              <div class="sick-leave-input-wrap">
                <input
                  id="sick-leave-tax"
                  v-model.number="taxPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getIssue('taxPercent'))"
                  aria-describedby="sick-leave-tax-error"
                  @blur="touch('taxPercent')"
                >
                <span>%</span>
              </div>
              <p v-if="getIssue('taxPercent')" id="sick-leave-tax-error" class="sick-leave-error">
                {{ t(getIssue('taxPercent')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="sick-leave-warning-note">
          <strong>{{ t('sickLeave.warning.title') }}</strong>
          <span>{{ t('sickLeave.warning.body') }}</span>
        </aside>
      </form>

      <section class="sick-leave-result" aria-live="polite">
        <p class="sick-leave-result__label">{{ t('sickLeave.result.label') }}</p>

        <template v-if="result">
          <div class="sick-leave-result__total">
            <span>{{ t('sickLeave.result.net') }}</span>
            <strong>{{ formatMoney(result.netBenefit) }}</strong>
          </div>

          <div class="sick-leave-result__rows">
            <div class="sick-leave-result__row">
              <span>{{ t('sickLeave.result.gross') }}</span>
              <strong>{{ formatMoney(result.grossBenefit) }}</strong>
            </div>
            <div class="sick-leave-result__row">
              <span>{{ t('sickLeave.result.daily') }}</span>
              <strong>{{ formatMoney(result.dailyBenefit) }}</strong>
            </div>
            <div class="sick-leave-result__row">
              <span>{{ t('sickLeave.result.tax') }}</span>
              <strong>{{ formatMoney(result.taxAmount) }}</strong>
            </div>
            <div class="sick-leave-result__row">
              <span>{{ t('sickLeave.result.employer') }}</span>
              <strong>{{ formatMoney(result.employerGross) }}</strong>
            </div>
            <div class="sick-leave-result__row">
              <span>{{ t('sickLeave.result.fund') }}</span>
              <strong>{{ formatMoney(result.fundGross) }}</strong>
            </div>
          </div>

          <p class="sick-leave-formula">{{ t('sickLeave.formula') }}</p>
        </template>

        <p v-else class="sick-leave-result__empty">{{ t('sickLeave.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSickLeaveCalculator } from '../composables/useSickLeaveCalculator'

const { t, n } = useI18n()

const {
  income2024,
  income2025,
  sickDays,
  experience,
  taxPercent,
  result,
  touch,
  getIssue,
} = useSickLeaveCalculator()

function formatMoney(value: number): string {
  return t('sickLeave.units.currencyValue', {
    value: n(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  })
}
</script>
