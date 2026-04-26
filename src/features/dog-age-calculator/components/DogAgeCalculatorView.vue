<template>
  <main class="dog-age-page" aria-labelledby="dog-age-title">
    <section class="dog-age-heading">
      <p class="dog-age-eyebrow">{{ t('dogAge.eyebrow') }}</p>
      <h1 id="dog-age-title">{{ t('dogAge.title') }}</h1>
      <p>{{ t('dogAge.intro') }}</p>
    </section>

    <div class="dog-age-workspace">
      <form class="dog-age-form" @submit.prevent>
        <section class="dog-age-section">
          <div class="dog-age-section__header">
            <h2>{{ t('dogAge.form.title') }}</h2>
            <p>{{ t('dogAge.form.description') }}</p>
          </div>

          <div class="dog-age-grid dog-age-grid--two">
            <div class="dog-age-field">
              <label for="dog-age-years">{{ t('dogAge.form.years') }}</label>
              <div class="dog-age-input-wrap">
                <input
                  id="dog-age-years"
                  v-model.number="input.years"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="30"
                  step="1"
                  :aria-invalid="Boolean(getIssue('years'))"
                  aria-describedby="dog-age-years-error"
                >
                <span>{{ t('dogAge.units.years') }}</span>
              </div>
              <p v-if="getIssue('years')" id="dog-age-years-error" class="dog-age-error">
                {{ t(getIssue('years')!.messageKey) }}
              </p>
            </div>

            <div class="dog-age-field">
              <label for="dog-age-months">{{ t('dogAge.form.months') }}</label>
              <div class="dog-age-input-wrap">
                <input
                  id="dog-age-months"
                  v-model.number="input.months"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="11"
                  step="1"
                  :aria-invalid="Boolean(getIssue('months'))"
                  aria-describedby="dog-age-months-error"
                >
                <span>{{ t('dogAge.units.months') }}</span>
              </div>
              <p v-if="getIssue('months')" id="dog-age-months-error" class="dog-age-error">
                {{ t(getIssue('months')!.messageKey) }}
              </p>
            </div>
          </div>

          <div class="dog-age-field">
            <span class="dog-age-field__label">{{ t('dogAge.form.size') }}</span>
            <div class="dog-age-chip-list" role="group" :aria-label="t('dogAge.form.size')">
              <button
                v-for="size in sizeOptions"
                :key="size"
                type="button"
                class="dog-age-chip"
                :class="{ 'dog-age-chip--active': input.size === size }"
                :aria-pressed="input.size === size"
                @click="input.size = size"
              >
                {{ t(`dogAge.size.${size}`) }}
              </button>
            </div>
          </div>
        </section>

        <aside class="dog-age-warning-note">
          <strong>{{ t('dogAge.warning.title') }}</strong>
          <span>{{ t('dogAge.warning.body') }}</span>
        </aside>
      </form>

      <section class="dog-age-result" aria-live="polite">
        <p class="dog-age-result__label">{{ t('dogAge.result.label') }}</p>

        <template v-if="result">
          <div class="dog-age-result__total">
            <span>{{ t('dogAge.result.humanAge') }}</span>
            <strong>{{ t('dogAge.result.humanYears', { value: formatNumber(result.humanYears) }) }}</strong>
          </div>

          <div class="dog-age-result__rows">
            <div class="dog-age-result__row">
              <span>{{ t('dogAge.result.dogAge') }}</span>
              <strong>{{ t('dogAge.result.dogYears', { value: formatNumber(result.dogYears) }) }}</strong>
            </div>
            <div class="dog-age-result__row">
              <span>{{ t('dogAge.result.stage') }}</span>
              <strong>{{ t(`dogAge.stage.${result.stageKey}`) }}</strong>
            </div>
            <div class="dog-age-result__row">
              <span>{{ t('dogAge.result.rate') }}</span>
              <strong>{{ t('dogAge.result.rateValue', { value: result.yearlyAgingRate }) }}</strong>
            </div>
          </div>

          <p class="dog-age-formula">{{ t('dogAge.formula') }}</p>
        </template>

        <p v-else class="dog-age-result__empty">{{ t('dogAge.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDogAgeCalculator } from '../composables/useDogAgeCalculator'
import type { DogSize } from '../types/dog-age'

const { t, n } = useI18n()
const sizeOptions: DogSize[] = ['small', 'medium', 'large', 'giant']
const { input, result, getIssue } = useDogAgeCalculator()

function formatNumber(value: number): string {
  return n(value, { maximumFractionDigits: 1 })
}
</script>
