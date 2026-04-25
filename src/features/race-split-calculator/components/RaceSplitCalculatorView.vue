<template>
  <main class="race-split-page" aria-labelledby="race-split-title">
    <section class="race-split-heading">
      <p class="race-split-eyebrow">{{ t('raceSplit.eyebrow') }}</p>
      <h1 id="race-split-title">{{ t('raceSplit.title') }}</h1>
      <p>{{ t('raceSplit.intro') }}</p>
    </section>

    <div class="race-split-workspace">
      <form class="race-split-form" @submit.prevent>
        <section class="race-split-section">
          <div class="race-split-section__header">
            <h2>{{ t('raceSplit.form.raceTitle') }}</h2>
          </div>
          <div class="race-split-grid race-split-grid--two">
            <NumberField field="distanceKm" :label="t('raceSplit.form.distance')" :suffix="t('raceSplit.units.km')" :step="0.1" />
            <NumberField field="splitDistanceKm" :label="t('raceSplit.form.splitDistance')" :suffix="t('raceSplit.units.km')" :step="0.5" />
          </div>
        </section>

        <section class="race-split-section">
          <div class="race-split-section__header">
            <h2>{{ t('raceSplit.form.timeTitle') }}</h2>
          </div>
          <div class="race-split-grid race-split-grid--three">
            <NumberField field="hours" :label="t('raceSplit.form.hours')" :suffix="t('raceSplit.units.hours')" :step="1" :min="0" />
            <NumberField field="minutes" :label="t('raceSplit.form.minutes')" :suffix="t('raceSplit.units.minutes')" :step="1" :min="0" />
            <NumberField field="seconds" :label="t('raceSplit.form.seconds')" :suffix="t('raceSplit.units.seconds')" :step="1" :min="0" />
          </div>
        </section>
      </form>

      <section class="race-split-result" aria-live="polite">
        <p class="race-split-result__label">{{ t('raceSplit.result.label') }}</p>

        <template v-if="result">
          <div class="race-split-result__total">
            <span>{{ t('raceSplit.result.pace') }}</span>
            <strong>{{ t('raceSplit.result.paceValue', { value: formatPace(result.paceSecondsPerKm) }) }}</strong>
          </div>

          <div class="race-split-result__rows">
            <div class="race-split-result__row">
              <span>{{ t('raceSplit.result.finishTime') }}</span>
              <strong>{{ formatTime(result.totalSeconds) }}</strong>
            </div>
            <div class="race-split-result__row">
              <span>{{ t('raceSplit.result.speed') }}</span>
              <strong>{{ t('raceSplit.result.speedValue', { value: format(result.speedKmH) }) }}</strong>
            </div>
            <div
              v-for="split in result.splits"
              :key="split.distanceKm"
              class="race-split-result__row"
            >
              <span>{{ t('raceSplit.result.splitAt', { value: format(split.distanceKm) }) }}</span>
              <strong>{{ formatTime(split.cumulativeSeconds) }}</strong>
            </div>
          </div>

          <p class="race-split-formula">{{ t('raceSplit.formula') }}</p>
        </template>

        <p v-else class="race-split-result__empty">{{ t('raceSplit.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { secondsToParts } from '../lib/calculations'
import { useRaceSplitCalculator } from '../composables/useRaceSplitCalculator'
import type { RaceSplitInputField } from '../types/race-split'

const { t, n } = useI18n()
const { input, result, getIssue } = useRaceSplitCalculator()

const NumberField = defineComponent<{ field: RaceSplitInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'race-split-field' }, [
      h('label', { for: `race-split-${props.field}` }, props.label),
      h('div', { class: 'race-split-input-wrap' }, [
        h('input', {
          id: `race-split-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `race-split-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'race-split-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `race-split-${props.field}-error`, class: 'race-split-error' }, t(getIssue(props.field)!.messageKey))
        : null,
    ])
  },
})

function format(value: number): string {
  return n(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}

function formatTime(totalSeconds: number): string {
  const parts = secondsToParts(totalSeconds)
  const minutes = parts.minutes.toString().padStart(2, '0')
  const seconds = parts.seconds.toString().padStart(2, '0')
  return parts.hours > 0 ? `${parts.hours}:${minutes}:${seconds}` : `${parts.minutes}:${seconds}`
}

function formatPace(seconds: number): string {
  return formatTime(seconds)
}
</script>

<style scoped>
.race-split-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.race-split-heading {
  max-width: 760px;
}

.race-split-section {
  display: grid;
  gap: 16px;
}

.race-split-section + .race-split-section {
  padding-top: 4px;
}

.race-split-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.race-split-result__rows {
  display: grid;
}
</style>
