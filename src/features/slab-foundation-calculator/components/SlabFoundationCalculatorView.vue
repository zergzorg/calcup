<template>
  <main class="slab-foundation-page" aria-labelledby="slab-foundation-title">
    <section class="slab-foundation-heading">
      <p class="slab-foundation-eyebrow">{{ t('slabFoundation.eyebrow') }}</p>
      <h1 id="slab-foundation-title">{{ t('slabFoundation.title') }}</h1>
      <p>{{ t('slabFoundation.intro') }}</p>
    </section>

    <div class="slab-foundation-workspace">
      <form class="slab-foundation-form" @submit.prevent>
        <aside class="slab-foundation-warning-note">
          <strong>{{ t('slabFoundation.warning.title') }}</strong>
          <span>{{ t('slabFoundation.warning.body') }}</span>
        </aside>

        <section class="slab-foundation-section">
          <div class="slab-foundation-section__header">
            <h2>{{ t('slabFoundation.form.geometryTitle') }}</h2>
            <p>{{ t('slabFoundation.form.geometryHelp') }}</p>
          </div>

          <div class="slab-foundation-grid--two">
            <NumberField field="lengthM" :label="t('slabFoundation.form.lengthM')" :suffix="t('slabFoundation.units.m')" :step="0.1" />
            <NumberField field="widthM" :label="t('slabFoundation.form.widthM')" :suffix="t('slabFoundation.units.m')" :step="0.1" />
          </div>

          <NumberField field="thicknessMm" :label="t('slabFoundation.form.thicknessMm')" :suffix="t('slabFoundation.units.mm')" :step="10" />

          <div class="slab-foundation-chip-list" role="group" :aria-label="t('slabFoundation.form.thicknessPresets')">
            <button
              v-for="preset in thicknessPresets"
              :key="preset"
              type="button"
              class="slab-foundation-chip"
              :class="{ 'slab-foundation-chip--active': input.thicknessMm === preset }"
              :aria-pressed="input.thicknessMm === preset"
              @click="setThickness(preset)"
            >
              {{ t('slabFoundation.units.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="slab-foundation-section">
          <div class="slab-foundation-section__header">
            <h2>{{ t('slabFoundation.form.baseTitle') }}</h2>
          </div>

          <div class="slab-foundation-grid--three">
            <NumberField field="sandDepthMm" :label="t('slabFoundation.form.sandDepthMm')" :suffix="t('slabFoundation.units.mm')" :step="10" :min="0" />
            <NumberField field="gravelDepthMm" :label="t('slabFoundation.form.gravelDepthMm')" :suffix="t('slabFoundation.units.mm')" :step="10" :min="0" />
            <NumberField field="wastePercent" :label="t('slabFoundation.form.wastePercent')" :suffix="t('slabFoundation.units.percent')" :step="1" :min="0" />
          </div>

          <div class="slab-foundation-chip-list" role="group" :aria-label="t('slabFoundation.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="slab-foundation-chip"
              :class="{ 'slab-foundation-chip--active': input.wastePercent === preset }"
              :aria-pressed="input.wastePercent === preset"
              @click="setWaste(preset)"
            >
              {{ t('slabFoundation.units.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="slab-foundation-section">
          <div class="slab-foundation-section__header">
            <h2>{{ t('slabFoundation.form.rebarTitle') }}</h2>
          </div>

          <div class="slab-foundation-grid--three">
            <NumberField field="rebarSpacingMm" :label="t('slabFoundation.form.rebarSpacingMm')" :suffix="t('slabFoundation.units.mm')" :step="10" />
            <NumberField field="rebarDiameterMm" :label="t('slabFoundation.form.rebarDiameterMm')" :suffix="t('slabFoundation.units.mm')" :step="1" />
            <NumberField field="rebarLayers" :label="t('slabFoundation.form.rebarLayers')" :suffix="t('slabFoundation.units.pcs')" :step="1" />
          </div>

          <div class="slab-foundation-chip-list" role="group" :aria-label="t('slabFoundation.form.spacingPresets')">
            <button
              v-for="preset in spacingPresets"
              :key="preset"
              type="button"
              class="slab-foundation-chip"
              :class="{ 'slab-foundation-chip--active': input.rebarSpacingMm === preset }"
              :aria-pressed="input.rebarSpacingMm === preset"
              @click="setSpacing(preset)"
            >
              {{ t('slabFoundation.units.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="slab-foundation-section">
          <div class="slab-foundation-section__header slab-foundation-section__header--tight">
            <h2>{{ t('slabFoundation.form.priceTitle') }}</h2>
          </div>

          <div class="slab-foundation-grid--two">
            <NumberField field="concretePricePerM3" :label="t('slabFoundation.form.concretePricePerM3')" :suffix="t('slabFoundation.units.rubM3')" :step="1" :min="0" />
            <NumberField field="rebarPricePerKg" :label="t('slabFoundation.form.rebarPricePerKg')" :suffix="t('slabFoundation.units.rubKg')" :step="1" :min="0" />
          </div>
        </section>
      </form>

      <section class="slab-foundation-result" aria-live="polite">
        <p class="slab-foundation-result__label">{{ t('slabFoundation.result.label') }}</p>

        <template v-if="result">
          <div class="slab-foundation-result__total">
            <span>{{ t('slabFoundation.result.concreteWithWaste') }}</span>
            <strong>{{ t('slabFoundation.units.m3Value', { value: format(result.concreteVolumeWithWasteM3) }) }}</strong>
          </div>

          <div class="slab-foundation-result__rows">
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.area') }}</span>
              <strong>{{ t('slabFoundation.units.m2Value', { value: format(result.areaM2) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.baseConcrete') }}</span>
              <strong>{{ t('slabFoundation.units.m3Value', { value: format(result.baseConcreteVolumeM3) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.sand') }}</span>
              <strong>{{ t('slabFoundation.units.m3Value', { value: format(result.sandVolumeM3) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.gravel') }}</span>
              <strong>{{ t('slabFoundation.units.m3Value', { value: format(result.gravelVolumeM3) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.rebarGrid') }}</span>
              <strong>{{ t('slabFoundation.units.pcsValue', { value: format(result.totalBarsInGrid) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.rebarLength') }}</span>
              <strong>{{ t('slabFoundation.units.mValue', { value: format(result.rebarLengthM) }) }}</strong>
            </div>
            <div class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.rebarWeight') }}</span>
              <strong>{{ t('slabFoundation.units.kgValue', { value: format(result.rebarWeightKg) }) }}</strong>
            </div>
            <div v-if="result.concreteCost !== null" class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.concreteCost') }}</span>
              <strong>{{ t('slabFoundation.units.moneyValue', { value: format(result.concreteCost) }) }}</strong>
            </div>
            <div v-if="result.rebarCost !== null" class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.rebarCost') }}</span>
              <strong>{{ t('slabFoundation.units.moneyValue', { value: format(result.rebarCost) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="slab-foundation-result__row">
              <span>{{ t('slabFoundation.result.totalCost') }}</span>
              <strong>{{ t('slabFoundation.units.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="slab-foundation-formula">{{ t('slabFoundation.formula') }}</p>
        </template>

        <p v-else class="slab-foundation-result__empty">{{ t('slabFoundation.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSlabFoundationCalculator } from '../composables/useSlabFoundationCalculator'
import type { SlabFoundationInputField } from '../types/slab-foundation'

const { t, n } = useI18n()
const { input, result, getIssue, setThickness, setSpacing, setWaste } = useSlabFoundationCalculator()

const thicknessPresets = [150, 200, 250]
const spacingPresets = [150, 200, 250]
const wastePresets = [5, 10, 15]

const NumberField = defineComponent<{
  field: SlabFoundationInputField
  label: string
  suffix?: string
  step?: number
  min?: number
}>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'slab-foundation-field' }, [
      h('label', { for: `slab-foundation-${props.field}` }, props.label),
      h('div', { class: 'slab-foundation-input-wrap' }, [
        h('input', {
          id: `slab-foundation-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `slab-foundation-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `slab-foundation-${props.field}-error`, class: 'slab-foundation-error' }, t(getIssue(props.field)!.messageKey))
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
