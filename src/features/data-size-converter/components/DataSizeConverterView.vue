<template>
  <main class="data-size-page" aria-labelledby="data-size-title">
    <section class="data-size-heading">
      <p class="data-size-eyebrow">{{ t('dataSize.eyebrow') }}</p>
      <h1 id="data-size-title">{{ t('dataSize.title') }}</h1>
      <p>{{ t('dataSize.intro') }}</p>
    </section>

    <div class="data-size-workspace">
      <form class="data-size-form" @submit.prevent>
        <section class="data-size-section">
          <div class="data-size-section__header">
            <h2>{{ t('dataSize.form.modeTitle') }}</h2>
            <p>{{ t(`dataSize.form.modeHint.${mode}`) }}</p>
          </div>

          <div class="data-size-chip-list" role="group" :aria-label="t('dataSize.form.modeTitle')">
            <button
              v-for="nextMode in modes"
              :key="nextMode"
              type="button"
              class="data-size-chip"
              :class="{ 'data-size-chip--active': mode === nextMode }"
              @click="mode = nextMode"
            >
              {{ t(`dataSize.modes.${nextMode}`) }}
            </button>
          </div>
        </section>

        <section class="data-size-section">
          <div class="data-size-field">
            <label for="data-size-value">{{ t('dataSize.form.value') }}</label>
            <div class="data-size-input-wrap">
              <input
                id="data-size-value"
                v-model.number="value"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(issue)"
                aria-describedby="data-size-value-error"
              >
            </div>
            <p v-if="issue" id="data-size-value-error" class="data-size-error">
              {{ t(issue.messageKey) }}
            </p>
          </div>

          <div class="data-size-unit-grid">
            <div class="data-size-field">
              <label for="data-size-from">{{ t('dataSize.form.from') }}</label>
              <select id="data-size-from" v-model="fromUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`dataSize.units.${unit}`) }}
                </option>
              </select>
            </div>

            <button
              type="button"
              class="data-size-swap"
              :aria-label="t('dataSize.form.swap')"
              :title="t('dataSize.form.swap')"
              @click="swapUnits"
            >
              ⇄
            </button>

            <div class="data-size-field">
              <label for="data-size-to">{{ t('dataSize.form.to') }}</label>
              <select id="data-size-to" v-model="toUnit">
                <option v-for="unit in units" :key="unit" :value="unit">
                  {{ t(`dataSize.units.${unit}`) }}
                </option>
              </select>
            </div>
          </div>
        </section>
      </form>

      <section class="data-size-result" aria-live="polite">
        <p class="data-size-result__label">{{ t('dataSize.result.label') }}</p>

        <template v-if="result !== null">
          <div class="data-size-result__total">
            <span>{{ t('dataSize.result.converted') }}</span>
            <strong>{{ formatNumber(result) }} {{ t(`dataSize.unitShort.${toUnit}`) }}</strong>
          </div>

          <div class="data-size-result__rows">
            <div class="data-size-result__row">
              <span>{{ t('dataSize.result.source') }}</span>
              <strong>{{ formatNumber(value) }} {{ t(`dataSize.unitShort.${fromUnit}`) }}</strong>
            </div>
            <div class="data-size-result__row">
              <span>{{ t('dataSize.result.bytes') }}</span>
              <strong>{{ formatNumber(bytesValue ?? 0) }} {{ t('dataSize.unitShort.byte') }}</strong>
            </div>
            <div class="data-size-result__row">
              <span>{{ t('dataSize.result.mode') }}</span>
              <strong>{{ t(`dataSize.modes.${mode}`) }}</strong>
            </div>
          </div>

          <p class="data-size-formula">{{ t(`dataSize.formula.${mode}`) }}</p>
        </template>

        <p v-else class="data-size-result__empty">{{ t('dataSize.result.empty') }}</p>
      </section>
    </div>

    <section class="data-size-popular" aria-labelledby="data-size-popular-title">
      <h2 id="data-size-popular-title">{{ t('dataSize.popular.title') }}</h2>
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
import { convertDataSize } from '../lib/calculations'
import { useDataSizeConverter } from '../composables/useDataSizeConverter'
import type { DataSizeMode, DataSizeUnit } from '../types/data-size'

const { t, n } = useI18n()
const {
  value,
  mode,
  fromUnit,
  toUnit,
  units,
  issue,
  result,
  bytesValue,
  swapUnits,
} = useDataSizeConverter()

const modes: DataSizeMode[] = ['decimal', 'binary']

const popularPairs: Array<[number, DataSizeUnit, DataSizeUnit]> = [
  [1, 'gigabyte', 'megabyte'],
  [1, 'terabyte', 'gigabyte'],
  [1, 'gibibyte', 'mebibyte'],
  [1024, 'mebibyte', 'gibibyte'],
  [1, 'gigabyte', 'gibibyte'],
]

const popularConversions = computed(() =>
  popularPairs
    .map(([sourceValue, from, to]) => {
      const converted = convertDataSize(sourceValue, from, to)
      if (converted === null) return ''

      return t('dataSize.popular.item', {
        value: formatNumber(sourceValue),
        from: t(`dataSize.unitShort.${from}`),
        result: formatNumber(converted),
        to: t(`dataSize.unitShort.${to}`),
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
