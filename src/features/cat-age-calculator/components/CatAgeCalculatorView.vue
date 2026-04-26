<template>
  <main class="cat-age-page" aria-labelledby="cat-age-title">
    <section class="cat-age-heading">
      <p class="cat-age-eyebrow">{{ t('catAge.eyebrow') }}</p>
      <h1 id="cat-age-title">{{ t('catAge.title') }}</h1>
      <p>{{ t('catAge.intro') }}</p>
    </section>

    <div class="cat-age-workspace">
      <form class="cat-age-form" @submit.prevent>
        <section class="cat-age-section">
          <div class="cat-age-section__header">
            <h2>{{ t('catAge.form.title') }}</h2>
            <p>{{ t('catAge.form.description') }}</p>
          </div>

          <div class="cat-age-grid cat-age-grid--two">
            <div class="cat-age-field">
              <label for="cat-age-years">{{ t('catAge.form.years') }}</label>
              <div class="cat-age-input-wrap">
                <input
                  id="cat-age-years"
                  v-model.number="input.years"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="35"
                  step="1"
                  :aria-invalid="Boolean(getIssue('years'))"
                  aria-describedby="cat-age-years-error"
                >
                <span>{{ t('catAge.units.years') }}</span>
              </div>
              <p v-if="getIssue('years')" id="cat-age-years-error" class="cat-age-error">
                {{ t(getIssue('years')!.messageKey) }}
              </p>
            </div>

            <div class="cat-age-field">
              <label for="cat-age-months">{{ t('catAge.form.months') }}</label>
              <div class="cat-age-input-wrap">
                <input
                  id="cat-age-months"
                  v-model.number="input.months"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="11"
                  step="1"
                  :aria-invalid="Boolean(getIssue('months'))"
                  aria-describedby="cat-age-months-error"
                >
                <span>{{ t('catAge.units.months') }}</span>
              </div>
              <p v-if="getIssue('months')" id="cat-age-months-error" class="cat-age-error">
                {{ t(getIssue('months')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <aside class="cat-age-warning-note">
          <strong>{{ t('catAge.warning.title') }}</strong>
          <span>{{ t('catAge.warning.body') }}</span>
        </aside>
      </form>

      <section class="cat-age-result" aria-live="polite">
        <p class="cat-age-result__label">{{ t('catAge.result.label') }}</p>

        <template v-if="result">
          <div class="cat-age-result__total">
            <span>{{ t('catAge.result.humanAge') }}</span>
            <strong>{{ t('catAge.result.humanYears', { value: formatNumber(result.humanYears) }) }}</strong>
          </div>

          <div class="cat-age-result__rows">
            <div class="cat-age-result__row">
              <span>{{ t('catAge.result.catAge') }}</span>
              <strong>{{ t('catAge.result.catYears', { value: formatNumber(result.catYears) }) }}</strong>
            </div>
            <div class="cat-age-result__row">
              <span>{{ t('catAge.result.stage') }}</span>
              <strong>{{ t(`catAge.stage.${result.stageKey}`) }}</strong>
            </div>
          </div>

          <p class="cat-age-formula">{{ t('catAge.formula') }}</p>
        </template>

        <p v-else class="cat-age-result__empty">{{ t('catAge.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatAgeCalculator } from '../composables/useCatAgeCalculator'

const { t, n } = useI18n()
const { input, result, getIssue } = useCatAgeCalculator()

function formatNumber(value: number): string {
  return n(value, { maximumFractionDigits: 1 })
}
</script>
