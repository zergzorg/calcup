<template>
  <main class="shoe-size-page" aria-labelledby="shoe-size-title">
    <section class="shoe-size-heading">
      <p class="shoe-size-eyebrow">{{ t('shoeSize.eyebrow') }}</p>
      <h1 id="shoe-size-title">{{ t('shoeSize.title') }}</h1>
      <p>{{ t('shoeSize.intro') }}</p>
    </section>

    <div class="shoe-size-workspace">
      <form class="shoe-size-form" @submit.prevent>
        <section class="shoe-size-section">
          <div class="shoe-size-section__header">
            <h2>{{ t('shoeSize.form.knownTitle') }}</h2>
            <p>{{ t('shoeSize.form.knownHint') }}</p>
          </div>

          <div class="shoe-size-chip-list" role="radiogroup" :aria-label="t('shoeSize.form.system')">
            <button
              v-for="item in systems"
              :key="item"
              type="button"
              class="shoe-size-chip"
              :class="{ 'shoe-size-chip--active': system === item }"
              role="radio"
              :aria-checked="system === item"
              @click="system = item"
            >
              {{ t(`shoeSize.systems.${item}`) }}
            </button>
          </div>

          <div class="shoe-size-field">
            <label for="shoe-size-value">{{ t('shoeSize.form.value') }}</label>
            <div class="shoe-size-input-wrap">
              <input
                id="shoe-size-value"
                v-model.number="value"
                type="number"
                min="0"
                step="0.5"
                inputmode="decimal"
                :aria-invalid="Boolean(issue)"
                aria-describedby="shoe-size-value-help shoe-size-value-error"
              >
              <span class="shoe-size-unit">{{ inputUnit }}</span>
            </div>
            <p id="shoe-size-value-help" class="shoe-size-help">
              {{ t(`shoeSize.form.help.${system}`) }}
            </p>
            <p v-if="issue" id="shoe-size-value-error" class="shoe-size-error">
              {{ t(issue.messageKey) }}
            </p>
          </div>
        </section>

        <section class="shoe-size-section">
          <div class="shoe-size-section__header">
            <h2>{{ t('shoeSize.assumptions.title') }}</h2>
            <p>{{ t('shoeSize.assumptions.body') }}</p>
          </div>
          <ul class="shoe-size-source-list">
            <li>{{ t('shoeSize.assumptions.mondopoint') }}</li>
            <li>{{ t('shoeSize.assumptions.brand') }}</li>
          </ul>
        </section>
      </form>

      <section class="shoe-size-result" aria-live="polite">
        <p class="shoe-size-result__label">{{ t('shoeSize.result.label') }}</p>

        <template v-if="result">
          <div class="shoe-size-result__total">
            <span>{{ t('shoeSize.result.primary') }}</span>
            <strong>{{ t('shoeSize.result.euValue', { value: formatSize(result.eu) }) }}</strong>
          </div>

          <div class="shoe-size-result__rows">
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.footLength') }}</span>
              <strong>{{ t('shoeSize.result.cmValue', { value: formatLength(result.footLengthCm) }) }}</strong>
            </div>
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.mondopoint') }}</span>
              <strong>{{ t('shoeSize.result.mmValue', { value: result.mondopointMm }) }}</strong>
            </div>
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.euRu') }}</span>
              <strong>{{ formatSize(result.ru) }}</strong>
            </div>
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.uk') }}</span>
              <strong>{{ formatSize(result.uk) }}</strong>
            </div>
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.usMen') }}</span>
              <strong>{{ formatSize(result.usMen) }}</strong>
            </div>
            <div class="shoe-size-result__row">
              <span>{{ t('shoeSize.result.usWomen') }}</span>
              <strong>{{ formatSize(result.usWomen) }}</strong>
            </div>
          </div>

          <p class="shoe-size-formula">{{ t('shoeSize.formula') }}</p>
        </template>

        <p v-else class="shoe-size-result__empty">{{ t('shoeSize.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useShoeSizeConverter } from '../composables/useShoeSizeConverter'

const { t, n } = useI18n()
const {
  value,
  system,
  systems,
  issue,
  result,
} = useShoeSizeConverter()

const inputUnit = computed(() => t(`shoeSize.units.${system.value}`))

function formatSize(nextValue: number): string {
  return n(nextValue, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(nextValue) ? 0 : 1,
  })
}

function formatLength(nextValue: number): string {
  return n(nextValue, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}
</script>

<style scoped>
.shoe-size-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.shoe-size-heading {
  max-width: 760px;
}

.shoe-size-section {
  display: grid;
  gap: 16px;
}

.shoe-size-section + .shoe-size-section {
  padding-top: 6px;
}

.shoe-size-section__header {
  display: grid;
  gap: 6px;
}

.shoe-size-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.shoe-size-section__header p,
.shoe-size-help,
.shoe-size-source-list {
  margin: 0;
  color: #64748b;
}

.shoe-size-source-list {
  display: grid;
  gap: 8px;
  padding-left: 18px;
}

.shoe-size-result__rows {
  display: grid;
}
</style>
