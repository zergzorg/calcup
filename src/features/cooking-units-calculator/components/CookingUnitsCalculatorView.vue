<template>
  <main class="cooking-units-page" aria-labelledby="cooking-units-title">
    <section class="cooking-units-heading">
      <p class="cooking-units-eyebrow">{{ t('cookingUnits.eyebrow') }}</p>
      <h1 id="cooking-units-title">{{ t('cookingUnits.title') }}</h1>
      <p>{{ t('cookingUnits.intro') }}</p>
    </section>

    <div class="cooking-units-workspace">
      <form class="cooking-units-form" @submit.prevent>
        <section class="cooking-units-section">
          <div class="cooking-units-warning-note">
            <strong>{{ t('cookingUnits.note.title') }}</strong>
            <span>{{ t('cookingUnits.note.text') }}</span>
          </div>

          <div class="cooking-units-field">
            <label for="cooking-units-value">{{ t('cookingUnits.form.value') }}</label>
            <div class="cooking-units-input-wrap">
              <input
                id="cooking-units-value"
                v-model.number="value"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(issue)"
                aria-describedby="cooking-units-value-error"
              >
            </div>
            <p v-if="issue" id="cooking-units-value-error" class="cooking-units-error">
              {{ t(issue.messageKey) }}
            </p>
          </div>

          <div class="cooking-units-unit-grid">
            <div class="cooking-units-field">
              <label for="cooking-units-from">{{ t('cookingUnits.form.from') }}</label>
              <select id="cooking-units-from" v-model="fromUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`cookingUnits.units.${unit}`) }}
                </option>
              </select>
            </div>

            <button
              type="button"
              class="cooking-units-swap"
              :aria-label="t('cookingUnits.form.swap')"
              :title="t('cookingUnits.form.swap')"
              @click="swapUnits"
            >
              ⇄
            </button>

            <div class="cooking-units-field">
              <label for="cooking-units-to">{{ t('cookingUnits.form.to') }}</label>
              <select id="cooking-units-to" v-model="toUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`cookingUnits.units.${unit}`) }}
                </option>
              </select>
            </div>
          </div>
        </section>
      </form>

      <section class="cooking-units-result" aria-live="polite">
        <p class="cooking-units-result__label">{{ t('cookingUnits.result.label') }}</p>

        <template v-if="result !== null">
          <div class="cooking-units-result__total">
            <span>{{ t('cookingUnits.result.converted') }}</span>
            <strong>{{ formatNumber(result) }} {{ t(`cookingUnits.unitShort.${toUnit}`) }}</strong>
          </div>

          <div class="cooking-units-result__rows">
            <div class="cooking-units-result__row">
              <span>{{ t('cookingUnits.result.source') }}</span>
              <strong>{{ formatNumber(value) }} {{ t(`cookingUnits.unitShort.${fromUnit}`) }}</strong>
            </div>
            <div class="cooking-units-result__row">
              <span>{{ t('cookingUnits.result.milliliters') }}</span>
              <strong>{{ formatNumber(milliliterValue ?? 0) }} {{ t('cookingUnits.unitShort.milliliter') }}</strong>
            </div>
          </div>

          <p class="cooking-units-formula">{{ t('cookingUnits.formula') }}</p>
        </template>

        <p v-else class="cooking-units-result__empty">{{ t('cookingUnits.result.empty') }}</p>
      </section>
    </div>

    <section class="cooking-units-popular" aria-labelledby="cooking-units-popular-title">
      <h2 id="cooking-units-popular-title">{{ t('cookingUnits.popular.title') }}</h2>
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
import { convertCookingUnit } from '../lib/calculations'
import { useCookingUnitsCalculator } from '../composables/useCookingUnitsCalculator'
import type { CookingUnit } from '../types/cooking-units'

const { t, n } = useI18n()
const {
  value,
  fromUnit,
  toUnit,
  units,
  issue,
  result,
  milliliterValue,
  swapUnits,
} = useCookingUnitsCalculator()

const popularPairs: Array<[number, CookingUnit, CookingUnit]> = [
  [1, 'cup', 'milliliter'],
  [1, 'tablespoon', 'teaspoon'],
  [100, 'milliliter', 'tablespoon'],
  [1, 'fluidOunce', 'milliliter'],
  [1, 'liter', 'cup'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([sourceValue, from, to]) => {
      const converted = convertCookingUnit(sourceValue, from, to)
      if (converted === null) return ''

      return t('cookingUnits.popular.item', {
        value: formatNumber(sourceValue),
        from: t(`cookingUnits.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`cookingUnits.unitShort.${to}`),
      })
    })
    .filter(Boolean),
)

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  })
}
</script>
