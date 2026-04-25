<template>
  <main class="weight-page" aria-labelledby="weight-title">
    <section class="weight-heading">
      <p class="weight-eyebrow">{{ t('weight.eyebrow') }}</p>
      <h1 id="weight-title">{{ t('weight.title') }}</h1>
      <p>{{ t('weight.intro') }}</p>
    </section>

    <div class="weight-workspace">
      <form class="weight-form" @submit.prevent>
        <div class="weight-field">
          <label for="weight-value">{{ t('weight.form.value') }}</label>
          <input
            id="weight-value"
            v-model.number="value"
            type="number"
            step="any"
            min="0"
            inputmode="decimal"
            :aria-invalid="Boolean(getIssue('value'))"
            aria-describedby="weight-value-error"
            @blur="touch('value')"
          />
          <p v-if="getIssue('value')" id="weight-value-error" class="weight-error">
            {{ t(getIssue('value')!.messageKey) }}
          </p>
        </div>

        <div class="weight-unit-grid">
          <div class="weight-field">
            <label for="weight-from">{{ t('weight.form.from') }}</label>
            <select id="weight-from" v-model="fromUnit">
              <option v-for="unit in UNITS" :key="unit" :value="unit">
                {{ t(`weight.units.${unit}`) }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="weight-swap"
            :aria-label="t('weight.form.swap')"
            :title="t('weight.form.swap')"
            @click="swapUnits"
          >
            ⇄
          </button>

          <div class="weight-field">
            <label for="weight-to">{{ t('weight.form.to') }}</label>
            <select id="weight-to" v-model="toUnit">
              <option v-for="unit in UNITS" :key="unit" :value="unit">
                {{ t(`weight.units.${unit}`) }}
              </option>
            </select>
          </div>
        </div>
      </form>

      <section class="weight-result" aria-live="polite">
        <p class="weight-result__label">{{ t('weight.result.label') }}</p>

        <template v-if="result !== null">
          <div class="weight-result__value">
            {{ result }}<span class="weight-result__unit">{{ t(`weight.unitShort.${toUnit}`) }}</span>
          </div>

          <p class="weight-result__summary">
            {{ value }} {{ t(`weight.unitShort.${fromUnit}`) }} = {{ result }} {{ t(`weight.unitShort.${toUnit}`) }}
          </p>

          <p v-if="formula" class="weight-result__formula">{{ formula }}</p>
        </template>

        <p v-else class="weight-result__empty">{{ t('weight.result.empty') }}</p>
      </section>
    </div>

    <section class="weight-popular" aria-labelledby="weight-popular-title">
      <h2 id="weight-popular-title">{{ t('weight.popular.title') }}</h2>
      <ul>
        <li v-for="item in popularItems" :key="item">{{ item }}</li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeightConverter, UNITS } from '../composables/useWeightConverter'

const { t } = useI18n()
const { value, fromUnit, toUnit, result, formula, touch, getIssue, swapUnits } = useWeightConverter()

const fmt = (v: number) => {
  const r = Math.round(v * 100) / 100
  return r.toString().replace('.', ',')
}

const popularItems = computed(() => [
  `70 кг ≈ ${fmt(70 * 2.20462)} фунт`,
  `3,5 кг ≈ ${fmt(3.5 * 2.20462)} фунт`,
  `150 г ≈ ${fmt(150 / 28.3495)} унц`,
  `1500 кг ≈ 1,5 т`,
])
</script>

<style scoped>
.weight-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.weight-heading {
  max-width: 760px;
}

.weight-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.weight-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.weight-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.weight-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 20px;
  align-items: stretch;
}

.weight-form,
.weight-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.weight-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

.weight-field {
  display: grid;
  gap: 8px;
}

.weight-field label {
  color: #27364a;
  font-weight: 750;
}

.weight-field input,
.weight-field select {
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

.weight-field input:focus,
.weight-field select:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}

.weight-field input[aria-invalid="true"] {
  border-color: #ef4444;
}

.weight-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.weight-unit-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: end;
}

.weight-swap {
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

.weight-swap:hover {
  border-color: #0d9488;
  background: #f0fdfa;
}

.weight-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
}

.weight-result__label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.weight-result__value {
  color: #0d9488;
  font-size: 2.5rem;
  font-weight: 850;
  line-height: 1.1;
}

.weight-result__unit {
  margin-left: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #64748b;
}

.weight-result__summary {
  margin: 12px 0 0;
  color: #526174;
  font-size: 0.95rem;
}

.weight-result__formula {
  margin: 12px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
  font-family: monospace;
}

.weight-result__empty {
  color: #94a3b8;
}

.weight-popular {
  max-width: 600px;
}

.weight-popular h2 {
  margin: 0 0 16px;
  color: #27364a;
  font-size: 1.1rem;
  font-weight: 700;
}

.weight-popular ul {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.weight-popular li {
  padding: 8px 14px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #475569;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .weight-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .weight-heading h1 {
    font-size: 2.15rem;
  }

  .weight-form,
  .weight-result {
    padding: 18px;
  }

  .weight-unit-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .weight-swap {
    justify-self: center;
    transform: rotate(90deg);
  }

  .weight-result__value {
    font-size: 2rem;
  }
}
</style>
