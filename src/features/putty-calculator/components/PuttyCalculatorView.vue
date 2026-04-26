<template>
  <main class="putty-page" aria-labelledby="putty-title">
    <section class="putty-heading">
      <p class="putty-eyebrow">{{ t('putty.eyebrow') }}</p>
      <h1 id="putty-title">{{ t('putty.title') }}</h1>
      <p>{{ t('putty.intro') }}</p>
    </section>

    <div class="putty-workspace">
      <form class="putty-form" @submit.prevent>
        <section class="putty-section">
          <div class="putty-section__header">
            <h2>{{ t('putty.form.surfaceTitle') }}</h2>
          </div>
          <NumberField field="surfaceArea" :label="t('putty.form.surfaceArea')" :suffix="t('putty.units.m2')" :step="0.01" />
          <NumberField field="excludedArea" :label="t('putty.form.excludedArea')" :suffix="t('putty.units.m2')" :step="0.01" :min="0" />
        </section>

        <section class="putty-section">
          <div class="putty-section__header">
            <h2>{{ t('putty.form.layerTitle') }}</h2>
          </div>
          <div class="putty-grid putty-grid--two">
            <NumberField field="layerThicknessMm" :label="t('putty.form.layerThickness')" :suffix="t('putty.units.mm')" :step="0.1" />
            <NumberField field="consumptionKgPerM2Mm" :label="t('putty.form.consumption')" :suffix="t('putty.units.kgPerM2Mm')" :step="0.1" />
          </div>
          <div class="putty-chip-list" role="group" :aria-label="t('putty.form.thicknessPresets')">
            <button
              v-for="preset in thicknessPresets"
              :key="preset"
              type="button"
              class="putty-chip"
              :class="{ 'putty-chip--active': input.layerThicknessMm === preset }"
              @click="setLayerThickness(preset)"
            >
              {{ t('putty.form.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="putty-section">
          <div class="putty-section__header">
            <h2>{{ t('putty.form.purchaseTitle') }}</h2>
          </div>
          <div class="putty-grid putty-grid--three">
            <NumberField field="wastePercent" :label="t('putty.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="bagWeightKg" :label="t('putty.form.bagWeight')" :suffix="t('putty.units.kg')" :step="1" />
            <NumberField field="bagPrice" :label="t('putty.form.bagPrice')" suffix="₽" :step="0.01" :min="0" />
          </div>
          <div class="putty-chip-list" role="group" :aria-label="t('putty.form.bagPresets')">
            <button
              v-for="preset in bagPresets"
              :key="preset"
              type="button"
              class="putty-chip"
              :class="{ 'putty-chip--active': input.bagWeightKg === preset }"
              @click="setBagWeight(preset)"
            >
              {{ t('putty.form.kgValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="putty-result" aria-live="polite">
        <p class="putty-result__label">{{ t('putty.result.label') }}</p>

        <template v-if="result">
          <div class="putty-result__total">
            <span>{{ t('putty.result.bags') }}</span>
            <strong>{{ t('putty.result.bagsValue', { count: result.bagsNeeded }) }}</strong>
          </div>

          <div class="putty-result__rows">
            <div class="putty-result__row">
              <span>{{ t('putty.result.netArea') }}</span>
              <strong>{{ t('putty.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="putty-result__row">
              <span>{{ t('putty.result.mixKg') }}</span>
              <strong>{{ t('putty.result.kgValue', { value: format(result.mixKg) }) }}</strong>
            </div>
            <div class="putty-result__row">
              <span>{{ t('putty.result.purchaseKg') }}</span>
              <strong>{{ t('putty.result.kgValue', { value: format(result.purchaseKg) }) }}</strong>
            </div>
            <div class="putty-result__row">
              <span>{{ t('putty.result.leftoverKg') }}</span>
              <strong>{{ t('putty.result.kgValue', { value: format(result.leftoverKg) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="putty-result__row">
              <span>{{ t('putty.result.totalCost') }}</span>
              <strong>{{ t('putty.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="putty-formula">{{ t('putty.formula') }}</p>
        </template>

        <p v-else class="putty-result__empty">{{ t('putty.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { usePuttyCalculator } from '../composables/usePuttyCalculator'
import type { PuttyInputField } from '../types/putty'

const { t, n } = useI18n()
const { input, result, getIssue, setLayerThickness, setBagWeight } = usePuttyCalculator()

const thicknessPresets = CALCULATOR_PRESETS_CONFIG.construction.putty.thicknessMillimeters
const bagPresets = CALCULATOR_PRESETS_CONFIG.construction.putty.bagKilograms

const NumberField = defineComponent<{ field: PuttyInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'putty-field' }, [
      h('label', { for: `putty-${props.field}` }, props.label),
      h('div', { class: 'putty-input-wrap' }, [
        h('input', {
          id: `putty-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `putty-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'putty-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `putty-${props.field}-error`, class: 'putty-error' }, t(getIssue(props.field)!.messageKey))
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
.putty-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.putty-heading {
  max-width: 760px;
}

.putty-section {
  display: grid;
  gap: 16px;
}

.putty-section + .putty-section {
  padding-top: 4px;
}

.putty-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.putty-result__rows {
  display: grid;
}
</style>
