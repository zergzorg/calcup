<template>
  <main class="workdays-page" aria-labelledby="workdays-title">
    <section class="workdays-heading">
      <p class="workdays-eyebrow">{{ t('workdays.eyebrow') }}</p>
      <h1 id="workdays-title">{{ t('workdays.title') }}</h1>
      <p>{{ t('workdays.intro') }}</p>
    </section>

    <div class="workdays-workspace">
      <form class="workdays-form" @submit.prevent>
        <section class="workdays-section">
          <div class="workdays-section__header">
            <h2>{{ t('workdays.form.title') }}</h2>
            <p>{{ t('workdays.form.description') }}</p>
          </div>

          <div class="workdays-grid workdays-grid--two">
            <div class="workdays-field">
              <label for="workdays-start">{{ t('workdays.form.startDate') }}</label>
              <input
                id="workdays-start"
                v-model="input.startDate"
                type="date"
                :aria-invalid="Boolean(getIssue('startDate'))"
                aria-describedby="workdays-start-error"
                @blur="touch('startDate')"
              >
              <p v-if="getIssue('startDate')" id="workdays-start-error" class="workdays-error">
                {{ t(getIssue('startDate')!.messageKey) }}
              </p>
            </div>

            <div class="workdays-field">
              <label for="workdays-end">{{ t('workdays.form.endDate') }}</label>
              <input
                id="workdays-end"
                v-model="input.endDate"
                type="date"
                :aria-invalid="Boolean(getIssue('endDate'))"
                aria-describedby="workdays-end-error"
                @blur="touch('endDate')"
              >
              <p v-if="getIssue('endDate')" id="workdays-end-error" class="workdays-error">
                {{ t(getIssue('endDate')!.messageKey) }}
              </p>
            </div>
          </div>

          <label class="workdays-toggle">
            <input v-model="input.includeEndDate" type="checkbox">
            {{ t('workdays.form.includeEndDate') }}
          </label>
        </section>
      </form>

      <section class="workdays-result" aria-live="polite">
        <p class="workdays-result__label">{{ t('workdays.result.label') }}</p>

        <template v-if="result">
          <div class="workdays-result__total">
            <span>{{ t('workdays.result.workdays') }}</span>
            <strong>{{ t('workdays.result.daysValue', { count: n(result.workdays, { maximumFractionDigits: 0 }) }) }}</strong>
          </div>

          <div class="workdays-result__rows">
            <div class="workdays-result__row">
              <span>{{ t('workdays.result.calendarDays') }}</span>
              <strong>{{ n(result.calendarDays, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="workdays-result__row">
              <span>{{ t('workdays.result.weekendDays') }}</span>
              <strong>{{ n(result.weekendDays, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="workdays-result__row">
              <span>{{ t('workdays.result.fullWeeks') }}</span>
              <strong>{{ n(result.fullWeeks, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="workdays-result__row">
              <span>{{ t('workdays.result.direction') }}</span>
              <strong>{{ t(`workdays.result.directionValue.${result.direction}`) }}</strong>
            </div>
          </div>

          <p class="workdays-formula">{{ t('workdays.formula') }}</p>
        </template>

        <p v-else class="workdays-result__empty">{{ t('workdays.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWorkdaysCalculator } from '../composables/useWorkdaysCalculator'

const { t, n } = useI18n()
const { input, result, touch, getIssue } = useWorkdaysCalculator()
</script>

<style scoped>
.workdays-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.workdays-heading {
  max-width: 760px;
}

.workdays-section {
  display: grid;
  gap: 16px;
}

.workdays-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.workdays-result__rows {
  display: grid;
}
</style>
