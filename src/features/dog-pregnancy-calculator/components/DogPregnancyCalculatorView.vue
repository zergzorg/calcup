<template>
  <main class="dog-pregnancy-page" aria-labelledby="dog-pregnancy-title">
    <section class="dog-pregnancy-heading">
      <p class="dog-pregnancy-eyebrow">{{ t('dogPregnancy.eyebrow') }}</p>
      <h1 id="dog-pregnancy-title">{{ t('dogPregnancy.title') }}</h1>
      <p>{{ t('dogPregnancy.intro') }}</p>
    </section>

    <div class="dog-pregnancy-workspace">
      <form class="dog-pregnancy-form" @submit.prevent>
        <section class="dog-pregnancy-section">
          <div class="dog-pregnancy-section__header">
            <h2>{{ t('dogPregnancy.form.methodTitle') }}</h2>
            <p>{{ t('dogPregnancy.form.methodHelp') }}</p>
          </div>

          <div class="dog-pregnancy-chip-list" role="group" :aria-label="t('dogPregnancy.form.mode')">
            <button
              v-for="mode in modes"
              :key="mode"
              type="button"
              class="dog-pregnancy-chip"
              :class="{ 'dog-pregnancy-chip--active': input.mode === mode }"
              :aria-pressed="input.mode === mode"
              @click="setMode(mode)"
            >
              {{ t(`dogPregnancy.modes.${mode}`) }}
            </button>
          </div>

          <div class="dog-pregnancy-grid--two">
            <div v-if="input.mode === 'mating'" class="dog-pregnancy-field">
              <label for="dog-pregnancy-mating">{{ t('dogPregnancy.form.matingDate') }}</label>
              <div class="dog-pregnancy-input-wrap">
                <input
                  id="dog-pregnancy-mating"
                  v-model="input.matingDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('matingDate'))"
                  aria-describedby="dog-pregnancy-mating-error"
                  @blur="touch('matingDate')"
                >
              </div>
              <p v-if="getIssue('matingDate')" id="dog-pregnancy-mating-error" class="dog-pregnancy-error">
                {{ t(getIssue('matingDate')!.messageKey) }}
              </p>
            </div>

            <div v-else class="dog-pregnancy-field">
              <label for="dog-pregnancy-ovulation">{{ t('dogPregnancy.form.ovulationDate') }}</label>
              <div class="dog-pregnancy-input-wrap">
                <input
                  id="dog-pregnancy-ovulation"
                  v-model="input.ovulationDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('ovulationDate'))"
                  aria-describedby="dog-pregnancy-ovulation-error"
                  @blur="touch('ovulationDate')"
                >
              </div>
              <p v-if="getIssue('ovulationDate')" id="dog-pregnancy-ovulation-error" class="dog-pregnancy-error">
                {{ t(getIssue('ovulationDate')!.messageKey) }}
              </p>
            </div>

            <div class="dog-pregnancy-field">
              <label for="dog-pregnancy-today">{{ t('dogPregnancy.form.todayDate') }}</label>
              <div class="dog-pregnancy-input-wrap">
                <input
                  id="dog-pregnancy-today"
                  v-model="input.todayDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('todayDate'))"
                  aria-describedby="dog-pregnancy-today-error"
                  @blur="touch('todayDate')"
                >
              </div>
              <p v-if="getIssue('todayDate')" id="dog-pregnancy-today-error" class="dog-pregnancy-error">
                {{ t(getIssue('todayDate')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="dog-pregnancy-warning-note">
          <strong>{{ t('dogPregnancy.warning.title') }}</strong>
          <span>{{ t('dogPregnancy.warning.body') }}</span>
        </aside>
      </form>

      <section class="dog-pregnancy-result" aria-live="polite">
        <p class="dog-pregnancy-result__label">{{ t('dogPregnancy.result.label') }}</p>

        <template v-if="result">
          <div class="dog-pregnancy-result__total">
            <span>{{ t('dogPregnancy.result.dueDate') }}</span>
            <strong>{{ formatDate(result.dueDate) }}</strong>
          </div>

          <div class="dog-pregnancy-result__rows">
            <div class="dog-pregnancy-result__row">
              <span>{{ t('dogPregnancy.result.window') }}</span>
              <strong>{{ formatDate(result.earliestDate) }} - {{ formatDate(result.latestDate) }}</strong>
            </div>
            <div class="dog-pregnancy-result__row">
              <span>{{ t('dogPregnancy.result.dayOfPregnancy') }}</span>
              <strong>{{ t('dogPregnancy.units.dayValue', { value: n(result.dayOfPregnancy) }) }}</strong>
            </div>
            <div class="dog-pregnancy-result__row">
              <span>{{ t('dogPregnancy.result.daysUntilDue') }}</span>
              <strong>{{ formatDaysUntilDue(result.daysUntilDue) }}</strong>
            </div>
            <div class="dog-pregnancy-result__row">
              <span>{{ t('dogPregnancy.result.phase') }}</span>
              <strong>{{ t(`dogPregnancy.phase.${result.phase}`) }}</strong>
            </div>
          </div>

          <p class="dog-pregnancy-formula">{{ t(`dogPregnancy.formula.${result.mode}`) }}</p>
        </template>

        <p v-else class="dog-pregnancy-result__empty">{{ t('dogPregnancy.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDogPregnancyCalculator } from '../composables/useDogPregnancyCalculator'
import type { DogPregnancyMode } from '../types/dog-pregnancy'

const { t, n, locale } = useI18n()
const modes: DogPregnancyMode[] = ['mating', 'ovulation']
const { input, result, setMode, touch, getIssue } = useDogPregnancyCalculator()

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
  if (value === 0) return t('dogPregnancy.units.today')

  return t(value > 0 ? 'dogPregnancy.units.daysLeft' : 'dogPregnancy.units.daysPast', {
    count: n(Math.abs(value), { maximumFractionDigits: 0 }),
  })
}
</script>
