<template>
  <main class="roof-page" aria-labelledby="roof-title">
    <section class="roof-heading">
      <p class="roof-eyebrow">{{ t('roof.eyebrow') }}</p>
      <h1 id="roof-title">{{ t('roof.title') }}</h1>
      <p>{{ t('roof.intro') }}</p>
    </section>

    <div class="roof-workspace">
      <form class="roof-form" @submit.prevent>
        <aside class="roof-warning-note">
          <strong>{{ t('roof.warning.title') }}</strong>
          <span>{{ t('roof.warning.body') }}</span>
        </aside>

        <section class="roof-section">
          <div class="roof-section__header">
            <h2>{{ t('roof.form.roofTypeTitle') }}</h2>
          </div>
          <div class="roof-toggle" role="group" :aria-label="t('roof.form.roofTypeTitle')">
            <button
              v-for="option in roofTypeOptions"
              :key="option.value"
              type="button"
              :class="{ 'roof-toggle__option--active': input.roofType === option.value }"
              class="roof-toggle__option"
              :aria-pressed="input.roofType === option.value"
              @click="setRoofType(option.value)"
            >
              {{ t(option.labelKey) }}
            </button>
          </div>
        </section>

        <section class="roof-section">
          <div class="roof-section__header">
            <h2>{{ t('roof.form.geometryTitle') }}</h2>
            <p>{{ t('roof.form.geometryHelp') }}</p>
          </div>

          <div class="roof-grid--two">
            <NumberField field="lengthM" :label="t('roof.form.lengthM')" :suffix="t('roof.units.m')" :step="0.1" />
            <NumberField field="widthM" :label="t('roof.form.widthM')" :suffix="t('roof.units.m')" :step="0.1" />
          </div>

          <div class="roof-grid--two">
            <NumberField field="overhangMm" :label="t('roof.form.overhangMm')" :suffix="t('roof.units.mm')" :step="10" :min="0" />
            <NumberField field="pitchDegrees" :label="t('roof.form.pitchDegrees')" :suffix="t('roof.units.degrees')" :step="1" :min="0" />
          </div>

          <div class="roof-chip-list" role="group" :aria-label="t('roof.form.pitchPresets')">
            <button
              v-for="preset in pitchPresets"
              :key="preset"
              type="button"
              class="roof-chip"
              :class="{ 'roof-chip--active': input.pitchDegrees === preset }"
              :aria-pressed="input.pitchDegrees === preset"
              @click="setPitch(preset)"
            >
              {{ t('roof.units.degreesValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="roof-section">
          <div class="roof-section__header">
            <h2>{{ t('roof.form.sheetTitle') }}</h2>
            <p>{{ t('roof.form.sheetHelp') }}</p>
          </div>

          <div class="roof-grid--two">
            <NumberField field="sheetLengthM" :label="t('roof.form.sheetLengthM')" :suffix="t('roof.units.m')" :step="0.01" />
            <NumberField field="sheetWidthM" :label="t('roof.form.sheetWidthM')" :suffix="t('roof.units.m')" :step="0.01" />
          </div>

          <div class="roof-chip-list" role="group" :aria-label="t('roof.form.sheetPresets')">
            <button
              v-for="preset in sheetPresets"
              :key="preset.label"
              type="button"
              class="roof-chip"
              :class="{ 'roof-chip--active': input.sheetLengthM === preset.length && input.sheetWidthM === preset.width }"
              :aria-pressed="input.sheetLengthM === preset.length && input.sheetWidthM === preset.width"
              @click="setSheetSize(preset.length, preset.width)"
            >
              {{ preset.label }}
            </button>
          </div>

          <div class="roof-grid--two">
            <NumberField field="sideOverlapMm" :label="t('roof.form.sideOverlapMm')" :suffix="t('roof.units.mm')" :step="10" :min="0" />
            <NumberField field="endOverlapMm" :label="t('roof.form.endOverlapMm')" :suffix="t('roof.units.mm')" :step="10" :min="0" />
          </div>
        </section>

        <section class="roof-section">
          <div class="roof-section__header roof-section__header--tight">
            <h2>{{ t('roof.form.purchaseTitle') }}</h2>
          </div>

          <div class="roof-grid--two">
            <NumberField field="wastePercent" :label="t('roof.form.wastePercent')" :suffix="t('roof.units.percent')" :step="1" :min="0" />
            <NumberField field="pricePerSheet" :label="t('roof.form.pricePerSheet')" :suffix="t('roof.units.rubSheet')" :step="1" :min="0" />
          </div>

          <div class="roof-chip-list" role="group" :aria-label="t('roof.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="roof-chip"
              :class="{ 'roof-chip--active': input.wastePercent === preset }"
              :aria-pressed="input.wastePercent === preset"
              @click="setWaste(preset)"
            >
              {{ t('roof.units.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="roof-result" aria-live="polite">
        <p class="roof-result__label">{{ t('roof.result.label') }}</p>

        <template v-if="result">
          <div class="roof-result__total">
            <span>{{ t('roof.result.sheets') }}</span>
            <strong>{{ t('roof.units.pcsValue', { value: format(result.sheetsNeeded) }) }}</strong>
          </div>

          <div class="roof-result__rows">
            <div class="roof-result__row">
              <span>{{ t('roof.result.roofArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.roofAreaM2) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.materialArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.materialAreaM2) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.projectedArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.projectedAreaM2) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.slopeLength') }}</span>
              <strong>{{ t('roof.units.mValue', { value: format(result.slopeLengthM) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.effectiveSheetArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.effectiveSheetAreaM2) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.purchaseArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.purchaseAreaM2) }) }}</strong>
            </div>
            <div class="roof-result__row">
              <span>{{ t('roof.result.leftoverArea') }}</span>
              <strong>{{ t('roof.units.m2Value', { value: format(result.leftoverAreaM2) }) }}</strong>
            </div>
            <div v-if="result.ridgeLengthM !== null" class="roof-result__row">
              <span>{{ t('roof.result.ridgeLength') }}</span>
              <strong>{{ t('roof.units.mValue', { value: format(result.ridgeLengthM) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="roof-result__row">
              <span>{{ t('roof.result.totalCost') }}</span>
              <strong>{{ t('roof.units.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="roof-formula">{{ t('roof.formula') }}</p>
        </template>

        <p v-else class="roof-result__empty">{{ t('roof.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoofCalculator } from '../composables/useRoofCalculator'
import type { RoofInputField, RoofType } from '../types/roof'

const { t, n } = useI18n()
const { input, result, getIssue, setRoofType, setPitch, setWaste, setSheetSize, updateNumber } = useRoofCalculator()

const roofTypeOptions: Array<{ value: RoofType; labelKey: string }> = [
  { value: 'gable', labelKey: 'roof.types.gable' },
  { value: 'hip', labelKey: 'roof.types.hip' },
  { value: 'shed', labelKey: 'roof.types.shed' },
]
const pitchPresets = [15, 30, 45]
const wastePresets = [5, 10, 15]
const sheetPresets = [
  { label: '3×1.1 м', length: 3, width: 1.1 },
  { label: '2×1 м', length: 2, width: 1 },
  { label: '6×1.1 м', length: 6, width: 1.1 },
]

const NumberField = defineComponent<{
  field: RoofInputField
  label: string
  suffix?: string
  step?: number
  min?: number
}>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'roof-field' }, [
      h('label', { for: `roof-${props.field}` }, props.label),
      h('div', { class: 'roof-input-wrap' }, [
        h('input', {
          id: `roof-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `roof-${props.field}-error`,
          onInput: (event: Event) => {
            updateNumber(props.field, Number((event.target as HTMLInputElement).value))
          },
        }),
        props.suffix ? h('span', props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `roof-${props.field}-error`, class: 'roof-error' }, t(getIssue(props.field)!.messageKey))
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
