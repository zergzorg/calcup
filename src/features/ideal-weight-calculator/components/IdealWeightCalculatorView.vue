<template>
  <main class="ideal-weight-page" aria-labelledby="ideal-weight-title">
    <section class="ideal-weight-heading">
      <p class="ideal-weight-eyebrow">{{ t('idealWeight.eyebrow') }}</p>
      <h1 id="ideal-weight-title">{{ t('idealWeight.title') }}</h1>
      <p>{{ t('idealWeight.intro') }}</p>
    </section>

    <div class="ideal-weight-workspace">
      <form class="ideal-weight-form" @submit.prevent>
        <section class="ideal-weight-section">
          <div class="ideal-weight-section__header">
            <h2>{{ t('idealWeight.form.profileTitle') }}</h2>
            <p>{{ t('idealWeight.form.profileHelp') }}</p>
          </div>

          <div class="ideal-weight-chip-list" role="group" :aria-label="t('idealWeight.form.sex')">
            <button
              v-for="option in sexOptions"
              :key="option"
              type="button"
              class="ideal-weight-chip"
              :class="{ 'ideal-weight-chip--active': sex === option }"
              :aria-pressed="sex === option"
              @click="sex = option"
            >
              {{ t(`idealWeight.sex.${option}`) }}
            </button>
          </div>

          <div class="ideal-weight-field">
            <label for="ideal-weight-height">{{ t('idealWeight.form.height') }}</label>
            <div class="ideal-weight-input-wrap">
              <input
                id="ideal-weight-height"
                v-model.number="heightCm"
                type="number"
                inputmode="decimal"
                min="120"
                max="230"
                step="1"
                :aria-invalid="Boolean(getIssue('heightCm'))"
                aria-describedby="ideal-weight-height-error"
              >
              <span>{{ t('idealWeight.units.cm') }}</span>
            </div>
            <p v-if="getIssue('heightCm')" id="ideal-weight-height-error" class="ideal-weight-error">
              {{ t(getIssue('heightCm')?.messageKey ?? '') }}
            </p>
          </div>
        </section>

        <aside class="ideal-weight-warning-note">
          <strong>{{ t('idealWeight.warning.title') }}</strong>
          <span>{{ t('idealWeight.warning.body') }}</span>
        </aside>
      </form>

      <section class="ideal-weight-result" aria-live="polite">
        <p class="ideal-weight-result__label">{{ t('idealWeight.result.label') }}</p>

        <template v-if="result">
          <div class="ideal-weight-result__total">
            <span>{{ t('idealWeight.result.average') }}</span>
            <strong>{{ formatWeight(result.recommendedKg) }}</strong>
          </div>

          <div class="ideal-weight-result__rows">
            <div class="ideal-weight-result__row">
              <span>{{ t('idealWeight.result.formulaRange') }}</span>
              <strong>{{ formatRange(result.minFormulaKg, result.maxFormulaKg) }}</strong>
            </div>
            <div class="ideal-weight-result__row">
              <span>{{ t('idealWeight.result.bmiRange') }}</span>
              <strong>{{ formatRange(result.bmiMinKg, result.bmiMaxKg) }}</strong>
            </div>
            <div
              v-for="item in result.formulas"
              :key="item.formula"
              class="ideal-weight-result__row"
            >
              <span>{{ t(`idealWeight.formulas.${item.formula}`) }}</span>
              <strong>{{ formatWeight(item.weightKg) }}</strong>
            </div>
          </div>

          <p class="ideal-weight-formula">{{ t('idealWeight.formula') }}</p>
        </template>

        <p v-else class="ideal-weight-result__empty">{{ t('idealWeight.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIdealWeightCalculator } from '../composables/useIdealWeightCalculator'
import type { IdealWeightSex } from '../types/ideal-weight'

const { t, n } = useI18n()
const sexOptions: IdealWeightSex[] = ['male', 'female']

const {
  sex,
  heightCm,
  result,
  getIssue,
} = useIdealWeightCalculator()

function formatWeight(value: number): string {
  return t('idealWeight.units.kgValue', {
    value: n(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  })
}

function formatRange(min: number, max: number): string {
  return `${formatWeight(min)} - ${formatWeight(max)}`
}
</script>
