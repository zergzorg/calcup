<template>
  <main class="trip-cost-page" aria-labelledby="trip-cost-title">
    <section class="trip-cost-heading">
      <p class="trip-cost-eyebrow">{{ t('tripCost.eyebrow') }}</p>
      <h1 id="trip-cost-title">{{ t('tripCost.title') }}</h1>
      <p>{{ t('tripCost.intro') }}</p>
    </section>

    <div class="trip-cost-workspace">
      <form class="trip-cost-form" @submit.prevent>
        <section class="trip-cost-section">
          <div class="trip-cost-section__header">
            <h2>{{ t('tripCost.form.routeTitle') }}</h2>
          </div>
          <div class="trip-cost-chip-list" role="radiogroup" :aria-label="t('tripCost.form.direction')">
            <button
              v-for="item in directions"
              :key="item"
              type="button"
              class="trip-cost-chip"
              :class="{ 'trip-cost-chip--active': direction === item }"
              role="radio"
              :aria-checked="direction === item"
              @click="direction = item"
            >
              {{ t(`tripCost.direction.${item}`) }}
            </button>
          </div>
          <NumberField field="distanceKm" :label="t('tripCost.form.distanceKm')" suffix="км" :step="0.1" />
        </section>

        <section class="trip-cost-section">
          <div class="trip-cost-section__header">
            <h2>{{ t('tripCost.form.fuelTitle') }}</h2>
          </div>
          <div class="trip-cost-grid trip-cost-grid--two">
            <NumberField field="consumptionPer100Km" :label="t('tripCost.form.consumption')" suffix="л/100 км" :step="0.1" />
            <NumberField field="fuelPricePerLiter" :label="t('tripCost.form.fuelPrice')" suffix="₽/л" :step="0.01" :min="0" />
          </div>
        </section>

        <section class="trip-cost-section">
          <div class="trip-cost-section__header">
            <h2>{{ t('tripCost.form.extraTitle') }}</h2>
          </div>
          <div class="trip-cost-grid trip-cost-grid--two">
            <NumberField field="tolls" :label="t('tripCost.form.tolls')" suffix="₽" :step="1" :min="0" />
            <NumberField field="parking" :label="t('tripCost.form.parking')" suffix="₽" :step="1" :min="0" />
          </div>
          <div class="trip-cost-grid trip-cost-grid--two">
            <NumberField field="otherCosts" :label="t('tripCost.form.otherCosts')" suffix="₽" :step="1" :min="0" />
            <NumberField field="passengers" :label="t('tripCost.form.passengers')" suffix="чел." :step="1" />
          </div>
        </section>
      </form>

      <section class="trip-cost-result" aria-live="polite">
        <p class="trip-cost-result__label">{{ t('tripCost.result.label') }}</p>

        <template v-if="result">
          <div class="trip-cost-result__total">
            <span>{{ t('tripCost.result.totalCost') }}</span>
            <strong>{{ t('tripCost.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
          </div>

          <div class="trip-cost-result__rows">
            <div class="trip-cost-result__row">
              <span>{{ t('tripCost.result.distance') }}</span>
              <strong>{{ t('tripCost.result.distanceValue', { value: format(result.effectiveDistanceKm) }) }}</strong>
            </div>
            <div class="trip-cost-result__row">
              <span>{{ t('tripCost.result.fuelLiters') }}</span>
              <strong>{{ t('tripCost.result.litersValue', { value: format(result.fuelLiters) }) }}</strong>
            </div>
            <div class="trip-cost-result__row">
              <span>{{ t('tripCost.result.fuelCost') }}</span>
              <strong>{{ t('tripCost.result.moneyValue', { value: format(result.fuelCost) }) }}</strong>
            </div>
            <div class="trip-cost-result__row">
              <span>{{ t('tripCost.result.extraCosts') }}</span>
              <strong>{{ t('tripCost.result.moneyValue', { value: format(result.extraCosts) }) }}</strong>
            </div>
            <div class="trip-cost-result__row">
              <span>{{ t('tripCost.result.costPerPerson') }}</span>
              <strong>{{ t('tripCost.result.moneyValue', { value: format(result.costPerPerson) }) }}</strong>
            </div>
          </div>

          <p class="trip-cost-formula">{{ t('tripCost.formula') }}</p>
        </template>

        <p v-else class="trip-cost-result__empty">{{ t('tripCost.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTripCostCalculator } from '../composables/useTripCostCalculator'
import type { TripCostInputField, TripDirection } from '../types/trip-cost'

const { t, n } = useI18n()
const { input, direction, result, getIssue } = useTripCostCalculator()

const directions: TripDirection[] = ['oneWay', 'roundTrip']

const NumberField = defineComponent<{ field: TripCostInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'trip-cost-field' }, [
      h('label', { for: `trip-cost-${props.field}` }, props.label),
      h('div', { class: 'trip-cost-input-wrap' }, [
        h('input', {
          id: `trip-cost-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: props.field === 'passengers' ? 'numeric' : 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `trip-cost-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'trip-cost-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `trip-cost-${props.field}-error`, class: 'trip-cost-error' }, t(getIssue(props.field)!.messageKey))
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
.trip-cost-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.trip-cost-heading {
  max-width: 760px;
}

.trip-cost-section {
  display: grid;
  gap: 16px;
}

.trip-cost-section + .trip-cost-section {
  padding-top: 4px;
}

.trip-cost-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.trip-cost-result__rows {
  display: grid;
}
</style>
