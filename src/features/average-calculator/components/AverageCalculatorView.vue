<template>
  <main class="average-page" aria-labelledby="average-title">
    <section class="average-heading">
      <p class="average-eyebrow">{{ t('average.eyebrow') }}</p>
      <h1 id="average-title">{{ t('average.title') }}</h1>
      <p>{{ t('average.intro') }}</p>
    </section>

    <div class="average-workspace">
      <form class="average-form" @submit.prevent>
        <section class="average-section">
          <div class="average-field">
            <label for="average-values">{{ t('average.form.values') }}</label>
            <div class="average-input-wrap">
              <textarea
                id="average-values"
                v-model="numbersInput"
                rows="4"
                :placeholder="t('average.form.placeholder')"
                :aria-invalid="Boolean(issue)"
                aria-describedby="average-values-help average-values-error"
              />
            </div>
            <p id="average-values-help" class="average-note">{{ t('average.form.help') }}</p>
            <p v-if="issue" id="average-values-error" class="average-error">
              {{ t(issue.messageKey, issue.params ?? {}) }}
            </p>
          </div>
        </section>

        <section class="average-section">
          <div class="average-section__header">
            <h2>{{ t('average.examples.title') }}</h2>
          </div>
          <div class="average-chip-list">
            <button
              v-for="example in examples"
              :key="example.value"
              type="button"
              class="average-chip"
              @click="numbersInput = example.value"
            >
              {{ t(`average.examples.${example.key}`) }}
            </button>
          </div>
        </section>
      </form>

      <section class="average-result" aria-live="polite">
        <p class="average-result__label">{{ t('average.result.label') }}</p>

        <template v-if="result">
          <div class="average-result__total">
            <span>{{ t('average.result.mean') }}</span>
            <strong>{{ formatNumber(result.mean) }}</strong>
          </div>

          <div class="average-result__rows">
            <div class="average-result__row">
              <span>{{ t('average.result.count') }}</span>
              <strong>{{ result.count }}</strong>
            </div>
            <div class="average-result__row">
              <span>{{ t('average.result.sum') }}</span>
              <strong>{{ formatNumber(result.sum) }}</strong>
            </div>
            <div class="average-result__row">
              <span>{{ t('average.result.median') }}</span>
              <strong>{{ formatNumber(result.median) }}</strong>
            </div>
            <div class="average-result__row">
              <span>{{ t('average.result.minMax') }}</span>
              <strong>{{ formatNumber(result.min) }} / {{ formatNumber(result.max) }}</strong>
            </div>
            <div class="average-result__row">
              <span>{{ t('average.result.range') }}</span>
              <strong>{{ formatNumber(result.range) }}</strong>
            </div>
          </div>

          <p class="average-formula">{{ t('average.formula') }}</p>
        </template>

        <p v-else class="average-result__empty">{{ t('average.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAverageCalculator } from '../composables/useAverageCalculator'

const { t, n } = useI18n()
const { numbersInput, issue, result } = useAverageCalculator()

const examples = [
  { key: 'grades', value: '5 4 5 3 4' },
  { key: 'prices', value: '1200 1350 1280 1410' },
  { key: 'decimal', value: '1,5 2,5 3,5 4,5' },
]

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  })
}
</script>
