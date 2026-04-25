<template>
  <main class="fuel-price-page" aria-labelledby="fuel-price-title">
    <section class="fuel-price-heading">
      <p class="fuel-price-eyebrow">{{ t('fuelPrice.eyebrow') }}</p>
      <h1 id="fuel-price-title">{{ t('fuelPrice.title') }}</h1>
      <p>{{ t('fuelPrice.intro') }}</p>
    </section>

    <div class="fuel-price-workspace">
      <form class="fuel-price-form" @submit.prevent>
        <section class="fuel-price-section">
          <div class="fuel-price-section__header">
            <h2>{{ t('fuelPrice.form.fuelTitle') }}</h2>
          </div>
          <div class="fuel-price-grid fuel-price-grid--two">
            <NumberField field="budget" :label="t('fuelPrice.form.budget')" suffix="₽" :step="1" />
            <NumberField field="pricePerLiter" :label="t('fuelPrice.form.pricePerLiter')" suffix="₽/л" :step="0.01" />
          </div>
          <NumberField field="consumptionPer100Km" :label="t('fuelPrice.form.consumption')" suffix="л/100 км" :step="0.1" />
        </section>
      </form>

      <section class="fuel-price-result" aria-live="polite">
        <p class="fuel-price-result__label">{{ t('fuelPrice.result.label') }}</p>

        <template v-if="result">
          <div class="fuel-price-result__total">
            <span>{{ t('fuelPrice.result.liters') }}</span>
            <strong>{{ t('fuelPrice.result.litersValue', { value: format(result.liters) }) }}</strong>
          </div>

          <div class="fuel-price-result__rows">
            <div class="fuel-price-result__row">
              <span>{{ t('fuelPrice.result.distance') }}</span>
              <strong>{{ t('fuelPrice.result.distanceValue', { value: format(result.distanceKm) }) }}</strong>
            </div>
            <div class="fuel-price-result__row">
              <span>{{ t('fuelPrice.result.costPer100Km') }}</span>
              <strong>{{ t('fuelPrice.result.moneyValue', { value: format(result.costPer100Km) }) }}</strong>
            </div>
          </div>

          <p class="fuel-price-formula">{{ t('fuelPrice.formula') }}</p>
        </template>

        <p v-else class="fuel-price-result__empty">{{ t('fuelPrice.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFuelPriceCalculator } from '../composables/useFuelPriceCalculator'
import type { FuelPriceInputField } from '../types/fuel-price'

const { t, n } = useI18n()
const { input, result, getIssue } = useFuelPriceCalculator()

const NumberField = defineComponent<{ field: FuelPriceInputField; label: string; suffix?: string; step?: number }>({
  props: ['field', 'label', 'suffix', 'step'],
  setup(props) {
    return () => h('div', { class: 'fuel-price-field' }, [
      h('label', { for: `fuel-price-${props.field}` }, props.label),
      h('div', { class: 'fuel-price-input-wrap' }, [
        h('input', {
          id: `fuel-price-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `fuel-price-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'fuel-price-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `fuel-price-${props.field}-error`, class: 'fuel-price-error' }, t(getIssue(props.field)!.messageKey))
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
.fuel-price-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.fuel-price-heading {
  max-width: 760px;
}

.fuel-price-section {
  display: grid;
  gap: 16px;
}

.fuel-price-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.fuel-price-result__rows {
  display: grid;
}
</style>
