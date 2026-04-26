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

        <section class="age-section">
          <div class="age-section__header">
            <h2>{{ t('age.milestone.title') }}</h2>
            <p>{{ t('age.milestone.description') }}</p>
          </div>

          <div class="age-grid age-grid--two">
            <div class="age-field">
              <label for="age-milestone-value">{{ t('age.milestone.value') }}</label>
              <input
                id="age-milestone-value"
                v-model.number="input.milestoneValue"
                type="number"
                min="1"
                max="200000"
                step="1"
                :aria-invalid="Boolean(getIssue('milestoneValue'))"
                aria-describedby="age-milestone-error"
                @blur="touch('milestoneValue')"
              >
              <p v-if="getIssue('milestoneValue')" id="age-milestone-error" class="age-error">
                {{ t(getIssue('milestoneValue')!.messageKey) }}
              </p>
            </div>

            <div class="age-field">
              <label for="age-milestone-unit">{{ t('age.milestone.unit') }}</label>
              <select id="age-milestone-unit" v-model="input.milestoneUnit">
                <option v-for="unit in milestoneUnits" :key="unit" :value="unit">
                  {{ t(`age.units.${unit}`) }}
                </option>
              </select>
            </div>
          </div>

          <div class="age-field">
            <span class="age-field__label">{{ t('age.milestone.quick') }}</span>
            <div class="age-chip-list" role="group" :aria-label="t('age.milestone.quick')">
              <button
                v-for="preset in milestonePresets"
                :key="`${preset.value}-${preset.unit}`"
                type="button"
                class="age-chip"
                :class="{ 'age-chip--active': input.milestoneValue === preset.value && input.milestoneUnit === preset.unit }"
                @click="setMilestone(preset.value, preset.unit)"
              >
                {{ n(preset.value) }} {{ t(`age.unitsShort.${preset.unit}`) }}
              </button>
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

          <p v-if="result.milestone" class="age-formula">
            <strong>{{ t('age.milestone.resultTitle') }}: {{ formatDate(result.milestone.date) }}</strong><br>
            {{ milestoneSummary }}
          </p>

          <div class="age-result__rows">
            <div
              v-for="item in result.upcomingMilestones"
              :key="`${item.value}-${item.unit}`"
              class="age-result__row"
            >
              <span>{{ n(item.value) }} {{ t(`age.unitsShort.${item.unit}`) }}</span>
              <strong>{{ formatDate(item.date) }}</strong>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateOnly } from '../lib/calculations'
import type { AgeMilestoneUnit, DateOnly } from '../types/age'
import { useAgeCalculator } from '../composables/useAgeCalculator'

const { t, n } = useI18n()
const { input, result, touch, getIssue } = useAgeCalculator()
const milestoneUnits: AgeMilestoneUnit[] = ['days', 'weeks', 'months', 'years']
const milestonePresets: Array<{ value: number, unit: AgeMilestoneUnit }> = [
  { value: 1_000, unit: 'days' },
  { value: 5_000, unit: 'days' },
  { value: 10_000, unit: 'days' },
  { value: 1_000, unit: 'weeks' },
  { value: 5_000, unit: 'weeks' },
  { value: 500, unit: 'months' },
  { value: 1_000, unit: 'months' },
  { value: 100, unit: 'years' },
]

const milestoneSummary = computed(() => {
  const milestone = result.value?.milestone
  if (!milestone) return ''

  const params = {
    value: n(milestone.value),
    unit: t(`age.units.${milestone.unit}`),
    years: milestone.age.years,
    months: milestone.age.months,
    days: milestone.age.days,
    count: Math.abs(milestone.daysFromTarget),
  }

  if (milestone.daysFromTarget === 0) return t('age.milestone.today', params)
  return milestone.isPast
    ? t('age.milestone.past', params)
    : t('age.milestone.future', params)
})

function formatDate(date: DateOnly): string {
  return formatDateOnly(date)
}

function setMilestone(value: number, unit: AgeMilestoneUnit) {
  input.milestoneValue = value
  input.milestoneUnit = unit
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
