<template>
  <main class="dog-food-page" aria-labelledby="dog-food-title">
    <section class="dog-food-heading">
      <p class="dog-food-eyebrow">{{ t('dogFood.eyebrow') }}</p>
      <h1 id="dog-food-title">{{ t('dogFood.title') }}</h1>
      <p>{{ t('dogFood.intro') }}</p>
    </section>

    <div class="dog-food-workspace">
      <form class="dog-food-form" @submit.prevent>
        <section class="dog-food-section">
          <div class="dog-food-section__header">
            <h2>{{ t('dogFood.form.profileTitle') }}</h2>
            <p>{{ t('dogFood.form.profileHelp') }}</p>
          </div>

          <div class="dog-food-field">
            <label for="dog-food-weight">{{ t('dogFood.form.weightKg') }}</label>
            <div class="dog-food-input-wrap">
              <input
                id="dog-food-weight"
                v-model.number="input.weightKg"
                type="number"
                inputmode="decimal"
                min="0.5"
                max="120"
                step="0.1"
                :aria-invalid="Boolean(getIssue('weightKg'))"
                aria-describedby="dog-food-weight-error"
              >
              <span>{{ t('dogFood.units.kg') }}</span>
            </div>
            <p v-if="getIssue('weightKg')" id="dog-food-weight-error" class="dog-food-error">
              {{ t(getIssue('weightKg')!.messageKey) }}
            </p>
          </div>

          <div class="dog-food-field">
            <span class="dog-food-field__label">{{ t('dogFood.form.profile') }}</span>
            <div class="dog-food-chip-list" role="group" :aria-label="t('dogFood.form.profile')">
              <button
                v-for="profile in profiles"
                :key="profile"
                type="button"
                class="dog-food-chip"
                :class="{ 'dog-food-chip--active': input.profile === profile }"
                :aria-pressed="input.profile === profile"
                @click="input.profile = profile"
              >
                {{ t(`dogFood.profile.${profile}`) }}
              </button>
            </div>
          </div>
        </section>

        <section class="dog-food-section">
          <div class="dog-food-section__header dog-food-section__header--tight">
            <h2>{{ t('dogFood.form.foodTitle') }}</h2>
          </div>

          <div class="dog-food-field">
            <label for="dog-food-calories">{{ t('dogFood.form.caloriesPer100g') }}</label>
            <div class="dog-food-input-wrap">
              <input
                id="dog-food-calories"
                v-model.number="input.caloriesPer100g"
                type="number"
                inputmode="decimal"
                min="150"
                max="650"
                step="1"
                :aria-invalid="Boolean(getIssue('caloriesPer100g'))"
                aria-describedby="dog-food-calories-error"
              >
              <span>{{ t('dogFood.units.kcal100g') }}</span>
            </div>
            <p v-if="getIssue('caloriesPer100g')" id="dog-food-calories-error" class="dog-food-error">
              {{ t(getIssue('caloriesPer100g')!.messageKey) }}
            </p>
          </div>

          <div class="dog-food-field">
            <label for="dog-food-treats">{{ t('dogFood.form.treatPercent') }}</label>
            <div class="dog-food-input-wrap">
              <input
                id="dog-food-treats"
                v-model.number="input.treatPercent"
                type="number"
                inputmode="decimal"
                min="0"
                max="30"
                step="1"
                :aria-invalid="Boolean(getIssue('treatPercent'))"
                aria-describedby="dog-food-treats-error"
              >
              <span>{{ t('dogFood.units.percent') }}</span>
            </div>
            <p v-if="getIssue('treatPercent')" id="dog-food-treats-error" class="dog-food-error">
              {{ t(getIssue('treatPercent')!.messageKey) }}
            </p>
          </div>
        </section>

        <aside class="dog-food-warning-note">
          <strong>{{ t('dogFood.warning.title') }}</strong>
          <span>{{ t('dogFood.warning.body') }}</span>
        </aside>
      </form>

      <section class="dog-food-result" aria-live="polite">
        <p class="dog-food-result__label">{{ t('dogFood.result.label') }}</p>

        <template v-if="result">
          <div class="dog-food-result__total">
            <span>{{ t('dogFood.result.gramsPerDay') }}</span>
            <strong>{{ t('dogFood.units.gramsValue', { value: formatNumber(result.gramsPerDay, 1) }) }}</strong>
          </div>

          <div class="dog-food-result__rows">
            <div class="dog-food-result__row">
              <span>{{ t('dogFood.result.dailyCalories') }}</span>
              <strong>{{ t('dogFood.units.kcalValue', { value: formatNumber(result.dailyCalories, 0) }) }}</strong>
            </div>
            <div class="dog-food-result__row">
              <span>{{ t('dogFood.result.foodCalories') }}</span>
              <strong>{{ t('dogFood.units.kcalValue', { value: formatNumber(result.foodCalories, 0) }) }}</strong>
            </div>
            <div class="dog-food-result__row">
              <span>{{ t('dogFood.result.twoMeals') }}</span>
              <strong>{{ t('dogFood.units.gramsValue', { value: formatNumber(result.gramsPerMealTwo, 1) }) }}</strong>
            </div>
            <div class="dog-food-result__row">
              <span>{{ t('dogFood.result.rer') }}</span>
              <strong>{{ t('dogFood.units.kcalValue', { value: formatNumber(result.rerCalories, 0) }) }}</strong>
            </div>
            <div class="dog-food-result__row">
              <span>{{ t('dogFood.result.multiplier') }}</span>
              <strong>{{ formatNumber(result.multiplier, 1) }}</strong>
            </div>
          </div>

          <p class="dog-food-formula">{{ t('dogFood.formula') }}</p>
        </template>

        <p v-else class="dog-food-result__empty">{{ t('dogFood.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDogFoodCalculator } from '../composables/useDogFoodCalculator'
import type { DogFoodProfile } from '../types/dog-food'

const { t, n } = useI18n()
const profiles: DogFoodProfile[] = ['weightLoss', 'neuteredAdult', 'intactAdult', 'active', 'puppyUnder4', 'puppyOver4', 'senior']
const { input, result, getIssue } = useDogFoodCalculator()

function formatNumber(value: number, digits: number): string {
  return n(value, { maximumFractionDigits: digits })
}
</script>
