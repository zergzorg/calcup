<template>
  <main class="calorie-page" aria-labelledby="calorie-title">
    <section class="calorie-heading">
      <p class="calorie-eyebrow">{{ t('calorie.eyebrow') }}</p>
      <h1 id="calorie-title">{{ t('calorie.title') }}</h1>
      <p>{{ t('calorie.intro') }}</p>
    </section>

    <div class="calorie-workspace">
      <form class="calorie-form" @submit.prevent>
        <section class="calorie-section">
          <div class="calorie-section__header">
            <h2>{{ t('calorie.form.profileTitle') }}</h2>
            <p>{{ t('calorie.form.profileHelp') }}</p>
          </div>

          <div class="calorie-chip-list" role="group" :aria-label="t('calorie.form.sex')">
            <button
              v-for="option in sexOptions"
              :key="option"
              type="button"
              class="calorie-chip"
              :class="{ 'calorie-chip--active': sex === option }"
              :aria-pressed="sex === option"
              @click="sex = option"
            >
              {{ t(`calorie.sex.${option}`) }}
            </button>
          </div>

          <div class="calorie-grid--three">
            <CalorieField
              id="calorie-age"
              v-model="age"
              :label="t('calorie.form.age')"
              :unit="t('calorie.units.years')"
              :issue="getIssue('age')"
              :min="10"
              :max="100"
              :step="1"
            />
            <CalorieField
              id="calorie-height"
              v-model="heightCm"
              :label="t('calorie.form.height')"
              :unit="t('calorie.units.cm')"
              :issue="getIssue('heightCm')"
              :min="100"
              :max="230"
              :step="1"
            />
            <CalorieField
              id="calorie-weight"
              v-model="weightKg"
              :label="t('calorie.form.weight')"
              :unit="t('calorie.units.kg')"
              :issue="getIssue('weightKg')"
              :min="30"
              :max="300"
              :step="0.1"
            />
          </div>
        </section>

        <section class="calorie-section">
          <div class="calorie-section__header">
            <h2>{{ t('calorie.form.activityTitle') }}</h2>
            <p>{{ t('calorie.form.activityHelp') }}</p>
          </div>
          <div class="calorie-chip-list" role="group" :aria-label="t('calorie.form.activityTitle')">
            <button
              v-for="option in activityOptions"
              :key="option"
              type="button"
              class="calorie-chip"
              :class="{ 'calorie-chip--active': activityLevel === option }"
              :aria-pressed="activityLevel === option"
              @click="activityLevel = option"
            >
              {{ t(`calorie.activity.${option}`) }}
            </button>
          </div>
        </section>

        <section class="calorie-section">
          <div class="calorie-section__header">
            <h2>{{ t('calorie.form.goalTitle') }}</h2>
            <p>{{ t('calorie.form.goalHelp') }}</p>
          </div>
          <div class="calorie-chip-list" role="group" :aria-label="t('calorie.form.goalTitle')">
            <button
              v-for="option in goalOptions"
              :key="option"
              type="button"
              class="calorie-chip"
              :class="{ 'calorie-chip--active': goal === option }"
              :aria-pressed="goal === option"
              @click="goal = option"
            >
              {{ t(`calorie.goals.${option}`) }}
            </button>
          </div>
        </section>

        <aside class="calorie-warning-note">
          <strong>{{ t('calorie.warning.title') }}</strong>
          <span>{{ t('calorie.warning.body') }}</span>
        </aside>
      </form>

      <section class="calorie-result" aria-live="polite">
        <p class="calorie-result__label">{{ t('calorie.result.label') }}</p>

        <template v-if="result">
          <div class="calorie-result__total">
            <span>{{ t('calorie.result.target') }}</span>
            <strong>{{ formatCalories(result.targetCalories) }}</strong>
          </div>

          <div class="calorie-result__rows">
            <div class="calorie-result__row">
              <span>{{ t('calorie.result.bmr') }}</span>
              <strong>{{ formatCalories(result.bmr) }}</strong>
            </div>
            <div class="calorie-result__row">
              <span>{{ t('calorie.result.tdee') }}</span>
              <strong>{{ formatCalories(result.tdee) }}</strong>
            </div>
            <div class="calorie-result__row">
              <span>{{ t('calorie.result.activityFactor') }}</span>
              <strong>{{ formatFactor(result.activityFactor) }}</strong>
            </div>
            <div class="calorie-result__row">
              <span>{{ t('calorie.result.dailyDelta') }}</span>
              <strong>{{ formatDelta(result.dailyDelta) }}</strong>
            </div>
          </div>

          <p class="calorie-formula">{{ t('calorie.formula') }}</p>
        </template>

        <p v-else class="calorie-result__empty">{{ t('calorie.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalorieCalculator } from '../composables/useCalorieCalculator'
import type {
  ActivityLevel,
  CalorieGoal,
  CalorieSex,
  CalorieValidationIssue,
} from '../types/calorie'

const CalorieField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, required: true },
    issue: { type: Object as () => CalorieValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'calorie-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'calorie-input-wrap' }, [
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
        ? h('p', { id: errorId, class: 'calorie-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()

const sexOptions: CalorieSex[] = ['male', 'female']
const activityOptions: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'athlete']
const goalOptions: CalorieGoal[] = ['lose', 'mildLose', 'maintain', 'gain']

const {
  sex,
  age,
  heightCm,
  weightKg,
  activityLevel,
  goal,
  result,
  getIssue,
} = useCalorieCalculator()

function formatCalories(value: number): string {
  return t('calorie.units.kcalValue', {
    value: n(value, { maximumFractionDigits: 0 }),
  })
}

function formatFactor(value: number): string {
  return `×${n(value, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`
}

function formatDelta(value: number): string {
  const prefix = value > 0 ? '+' : ''

  return t('calorie.units.kcalValue', {
    value: `${prefix}${n(value, { maximumFractionDigits: 0 })}`,
  })
}
</script>
