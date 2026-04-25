<template>
  <main class="floor-screed-page" aria-labelledby="floor-screed-title">
    <section class="floor-screed-heading">
      <p class="floor-screed-eyebrow">{{ t('floorScreed.eyebrow') }}</p>
      <h1 id="floor-screed-title">{{ t('floorScreed.title') }}</h1>
      <p>{{ t('floorScreed.intro') }}</p>
    </section>

    <div class="floor-screed-workspace">
      <form class="floor-screed-form" @submit.prevent>
        <section class="floor-screed-section">
          <div class="floor-screed-section__header">
            <h2>{{ t('floorScreed.form.roomTitle') }}</h2>
          </div>
          <div class="floor-screed-grid floor-screed-grid--two">
            <NumberField field="roomLength" :label="t('floorScreed.form.roomLength')" suffix="м" :step="0.01" />
            <NumberField field="roomWidth" :label="t('floorScreed.form.roomWidth')" suffix="м" :step="0.01" />
          </div>
          <NumberField field="excludedArea" :label="t('floorScreed.form.excludedArea')" suffix="м²" :step="0.01" :min="0" />
        </section>

        <section class="floor-screed-section">
          <div class="floor-screed-section__header">
            <h2>{{ t('floorScreed.form.layerTitle') }}</h2>
            <p>{{ t('floorScreed.form.consumptionHint') }}</p>
          </div>
          <div class="floor-screed-grid floor-screed-grid--two">
            <NumberField field="thicknessMm" :label="t('floorScreed.form.thicknessMm')" suffix="мм" :step="1" />
            <NumberField field="consumptionKgPerM2Mm" :label="t('floorScreed.form.consumption')" suffix="кг/м²/мм" :step="0.1" />
          </div>
          <div class="floor-screed-chip-list" role="group" :aria-label="t('floorScreed.form.thicknessPresets')">
            <button
              v-for="preset in thicknessPresets"
              :key="preset"
              type="button"
              class="floor-screed-chip"
              :class="{ 'floor-screed-chip--active': input.thicknessMm === preset }"
              @click="setThickness(preset)"
            >
              {{ t('floorScreed.form.thicknessValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="floor-screed-section">
          <div class="floor-screed-section__header">
            <h2>{{ t('floorScreed.form.bagTitle') }}</h2>
          </div>
          <div class="floor-screed-grid floor-screed-grid--three">
            <NumberField field="wastePercent" :label="t('floorScreed.form.wastePercent')" suffix="%" :step="1" :min="0" />
            <NumberField field="bagWeight" :label="t('floorScreed.form.bagWeight')" suffix="кг" :step="1" />
            <NumberField field="bagPrice" :label="t('floorScreed.form.bagPrice')" suffix="₽" :step="1" :min="0" />
          </div>
          <div class="floor-screed-chip-list" role="group" :aria-label="t('floorScreed.form.bagPresets')">
            <button
              v-for="preset in bagPresets"
              :key="preset"
              type="button"
              class="floor-screed-chip"
              :class="{ 'floor-screed-chip--active': input.bagWeight === preset }"
              @click="setBagWeight(preset)"
            >
              {{ t('floorScreed.form.kgValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="floor-screed-result" aria-live="polite">
        <p class="floor-screed-result__label">{{ t('floorScreed.result.label') }}</p>

        <template v-if="result">
          <div class="floor-screed-result__total">
            <span>{{ t('floorScreed.result.bags') }}</span>
            <strong>{{ t('floorScreed.result.bagsValue', { count: result.bagsNeeded }) }}</strong>
          </div>

          <div class="floor-screed-result__rows">
            <div class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.netArea') }}</span>
              <strong>{{ t('floorScreed.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.volume') }}</span>
              <strong>{{ t('floorScreed.result.volumeValue', { value: format(result.volumeM3) }) }}</strong>
            </div>
            <div class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.dryMix') }}</span>
              <strong>{{ t('floorScreed.result.kgValue', { value: format(result.dryMixKg) }) }}</strong>
            </div>
            <div class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.purchaseKg') }}</span>
              <strong>{{ t('floorScreed.result.kgValue', { value: format(result.purchaseKg) }) }}</strong>
            </div>
            <div class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.leftoverKg') }}</span>
              <strong>{{ t('floorScreed.result.kgValue', { value: format(result.leftoverKg) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="floor-screed-result__row">
              <span>{{ t('floorScreed.result.totalCost') }}</span>
              <strong>{{ t('floorScreed.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="floor-screed-formula">{{ t('floorScreed.formula') }}</p>
        </template>

        <p v-else class="floor-screed-result__empty">{{ t('floorScreed.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFloorScreedCalculator } from '../composables/useFloorScreedCalculator'
import type { FloorScreedInputField } from '../types/floor-screed'

const { t, n } = useI18n()
const { input, result, getIssue, setThickness, setBagWeight } = useFloorScreedCalculator()

const thicknessPresets = [30, 50, 70]
const bagPresets = [20, 25, 40]

const NumberField = defineComponent<{ field: FloorScreedInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'floor-screed-field' }, [
      h('label', { for: `floor-screed-${props.field}` }, props.label),
      h('div', { class: 'floor-screed-input-wrap' }, [
        h('input', {
          id: `floor-screed-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `floor-screed-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'floor-screed-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `floor-screed-${props.field}-error`, class: 'floor-screed-error' }, t(getIssue(props.field)!.messageKey))
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
.floor-screed-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.floor-screed-heading {
  max-width: 760px;
}

.floor-screed-section {
  display: grid;
  gap: 16px;
}

.floor-screed-section + .floor-screed-section {
  padding-top: 4px;
}

.floor-screed-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.floor-screed-section__header p {
  margin: 6px 0 0;
  color: #64748b;
}

.floor-screed-result__rows {
  display: grid;
}
</style>
