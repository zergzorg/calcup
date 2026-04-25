<template>
  <main class="drywall-page" aria-labelledby="drywall-title">
    <section class="drywall-heading">
      <p class="drywall-eyebrow">{{ t('drywall.eyebrow') }}</p>
      <h1 id="drywall-title">{{ t('drywall.title') }}</h1>
      <p>{{ t('drywall.intro') }}</p>
    </section>

    <div class="drywall-workspace">
      <form class="drywall-form" @submit.prevent>
        <section class="drywall-section">
          <div class="drywall-section__header">
            <h2>{{ t('drywall.form.wallTitle') }}</h2>
          </div>
          <div class="drywall-grid drywall-grid--two">
            <NumberField field="wallLength" :label="t('drywall.form.wallLength')" :suffix="t('drywall.units.m')" :step="0.01" />
            <NumberField field="wallHeight" :label="t('drywall.form.wallHeight')" :suffix="t('drywall.units.m')" :step="0.01" />
          </div>
          <NumberField field="openingsArea" :label="t('drywall.form.openingsArea')" :suffix="t('drywall.units.m2')" :step="0.01" :min="0" />
        </section>

        <section class="drywall-section">
          <div class="drywall-section__header">
            <h2>{{ t('drywall.form.sheetTitle') }}</h2>
          </div>
          <div class="drywall-grid drywall-grid--two">
            <NumberField field="sheetWidth" :label="t('drywall.form.sheetWidth')" :suffix="t('drywall.units.m')" :step="0.01" />
            <NumberField field="sheetHeight" :label="t('drywall.form.sheetHeight')" :suffix="t('drywall.units.m')" :step="0.01" />
          </div>
          <div class="drywall-chip-list" role="group" :aria-label="t('drywall.form.sheetPresets')">
            <button
              v-for="preset in sheetPresets"
              :key="preset.label"
              type="button"
              class="drywall-chip"
              :class="{ 'drywall-chip--active': input.sheetWidth === preset.width && input.sheetHeight === preset.height }"
              @click="setSheetSize(preset.width, preset.height)"
            >
              {{ preset.label }}
            </button>
          </div>
        </section>

        <section class="drywall-section">
          <div class="drywall-section__header">
            <h2>{{ t('drywall.form.frameTitle') }}</h2>
          </div>
          <div class="drywall-grid drywall-grid--two">
            <NumberField field="layers" :label="t('drywall.form.layers')" :suffix="t('drywall.units.layers')" :step="1" />
            <NumberField field="studSpacingMm" :label="t('drywall.form.studSpacing')" :suffix="t('drywall.units.mm')" :step="50" />
          </div>
          <div class="drywall-grid drywall-grid--three">
            <NumberField field="wastePercent" :label="t('drywall.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="screwsPerSheet" :label="t('drywall.form.screwsPerSheet')" :suffix="t('drywall.units.pcs')" :step="1" />
            <NumberField field="sheetPrice" :label="t('drywall.form.sheetPrice')" suffix="₽" :step="1" :min="0" />
          </div>
          <div class="drywall-chip-list" role="group" :aria-label="t('drywall.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="drywall-chip"
              :class="{ 'drywall-chip--active': input.wastePercent === preset }"
              @click="setWastePercent(preset)"
            >
              {{ t('drywall.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="drywall-result" aria-live="polite">
        <p class="drywall-result__label">{{ t('drywall.result.label') }}</p>

        <template v-if="result">
          <div class="drywall-result__total">
            <span>{{ t('drywall.result.sheets') }}</span>
            <strong>{{ t('drywall.result.sheetsValue', { count: result.sheetsNeeded }) }}</strong>
          </div>

          <div class="drywall-result__rows">
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.netArea') }}</span>
              <strong>{{ t('drywall.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.materialArea') }}</span>
              <strong>{{ t('drywall.result.areaValue', { value: format(result.materialArea) }) }}</strong>
            </div>
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.purchaseArea') }}</span>
              <strong>{{ t('drywall.result.areaValue', { value: format(result.purchaseArea) }) }}</strong>
            </div>
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.guideProfile') }}</span>
              <strong>{{ t('drywall.result.lengthValue', { value: format(result.guideProfileM) }) }}</strong>
            </div>
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.studProfile') }}</span>
              <strong>{{ t('drywall.result.profileValue', { meters: format(result.studProfileM), count: result.studsCount }) }}</strong>
            </div>
            <div class="drywall-result__row">
              <span>{{ t('drywall.result.screws') }}</span>
              <strong>{{ t('drywall.result.pcsValue', { count: result.screwsNeeded }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="drywall-result__row">
              <span>{{ t('drywall.result.totalCost') }}</span>
              <strong>{{ t('drywall.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="drywall-formula">{{ t('drywall.formula') }}</p>
        </template>

        <p v-else class="drywall-result__empty">{{ t('drywall.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDrywallCalculator } from '../composables/useDrywallCalculator'
import type { DrywallInputField } from '../types/drywall'

const { t, n } = useI18n()
const { input, result, getIssue, setSheetSize, setWastePercent } = useDrywallCalculator()

const sheetPresets = [
  { label: '1.2×2.5 м', width: 1.2, height: 2.5 },
  { label: '1.2×3.0 м', width: 1.2, height: 3 },
  { label: '1.2×2.7 м', width: 1.2, height: 2.7 },
]
const wastePresets = [5, 10, 15]

const NumberField = defineComponent<{ field: DrywallInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'drywall-field' }, [
      h('label', { for: `drywall-${props.field}` }, props.label),
      h('div', { class: 'drywall-input-wrap' }, [
        h('input', {
          id: `drywall-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `drywall-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'drywall-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `drywall-${props.field}-error`, class: 'drywall-error' }, t(getIssue(props.field)!.messageKey))
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
.drywall-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.drywall-heading {
  max-width: 760px;
}

.drywall-section {
  display: grid;
  gap: 16px;
}

.drywall-section + .drywall-section {
  padding-top: 4px;
}

.drywall-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.drywall-result__rows {
  display: grid;
}
</style>
