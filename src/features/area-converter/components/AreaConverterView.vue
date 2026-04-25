<template>
  <main class="area-page" aria-labelledby="area-title">
    <section class="area-heading">
      <p class="area-eyebrow">{{ t('area.eyebrow') }}</p>
      <h1 id="area-title">{{ t('area.title') }}</h1>
      <p>{{ t('area.intro') }}</p>
    </section>

    <div class="area-workspace">
      <form class="area-form" @submit.prevent>
        <div class="area-field">
          <label for="area-value">{{ t('area.form.value') }}</label>
          <input
            id="area-value"
            v-model.number="value"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            :aria-invalid="Boolean(issue)"
            aria-describedby="area-value-error"
          />
          <p v-if="issue" id="area-value-error" class="area-error">
            {{ t(issue.messageKey) }}
          </p>
        </div>

        <div class="area-unit-grid">
          <div class="area-field">
            <label for="area-from">{{ t('area.form.from') }}</label>
            <select id="area-from" v-model="fromUnit">
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ t(`area.units.${unit}`) }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="area-swap"
            :aria-label="t('area.form.swap')"
            :title="t('area.form.swap')"
            @click="swapUnits"
          >
            ⇄
          </button>

          <div class="area-field">
            <label for="area-to">{{ t('area.form.to') }}</label>
            <select id="area-to" v-model="toUnit">
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ t(`area.units.${unit}`) }}
              </option>
            </select>
          </div>
        </div>
      </form>

      <section class="area-result" aria-live="polite">
        <p class="area-result__label">{{ t('area.result.label') }}</p>

        <template v-if="result !== null">
          <div class="area-result__value">
            {{ formatNumber(result) }}
            <span class="area-result__unit">{{ t(`area.unitShort.${toUnit}`) }}</span>
          </div>
          <p class="area-result__summary">
            {{ formatNumber(value) }} {{ t(`area.unitShort.${fromUnit}`) }}
            = {{ formatNumber(result) }} {{ t(`area.unitShort.${toUnit}`) }}
          </p>
        </template>

        <p v-else class="area-result__empty">{{ t('area.result.empty') }}</p>
      </section>
    </div>

    <section class="area-popular" aria-labelledby="area-popular-title">
      <h2 id="area-popular-title">{{ t('area.popular.title') }}</h2>
      <ul class="area-popular__list">
        <li v-for="item in popularConversions" :key="item" class="area-popular__item">
          {{ item }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { convertArea } from '../lib/calculations'
import { useAreaConverter } from '../composables/useAreaConverter'
import type { AreaUnit } from '../types/area'

const { t, n } = useI18n()
const { value, fromUnit, toUnit, units, issue, result, swapUnits } = useAreaConverter()

const popularPairs: Array<[number, AreaUnit, AreaUnit]> = [
  [1, 'squareMeter', 'squareFoot'],
  [1, 'hectare', 'squareMeter'],
  [1, 'are', 'squareMeter'],
  [1, 'acre', 'hectare'],
  [1, 'squareKilometer', 'hectare'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([src, from, to]) => {
      const converted = convertArea(src, from, to)
      if (converted === null) return ''
      return t('area.popular.item', {
        value: formatNumber(src),
        from: t(`area.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`area.unitShort.${to}`),
      })
    })
    .filter(Boolean),
)

function formatNumber(v: number): string {
  return n(v, { maximumFractionDigits: 8, minimumFractionDigits: 0 })
}
</script>

<style scoped>
.area-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.area-heading {
  max-width: 760px;
}

.area-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.area-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.area-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

/* Workspace: form left, result right */
.area-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 400px);
  gap: 20px;
  align-items: start;
}

.area-form,
.area-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.area-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

/* Fields */
.area-field {
  display: grid;
  gap: 6px;
}

.area-field label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.area-field input,
.area-field select {
  padding: 10px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 15px;
  color: #111827;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.area-field input:focus,
.area-field select:focus {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

.area-field input[aria-invalid="true"] {
  border-color: #ef4444;
}

.area-error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
}

/* Unit grid: from ⇄ to */
.area-unit-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: end;
}

.area-swap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: #f9fafb;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
  margin-bottom: 2px;
}

.area-swap:hover {
  border-color: #0d9488;
  color: #0f766e;
}

/* Result */
.area-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
}

.area-result__label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.area-result__value {
  color: #0d9488;
  font-size: 2.5rem;
  font-weight: 850;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.area-result__unit {
  margin-left: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #94a3b8;
}

.area-result__summary {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #526174;
  overflow-wrap: anywhere;
}

.area-result__empty {
  color: #94a3b8;
  font-size: 14px;
}

/* Popular */
.area-popular h2 {
  margin: 0 0 14px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.area-popular__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.area-popular__item {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 13px;
  color: #475569;
}

@media (max-width: 900px) {
  .area-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .area-heading h1 { font-size: 2.15rem; }
  .area-form, .area-result { padding: 18px; }
  .area-result__value { font-size: 2rem; }
  .area-unit-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .area-swap {
    width: 100%;
    height: 34px;
  }
}
</style>
