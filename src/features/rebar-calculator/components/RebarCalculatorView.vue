<template>
  <main class="rebar-page" aria-labelledby="rebar-title">
    <section class="rebar-heading">
      <p class="rebar-eyebrow">{{ t('rebar.eyebrow') }}</p>
      <h1 id="rebar-title">{{ t('rebar.title') }}</h1>
      <p>{{ t('rebar.intro') }}</p>
    </section>

    <div class="rebar-workspace">
      <form class="rebar-form" @submit.prevent>
        <section class="rebar-warning-note">
          <strong>{{ t('rebar.warning.title') }}</strong>
          <span>{{ t('rebar.warning.body') }}</span>
        </section>

        <section class="rebar-section">
          <div class="rebar-section__header">
            <h2>{{ t('rebar.form.geometryTitle') }}</h2>
            <p>{{ t('rebar.form.geometryHint') }}</p>
          </div>
          <div class="rebar-grid rebar-grid--two">
            <NumberField field="lengthM" :label="t('rebar.form.length')" :suffix="t('rebar.units.m')" :step="0.1" />
            <NumberField field="widthM" :label="t('rebar.form.width')" :suffix="t('rebar.units.m')" :step="0.1" />
          </div>
          <div class="rebar-grid rebar-grid--two">
            <NumberField field="spacingMm" :label="t('rebar.form.spacing')" :suffix="t('rebar.units.mm')" :step="10" />
            <NumberField field="layers" :label="t('rebar.form.layers')" :suffix="t('rebar.units.pcs')" :step="1" />
          </div>
          <div class="rebar-chip-list" role="group" :aria-label="t('rebar.form.spacingPresets')">
            <button
              v-for="preset in spacingPresets"
              :key="preset"
              type="button"
              class="rebar-chip"
              :class="{ 'rebar-chip--active': input.spacingMm === preset }"
              @click="setSpacing(preset)"
            >
              {{ t('rebar.units.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="rebar-section">
          <div class="rebar-section__header">
            <h2>{{ t('rebar.form.materialsTitle') }}</h2>
          </div>
          <div class="rebar-grid rebar-grid--two">
            <NumberField field="diameterMm" :label="t('rebar.form.diameter')" :suffix="t('rebar.units.mm')" :step="1" />
            <NumberField field="barLengthM" :label="t('rebar.form.barLength')" :suffix="t('rebar.units.m')" :step="0.1" />
          </div>
          <div class="rebar-chip-list" role="group" :aria-label="t('rebar.form.diameterPresets')">
            <button
              v-for="preset in diameterPresets"
              :key="preset"
              type="button"
              class="rebar-chip"
              :class="{ 'rebar-chip--active': input.diameterMm === preset }"
              @click="setDiameter(preset)"
            >
              {{ t('rebar.units.mmValue', { value: preset }) }}
            </button>
          </div>
          <div class="rebar-grid rebar-grid--two">
            <NumberField field="wastePercent" :label="t('rebar.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="pricePerKg" :label="t('rebar.form.price')" suffix="₽/кг" :step="1" :min="0" />
          </div>
          <div class="rebar-chip-list" role="group" :aria-label="t('rebar.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="rebar-chip"
              :class="{ 'rebar-chip--active': input.wastePercent === preset }"
              @click="setWaste(preset)"
            >
              {{ t('rebar.units.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="rebar-result" aria-live="polite">
        <p class="rebar-result__label">{{ t('rebar.result.label') }}</p>

        <template v-if="result">
          <div class="rebar-result__total">
            <span>{{ t('rebar.result.purchaseBars') }}</span>
            <strong>{{ t('rebar.units.pcsValue', { value: n(result.purchaseBars) }) }}</strong>
          </div>

          <div class="rebar-result__rows">
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.gridBars') }}</span>
              <strong>{{ t('rebar.units.pcsValue', { value: n(result.totalBarsInGrid) }) }}</strong>
            </div>
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.baseLength') }}</span>
              <strong>{{ t('rebar.units.mValue', { value: format(result.baseLengthM) }) }}</strong>
            </div>
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.lengthWithWaste') }}</span>
              <strong>{{ t('rebar.units.mValue', { value: format(result.lengthWithWasteM) }) }}</strong>
            </div>
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.purchaseLength') }}</span>
              <strong>{{ t('rebar.units.mValue', { value: format(result.purchaseLengthM) }) }}</strong>
            </div>
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.weightPerMeter') }}</span>
              <strong>{{ t('rebar.units.kgPerMValue', { value: format(result.weightPerMeterKg, 3) }) }}</strong>
            </div>
            <div class="rebar-result__row">
              <span>{{ t('rebar.result.totalWeight') }}</span>
              <strong>{{ t('rebar.units.kgValue', { value: format(result.totalWeightKg, 1) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="rebar-result__row">
              <span>{{ t('rebar.result.totalCost') }}</span>
              <strong>{{ t('rebar.units.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="rebar-formula">{{ t('rebar.formula') }}</p>
        </template>

        <p v-else class="rebar-result__empty">{{ t('rebar.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRebarCalculator } from '../composables/useRebarCalculator'
import type { RebarInputField } from '../types/rebar'

const { t, n } = useI18n()
const { input, result, getIssue, setDiameter, setSpacing, setWaste } = useRebarCalculator()

const spacingPresets = [150, 200, 250]
const diameterPresets = [8, 10, 12, 14, 16]
const wastePresets = [5, 10, 15]

const NumberField = defineComponent<{ field: RebarInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'rebar-field' }, [
      h('label', { for: `rebar-${props.field}` }, props.label),
      h('div', { class: 'rebar-input-wrap' }, [
        h('input', {
          id: `rebar-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `rebar-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'rebar-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `rebar-${props.field}-error`, class: 'rebar-error' }, t(getIssue(props.field)!.messageKey))
        : null,
    ])
  },
})

function format(value: number, maximumFractionDigits = 2): string {
  return n(value, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })
}
</script>
