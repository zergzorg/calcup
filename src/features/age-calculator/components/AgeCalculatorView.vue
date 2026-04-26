<template>
  <main class="age-page" aria-labelledby="age-title">
    <section class="age-heading">
      <p class="age-eyebrow">{{ t('age.eyebrow') }}</p>
      <h1 id="age-title">{{ t('age.title') }}</h1>
      <p>{{ t('age.intro') }}</p>
    </section>

    <div class="age-workspace">
      <form class="age-form" @submit.prevent>
        <section class="age-section">
          <div class="age-section__header">
            <h2>{{ t('age.form.title') }}</h2>
            <p>{{ t('age.form.description') }}</p>
          </div>

          <div class="age-grid age-grid--two">
            <div class="age-field">
              <label for="age-birth">{{ t('age.form.birthDate') }}</label>
              <input
                id="age-birth"
                v-model="input.birthDate"
                type="date"
                :aria-invalid="Boolean(getIssue('birthDate'))"
                aria-describedby="age-birth-error"
                @blur="touch('birthDate')"
              >
              <p v-if="getIssue('birthDate')" id="age-birth-error" class="age-error">
                {{ t(getIssue('birthDate')!.messageKey) }}
              </p>
            </div>

            <div class="age-field">
              <label for="age-target">{{ t('age.form.targetDate') }}</label>
              <input
                id="age-target"
                v-model="input.targetDate"
                type="date"
                :aria-invalid="Boolean(getIssue('targetDate'))"
                aria-describedby="age-target-error"
                @blur="touch('targetDate')"
              >
              <p v-if="getIssue('targetDate')" id="age-target-error" class="age-error">
                {{ t(getIssue('targetDate')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>
      </form>

      <section class="age-result" aria-live="polite">
        <p class="age-result__label">{{ t('age.result.label') }}</p>

        <template v-if="result">
          <div class="age-result__total">
            <span>{{ t('age.result.age') }}</span>
            <strong>{{ t('age.result.ageValue', { years: result.age.years, months: result.age.months, days: result.age.days }) }}</strong>
          </div>

          <div class="age-result__rows">
            <div class="age-result__row">
              <span>{{ t('age.result.monthsTotal') }}</span>
              <strong>{{ n(result.totalMonths, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="age-result__row">
              <span>{{ t('age.result.weeksTotal') }}</span>
              <strong>{{ n(result.totalWeeks, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="age-result__row">
              <span>{{ t('age.result.daysTotal') }}</span>
              <strong>{{ n(result.totalDays, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="age-result__row">
              <span>{{ t('age.result.nextBirthday') }}</span>
              <strong>{{ formatDate(result.nextBirthday) }}</strong>
            </div>
            <div class="age-result__row">
              <span>{{ t('age.result.daysUntilBirthday') }}</span>
              <strong>{{ t('age.result.daysValue', { count: result.daysUntilBirthday }) }}</strong>
            </div>
            <div class="age-result__row">
              <span>{{ t('age.result.nextBirthdayAge') }}</span>
              <strong>{{ t('age.result.yearsValue', { count: result.nextBirthdayAge }) }}</strong>
            </div>
          </div>

          <p class="age-formula">{{ t('age.formula') }}</p>
        </template>

        <p v-else class="age-result__empty">{{ t('age.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateOnly } from '../lib/calculations'
import type { DateOnly } from '../types/age'
import { useAgeCalculator } from '../composables/useAgeCalculator'

const { t, n } = useI18n()
const { input, result, touch, getIssue } = useAgeCalculator()

function formatDate(date: DateOnly): string {
  return formatDateOnly(date)
}
</script>

<style scoped>
.age-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.age-heading {
  max-width: 760px;
}

.age-section {
  display: grid;
  gap: 16px;
}

.age-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.age-result__rows {
  display: grid;
}
</style>
