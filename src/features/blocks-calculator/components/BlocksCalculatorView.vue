<template>
  <main class="blocks-page" aria-labelledby="blocks-title">
    <section class="blocks-heading">
      <p class="blocks-eyebrow">{{ t('blocks.eyebrow') }}</p>
      <h1 id="blocks-title">{{ t('blocks.title') }}</h1>
      <p>{{ t('blocks.intro') }}</p>
    </section>

    <div class="blocks-workspace">
      <form class="blocks-form" @submit.prevent>
        <section class="blocks-section">
          <div class="blocks-section__header">
            <h2>{{ t('blocks.form.wallTitle') }}</h2>
          </div>
          <div class="blocks-grid blocks-grid--two">
            <NumberField field="wallLength" :label="t('blocks.form.wallLength')" :suffix="t('blocks.units.m')" :step="0.01" />
            <NumberField field="wallHeight" :label="t('blocks.form.wallHeight')" :suffix="t('blocks.units.m')" :step="0.01" />
          </div>
          <NumberField field="openingsArea" :label="t('blocks.form.openingsArea')" :suffix="t('blocks.units.m2')" :step="0.01" :min="0" />
        </section>

        <section class="blocks-section">
          <div class="blocks-section__header">
            <h2>{{ t('blocks.form.blockTitle') }}</h2>
          </div>
          <div class="blocks-grid blocks-grid--three">
            <NumberField field="blockLengthMm" :label="t('blocks.form.blockLength')" :suffix="t('blocks.units.mm')" :step="1" />
            <NumberField field="blockHeightMm" :label="t('blocks.form.blockHeight')" :suffix="t('blocks.units.mm')" :step="1" />
            <NumberField field="blockWidthMm" :label="t('blocks.form.blockWidth')" :suffix="t('blocks.units.mm')" :step="1" />
          </div>
          <div class="blocks-chip-list" role="group" :aria-label="t('blocks.form.blockPresets')">
            <button
              v-for="preset in blockPresets"
              :key="preset.label"
              type="button"
              class="blocks-chip"
              :class="{ 'blocks-chip--active': input.blockLengthMm === preset.length && input.blockHeightMm === preset.height && input.blockWidthMm === preset.width }"
              @click="setBlockSize(preset.length, preset.height, preset.width)"
            >
              {{ preset.label }}
            </button>
          </div>
        </section>

        <section class="blocks-section">
          <div class="blocks-section__header">
            <h2>{{ t('blocks.form.purchaseTitle') }}</h2>
          </div>
          <div class="blocks-grid blocks-grid--three">
            <NumberField field="wastePercent" :label="t('blocks.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="adhesiveKgPerM2" :label="t('blocks.form.adhesive')" :suffix="t('blocks.units.kgPerM2')" :step="0.1" :min="0" />
            <NumberField field="bagWeightKg" :label="t('blocks.form.bagWeight')" :suffix="t('blocks.units.kg')" :step="1" />
          </div>
          <NumberField field="blockPrice" :label="t('blocks.form.blockPrice')" suffix="₽" :step="0.01" :min="0" />
          <div class="blocks-chip-list" role="group" :aria-label="t('blocks.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="blocks-chip"
              :class="{ 'blocks-chip--active': input.wastePercent === preset }"
              @click="setWastePercent(preset)"
            >
              {{ t('blocks.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="blocks-result" aria-live="polite">
        <p class="blocks-result__label">{{ t('blocks.result.label') }}</p>

        <template v-if="result">
          <div class="blocks-result__total">
            <span>{{ t('blocks.result.blocks') }}</span>
            <strong>{{ t('blocks.result.blocksValue', { count: result.blocksWithWaste }) }}</strong>
          </div>

          <div class="blocks-result__rows">
            <div class="blocks-result__row">
              <span>{{ t('blocks.result.netArea') }}</span>
              <strong>{{ t('blocks.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="blocks-result__row">
              <span>{{ t('blocks.result.baseBlocks') }}</span>
              <strong>{{ t('blocks.result.blocksValue', { count: result.baseBlocks }) }}</strong>
            </div>
            <div class="blocks-result__row">
              <span>{{ t('blocks.result.wallVolume') }}</span>
              <strong>{{ t('blocks.result.volumeValue', { value: format(result.wallVolume) }) }}</strong>
            </div>
            <div class="blocks-result__row">
              <span>{{ t('blocks.result.blockVolume') }}</span>
              <strong>{{ t('blocks.result.volumeValue', { value: format(result.blockVolume) }) }}</strong>
            </div>
            <div class="blocks-result__row">
              <span>{{ t('blocks.result.adhesive') }}</span>
              <strong>{{ t('blocks.result.adhesiveValue', { kg: format(result.adhesiveKg), bags: result.adhesiveBags }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="blocks-result__row">
              <span>{{ t('blocks.result.totalCost') }}</span>
              <strong>{{ t('blocks.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="blocks-formula">{{ t('blocks.formula') }}</p>
        </template>

        <p v-else class="blocks-result__empty">{{ t('blocks.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useBlocksCalculator } from '../composables/useBlocksCalculator'
import type { BlocksInputField } from '../types/blocks'

const { t, n } = useI18n()
const { input, result, getIssue, setBlockSize, setWastePercent } = useBlocksCalculator()

const blockPresets = CALCULATOR_PRESETS_CONFIG.construction.blocks.blockSizes
const wastePresets = CALCULATOR_PRESETS_CONFIG.construction.blocks.wastePercents

const NumberField = defineComponent<{ field: BlocksInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'blocks-field' }, [
      h('label', { for: `blocks-${props.field}` }, props.label),
      h('div', { class: 'blocks-input-wrap' }, [
        h('input', {
          id: `blocks-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `blocks-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'blocks-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `blocks-${props.field}-error`, class: 'blocks-error' }, t(getIssue(props.field)!.messageKey))
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
.blocks-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.blocks-heading {
  max-width: 760px;
}

.blocks-section {
  display: grid;
  gap: 16px;
}

.blocks-section + .blocks-section {
  padding-top: 4px;
}

.blocks-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.blocks-result__rows {
  display: grid;
}
</style>
