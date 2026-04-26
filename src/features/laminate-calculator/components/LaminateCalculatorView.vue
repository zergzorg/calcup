<template>
  <main class="laminate-page" aria-labelledby="laminate-title">
    <section class="laminate-heading">
      <p class="laminate-eyebrow">{{ t('laminate.eyebrow') }}</p>
      <h1 id="laminate-title">{{ t('laminate.title') }}</h1>
      <p>{{ t('laminate.intro') }}</p>
    </section>

    <div class="laminate-workspace">
      <form class="laminate-form" @submit.prevent>
        <section class="laminate-section">
          <div class="laminate-section__header">
            <h2>{{ t('laminate.form.roomTitle') }}</h2>
          </div>
          <div class="laminate-grid laminate-grid--two">
            <NumberField field="roomLength" :label="t('laminate.form.roomLength')" suffix="м" :step="0.01" />
            <NumberField field="roomWidth" :label="t('laminate.form.roomWidth')" suffix="м" :step="0.01" />
          </div>
          <NumberField field="excludedArea" :label="t('laminate.form.excludedArea')" suffix="м²" :step="0.01" :min="0" />
        </section>

        <section class="laminate-section">
          <div class="laminate-section__header">
            <h2>{{ t('laminate.form.packTitle') }}</h2>
            <p>{{ t('laminate.form.packHint') }}</p>
          </div>
          <NumberField field="packCoverage" :label="t('laminate.form.packCoverage')" suffix="м²" :step="0.001" />
          <div class="laminate-chip-list" role="group" :aria-label="t('laminate.form.coveragePresets')">
            <button
              v-for="preset in coveragePresets"
              :key="preset"
              type="button"
              class="laminate-chip"
              :class="{ 'laminate-chip--active': input.packCoverage === preset }"
              @click="setPackCoverage(preset)"
            >
              {{ t('laminate.form.coverageValue', { value: format(preset) }) }}
            </button>
          </div>
          <NumberField field="packPrice" :label="t('laminate.form.packPrice')" suffix="₽" :step="1" :min="0" />
        </section>

        <section class="laminate-section">
          <div class="laminate-section__header">
            <h2>{{ t('laminate.form.wasteTitle') }}</h2>
          </div>
          <NumberField field="wastePercent" :label="t('laminate.form.wastePercent')" suffix="%" :step="1" :min="0" />
          <div class="laminate-chip-list" role="group" :aria-label="t('laminate.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="laminate-chip"
              :class="{ 'laminate-chip--active': input.wastePercent === preset }"
              @click="setWastePercent(preset)"
            >
              {{ t('laminate.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="laminate-result" aria-live="polite">
        <p class="laminate-result__label">{{ t('laminate.result.label') }}</p>

        <template v-if="result">
          <div class="laminate-result__total">
            <span>{{ t('laminate.result.packs') }}</span>
            <strong>{{ t('laminate.result.packsValue', { count: result.packsNeeded }) }}</strong>
          </div>

          <div class="laminate-result__rows">
            <div class="laminate-result__row">
              <span>{{ t('laminate.result.netArea') }}</span>
              <strong>{{ t('laminate.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="laminate-result__row">
              <span>{{ t('laminate.result.materialArea') }}</span>
              <strong>{{ t('laminate.result.areaValue', { value: format(result.materialArea) }) }}</strong>
            </div>
            <div class="laminate-result__row">
              <span>{{ t('laminate.result.purchaseArea') }}</span>
              <strong>{{ t('laminate.result.areaValue', { value: format(result.purchaseArea) }) }}</strong>
            </div>
            <div class="laminate-result__row">
              <span>{{ t('laminate.result.leftoverArea') }}</span>
              <strong>{{ t('laminate.result.areaValue', { value: format(result.leftoverArea) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="laminate-result__row">
              <span>{{ t('laminate.result.totalCost') }}</span>
              <strong>{{ t('laminate.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="laminate-formula">{{ t('laminate.formula') }}</p>
        </template>

        <p v-else class="laminate-result__empty">{{ t('laminate.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useLaminateCalculator } from '../composables/useLaminateCalculator'
import type { LaminateInputField } from '../types/laminate'

const { t, n } = useI18n()
const { input, result, getIssue, setWastePercent, setPackCoverage } = useLaminateCalculator()

const coveragePresets = CALCULATOR_PRESETS_CONFIG.laminate.packCoverage
const wastePresets = CALCULATOR_PRESETS_CONFIG.laminate.wastePercent

const NumberField = defineComponent<{ field: LaminateInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'laminate-field' }, [
      h('label', { for: `laminate-${props.field}` }, props.label),
      h('div', { class: 'laminate-input-wrap' }, [
        h('input', {
          id: `laminate-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `laminate-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'laminate-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `laminate-${props.field}-error`, class: 'laminate-error' }, t(getIssue(props.field)!.messageKey))
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
.laminate-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.laminate-heading {
  max-width: 760px;
}

.laminate-section {
  display: grid;
  gap: 16px;
}

.laminate-section + .laminate-section {
  padding-top: 4px;
}

.laminate-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.laminate-section__header p {
  margin: 6px 0 0;
  color: #64748b;
}

.laminate-result__rows {
  display: grid;
}
</style>
