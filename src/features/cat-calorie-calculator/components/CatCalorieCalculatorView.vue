<template>
  <main class="cat-calorie-page" aria-labelledby="cat-calorie-title">
    <section class="cat-calorie-heading">
      <p class="cat-calorie-eyebrow">{{ t('catCalorie.eyebrow') }}</p>
      <h1 id="cat-calorie-title">{{ t('catCalorie.title') }}</h1>
      <p>{{ t('catCalorie.intro') }}</p>
    </section>

    <div class="cat-calorie-workspace">
      <form class="cat-calorie-form" @submit.prevent>
        <section class="cat-calorie-section">
          <div class="cat-calorie-section__header">
            <h2>{{ t('catCalorie.form.profileTitle') }}</h2>
            <p>{{ t('catCalorie.form.profileHelp') }}</p>
          </div>

          <div class="cat-calorie-field">
            <label for="cat-calorie-weight">{{ t('catCalorie.form.weightKg') }}</label>
            <div class="cat-calorie-input-wrap">
              <input
                id="cat-calorie-weight"
                v-model.number="input.weightKg"
                type="number"
                inputmode="decimal"
                min="0.5"
                max="15"
                step="0.1"
                :aria-invalid="Boolean(getIssue('weightKg'))"
                aria-describedby="cat-calorie-weight-error"
              >
              <span>{{ t('catCalorie.units.kg') }}</span>
            </div>
            <p v-if="getIssue('weightKg')" id="cat-calorie-weight-error" class="cat-calorie-error">
              {{ t(getIssue('weightKg')!.messageKey) }}
            </p>
          </div>

          <div class="cat-calorie-field">
            <span class="cat-calorie-field__label">{{ t('catCalorie.form.profile') }}</span>
            <div class="cat-calorie-chip-list" role="group" :aria-label="t('catCalorie.form.profile')">
              <button
                v-for="profile in profiles"
                :key="profile"
                type="button"
                class="cat-calorie-chip"
                :class="{ 'cat-calorie-chip--active': input.profile === profile }"
                :aria-pressed="input.profile === profile"
                @click="input.profile = profile"
              >
                {{ t(`catCalorie.profile.${profile}`) }}
              </button>
            </div>
          </div>
        </section>

        <section class="cat-calorie-section">
          <div class="cat-calorie-section__header cat-calorie-section__header--tight">
            <h2>{{ t('catCalorie.form.foodTitle') }}</h2>
          </div>

          <div class="cat-calorie-field">
            <label for="cat-calorie-food">{{ t('catCalorie.form.caloriesPer100g') }}</label>
            <div class="cat-calorie-input-wrap">
              <input
                id="cat-calorie-food"
                v-model.number="input.caloriesPer100g"
                type="number"
                inputmode="decimal"
                min="120"
                max="650"
                step="1"
                :aria-invalid="Boolean(getIssue('caloriesPer100g'))"
                aria-describedby="cat-calorie-food-error"
              >
              <span>{{ t('catCalorie.units.kcal100g') }}</span>
            </div>
            <p v-if="getIssue('caloriesPer100g')" id="cat-calorie-food-error" class="cat-calorie-error">
              {{ t(getIssue('caloriesPer100g')!.messageKey) }}
            </p>
          </div>

          <div class="cat-calorie-field">
            <label for="cat-calorie-treats">{{ t('catCalorie.form.treatPercent') }}</label>
            <div class="cat-calorie-input-wrap">
              <input
                id="cat-calorie-treats"
                v-model.number="input.treatPercent"
                type="number"
                inputmode="decimal"
                min="0"
                max="20"
                step="1"
                :aria-invalid="Boolean(getIssue('treatPercent'))"
                aria-describedby="cat-calorie-treats-error"
              >
              <span>{{ t('catCalorie.units.percent') }}</span>
            </div>
            <p v-if="getIssue('treatPercent')" id="cat-calorie-treats-error" class="cat-calorie-error">
              {{ t(getIssue('treatPercent')!.messageKey) }}
            </p>
          </div>
        </section>

        <aside class="cat-calorie-warning-note">
          <strong>{{ t('catCalorie.warning.title') }}</strong>
          <span>{{ t('catCalorie.warning.body') }}</span>
        </aside>
      </form>

      <section class="cat-calorie-result" aria-live="polite">
        <p class="cat-calorie-result__label">{{ t('catCalorie.result.label') }}</p>

        <template v-if="result">
          <div class="cat-calorie-result__total">
            <span>{{ t('catCalorie.result.gramsPerDay') }}</span>
            <strong>{{ t('catCalorie.units.gramsValue', { value: formatNumber(result.gramsPerDay, 1) }) }}</strong>
          </div>

          <div class="cat-calorie-result__rows">
            <div class="cat-calorie-result__row">
              <span>{{ t('catCalorie.result.dailyCalories') }}</span>
              <strong>{{ t('catCalorie.units.kcalValue', { value: formatNumber(result.dailyCalories, 0) }) }}</strong>
            </div>
            <div class="cat-calorie-result__row">
              <span>{{ t('catCalorie.result.foodCalories') }}</span>
              <strong>{{ t('catCalorie.units.kcalValue', { value: formatNumber(result.foodCalories, 0) }) }}</strong>
            </div>
            <div class="cat-calorie-result__row">
              <span>{{ t('catCalorie.result.threeMeals') }}</span>
              <strong>{{ t('catCalorie.units.gramsValue', { value: formatNumber(result.gramsPerMealThree, 1) }) }}</strong>
            </div>
            <div class="cat-calorie-result__row">
              <span>{{ t('catCalorie.result.rer') }}</span>
              <strong>{{ t('catCalorie.units.kcalValue', { value: formatNumber(result.rerCalories, 0) }) }}</strong>
            </div>
          </div>

          <p class="cat-calorie-formula">{{ t('catCalorie.formula') }}</p>
        </template>

        <p v-else class="cat-calorie-result__empty">{{ t('catCalorie.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatCalorieCalculator } from '../composables/useCatCalorieCalculator'
import type { CatCalorieProfile } from '../types/cat-calorie'

const { t, n } = useI18n()
const profiles: CatCalorieProfile[] = ['weightLoss', 'neuteredAdult', 'intactAdult', 'active', 'kittenUnder4', 'kittenOver4', 'senior']
const { input, result, getIssue } = useCatCalorieCalculator()

function formatNumber(value: number, digits: number): string {
  return n(value, { maximumFractionDigits: digits })
}
</script>
