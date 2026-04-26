<template>
  <main class="ev-range-page" aria-labelledby="ev-range-title">
    <section class="ev-range-heading">
      <p class="ev-range-eyebrow">{{ t('evRange.eyebrow') }}</p>
      <h1 id="ev-range-title">{{ t('evRange.title') }}</h1>
      <p>{{ t('evRange.intro') }}</p>
    </section>

    <div class="ev-range-workspace">
      <form class="ev-range-form" @submit.prevent>
        <section class="ev-range-section">
          <div class="ev-range-section__header">
            <h2>{{ t('evRange.form.batteryTitle') }}</h2>
          </div>
          <NumberField field="batteryCapacityKwh" :label="t('evRange.form.batteryCapacity')" :suffix="t('evRange.units.kwh')" :step="0.1" />
          <div class="ev-range-grid ev-range-grid--two">
            <NumberField field="currentChargePercent" :label="t('evRange.form.currentCharge')" suffix="%" :step="1" :min="0" />
            <NumberField field="targetChargePercent" :label="t('evRange.form.targetCharge')" suffix="%" :step="1" :min="0" />
          </div>
          <div class="ev-range-chip-list" role="group" :aria-label="t('evRange.form.chargePresets')">
            <button
              v-for="preset in chargePresets"
              :key="preset"
              type="button"
              class="ev-range-chip"
              :class="{ 'ev-range-chip--active': input.currentChargePercent === preset }"
              @click="setCurrentCharge(preset)"
            >
              {{ t('evRange.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="ev-range-section">
          <div class="ev-range-section__header">
            <h2>{{ t('evRange.form.consumptionTitle') }}</h2>
          </div>
          <div class="ev-range-grid ev-range-grid--three">
            <NumberField field="consumptionKwhPer100Km" :label="t('evRange.form.consumption')" :suffix="t('evRange.units.kwhPer100')" :step="0.1" />
            <NumberField field="reservePercent" :label="t('evRange.form.reserve')" suffix="%" :step="1" :min="0" />
            <NumberField field="electricityPrice" :label="t('evRange.form.electricityPrice')" suffix="₽/кВт⋅ч" :step="0.01" :min="0" />
          </div>
          <div class="ev-range-chip-list" role="group" :aria-label="t('evRange.form.reservePresets')">
            <button
              v-for="preset in reservePresets"
              :key="preset"
              type="button"
              class="ev-range-chip"
              :class="{ 'ev-range-chip--active': input.reservePercent === preset }"
              @click="setReserve(preset)"
            >
              {{ t('evRange.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="ev-range-result" aria-live="polite">
        <p class="ev-range-result__label">{{ t('evRange.result.label') }}</p>

        <template v-if="result">
          <div class="ev-range-result__total">
            <span>{{ t('evRange.result.range') }}</span>
            <strong>{{ t('evRange.result.distanceValue', { value: format(result.rangeKm) }) }}</strong>
          </div>

          <div class="ev-range-result__rows">
            <div class="ev-range-result__row">
              <span>{{ t('evRange.result.rangeMiles') }}</span>
              <strong>{{ t('evRange.result.milesValue', { value: format(result.rangeMiles) }) }}</strong>
            </div>
            <div class="ev-range-result__row">
              <span>{{ t('evRange.result.usableEnergy') }}</span>
              <strong>{{ t('evRange.result.energyValue', { value: format(result.usableEnergyKwh) }) }}</strong>
            </div>
            <div class="ev-range-result__row">
              <span>{{ t('evRange.result.currentEnergy') }}</span>
              <strong>{{ t('evRange.result.energyValue', { value: format(result.currentEnergyKwh) }) }}</strong>
            </div>
            <div class="ev-range-result__row">
              <span>{{ t('evRange.result.chargeEnergy') }}</span>
              <strong>{{ t('evRange.result.energyValue', { value: format(result.chargeEnergyKwh) }) }}</strong>
            </div>
            <div v-if="result.chargeCost !== null" class="ev-range-result__row">
              <span>{{ t('evRange.result.chargeCost') }}</span>
              <strong>{{ t('evRange.result.moneyValue', { value: format(result.chargeCost) }) }}</strong>
            </div>
            <div v-if="result.costPer100Km !== null" class="ev-range-result__row">
              <span>{{ t('evRange.result.costPer100Km') }}</span>
              <strong>{{ t('evRange.result.moneyValue', { value: format(result.costPer100Km) }) }}</strong>
            </div>
          </div>

          <p class="ev-range-formula">{{ t('evRange.formula') }}</p>
        </template>

        <p v-else class="ev-range-result__empty">{{ t('evRange.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useEvRangeCalculator } from '../composables/useEvRangeCalculator'
import type { EvRangeInputField } from '../types/ev-range'

const { t, n } = useI18n()
const { input, result, getIssue, setCurrentCharge, setReserve } = useEvRangeCalculator()

const chargePresets = CALCULATOR_PRESETS_CONFIG.evRange.chargePercents
const reservePresets = CALCULATOR_PRESETS_CONFIG.evRange.reservePercents

const NumberField = defineComponent<{ field: EvRangeInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'ev-range-field' }, [
      h('label', { for: `ev-range-${props.field}` }, props.label),
      h('div', { class: 'ev-range-input-wrap' }, [
        h('input', {
          id: `ev-range-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          max: props.field.includes('Percent') ? 100 : undefined,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `ev-range-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'ev-range-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `ev-range-${props.field}-error`, class: 'ev-range-error' }, t(getIssue(props.field)!.messageKey))
        : null,
    ])
  },
})

function format(value: number): string {
  return n(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}
</script>

<style scoped>
.ev-range-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.ev-range-heading {
  max-width: 760px;
}

.ev-range-section {
  display: grid;
  gap: 16px;
}

.ev-range-section + .ev-range-section {
  padding-top: 4px;
}

.ev-range-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.ev-range-result__rows {
  display: grid;
}
</style>
