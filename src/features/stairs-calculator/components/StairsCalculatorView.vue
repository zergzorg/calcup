<template>
  <main class="stairs-page" aria-labelledby="stairs-title">
    <section class="stairs-heading">
      <p class="stairs-eyebrow">{{ t('stairs.eyebrow') }}</p>
      <h1 id="stairs-title">{{ t('stairs.title') }}</h1>
      <p>{{ t('stairs.intro') }}</p>
    </section>

    <div class="stairs-workspace">
      <form class="stairs-form" @submit.prevent>
        <aside class="stairs-warning-note">
          <strong>{{ t('stairs.warning.title') }}</strong>
          <span>{{ t('stairs.warning.body') }}</span>
        </aside>

        <section class="stairs-section">
          <div class="stairs-section__header">
            <h2>{{ t('stairs.form.geometryTitle') }}</h2>
            <p>{{ t('stairs.form.geometryHelp') }}</p>
          </div>

          <NumberField field="totalRiseCm" :label="t('stairs.form.totalRiseCm')" :suffix="t('stairs.units.cm')" :step="1" />
          <div class="stairs-chip-list" role="group" :aria-label="t('stairs.form.risePresets')">
            <button
              v-for="preset in risePresets"
              :key="preset"
              type="button"
              class="stairs-chip"
              :class="{ 'stairs-chip--active': input.totalRiseCm === preset }"
              :aria-pressed="input.totalRiseCm === preset"
              @click="setRise(preset)"
            >
              {{ t('stairs.units.cmValue', { value: preset }) }}
            </button>
          </div>

          <div class="stairs-grid--two">
            <NumberField field="targetRiserCm" :label="t('stairs.form.targetRiserCm')" :suffix="t('stairs.units.cm')" :step="0.5" />
            <NumberField field="treadDepthCm" :label="t('stairs.form.treadDepthCm')" :suffix="t('stairs.units.cm')" :step="0.5" />
          </div>
        </section>

        <section class="stairs-section">
          <div class="stairs-section__header stairs-section__header--tight">
            <h2>{{ t('stairs.form.purchaseTitle') }}</h2>
          </div>

          <div class="stairs-grid--two">
            <NumberField field="stairWidthM" :label="t('stairs.form.stairWidthM')" :suffix="t('stairs.units.m')" :step="0.05" />
            <NumberField field="pricePerTread" :label="t('stairs.form.pricePerTread')" :suffix="t('stairs.units.rubTread')" :step="1" :min="0" />
          </div>

          <NumberField field="wastePercent" :label="t('stairs.form.wastePercent')" :suffix="t('stairs.units.percent')" :step="1" :min="0" />
          <div class="stairs-chip-list" role="group" :aria-label="t('stairs.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="stairs-chip"
              :class="{ 'stairs-chip--active': input.wastePercent === preset }"
              :aria-pressed="input.wastePercent === preset"
              @click="setWaste(preset)"
            >
              {{ t('stairs.units.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="stairs-result" aria-live="polite">
        <p class="stairs-result__label">{{ t('stairs.result.label') }}</p>

        <template v-if="result">
          <div class="stairs-result__total">
            <span>{{ t('stairs.result.risers') }}</span>
            <strong>{{ t('stairs.units.pcsValue', { value: format(result.risersCount) }) }}</strong>
          </div>

          <div class="stairs-result__rows">
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.treads') }}</span>
              <strong>{{ t('stairs.units.pcsValue', { value: format(result.treadsCount) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.actualRiser') }}</span>
              <strong>{{ t('stairs.units.cmValue', { value: format(result.actualRiserCm) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.totalRun') }}</span>
              <strong>{{ t('stairs.units.cmValue', { value: format(result.totalRunCm) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.angle') }}</span>
              <strong>{{ t('stairs.units.degreesValue', { value: format(result.stairAngleDegrees) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.stringer') }}</span>
              <strong>{{ t('stairs.units.mValue', { value: format(result.stringerLengthM) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.treadArea') }}</span>
              <strong>{{ t('stairs.units.m2Value', { value: format(result.treadAreaWithWasteM2) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.purchaseTreads') }}</span>
              <strong>{{ t('stairs.units.pcsValue', { value: format(result.purchaseTreads) }) }}</strong>
            </div>
            <div class="stairs-result__row">
              <span>{{ t('stairs.result.comfort') }}</span>
              <strong>{{ t(`stairs.comfort.${result.comfort}`, { value: format(result.comfortStepCm) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="stairs-result__row">
              <span>{{ t('stairs.result.totalCost') }}</span>
              <strong>{{ t('stairs.units.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="stairs-formula">{{ t('stairs.formula') }}</p>
        </template>

        <p v-else class="stairs-result__empty">{{ t('stairs.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useStairsCalculator } from '../composables/useStairsCalculator'
import type { StairsInputField } from '../types/stairs'

const { t, n } = useI18n()
const { input, result, getIssue, setRise, setWaste, updateNumber } = useStairsCalculator()

const risePresets = CALCULATOR_PRESETS_CONFIG.construction.stairs.riseMillimeters
const wastePresets = CALCULATOR_PRESETS_CONFIG.construction.commonWastePercents

const NumberField = defineComponent<{
  field: StairsInputField
  label: string
  suffix?: string
  step?: number
  min?: number
}>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'stairs-field' }, [
      h('label', { for: `stairs-${props.field}` }, props.label),
      h('div', { class: 'stairs-input-wrap' }, [
        h('input', {
          id: `stairs-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `stairs-${props.field}-error`,
          onInput: (event: Event) => {
            updateNumber(props.field, Number((event.target as HTMLInputElement).value))
          },
        }),
        props.suffix ? h('span', props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `stairs-${props.field}-error`, class: 'stairs-error' }, t(getIssue(props.field)!.messageKey))
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
