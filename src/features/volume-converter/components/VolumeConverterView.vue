<template>
  <main class="volume-page" aria-labelledby="volume-title">
    <section class="volume-heading">
      <p class="volume-eyebrow">{{ t('volume.eyebrow') }}</p>
      <h1 id="volume-title">{{ t('volume.title') }}</h1>
      <p>{{ t('volume.intro') }}</p>
    </section>

    <div class="volume-workspace">
      <form class="volume-form" @submit.prevent>
        <section class="volume-section">
          <div class="volume-field">
            <label for="volume-value">{{ t('volume.form.value') }}</label>
            <div class="volume-input-wrap">
              <input
                id="volume-value"
                v-model.number="value"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(issue)"
                aria-describedby="volume-value-error"
              >
            </div>
            <p v-if="issue" id="volume-value-error" class="volume-error">
              {{ t(issue.messageKey) }}
            </p>
          </div>

          <div class="volume-unit-grid">
            <div class="volume-field">
              <label for="volume-from">{{ t('volume.form.from') }}</label>
              <select id="volume-from" v-model="fromUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`volume.units.${unit}`) }}
                </option>
              </select>
            </div>

            <button
              type="button"
              class="volume-swap"
              :aria-label="t('volume.form.swap')"
              :title="t('volume.form.swap')"
              @click="swapUnits"
            >
              ⇄
            </button>

            <div class="volume-field">
              <label for="volume-to">{{ t('volume.form.to') }}</label>
              <select id="volume-to" v-model="toUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`volume.units.${unit}`) }}
                </option>
              </select>
            </div>
          </div>
        </section>
      </form>

      <section class="volume-result" aria-live="polite">
        <p class="volume-result__label">{{ t('volume.result.label') }}</p>

        <template v-if="result !== null">
          <div class="volume-result__total">
            <span>{{ t('volume.result.converted') }}</span>
            <strong>{{ formatNumber(result) }} {{ t(`volume.unitShort.${toUnit}`) }}</strong>
          </div>

          <div class="volume-result__rows">
            <div class="volume-result__row">
              <span>{{ t('volume.result.source') }}</span>
              <strong>{{ formatNumber(value) }} {{ t(`volume.unitShort.${fromUnit}`) }}</strong>
            </div>
            <div class="volume-result__row">
              <span>{{ t('volume.result.liters') }}</span>
              <strong>{{ formatNumber(literValue) }} {{ t('volume.unitShort.liter') }}</strong>
            </div>
          </div>

          <p class="volume-formula">{{ t('volume.formula') }}</p>
        </template>

        <p v-else class="volume-result__empty">{{ t('volume.result.empty') }}</p>
      </section>
    </div>

    <section class="volume-popular" aria-labelledby="volume-popular-title">
      <h2 id="volume-popular-title">{{ t('volume.popular.title') }}</h2>
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
import { convertVolume } from '../lib/calculations'
import { useVolumeConverter } from '../composables/useVolumeConverter'
import type { VolumeUnit } from '../types/volume'

const { t, n } = useI18n()
const {
  value,
  fromUnit,
  toUnit,
  units,
  issue,
  result,
  swapUnits,
} = useVolumeConverter()

const literValue = computed(() => convertVolume(value.value, fromUnit.value, 'liter') ?? 0)

const popularPairs: Array<[number, VolumeUnit, VolumeUnit]> = [
  [1, 'liter', 'milliliter'],
  [1, 'cubicMeter', 'liter'],
  [1, 'gallon', 'liter'],
  [1, 'cup', 'milliliter'],
  [1, 'tablespoon', 'teaspoon'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([sourceValue, from, to]) => {
      const converted = convertVolume(sourceValue, from, to)
      if (converted === null) return ''

      return t('volume.popular.item', {
        value: formatNumber(sourceValue),
        from: t(`volume.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`volume.unitShort.${to}`),
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
