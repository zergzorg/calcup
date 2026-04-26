<template>
  <main class="cat-pregnancy-page" aria-labelledby="cat-pregnancy-title">
    <section class="cat-pregnancy-heading">
      <p class="cat-pregnancy-eyebrow">{{ t('catPregnancy.eyebrow') }}</p>
      <h1 id="cat-pregnancy-title">{{ t('catPregnancy.title') }}</h1>
      <p>{{ t('catPregnancy.intro') }}</p>
    </section>

    <div class="cat-pregnancy-workspace">
      <form class="cat-pregnancy-form" @submit.prevent>
        <section class="cat-pregnancy-section">
          <div class="cat-pregnancy-section__header">
            <h2>{{ t('catPregnancy.form.title') }}</h2>
            <p>{{ t('catPregnancy.form.help') }}</p>
          </div>

          <div class="cat-pregnancy-grid--two">
            <div class="cat-pregnancy-field">
              <label for="cat-pregnancy-mating">{{ t('catPregnancy.form.matingDate') }}</label>
              <div class="cat-pregnancy-input-wrap">
                <input
                  id="cat-pregnancy-mating"
                  v-model="input.matingDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('matingDate'))"
                  aria-describedby="cat-pregnancy-mating-error"
                  @blur="touch('matingDate')"
                >
              </div>
              <p v-if="getIssue('matingDate')" id="cat-pregnancy-mating-error" class="cat-pregnancy-error">
                {{ t(getIssue('matingDate')!.messageKey) }}
              </p>
            </div>

            <div class="cat-pregnancy-field">
              <label for="cat-pregnancy-today">{{ t('catPregnancy.form.todayDate') }}</label>
              <div class="cat-pregnancy-input-wrap">
                <input
                  id="cat-pregnancy-today"
                  v-model="input.todayDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('todayDate'))"
                  aria-describedby="cat-pregnancy-today-error"
                  @blur="touch('todayDate')"
                >
              </div>
              <p v-if="getIssue('todayDate')" id="cat-pregnancy-today-error" class="cat-pregnancy-error">
                {{ t(getIssue('todayDate')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="cat-pregnancy-warning-note">
          <strong>{{ t('catPregnancy.warning.title') }}</strong>
          <span>{{ t('catPregnancy.warning.body') }}</span>
        </aside>
      </form>

      <section class="cat-pregnancy-result" aria-live="polite">
        <p class="cat-pregnancy-result__label">{{ t('catPregnancy.result.label') }}</p>

        <template v-if="result">
          <div class="cat-pregnancy-result__total">
            <span>{{ t('catPregnancy.result.dueDate') }}</span>
            <strong>{{ formatDate(result.dueDate) }}</strong>
          </div>

          <div class="cat-pregnancy-result__rows">
            <div class="cat-pregnancy-result__row">
              <span>{{ t('catPregnancy.result.window') }}</span>
              <strong>{{ formatDate(result.earliestDate) }} - {{ formatDate(result.latestDate) }}</strong>
            </div>
            <div class="cat-pregnancy-result__row">
              <span>{{ t('catPregnancy.result.dayOfPregnancy') }}</span>
              <strong>{{ t('catPregnancy.units.dayValue', { value: n(result.dayOfPregnancy) }) }}</strong>
            </div>
            <div class="cat-pregnancy-result__row">
              <span>{{ t('catPregnancy.result.daysUntilDue') }}</span>
              <strong>{{ formatDaysUntilDue(result.daysUntilDue) }}</strong>
            </div>
            <div class="cat-pregnancy-result__row">
              <span>{{ t('catPregnancy.result.phase') }}</span>
              <strong>{{ t(`catPregnancy.phase.${result.phase}`) }}</strong>
            </div>
          </div>

          <p class="cat-pregnancy-formula">{{ t('catPregnancy.formula') }}</p>
        </template>

        <p v-else class="cat-pregnancy-result__empty">{{ t('catPregnancy.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatPregnancyCalculator } from '../composables/useCatPregnancyCalculator'

const { t, n, locale } = useI18n()
const { input, result, touch, getIssue } = useCatPregnancyCalculator()

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return new Intl.DateTimeFormat(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function formatDaysUntilDue(value: number): string {
  if (value === 0) return t('catPregnancy.units.today')

  return t(value > 0 ? 'catPregnancy.units.daysLeft' : 'catPregnancy.units.daysPast', {
    count: n(Math.abs(value), { maximumFractionDigits: 0 }),
  })
}
</script>
