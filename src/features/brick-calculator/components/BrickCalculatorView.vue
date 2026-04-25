<template>
  <main class="brick-page" aria-labelledby="brick-title">
    <section class="brick-heading">
      <p class="brick-eyebrow">{{ t('brick.eyebrow') }}</p>
      <h1 id="brick-title">{{ t('brick.title') }}</h1>
      <p>{{ t('brick.intro') }}</p>
    </section>

    <div class="brick-workspace">
      <form class="brick-form" @submit.prevent>
        <section class="brick-section">
          <div class="brick-section__header">
            <h2>{{ t('brick.form.wallTitle') }}</h2>
          </div>
          <div class="brick-grid brick-grid--two">
            <NumberField field="wallLength" :label="t('brick.form.wallLength')" :suffix="t('brick.units.m')" :step="0.01" />
            <NumberField field="wallHeight" :label="t('brick.form.wallHeight')" :suffix="t('brick.units.m')" :step="0.01" />
          </div>
          <NumberField field="openingsArea" :label="t('brick.form.openingsArea')" :suffix="t('brick.units.m2')" :step="0.01" :min="0" />
        </section>

        <section class="brick-section">
          <div class="brick-section__header">
            <h2>{{ t('brick.form.brickTitle') }}</h2>
          </div>
          <div class="brick-grid brick-grid--three">
            <NumberField field="brickLengthMm" :label="t('brick.form.brickLength')" :suffix="t('brick.units.mm')" :step="1" />
            <NumberField field="brickWidthMm" :label="t('brick.form.brickWidth')" :suffix="t('brick.units.mm')" :step="1" />
            <NumberField field="brickHeightMm" :label="t('brick.form.brickHeight')" :suffix="t('brick.units.mm')" :step="1" />
          </div>
          <div class="brick-chip-list" role="group" :aria-label="t('brick.form.presets')">
            <button
              v-for="preset in brickPresets"
              :key="preset.label"
              type="button"
              class="brick-chip"
              :class="{ 'brick-chip--active': input.brickLengthMm === preset.length && input.brickWidthMm === preset.width && input.brickHeightMm === preset.height }"
              @click="setBrickSize(preset.length, preset.width, preset.height)"
            >
              {{ preset.label }}
            </button>
          </div>
        </section>

        <section class="brick-section">
          <div class="brick-section__header">
            <h2>{{ t('brick.form.masonryTitle') }}</h2>
          </div>
          <div class="brick-grid brick-grid--two">
            <NumberField field="jointMm" :label="t('brick.form.joint')" :suffix="t('brick.units.mm')" :step="1" :min="0" />
            <NumberField field="thicknessBricks" :label="t('brick.form.thickness')" :suffix="t('brick.units.brick')" :step="0.5" />
          </div>
          <div class="brick-grid brick-grid--three">
            <NumberField field="wastePercent" :label="t('brick.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="mortarSharePercent" :label="t('brick.form.mortarShare')" suffix="%" :step="1" :min="0" />
            <NumberField field="brickPrice" :label="t('brick.form.brickPrice')" suffix="₽" :step="0.01" :min="0" />
          </div>
        </section>
      </form>

      <section class="brick-result" aria-live="polite">
        <p class="brick-result__label">{{ t('brick.result.label') }}</p>

        <template v-if="result">
          <div class="brick-result__total">
            <span>{{ t('brick.result.bricks') }}</span>
            <strong>{{ t('brick.result.bricksValue', { count: result.bricksWithWaste }) }}</strong>
          </div>

          <div class="brick-result__rows">
            <div class="brick-result__row">
              <span>{{ t('brick.result.netArea') }}</span>
              <strong>{{ t('brick.result.areaValue', { value: format(result.netArea) }) }}</strong>
            </div>
            <div class="brick-result__row">
              <span>{{ t('brick.result.baseBricks') }}</span>
              <strong>{{ t('brick.result.bricksValue', { count: result.baseBricks }) }}</strong>
            </div>
            <div class="brick-result__row">
              <span>{{ t('brick.result.bricksPerM2') }}</span>
              <strong>{{ t('brick.result.bricksPerM2Value', { value: format(result.bricksPerM2HalfBrick) }) }}</strong>
            </div>
            <div class="brick-result__row">
              <span>{{ t('brick.result.masonryVolume') }}</span>
              <strong>{{ t('brick.result.volumeValue', { value: format(result.masonryVolume) }) }}</strong>
            </div>
            <div class="brick-result__row">
              <span>{{ t('brick.result.mortarVolume') }}</span>
              <strong>{{ t('brick.result.volumeValue', { value: format(result.mortarVolume) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="brick-result__row">
              <span>{{ t('brick.result.totalCost') }}</span>
              <strong>{{ t('brick.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="brick-formula">{{ t('brick.formula') }}</p>
        </template>

        <p v-else class="brick-result__empty">{{ t('brick.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBrickCalculator } from '../composables/useBrickCalculator'
import type { BrickInputField } from '../types/brick'

const { t, n } = useI18n()
const { input, result, getIssue, setBrickSize } = useBrickCalculator()

const brickPresets = [
  { label: '250×120×65', length: 250, width: 120, height: 65 },
  { label: '250×120×88', length: 250, width: 120, height: 88 },
  { label: '250×120×138', length: 250, width: 120, height: 138 },
]

const NumberField = defineComponent<{ field: BrickInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'brick-field' }, [
      h('label', { for: `brick-${props.field}` }, props.label),
      h('div', { class: 'brick-input-wrap' }, [
        h('input', {
          id: `brick-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `brick-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'brick-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `brick-${props.field}-error`, class: 'brick-error' }, t(getIssue(props.field)!.messageKey))
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
.brick-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.brick-heading {
  max-width: 760px;
}

.brick-section {
  display: grid;
  gap: 16px;
}

.brick-section + .brick-section {
  padding-top: 4px;
}

.brick-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.brick-result__rows {
  display: grid;
}
</style>
