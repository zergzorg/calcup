<template>
  <main class="concrete-page" aria-labelledby="concrete-title">
    <section class="concrete-heading">
      <p class="concrete-eyebrow">{{ t('concrete.eyebrow') }}</p>
      <h1 id="concrete-title">{{ t('concrete.title') }}</h1>
      <p>{{ t('concrete.intro') }}</p>
    </section>

    <div class="concrete-workspace">
      <form class="concrete-form" @submit.prevent>
        <section class="concrete-section">
          <div class="concrete-section__header">
            <h2>{{ t('concrete.form.sizeTitle') }}</h2>
          </div>
          <div class="concrete-grid concrete-grid--two">
            <NumberField field="lengthM" :label="t('concrete.form.length')" :suffix="t('concrete.units.m')" :step="0.01" />
            <NumberField field="widthM" :label="t('concrete.form.width')" :suffix="t('concrete.units.m')" :step="0.01" />
          </div>
          <NumberField field="thicknessMm" :label="t('concrete.form.thickness')" :suffix="t('concrete.units.mm')" :step="1" />
          <div class="concrete-chip-list" role="group" :aria-label="t('concrete.form.thicknessPresets')">
            <button
              v-for="preset in thicknessPresets"
              :key="preset"
              type="button"
              class="concrete-chip"
              :class="{ 'concrete-chip--active': input.thicknessMm === preset }"
              @click="setThickness(preset)"
            >
              {{ t('concrete.form.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="concrete-section">
          <div class="concrete-section__header">
            <h2>{{ t('concrete.form.purchaseTitle') }}</h2>
          </div>
          <div class="concrete-grid concrete-grid--three">
            <NumberField field="wastePercent" :label="t('concrete.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="bagYieldLiters" :label="t('concrete.form.bagYield')" :suffix="t('concrete.units.l')" :step="0.1" />
            <NumberField field="pricePerM3" :label="t('concrete.form.pricePerM3')" suffix="₽/м³" :step="1" :min="0" />
          </div>
          <div class="concrete-chip-list" role="group" :aria-label="t('concrete.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="concrete-chip"
              :class="{ 'concrete-chip--active': input.wastePercent === preset }"
              @click="setWastePercent(preset)"
            >
              {{ t('concrete.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="concrete-result" aria-live="polite">
        <p class="concrete-result__label">{{ t('concrete.result.label') }}</p>

        <template v-if="result">
          <div class="concrete-result__total">
            <span>{{ t('concrete.result.volume') }}</span>
            <strong>{{ t('concrete.result.volumeValue', { value: format(result.volumeWithWasteM3) }) }}</strong>
          </div>

          <div class="concrete-result__rows">
            <div class="concrete-result__row">
              <span>{{ t('concrete.result.area') }}</span>
              <strong>{{ t('concrete.result.areaValue', { value: format(result.area) }) }}</strong>
            </div>
            <div class="concrete-result__row">
              <span>{{ t('concrete.result.baseVolume') }}</span>
              <strong>{{ t('concrete.result.volumeValue', { value: format(result.baseVolumeM3) }) }}</strong>
            </div>
            <div class="concrete-result__row">
              <span>{{ t('concrete.result.liters') }}</span>
              <strong>{{ t('concrete.result.litersValue', { value: format(result.volumeLiters) }) }}</strong>
            </div>
            <div class="concrete-result__row">
              <span>{{ t('concrete.result.bags') }}</span>
              <strong>{{ t('concrete.result.bagsValue', { count: result.bagsNeeded }) }}</strong>
            </div>
            <div class="concrete-result__row">
              <span>{{ t('concrete.result.leftover') }}</span>
              <strong>{{ t('concrete.result.litersValue', { value: format(result.leftoverLiters) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="concrete-result__row">
              <span>{{ t('concrete.result.totalCost') }}</span>
              <strong>{{ t('concrete.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="concrete-formula">{{ t('concrete.formula') }}</p>
        </template>

        <p v-else class="concrete-result__empty">{{ t('concrete.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConcreteCalculator } from '../composables/useConcreteCalculator'
import type { ConcreteInputField } from '../types/concrete'

const { t, n } = useI18n()
const { input, result, getIssue, setThickness, setWastePercent } = useConcreteCalculator()

const thicknessPresets = [80, 120, 150]
const wastePresets = [5, 10, 15]

const NumberField = defineComponent<{ field: ConcreteInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'concrete-field' }, [
      h('label', { for: `concrete-${props.field}` }, props.label),
      h('div', { class: 'concrete-input-wrap' }, [
        h('input', {
          id: `concrete-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `concrete-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'concrete-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `concrete-${props.field}-error`, class: 'concrete-error' }, t(getIssue(props.field)!.messageKey))
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
.concrete-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.concrete-heading {
  max-width: 760px;
}

.concrete-section {
  display: grid;
  gap: 16px;
}

.concrete-section + .concrete-section {
  padding-top: 4px;
}

.concrete-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.concrete-result__rows {
  display: grid;
}
</style>
