<template>
  <main class="pregnancy-due-date-page" aria-labelledby="pregnancy-due-date-title">
    <section class="pregnancy-due-date-heading">
      <p class="pregnancy-due-date-eyebrow">{{ t('pregnancyDueDate.eyebrow') }}</p>
      <h1 id="pregnancy-due-date-title">{{ t('pregnancyDueDate.title') }}</h1>
      <p>{{ t('pregnancyDueDate.intro') }}</p>
    </section>

    <div class="pregnancy-due-date-workspace">
      <form class="pregnancy-due-date-form" @submit.prevent>
        <section class="pregnancy-due-date-section">
          <div class="pregnancy-due-date-section__header">
            <h2>{{ t('pregnancyDueDate.form.methodTitle') }}</h2>
            <p>{{ t('pregnancyDueDate.form.methodHelp') }}</p>
          </div>

          <div class="pregnancy-due-date-chip-list" role="group" :aria-label="t('pregnancyDueDate.form.mode')">
            <button
              v-for="option in modeOptions"
              :key="option"
              type="button"
              class="pregnancy-due-date-chip"
              :class="{ 'pregnancy-due-date-chip--active': mode === option }"
              :aria-pressed="mode === option"
              @click="mode = option"
            >
              {{ t(`pregnancyDueDate.modes.${option}`) }}
            </button>
          </div>

          <div class="pregnancy-due-date-grid--two">
            <div v-if="mode === 'lmp'" class="pregnancy-due-date-field">
              <label for="pregnancy-due-date-lmp">{{ t('pregnancyDueDate.form.lmpDate') }}</label>
              <div class="pregnancy-due-date-input-wrap">
                <input
                  id="pregnancy-due-date-lmp"
                  v-model="lmpDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('lmpDate'))"
                  aria-describedby="pregnancy-due-date-lmp-error"
                  @blur="touch('lmpDate')"
                >
              </div>
              <p v-if="getIssue('lmpDate')" id="pregnancy-due-date-lmp-error" class="pregnancy-due-date-error">
                {{ t(getIssue('lmpDate')!.messageKey) }}
              </p>
            </div>

            <div v-else class="pregnancy-due-date-field">
              <label for="pregnancy-due-date-conception">{{ t('pregnancyDueDate.form.conceptionDate') }}</label>
              <div class="pregnancy-due-date-input-wrap">
                <input
                  id="pregnancy-due-date-conception"
                  v-model="conceptionDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('conceptionDate'))"
                  aria-describedby="pregnancy-due-date-conception-error"
                  @blur="touch('conceptionDate')"
                >
              </div>
              <p v-if="getIssue('conceptionDate')" id="pregnancy-due-date-conception-error" class="pregnancy-due-date-error">
                {{ t(getIssue('conceptionDate')!.messageKey) }}
              </p>
            </div>

            <div class="pregnancy-due-date-field">
              <label for="pregnancy-due-date-today">{{ t('pregnancyDueDate.form.todayDate') }}</label>
              <div class="pregnancy-due-date-input-wrap">
                <input
                  id="pregnancy-due-date-today"
                  v-model="todayDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('todayDate'))"
                  aria-describedby="pregnancy-due-date-today-error"
                  @blur="touch('todayDate')"
                >
              </div>
              <p v-if="getIssue('todayDate')" id="pregnancy-due-date-today-error" class="pregnancy-due-date-error">
                {{ t(getIssue('todayDate')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="pregnancy-due-date-warning-note">
          <strong>{{ t('pregnancyDueDate.warning.title') }}</strong>
          <span>{{ t('pregnancyDueDate.warning.body') }}</span>
        </aside>
      </form>

      <section class="pregnancy-due-date-result" aria-live="polite">
        <p class="pregnancy-due-date-result__label">{{ t('pregnancyDueDate.result.label') }}</p>

        <template v-if="result">
          <div class="pregnancy-due-date-result__total">
            <span>{{ t('pregnancyDueDate.result.dueDate') }}</span>
            <strong>{{ formatDate(result.dueDate) }}</strong>
          </div>

          <div class="pregnancy-due-date-result__rows">
            <div class="pregnancy-due-date-result__row">
              <span>{{ t('pregnancyDueDate.result.gestationalAge') }}</span>
              <strong>{{ t('pregnancyDueDate.units.weeksDays', { weeks: n(result.gestationalWeeks), days: n(result.gestationalDays) }) }}</strong>
            </div>
            <div class="pregnancy-due-date-result__row">
              <span>{{ t('pregnancyDueDate.result.trimester') }}</span>
              <strong>{{ t(`pregnancyDueDate.trimesters.${result.trimester}`) }}</strong>
            </div>
            <div class="pregnancy-due-date-result__row">
              <span>{{ t('pregnancyDueDate.result.daysUntilDue') }}</span>
              <strong>{{ formatDaysUntilDue(result.daysUntilDue) }}</strong>
            </div>
            <div class="pregnancy-due-date-result__row">
              <span>{{ t('pregnancyDueDate.result.status') }}</span>
              <strong>{{ t(`pregnancyDueDate.status.${result.status}`) }}</strong>
            </div>
          </div>

          <p class="pregnancy-due-date-formula">{{ t('pregnancyDueDate.formula') }}</p>
        </template>

        <p v-else class="pregnancy-due-date-result__empty">{{ t('pregnancyDueDate.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePregnancyDueDateCalculator } from '../composables/usePregnancyDueDateCalculator'
import type { PregnancyDueDateMode } from '../types/pregnancyDueDate'

const { t, n, locale } = useI18n()
const modeOptions: PregnancyDueDateMode[] = ['lmp', 'conception']

const {
  mode,
  lmpDate,
  conceptionDate,
  todayDate,
  result,
  touch,
  getIssue,
} = usePregnancyDueDateCalculator()

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return new Intl.DateTimeFormat(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function formatDaysUntilDue(value: number): string {
  if (value === 0) return t('pregnancyDueDate.units.today')

  return t(value > 0 ? 'pregnancyDueDate.units.daysLeft' : 'pregnancyDueDate.units.daysPast', {
    count: n(Math.abs(value), { maximumFractionDigits: 0 }),
  })
}
</script>
