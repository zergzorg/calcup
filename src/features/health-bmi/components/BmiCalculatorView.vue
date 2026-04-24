<template>
  <main class="bmi-page" aria-labelledby="bmi-title">
    <section class="bmi-heading">
      <p class="bmi-eyebrow">{{ t('bmi.eyebrow') }}</p>
      <h1 id="bmi-title">{{ t('bmi.title') }}</h1>
      <p>{{ t('bmi.intro') }}</p>
    </section>

    <div class="bmi-workspace">
      <form class="bmi-form" @submit.prevent>
        <div class="bmi-field">
          <label for="bmi-height">{{ t('bmi.form.height') }}</label>
          <div class="bmi-input-wrap">
            <input
              id="bmi-height"
              v-model.number="heightCm"
              type="number"
              inputmode="decimal"
              min="50"
              max="250"
              step="1"
              :aria-invalid="Boolean(getIssue('heightCm'))"
              aria-describedby="bmi-height-error"
            >
            <span>{{ t('bmi.units.cm') }}</span>
          </div>
          <p v-if="getIssue('heightCm')" id="bmi-height-error" class="bmi-error">
            {{ t(getIssue('heightCm')?.messageKey ?? '') }}
          </p>
        </div>

        <div class="bmi-field">
          <label for="bmi-weight">{{ t('bmi.form.weight') }}</label>
          <div class="bmi-input-wrap">
            <input
              id="bmi-weight"
              v-model.number="weightKg"
              type="number"
              inputmode="decimal"
              min="10"
              max="400"
              step="0.1"
              :aria-invalid="Boolean(getIssue('weightKg'))"
              aria-describedby="bmi-weight-error"
            >
            <span>{{ t('bmi.units.kg') }}</span>
          </div>
          <p v-if="getIssue('weightKg')" id="bmi-weight-error" class="bmi-error">
            {{ t(getIssue('weightKg')?.messageKey ?? '') }}
          </p>
        </div>
      </form>

      <section class="bmi-result" aria-live="polite">
        <p class="bmi-result__label">{{ t('bmi.result.label') }}</p>

        <template v-if="result">
          <div class="bmi-result__value">{{ result.value.toFixed(1) }}</div>
          <h2>{{ t(`bmi.categories.${result.category}.title`) }}</h2>
          <p>{{ t(`bmi.categories.${result.category}.description`) }}</p>
        </template>

        <p v-else class="bmi-result__empty">{{ t('bmi.result.empty') }}</p>
      </section>
    </div>

    <aside class="bmi-disclaimer">
      <h2>{{ t('bmi.disclaimer.title') }}</h2>
      <p>{{ t('bmi.disclaimer.body') }}</p>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBmiCalculator } from '../composables/useBmiCalculator'

const { t } = useI18n()
const { heightCm, weightKg, result, getIssue } = useBmiCalculator()
</script>

<style scoped>
.bmi-page {
  display: grid;
  gap: 28px;
  color: #172033;
}

.bmi-heading {
  max-width: 720px;
}

.bmi-eyebrow {
  margin: 0 0 10px;
  color: #0f766e;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bmi-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.bmi-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.bmi-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
  gap: 20px;
  align-items: stretch;
}

.bmi-form,
.bmi-result,
.bmi-disclaimer {
  border: 1px solid #dbe7e2;
  border-radius: 8px;
  background: #fbfdfc;
}

.bmi-form {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.bmi-field {
  display: grid;
  gap: 8px;
}

.bmi-field label {
  color: #27364a;
  font-weight: 750;
}

.bmi-input-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  overflow: hidden;
  border: 1px solid #c9d8d1;
  border-radius: 8px;
  background: #fff;
}

.bmi-input-wrap:focus-within {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.bmi-input-wrap input {
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 14px 14px;
  color: #111827;
  background: transparent;
  font: inherit;
  font-size: 1rem;
  outline: 0;
}

.bmi-input-wrap span {
  padding: 0 14px;
  color: #64748b;
  font-weight: 700;
}

.bmi-input-wrap input[aria-invalid="true"] {
  color: #991b1b;
}

.bmi-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.bmi-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 258px;
  padding: 24px;
}

.bmi-result__label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.bmi-result__value {
  color: #0f766e;
  font-size: 4rem;
  line-height: 1;
  font-weight: 850;
}

.bmi-result h2 {
  margin: 14px 0 8px;
  color: #111827;
  font-size: 1.35rem;
  font-weight: 800;
}

.bmi-result p {
  margin: 0;
  color: #526174;
}

.bmi-result__empty {
  margin-top: 8px;
}

.bmi-disclaimer {
  padding: 20px 24px;
  background: #fff8ed;
  border-color: #fed7aa;
}

.bmi-disclaimer h2 {
  margin: 0 0 8px;
  color: #92400e;
  font-size: 1rem;
  font-weight: 800;
}

.bmi-disclaimer p {
  margin: 0;
  color: #9a3412;
}

@media (max-width: 767px) {
  .bmi-page {
    gap: 22px;
  }

  .bmi-heading h1 {
    font-size: 2.15rem;
  }

  .bmi-heading p:last-child {
    font-size: 1rem;
  }

  .bmi-workspace {
    grid-template-columns: 1fr;
  }

  .bmi-form,
  .bmi-result,
  .bmi-disclaimer {
    padding: 18px;
  }

  .bmi-result {
    min-height: 220px;
  }

  .bmi-result__value {
    font-size: 3.2rem;
  }
}
</style>
