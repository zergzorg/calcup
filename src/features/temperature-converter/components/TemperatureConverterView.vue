<template>
  <main class="temperature-page" aria-labelledby="temperature-title">
    <section class="temperature-heading">
      <p class="temperature-eyebrow">{{ t('temperature.eyebrow') }}</p>
      <h1 id="temperature-title">{{ t('temperature.title') }}</h1>
      <p>{{ t('temperature.intro') }}</p>
    </section>

    <div class="temperature-workspace">
      <form class="temperature-form" @submit.prevent>
        <div class="temperature-field">
          <label for="temperature-value">{{ t('temperature.form.value') }}</label>
          <input
            id="temperature-value"
            v-model.number="value"
            type="number"
            step="any"
            inputmode="decimal"
            :aria-invalid="Boolean(getIssue('value'))"
            aria-describedby="temperature-value-error"
            @blur="touch('value')"
          >
          <p v-if="getIssue('value')" id="temperature-value-error" class="temperature-error">
            {{ t(getIssue('value')!.messageKey) }}
          </p>
        </div>

        <div class="temperature-unit-grid">
          <div class="temperature-field">
            <label for="temperature-from">{{ t('temperature.form.from') }}</label>
            <select id="temperature-from" v-model="fromUnit">
              <option v-for="unit in UNITS" :key="unit" :value="unit">
                {{ t(`temperature.units.${unit}`) }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="temperature-swap"
            :aria-label="t('temperature.form.swap')"
            :title="t('temperature.form.swap')"
            @click="swapUnits"
          >
            ⇄
          </button>

          <div class="temperature-field">
            <label for="temperature-to">{{ t('temperature.form.to') }}</label>
            <select id="temperature-to" v-model="toUnit">
              <option v-for="unit in UNITS" :key="unit" :value="unit">
                {{ t(`temperature.units.${unit}`) }}
              </option>
            </select>
          </div>
        </div>
      </form>

      <section class="temperature-result" aria-live="polite">
        <p class="temperature-result__label">{{ t('temperature.result.label') }}</p>

        <template v-if="result !== null">
          <div class="temperature-result__value">{{ result }} {{ t(`temperature.units.${toUnit}`) }}</div>
          <p class="temperature-result__summary">{{ value }} {{ t(`temperature.units.${fromUnit}`) }} = {{ result }} {{ t(`temperature.units.${toUnit}`) }}</p>
          <p v-if="formula" class="temperature-result__formula">{{ formula }}</p>
        </template>

        <p v-else class="temperature-result__empty">{{ t('temperature.result.empty') }}</p>
      </section>
    </div>

    <section class="temperature-popular" aria-labelledby="temperature-popular-title">
      <h2 id="temperature-popular-title">{{ t('temperature.popular.title') }}</h2>
      <ul>
        <li>{{ t('temperature.popular.freezing') }}</li>
        <li>{{ t('temperature.popular.boiling') }}</li>
        <li>{{ t('temperature.popular.body') }}</li>
        <li>{{ t('temperature.popular.room') }}</li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTemperatureCalculator, UNITS } from '../composables/useTemperatureConverter'

const { t } = useI18n()
const { value, fromUnit, toUnit, result, formula, touch, getIssue, swapUnits } = useTemperatureCalculator()
</script>

<style scoped>
.temperature-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.temperature-heading {
  max-width: 760px;
}

.temperature-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.temperature-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.temperature-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.temperature-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 20px;
  align-items: stretch;
}

.temperature-form,
.temperature-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.temperature-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

.temperature-field {
  display: grid;
  gap: 8px;
}

.temperature-field label {
  color: #27364a;
  font-weight: 750;
}

.temperature-field input,
.temperature-field select {
  padding: 14px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-size: 1rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.temperature-field input:focus,
.temperature-field select:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}

.temperature-field input[aria-invalid="true"] {
  border-color: #ef4444;
}

.temperature-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.temperature-unit-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: end;
}

.temperature-swap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
  color: #526174;
  font-size: 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.temperature-swap:hover {
  border-color: #0d9488;
  background: #f0fdfa;
}

.temperature-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
}

.temperature-result__label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.temperature-result__value {
  color: #0d9488;
  font-size: 2.5rem;
  font-weight: 850;
  line-height: 1.1;
}

.temperature-result__summary {
  margin: 12px 0 0;
  color: #526174;
  font-size: 0.95rem;
}

.temperature-result__formula {
  margin: 12px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
  font-family: monospace;
}

.temperature-result__empty {
  color: #94a3b8;
}

.temperature-popular {
  max-width: 600px;
}

.temperature-popular h2 {
  margin: 0 0 16px;
  color: #27364a;
  font-size: 1.1rem;
  font-weight: 700;
}

.temperature-popular ul {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.temperature-popular li {
  padding: 8px 14px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #475569;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .temperature-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .temperature-page {
    gap: 20px;
  }

  .temperature-heading h1 {
    font-size: 2.15rem;
  }

  .temperature-heading p:last-child {
    font-size: 1rem;
  }

  .temperature-form,
  .temperature-result {
    padding: 18px;
  }

  .temperature-unit-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .temperature-swap {
    justify-self: center;
    transform: rotate(90deg);
  }

  .temperature-result__value {
    font-size: 2rem;
  }
}
</style>