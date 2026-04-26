<template>
  <main class="speed-page" aria-labelledby="speed-title">
    <section class="speed-heading">
      <p class="speed-eyebrow">{{ t('speed.eyebrow') }}</p>
      <h1 id="speed-title">{{ t('speed.title') }}</h1>
      <p>{{ t('speed.intro') }}</p>
    </section>

    <div class="speed-workspace">
      <form class="speed-form" @submit.prevent>
        <section class="speed-section">
          <div class="speed-field">
            <label for="speed-value">{{ t('speed.form.value') }}</label>
            <div class="speed-input-wrap">
              <input
                id="speed-value"
                v-model.number="value"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(issue)"
                aria-describedby="speed-value-error"
              >
            </div>
            <p v-if="issue" id="speed-value-error" class="speed-error">
              {{ t(issue.messageKey) }}
            </p>
          </div>

          <div class="speed-unit-grid">
            <div class="speed-field">
              <label for="speed-from">{{ t('speed.form.from') }}</label>
              <select id="speed-from" v-model="fromUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`speed.units.${unit}`) }}
                </option>
              </select>
            </div>

            <button
              type="button"
              class="speed-swap"
              :aria-label="t('speed.form.swap')"
              :title="t('speed.form.swap')"
              @click="swapUnits"
            >
              ⇄
            </button>

            <div class="speed-field">
              <label for="speed-to">{{ t('speed.form.to') }}</label>
              <select id="speed-to" v-model="toUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`speed.units.${unit}`) }}
                </option>
              </select>
            </div>
          </div>
        </section>
      </form>

      <section class="speed-result" aria-live="polite">
        <p class="speed-result__label">{{ t('speed.result.label') }}</p>

        <template v-if="result !== null">
          <div class="speed-result__total">
            <span>{{ t('speed.result.converted') }}</span>
            <strong>{{ formatNumber(result) }} {{ t(`speed.unitShort.${toUnit}`) }}</strong>
          </div>

          <div class="speed-result__rows">
            <div class="speed-result__row">
              <span>{{ t('speed.result.source') }}</span>
              <strong>{{ formatNumber(value) }} {{ t(`speed.unitShort.${fromUnit}`) }}</strong>
            </div>
            <div class="speed-result__row">
              <span>{{ t('speed.result.metersPerSecond') }}</span>
              <strong>{{ formatNumber(metersPerSecondValue) }} {{ t('speed.unitShort.meterPerSecond') }}</strong>
            </div>
          </div>

          <p class="speed-formula">{{ t('speed.formula') }}</p>
        </template>

        <p v-else class="speed-result__empty">{{ t('speed.result.empty') }}</p>
      </section>
    </div>

    <section class="speed-popular" aria-labelledby="speed-popular-title">
      <h2 id="speed-popular-title">{{ t('speed.popular.title') }}</h2>
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
import { convertSpeed } from '../lib/calculations'
import { useSpeedConverter } from '../composables/useSpeedConverter'
import type { SpeedUnit } from '../types/speed'

const { t, n } = useI18n()
const {
  value,
  fromUnit,
  toUnit,
  units,
  issue,
  result,
  metersPerSecondValue,
  swapUnits,
} = useSpeedConverter()

const popularPairs: Array<[number, SpeedUnit, SpeedUnit]> = [
  [36, 'kilometerPerHour', 'meterPerSecond'],
  [60, 'milePerHour', 'kilometerPerHour'],
  [10, 'knot', 'meterPerSecond'],
  [5, 'minutePerKilometer', 'kilometerPerHour'],
  [10, 'kilometerPerHour', 'minutePerKilometer'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([sourceValue, from, to]) => {
      const converted = convertSpeed(sourceValue, from, to)
      if (converted === null) return ''

      return t('speed.popular.item', {
        value: formatNumber(sourceValue),
        from: t(`speed.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`speed.unitShort.${to}`),
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
