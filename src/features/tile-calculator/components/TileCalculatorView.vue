<template>
  <main class="tile-page" aria-labelledby="tile-title">
    <section class="tile-heading">
      <p class="tile-eyebrow">{{ t('tile.eyebrow') }}</p>
      <h1 id="tile-title">{{ t('tile.title') }}</h1>
      <p>{{ t('tile.intro') }}</p>
    </section>

    <div class="tile-workspace">
      <form class="tile-form" @submit.prevent>
        <section class="tile-section">
          <div class="tile-section__header">
            <h2>{{ t('tile.form.surfaceTitle') }}</h2>
          </div>
          <div class="tile-grid tile-grid--two">
            <NumberField field="surfaceLength" :label="t('tile.form.surfaceLength')" suffix="м" :step="0.01" />
            <NumberField field="surfaceWidth" :label="t('tile.form.surfaceWidth')" suffix="м" :step="0.01" />
          </div>
        </section>

        <section class="tile-section">
          <div class="tile-section__header">
            <h2>{{ t('tile.form.tileTitle') }}</h2>
          </div>
          <div class="tile-grid tile-grid--two">
            <NumberField field="tileLengthCm" :label="t('tile.form.tileLength')" suffix="см" :step="0.1" />
            <NumberField field="tileWidthCm" :label="t('tile.form.tileWidth')" suffix="см" :step="0.1" />
          </div>
          <div class="tile-chip-list" role="group" :aria-label="t('tile.form.presets')">
            <button
              v-for="preset in tilePresets"
              :key="preset.label"
              type="button"
              class="tile-chip"
              :class="{ 'tile-chip--active': input.tileLengthCm === preset.length && input.tileWidthCm === preset.width }"
              @click="setTileSize(preset.length, preset.width)"
            >
              {{ preset.label }}
            </button>
          </div>
        </section>

        <section class="tile-section">
          <div class="tile-section__header">
            <h2>{{ t('tile.form.boxTitle') }}</h2>
          </div>
          <div class="tile-grid tile-grid--three">
            <NumberField field="wastePercent" :label="t('tile.form.wastePercent')" suffix="%" :step="1" />
            <NumberField field="tilesPerBox" :label="t('tile.form.tilesPerBox')" suffix="шт" :step="1" />
            <NumberField field="boxPrice" :label="t('tile.form.boxPrice')" suffix="₽" :step="1" />
          </div>
        </section>
      </form>

      <section class="tile-result" aria-live="polite">
        <p class="tile-result__label">{{ t('tile.result.label') }}</p>

        <template v-if="result">
          <div class="tile-result__total">
            <span>{{ t('tile.result.boxes') }}</span>
            <strong>{{ t('tile.result.boxesValue', { count: result.boxesNeeded }) }}</strong>
          </div>

          <div class="tile-result__rows">
            <div class="tile-result__row">
              <span>{{ t('tile.result.surfaceArea') }}</span>
              <strong>{{ t('tile.result.areaValue', { value: format(result.surfaceArea) }) }}</strong>
            </div>
            <div class="tile-result__row">
              <span>{{ t('tile.result.baseTiles') }}</span>
              <strong>{{ t('tile.result.tilesValue', { count: result.baseTiles }) }}</strong>
            </div>
            <div class="tile-result__row">
              <span>{{ t('tile.result.tilesWithWaste') }}</span>
              <strong>{{ t('tile.result.tilesValue', { count: result.tilesWithWaste }) }}</strong>
            </div>
            <div class="tile-result__row">
              <span>{{ t('tile.result.purchaseTiles') }}</span>
              <strong>{{ t('tile.result.tilesValue', { count: result.purchaseTiles }) }}</strong>
            </div>
            <div class="tile-result__row">
              <span>{{ t('tile.result.leftoverTiles') }}</span>
              <strong>{{ t('tile.result.tilesValue', { count: result.leftoverTiles }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="tile-result__row">
              <span>{{ t('tile.result.totalCost') }}</span>
              <strong>{{ t('tile.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="tile-formula">{{ t('tile.formula') }}</p>
        </template>

        <p v-else class="tile-result__empty">{{ t('tile.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useTileCalculator } from '../composables/useTileCalculator'
import type { TileInputField } from '../types/tile'

const { t, n } = useI18n()
const { input, result, getIssue, setTileSize } = useTileCalculator()

const tilePresets = CALCULATOR_PRESETS_CONFIG.construction.tile.tileSizes

const NumberField = defineComponent<{ field: TileInputField; label: string; suffix?: string; step?: number }>({
  props: ['field', 'label', 'suffix', 'step'],
  setup(props) {
    return () => h('div', { class: 'tile-field' }, [
      h('label', { for: `tile-${props.field}` }, props.label),
      h('div', { class: 'tile-input-wrap' }, [
        h('input', {
          id: `tile-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.field === 'wastePercent' || props.field === 'boxPrice' ? 0 : 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `tile-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'tile-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `tile-${props.field}-error`, class: 'tile-error' }, t(getIssue(props.field)!.messageKey))
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
.tile-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.tile-heading {
  max-width: 760px;
}

.tile-section {
  display: grid;
  gap: 16px;
}

.tile-section + .tile-section {
  padding-top: 4px;
}

.tile-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.tile-result__rows {
  display: grid;
}
</style>
