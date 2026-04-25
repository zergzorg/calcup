<template>
  <main class="fuel-page" aria-labelledby="fuel-title">
    <section class="fuel-heading">
      <p class="fuel-eyebrow">{{ t('fuel.eyebrow') }}</p>
      <h1 id="fuel-title">{{ t('fuel.title') }}</h1>
      <p>{{ t('fuel.intro') }}</p>
    </section>

    <div class="fuel-workspace">
      <form class="fuel-form" @submit.prevent>
        <fieldset class="fuel-modes">
          <legend class="fuel-modes__legend">{{ t('fuel.modes.label') }}</legend>
          <div class="fuel-modes__list">
            <label
              v-for="m in MODES"
              :key="m"
              class="fuel-mode-option"
              :class="{ 'fuel-mode-option--active': mode === m }"
            >
              <input
                v-model="mode"
                type="radio"
                name="fuel-mode"
                :value="m"
                class="fuel-mode-option__radio"
              >
              {{ t(`fuel.modes.${m}`) }}
            </label>
          </div>
        </fieldset>

        <div class="fuel-field">
          <label for="fuel-distance">{{ t('fuel.form.distance') }}</label>
          <div class="fuel-input-wrap">
            <input
              id="fuel-distance"
              v-model.number="distance"
              type="number"
              min="0.01"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('distance'))"
              aria-describedby="fuel-distance-error"
              @blur="touch('distance')"
            >
            <span class="fuel-unit">{{ t('fuel.units.km') }}</span>
          </div>
          <p v-if="getIssue('distance')" id="fuel-distance-error" class="fuel-error">
            {{ t(getIssue('distance')!.messageKey) }}
          </p>
        </div>

        <div v-if="mode === 'consumption'" class="fuel-field">
          <label for="fuel-liters">{{ t('fuel.form.fuelLiters') }}</label>
          <div class="fuel-input-wrap">
            <input
              id="fuel-liters"
              v-model.number="fuelLiters"
              type="number"
              min="0.01"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('fuel'))"
              aria-describedby="fuel-liters-error"
              @blur="touch('fuel')"
            >
            <span class="fuel-unit">{{ t('fuel.units.liters') }}</span>
          </div>
          <p v-if="getIssue('fuel')" id="fuel-liters-error" class="fuel-error">
            {{ t(getIssue('fuel')!.messageKey) }}
          </p>
        </div>

        <div v-if="mode === 'requiredFuel' || mode === 'tripCost'" class="fuel-field">
          <label for="fuel-consumption">{{ t('fuel.form.consumptionPer100') }}</label>
          <div class="fuel-input-wrap">
            <input
              id="fuel-consumption"
              v-model.number="consumptionPer100"
              type="number"
              min="0.01"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('consumption'))"
              aria-describedby="fuel-consumption-error"
              @blur="touch('consumption')"
            >
            <span class="fuel-unit">{{ t('fuel.units.per100km') }}</span>
          </div>
          <p v-if="getIssue('consumption')" id="fuel-consumption-error" class="fuel-error">
            {{ t(getIssue('consumption')!.messageKey) }}
          </p>
        </div>

        <div v-if="mode === 'tripCost'" class="fuel-field">
          <label for="fuel-price">{{ t('fuel.form.pricePerLiter') }}</label>
          <div class="fuel-input-wrap">
            <input
              id="fuel-price"
              v-model.number="pricePerLiter"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('price'))"
              aria-describedby="fuel-price-error"
              @blur="touch('price')"
            >
            <span class="fuel-unit">{{ t('fuel.units.perLiter') }}</span>
          </div>
          <p v-if="getIssue('price')" id="fuel-price-error" class="fuel-error">
            {{ t(getIssue('price')!.messageKey) }}
          </p>
        </div>
      </form>

      <section class="fuel-result" aria-live="polite">
        <p class="fuel-result__label">{{ t('fuel.result.label') }}</p>

        <template v-if="mode === 'consumption' && consumptionResult !== null">
          <div class="fuel-result__value">{{ n(consumptionResult, { maximumFractionDigits: 2 }) }}</div>
          <p class="fuel-result__unit">{{ t('fuel.units.per100km') }}</p>
          <p class="fuel-result__formula">{{ t('fuel.result.consumption.formula') }}</p>
        </template>

        <template v-else-if="mode === 'requiredFuel' && requiredFuelResult !== null">
          <div class="fuel-result__value">{{ n(requiredFuelResult, { maximumFractionDigits: 2 }) }}</div>
          <p class="fuel-result__unit">{{ t('fuel.units.liters') }}</p>
          <p class="fuel-result__formula">{{ t('fuel.result.requiredFuel.formula') }}</p>
        </template>

        <template v-else-if="mode === 'tripCost' && tripCostResult !== null">
          <div class="fuel-result__value">{{ n(tripCostResult.cost, { maximumFractionDigits: 2 }) }}</div>
          <p class="fuel-result__unit">{{ t('fuel.units.currency') }}</p>
          <p class="fuel-result__secondary">
            {{ t('fuel.result.tripCost.liters', { liters: n(tripCostResult.liters, { maximumFractionDigits: 2 }) }) }}
          </p>
          <p class="fuel-result__formula">{{ t('fuel.result.tripCost.formula') }}</p>
        </template>

        <p v-else class="fuel-result__empty">{{ t('fuel.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFuelCalculator } from '../composables/useFuelCalculator'
import type { FuelMode } from '../types/fuel'

const { t, n } = useI18n()

const MODES: FuelMode[] = ['consumption', 'requiredFuel', 'tripCost']

const {
  mode,
  distance,
  fuelLiters,
  consumptionPer100,
  pricePerLiter,
  touch,
  getIssue,
  consumptionResult,
  requiredFuelResult,
  tripCostResult,
} = useFuelCalculator()
</script>

<style scoped>
.fuel-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.fuel-heading {
  max-width: 760px;
}

.fuel-eyebrow {
  margin: 0 0 10px;
  color: #0e7490;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.fuel-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.fuel-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.fuel-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 20px;
  align-items: stretch;
}

.fuel-form,
.fuel-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.fuel-form {
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 24px;
}

.fuel-modes {
  margin: 0;
  padding: 0;
  border: none;
}

.fuel-modes__legend {
  margin: 0 0 10px;
  color: #27364a;
  font-weight: 750;
}

.fuel-modes__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fuel-mode-option {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  padding: 10px 14px;
  color: #526174;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.1s, background 0.1s, color 0.1s;
}

.fuel-mode-option--active {
  border-color: #0e7490;
  color: #0e7490;
  background: #ecfeff;
}

.fuel-mode-option__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.fuel-field {
  display: grid;
  gap: 8px;
}

.fuel-field label {
  color: #27364a;
  font-weight: 750;
}

.fuel-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.fuel-input-wrap input {
  min-width: 0;
  border: none;
  padding: 14px;
  color: #111827;
  background: transparent;
  font: inherit;
  outline: 0;
}

.fuel-input-wrap input:focus {
  outline: none;
}

.fuel-input-wrap:focus-within {
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.12);
}

.fuel-input-wrap input[aria-invalid="true"] {
  color: #991b1b;
}

.fuel-unit {
  padding: 0 14px;
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  user-select: none;
}

.fuel-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.fuel-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 252px;
  padding: 24px;
}

.fuel-result__label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.fuel-result__value {
  color: #0e7490;
  font-size: 3.6rem;
  line-height: 1;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.fuel-result__unit {
  margin: 6px 0 0;
  color: #526174;
  font-size: 1rem;
  font-weight: 600;
}

.fuel-result__secondary {
  margin: 10px 0 0;
  color: #334155;
  font-size: 0.95rem;
}

.fuel-result__formula {
  margin: 14px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
  font-family: monospace;
}

.fuel-result__empty {
  margin-top: 8px;
  color: #94a3b8;
}

@media (max-width: 900px) {
  .fuel-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .fuel-page {
    gap: 20px;
  }

  .fuel-heading h1 {
    font-size: 2.15rem;
  }

  .fuel-heading p:last-child {
    font-size: 1rem;
  }

  .fuel-form,
  .fuel-result {
    padding: 18px;
  }

  .fuel-result {
    min-height: 220px;
  }

  .fuel-result__value {
    font-size: 3rem;
  }

  .fuel-modes__list {
    flex-direction: column;
  }
}
</style>
