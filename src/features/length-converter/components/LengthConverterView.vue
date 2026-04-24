<template>
  <main class="length-page" aria-labelledby="length-title">
    <section class="length-heading">
      <p class="length-eyebrow">{{ t('length.eyebrow') }}</p>
      <h1 id="length-title">{{ t('length.title') }}</h1>
      <p>{{ t('length.intro') }}</p>
    </section>

    <div class="length-workspace">
      <form class="length-form" @submit.prevent>
        <div class="length-field">
          <label for="length-value">{{ t('length.form.value') }}</label>
          <input
            id="length-value"
            v-model.number="value"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            :aria-invalid="Boolean(issue)"
            aria-describedby="length-value-error"
          >
          <p v-if="issue" id="length-value-error" class="length-error">
            {{ t(issue.messageKey) }}
          </p>
        </div>

        <div class="length-unit-grid">
          <div class="length-field">
            <label for="length-from">{{ t('length.form.from') }}</label>
            <select id="length-from" v-model="fromUnit">
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ t(`length.units.${unit}`) }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="length-swap"
            :aria-label="t('length.form.swap')"
            :title="t('length.form.swap')"
            @click="swapUnits"
          >
            ⇄
          </button>

          <div class="length-field">
            <label for="length-to">{{ t('length.form.to') }}</label>
            <select id="length-to" v-model="toUnit">
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ t(`length.units.${unit}`) }}
              </option>
            </select>
          </div>
        </div>
      </form>

      <section class="length-result" aria-live="polite">
        <p class="length-result__label">{{ t('length.result.label') }}</p>

        <template v-if="result !== null">
          <div class="length-result__value">{{ formatNumber(result) }}</div>
          <p>{{ t('length.result.summary', resultSummaryParams) }}</p>
        </template>

        <p v-else class="length-result__empty">{{ t('length.result.empty') }}</p>
      </section>
    </div>

    <section class="length-popular" aria-labelledby="length-popular-title">
      <h2 id="length-popular-title">{{ t('length.popular.title') }}</h2>
      <ul>
        <li v-for="item in popularConversions" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { convertLength } from '../lib/calculations'
import { useLengthConverter } from '../composables/useLengthConverter'
import type { LengthUnit } from '../types/length'

const { t, n } = useI18n()
const {
  value,
  fromUnit,
  toUnit,
  units,
  issue,
  result,
  swapUnits,
} = useLengthConverter()

const resultSummaryParams = computed(() => ({
  value: formatNumber(value.value),
  from: t(`length.unitShort.${fromUnit.value}`),
  to: t(`length.unitShort.${toUnit.value}`),
}))

const popularPairs: Array<[number, LengthUnit, LengthUnit]> = [
  [1, 'meter', 'centimeter'],
  [1, 'kilometer', 'meter'],
  [1, 'inch', 'centimeter'],
  [1, 'foot', 'meter'],
  [1, 'mile', 'kilometer'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([sourceValue, from, to]) => {
      const converted = convertLength(sourceValue, from, to)
      if (converted === null) return ''

      return t('length.popular.item', {
        value: formatNumber(sourceValue),
        from: t(`length.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`length.unitShort.${to}`),
      })
    })
    .filter(Boolean),
)

function formatNumber(nextValue: number): string {
  return n(nextValue, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  })
}
</script>

<style scoped>
.length-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.length-heading {
  max-width: 760px;
}

.length-eyebrow {
  margin: 0 0 10px;
  color: #0e7490;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.length-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.length-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.length-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 20px;
  align-items: stretch;
}

.length-form,
.length-result,
.length-popular {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.length-form {
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 24px;
}

.length-field {
  display: grid;
  gap: 8px;
}

.length-field label {
  color: #27364a;
  font-weight: 750;
}

.length-field input,
.length-field select {
  width: 100%;
  min-width: 0;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  padding: 14px;
  color: #111827;
  background: #fff;
  font: inherit;
  outline: 0;
}

.length-field input:focus,
.length-field select:focus {
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.12);
}

.length-field input[aria-invalid="true"] {
  color: #991b1b;
}

.length-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.length-unit-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
  gap: 12px;
  align-items: end;
}

.length-swap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 48px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  color: #0e7490;
  background: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
}

.length-swap:hover {
  border-color: #0e7490;
  background: #ecfeff;
}

.length-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 252px;
  padding: 24px;
}

.length-result__label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.length-result__value {
  color: #0e7490;
  font-size: 3.6rem;
  line-height: 1;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.length-result p {
  margin: 14px 0 0;
  color: #526174;
}

.length-result__empty {
  margin-top: 8px;
}

.length-popular {
  padding: 20px 24px;
}

.length-popular h2 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
}

.length-popular ul {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.length-popular li {
  border-radius: 8px;
  padding: 10px 12px;
  color: #334155;
  background: #f0f9ff;
  font-size: 0.92rem;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 900px) {
  .length-workspace {
    grid-template-columns: 1fr;
  }

  .length-popular ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .length-page {
    gap: 20px;
  }

  .length-heading h1 {
    font-size: 2.15rem;
  }

  .length-heading p:last-child {
    font-size: 1rem;
  }

  .length-form,
  .length-result,
  .length-popular {
    padding: 18px;
  }

  .length-unit-grid {
    grid-template-columns: 1fr;
  }

  .length-swap {
    width: 100%;
  }

  .length-result {
    min-height: 220px;
  }

  .length-result__value {
    font-size: 3rem;
  }

  .length-popular ul {
    grid-template-columns: 1fr;
  }
}
</style>
