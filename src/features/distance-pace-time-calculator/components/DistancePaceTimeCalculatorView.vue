<template>
  <main class="distance-page" aria-labelledby="distance-title">
    <section class="distance-heading">
      <p class="distance-eyebrow">{{ t('distancePaceTime.eyebrow') }}</p>
      <h1 id="distance-title">{{ t('distancePaceTime.title') }}</h1>
      <p>{{ t('distancePaceTime.intro') }}</p>
    </section>

    <div class="distance-workspace">
      <form class="distance-form" @submit.prevent>
        <section class="distance-section">
          <div class="distance-section__header">
            <h2>{{ t('distancePaceTime.modes.label') }}</h2>
          </div>
          <div class="distance-grid distance-grid--three" role="radiogroup" :aria-label="t('distancePaceTime.modes.label')">
            <button
              v-for="item in modes"
              :key="item"
              type="button"
              class="distance-chip"
              :class="{ 'distance-chip--active': mode === item }"
              role="radio"
              :aria-checked="mode === item"
              @click="mode = item"
            >
              {{ t(`distancePaceTime.modes.${item}`) }}
            </button>
          </div>
        </section>

        <section v-if="mode !== 'distance'" class="distance-section">
          <div class="distance-section__header">
            <h2>{{ t('distancePaceTime.form.distanceTitle') }}</h2>
          </div>
          <div class="distance-field">
            <label for="distance-km">{{ t('distancePaceTime.form.distance') }}</label>
            <div class="distance-input-wrap">
              <input
                id="distance-km"
                v-model.number="distanceKm"
                type="number"
                min="0.001"
                step="0.001"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('distanceKm'))"
                aria-describedby="distance-km-error"
                @blur="touch('distanceKm')"
              >
              <span class="distance-unit">{{ t('distancePaceTime.units.km') }}</span>
            </div>
            <p v-if="getIssue('distanceKm')" id="distance-km-error" class="distance-error">
              {{ t(getIssue('distanceKm')!.messageKey) }}
            </p>
          </div>
          <div class="distance-grid distance-grid--three" role="group" :aria-label="t('distancePaceTime.form.presets')">
            <button
              v-for="preset in distancePresets"
              :key="preset"
              type="button"
              class="distance-chip"
              :class="{ 'distance-chip--active': distanceKm === preset }"
              @click="setDistance(preset)"
            >
              {{ formatDistance(preset) }}
            </button>
          </div>
        </section>

        <section v-if="mode !== 'pace'" class="distance-section">
          <div class="distance-section__header">
            <h2>{{ t('distancePaceTime.form.paceTitle') }}</h2>
          </div>
          <div class="distance-grid distance-grid--two">
            <TimeNumberField field="paceMinutes" :label="t('distancePaceTime.form.minutes')" suffix="мин" />
            <TimeNumberField field="paceSeconds" :label="t('distancePaceTime.form.seconds')" suffix="сек" />
          </div>
        </section>

        <section v-if="mode !== 'time'" class="distance-section">
          <div class="distance-section__header">
            <h2>{{ t('distancePaceTime.form.timeTitle') }}</h2>
          </div>
          <div class="distance-grid distance-grid--three">
            <TimeNumberField field="timeHours" :label="t('distancePaceTime.form.hours')" suffix="ч" />
            <TimeNumberField field="timeMinutes" :label="t('distancePaceTime.form.minutes')" suffix="мин" />
            <TimeNumberField field="timeSeconds" :label="t('distancePaceTime.form.seconds')" suffix="сек" />
          </div>
        </section>
      </form>

      <section class="distance-result" aria-live="polite">
        <p class="distance-result__label">{{ t('distancePaceTime.result.label') }}</p>

        <template v-if="result">
          <div class="distance-result__total">
            <span>{{ t(`distancePaceTime.result.primary.${mode}`) }}</span>
            <strong>{{ primaryResult }}</strong>
          </div>

          <div class="distance-result__rows">
            <div class="distance-result__row">
              <span>{{ t('distancePaceTime.result.distance') }}</span>
              <strong>{{ formatDistance(result.distanceKm) }}</strong>
            </div>
            <div class="distance-result__row">
              <span>{{ t('distancePaceTime.result.time') }}</span>
              <strong>{{ formatTime(result.time) }}</strong>
            </div>
            <div class="distance-result__row">
              <span>{{ t('distancePaceTime.result.pace') }}</span>
              <strong>{{ formatPace(result.pace) }}</strong>
            </div>
            <div class="distance-result__row">
              <span>{{ t('distancePaceTime.result.speed') }}</span>
              <strong>{{ t('distancePaceTime.result.speedValue', { value: n(result.speedKmH, { maximumFractionDigits: 2 }) }) }}</strong>
            </div>
          </div>

          <p class="distance-formula">{{ t(`distancePaceTime.formula.${mode}`) }}</p>
        </template>

        <p v-else class="distance-result__empty">{{ t('distancePaceTime.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDistancePaceTimeCalculator } from '../composables/useDistancePaceTimeCalculator'
import type { DistancePaceTimeMode, DistancePaceTimeValidationIssue, PaceParts, TimeParts } from '../types/distance-pace-time'

const { t, n } = useI18n()
const modes: DistancePaceTimeMode[] = ['time', 'pace', 'distance']

const {
  mode,
  distanceKm,
  timeHours,
  timeMinutes,
  timeSeconds,
  paceMinutes,
  paceSeconds,
  distancePresets,
  result,
  touch,
  getIssue,
  setDistance,
} = useDistancePaceTimeCalculator()

const valueByField = {
  timeHours,
  timeMinutes,
  timeSeconds,
  paceMinutes,
  paceSeconds,
}

const primaryResult = computed(() => {
  if (!result.value) return ''
  if (mode.value === 'time') return formatTime(result.value.time)
  if (mode.value === 'pace') return formatPace(result.value.pace)
  return formatDistance(result.value.distanceKm)
})

const TimeNumberField = defineComponent({
  props: {
    field: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, default: '' },
  },
  setup(props) {
    return () => {
      const field = props.field as Exclude<DistancePaceTimeValidationIssue['field'], 'distanceKm'>
      const model = valueByField[field]
      const issue = getIssue(field)

      return h('div', { class: 'distance-field' }, [
        h('label', { for: `distance-${field}` }, props.label),
        h('div', { class: ['distance-input-wrap', { 'distance-input-wrap--error': Boolean(issue) }] }, [
          h('input', {
            id: `distance-${field}`,
            type: 'number',
            min: '0',
            step: '1',
            inputmode: 'numeric',
            value: model.value,
            'aria-invalid': Boolean(issue),
            'aria-describedby': `distance-${field}-error`,
            onInput: (event: Event) => {
              const target = event.target as HTMLInputElement
              model.value = target.value === '' ? Number.NaN : Number(target.value)
            },
            onBlur: () => touch(field),
          }),
          props.suffix ? h('span', { class: 'distance-unit' }, props.suffix) : null,
        ]),
        issue ? h('p', { id: `distance-${field}-error`, class: 'distance-error' }, t(issue.messageKey)) : null,
      ])
    }
  },
})

function formatDistance(value: number): string {
  return t('distancePaceTime.result.distanceValue', {
    value: n(value, { maximumFractionDigits: 3, minimumFractionDigits: 0 }),
  })
}

function formatPace(parts: PaceParts): string {
  return t('distancePaceTime.result.paceValue', {
    minutes: parts.minutes,
    seconds: String(parts.seconds).padStart(2, '0'),
  })
}

function formatTime(parts: TimeParts): string {
  return t('distancePaceTime.result.timeValue', {
    hours: parts.hours,
    minutes: String(parts.minutes).padStart(2, '0'),
    seconds: String(parts.seconds).padStart(2, '0'),
  })
}
</script>
