<template>
  <main class="body-fat-page" aria-labelledby="body-fat-title">
    <section class="body-fat-heading">
      <p class="body-fat-eyebrow">{{ t('bodyFat.eyebrow') }}</p>
      <h1 id="body-fat-title">{{ t('bodyFat.title') }}</h1>
      <p>{{ t('bodyFat.intro') }}</p>
    </section>

    <div class="body-fat-workspace">
      <form class="body-fat-form" @submit.prevent>
        <section class="body-fat-section">
          <div class="body-fat-section__header">
            <h2>{{ t('bodyFat.form.measurementsTitle') }}</h2>
            <p>{{ t('bodyFat.form.measurementsHelp') }}</p>
          </div>

          <div class="body-fat-chip-list" role="group" :aria-label="t('bodyFat.form.sex')">
            <button
              v-for="option in sexOptions"
              :key="option"
              type="button"
              class="body-fat-chip"
              :class="{ 'body-fat-chip--active': sex === option }"
              :aria-pressed="sex === option"
              @click="sex = option"
            >
              {{ t(`bodyFat.sex.${option}`) }}
            </button>
          </div>

          <div class="body-fat-grid--two">
            <BodyFatField
              id="body-fat-height"
              v-model="heightCm"
              :label="t('bodyFat.form.heightCm')"
              :unit="t('bodyFat.units.cm')"
              :issue="getIssue('heightCm')"
              :min="120"
              :max="230"
              :step="1"
            />
            <BodyFatField
              id="body-fat-neck"
              v-model="neckCm"
              :label="t('bodyFat.form.neckCm')"
              :unit="t('bodyFat.units.cm')"
              :issue="getIssue('neckCm')"
              :min="20"
              :max="80"
              :step="0.5"
            />
          </div>

          <div class="body-fat-grid--two">
            <BodyFatField
              id="body-fat-waist"
              v-model="waistCm"
              :label="t('bodyFat.form.waistCm')"
              :unit="t('bodyFat.units.cm')"
              :issue="getIssue('waistCm')"
              :min="40"
              :max="220"
              :step="0.5"
            />
            <BodyFatField
              v-if="sex === 'female'"
              id="body-fat-hip"
              v-model="hipCm"
              :label="t('bodyFat.form.hipCm')"
              :unit="t('bodyFat.units.cm')"
              :issue="getIssue('hipCm')"
              :min="40"
              :max="220"
              :step="0.5"
            />
            <BodyFatField
              id="body-fat-weight"
              v-model="weightKg"
              :label="t('bodyFat.form.weightKg')"
              :unit="t('bodyFat.units.kg')"
              :min="20"
              :max="400"
              :step="0.5"
            />
          </div>
        </section>

        <aside class="body-fat-warning-note">
          <strong>{{ t('bodyFat.warning.title') }}</strong>
          <span>{{ t('bodyFat.warning.body') }}</span>
        </aside>
      </form>

      <section class="body-fat-result" aria-live="polite">
        <p class="body-fat-result__label">{{ t('bodyFat.result.label') }}</p>

        <template v-if="result">
          <div class="body-fat-result__total">
            <span>{{ t('bodyFat.result.bodyFatPercent') }}</span>
            <strong>{{ formatPercent(result.bodyFatPercent) }}</strong>
          </div>

          <div class="body-fat-result__rows">
            <div class="body-fat-result__row">
              <span>{{ t('bodyFat.result.category') }}</span>
              <strong>{{ t(`bodyFat.categories.${result.categoryKey}`) }}</strong>
            </div>
            <div class="body-fat-result__row">
              <span>{{ t('bodyFat.result.fatMass') }}</span>
              <strong>{{ result.fatMassKg === null ? t('bodyFat.result.noMass') : formatKg(result.fatMassKg) }}</strong>
            </div>
            <div class="body-fat-result__row">
              <span>{{ t('bodyFat.result.leanMass') }}</span>
              <strong>{{ result.leanMassKg === null ? t('bodyFat.result.noMass') : formatKg(result.leanMassKg) }}</strong>
            </div>
          </div>

          <p class="body-fat-formula">{{ t('bodyFat.formula') }}</p>
        </template>

        <p v-else class="body-fat-result__empty">{{ t('bodyFat.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBodyFatCalculator } from '../composables/useBodyFatCalculator'
import type { BodyFatSex, BodyFatValidationIssue } from '../types/bodyFat'

const BodyFatField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => BodyFatValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'body-fat-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'body-fat-input-wrap' }, [
        h('input', {
          id: props.id,
          value: Number.isNaN(props.modelValue) ? '' : props.modelValue,
          type: 'number',
          inputmode: 'decimal',
          min: props.min,
          max: props.max,
          step: props.step,
          'aria-invalid': Boolean(props.issue),
          'aria-describedby': errorId,
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value
            emit('update:modelValue', value === '' ? Number.NaN : Number(value))
          },
        }),
        h('span', props.unit),
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'body-fat-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const sexOptions: BodyFatSex[] = ['male', 'female']

const {
  sex,
  heightCm,
  neckCm,
  waistCm,
  hipCm,
  weightKg,
  result,
  getIssue,
} = useBodyFatCalculator()

function formatPercent(value: number): string {
  return t('bodyFat.units.percentValue', {
    value: n(value, { maximumFractionDigits: 1 }),
  })
}

function formatKg(value: number): string {
  return t('bodyFat.units.kgValue', {
    value: n(value, { maximumFractionDigits: 1 }),
  })
}
</script>
