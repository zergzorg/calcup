<template>
  <main class="insulation-page" aria-labelledby="insulation-title">
    <section class="insulation-heading">
      <p class="insulation-eyebrow">{{ t('insulation.eyebrow') }}</p>
      <h1 id="insulation-title">{{ t('insulation.title') }}</h1>
      <p>{{ t('insulation.intro') }}</p>
    </section>

    <div class="insulation-workspace">
      <form class="insulation-form" @submit.prevent>
        <section class="insulation-section">
          <div class="insulation-section__header">
            <h2>{{ t('insulation.form.surfaceTitle') }}</h2>
          </div>
          <NumberField field="surfaceArea" :label="t('insulation.form.surfaceArea')" :suffix="t('insulation.units.m2')" :step="0.01" />
          <NumberField field="excludedArea" :label="t('insulation.form.excludedArea')" :suffix="t('insulation.units.m2')" :step="0.01" :min="0" />
        </section>

        <section class="insulation-section">
          <div class="insulation-section__header">
            <h2>{{ t('insulation.form.boardTitle') }}</h2>
          </div>
          <div class="insulation-grid insulation-grid--three">
            <NumberField field="boardLengthM" :label="t('insulation.form.boardLength')" :suffix="t('insulation.units.m')" :step="0.01" />
            <NumberField field="boardWidthM" :label="t('insulation.form.boardWidth')" :suffix="t('insulation.units.m')" :step="0.01" />
            <NumberField field="boardThicknessMm" :label="t('insulation.form.boardThickness')" :suffix="t('insulation.units.mm')" :step="1" />
          </div>
          <div class="insulation-chip-list" role="group" :aria-label="t('insulation.form.boardPresets')">
            <button
              v-for="preset in boardPresets"
              :key="preset.label"
              type="button"
              class="insulation-chip"
              :class="{ 'insulation-chip--active': input.boardLengthM === preset.length && input.boardWidthM === preset.width }"
              @click="setBoardSize(preset.length, preset.width)"
            >
              {{ preset.label }}
            </button>
          </div>
        </section>

        <section class="insulation-section">
          <div class="insulation-section__header">
            <h2>{{ t('insulation.form.purchaseTitle') }}</h2>
          </div>
          <div class="insulation-grid insulation-grid--three">
            <NumberField field="boardsPerPack" :label="t('insulation.form.boardsPerPack')" :suffix="t('insulation.units.pcs')" :step="1" />
            <NumberField field="wastePercent" :label="t('insulation.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="packPrice" :label="t('insulation.form.packPrice')" suffix="₽" :step="0.01" :min="0" />
          </div>
          <div class="insulation-chip-list" role="group" :aria-label="t('insulation.form.thicknessPresets')">
            <button
              v-for="preset in thicknessPresets"
              :key="preset"
              type="button"
              class="insulation-chip"
              :class="{ 'insulation-chip--active': input.boardThicknessMm === preset }"
              @click="setThickness(preset)"
            >
              {{ t('insulation.form.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="insulation-result" aria-live="polite">
        <p class="insulation-result__label">{{ t('insulation.result.label') }}</p>

        <template v-if="result">
          <div class="insulation-result__total">
            <span>{{ t('insulation.result.packs') }}</span>
            <strong>{{ t('insulation.result.packsValue', { count: result.packsNeeded }) }}</strong>
          </div>

          <div class="insulation-result__rows">
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.boards') }}</span>
              <strong>{{ t('insulation.result.boardsValue', { count: result.boardsNeeded }) }}</strong>
            </div>
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.netArea') }}</span>
              <strong>{{ t('insulation.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.materialArea') }}</span>
              <strong>{{ t('insulation.result.areaValue', { value: format(result.materialArea) }) }}</strong>
            </div>
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.purchaseArea') }}</span>
              <strong>{{ t('insulation.result.areaValue', { value: format(result.purchaseArea) }) }}</strong>
            </div>
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.purchaseVolume') }}</span>
              <strong>{{ t('insulation.result.volumeValue', { value: format(result.purchaseVolume) }) }}</strong>
            </div>
            <div class="insulation-result__row">
              <span>{{ t('insulation.result.leftoverArea') }}</span>
              <strong>{{ t('insulation.result.areaValue', { value: format(result.leftoverArea) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="insulation-result__row">
              <span>{{ t('insulation.result.totalCost') }}</span>
              <strong>{{ t('insulation.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="insulation-formula">{{ t('insulation.formula') }}</p>
        </template>

        <p v-else class="insulation-result__empty">{{ t('insulation.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useInsulationCalculator } from '../composables/useInsulationCalculator'
import type { InsulationInputField } from '../types/insulation'

const { t, n } = useI18n()
const { input, result, getIssue, setBoardSize, setThickness } = useInsulationCalculator()

const boardPresets = CALCULATOR_PRESETS_CONFIG.construction.insulation.boardSizes
const thicknessPresets = CALCULATOR_PRESETS_CONFIG.construction.insulation.thicknessMillimeters

const NumberField = defineComponent<{ field: InsulationInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'insulation-field' }, [
      h('label', { for: `insulation-${props.field}` }, props.label),
      h('div', { class: 'insulation-input-wrap' }, [
        h('input', {
          id: `insulation-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `insulation-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'insulation-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `insulation-${props.field}-error`, class: 'insulation-error' }, t(getIssue(props.field)!.messageKey))
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
.insulation-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.insulation-heading {
  max-width: 760px;
}

.insulation-section {
  display: grid;
  gap: 16px;
}

.insulation-section + .insulation-section {
  padding-top: 4px;
}

.insulation-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.insulation-result__rows {
  display: grid;
}
</style>
