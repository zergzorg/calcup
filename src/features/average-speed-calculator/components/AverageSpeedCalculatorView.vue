<template>
  <main class="average-speed-page" aria-labelledby="average-speed-title">
    <section class="average-speed-heading">
      <p class="average-speed-eyebrow">{{ t('averageSpeed.eyebrow') }}</p>
      <h1 id="average-speed-title">{{ t('averageSpeed.title') }}</h1>
      <p>{{ t('averageSpeed.intro') }}</p>
    </section>

    <div class="average-speed-workspace">
      <form class="average-speed-form" @submit.prevent>
        <section class="average-speed-section">
          <div class="average-speed-section__header">
            <h2>{{ t('averageSpeed.form.routeTitle') }}</h2>
          </div>
          <NumberField field="distanceKm" :label="t('averageSpeed.form.distance')" :suffix="t('averageSpeed.units.km')" :step="0.1" />
        </section>

        <section class="average-speed-section">
          <div class="average-speed-section__header">
            <h2>{{ t('averageSpeed.form.timeTitle') }}</h2>
          </div>
          <div class="average-speed-grid average-speed-grid--two">
            <NumberField field="hours" :label="t('averageSpeed.form.hours')" :suffix="t('averageSpeed.units.hours')" :step="1" :min="0" />
            <NumberField field="minutes" :label="t('averageSpeed.form.minutes')" :suffix="t('averageSpeed.units.minutes')" :step="1" :min="0" />
          </div>
        </section>
      </form>

      <section class="average-speed-result" aria-live="polite">
        <p class="average-speed-result__label">{{ t('averageSpeed.result.label') }}</p>

        <template v-if="result">
          <div class="average-speed-result__total">
            <span>{{ t('averageSpeed.result.speed') }}</span>
            <strong>{{ t('averageSpeed.result.speedKmHValue', { value: format(result.speedKmH) }) }}</strong>
          </div>

          <div class="average-speed-result__rows">
            <div class="average-speed-result__row">
              <span>{{ t('averageSpeed.result.travelTime') }}</span>
              <strong>{{ formatDuration(result.totalMinutes) }}</strong>
            </div>
            <div class="average-speed-result__row">
              <span>{{ t('averageSpeed.result.speedMph') }}</span>
              <strong>{{ t('averageSpeed.result.speedMphValue', { value: format(result.speedMph) }) }}</strong>
            </div>
            <div class="average-speed-result__row">
              <span>{{ t('averageSpeed.result.speedMs') }}</span>
              <strong>{{ t('averageSpeed.result.speedMsValue', { value: format(result.speedMs) }) }}</strong>
            </div>
            <div class="average-speed-result__row">
              <span>{{ t('averageSpeed.result.pace') }}</span>
              <strong>{{ t('averageSpeed.result.paceValue', { value: formatPace(result.paceSecondsPerKm) }) }}</strong>
            </div>
          </div>

          <p class="average-speed-formula">{{ t('averageSpeed.formula') }}</p>
        </template>

        <p v-else class="average-speed-result__empty">{{ t('averageSpeed.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAverageSpeedCalculator } from '../composables/useAverageSpeedCalculator'
import type { AverageSpeedInputField } from '../types/average-speed'

const { t, n } = useI18n()
const { input, result, getIssue } = useAverageSpeedCalculator()

const NumberField = defineComponent<{ field: AverageSpeedInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'average-speed-field' }, [
      h('label', { for: `average-speed-${props.field}` }, props.label),
      h('div', { class: 'average-speed-input-wrap' }, [
        h('input', {
          id: `average-speed-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `average-speed-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'average-speed-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `average-speed-${props.field}-error`, class: 'average-speed-error' }, t(getIssue(props.field)!.messageKey))
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

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  return t('averageSpeed.result.timeValue', { hours, minutes })
}

function formatPace(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const restSeconds = Math.round(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${restSeconds}`
}
</script>

<style scoped>
.average-speed-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.average-speed-heading {
  max-width: 760px;
}

.average-speed-section {
  display: grid;
  gap: 16px;
}

.average-speed-section + .average-speed-section {
  padding-top: 4px;
}

.average-speed-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.average-speed-result__rows {
  display: grid;
}
</style>
