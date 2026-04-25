<template>
  <main class="paint-page" aria-labelledby="paint-title">
    <section class="paint-heading">
      <p class="paint-eyebrow">{{ t('paint.eyebrow') }}</p>
      <h1 id="paint-title">{{ t('paint.title') }}</h1>
      <p>{{ t('paint.intro') }}</p>
    </section>

    <div class="paint-workspace">
      <form class="paint-form" @submit.prevent>
        <section class="paint-section" aria-labelledby="paint-room-title">
          <div class="paint-section__header">
            <h2 id="paint-room-title">{{ t('paint.form.roomTitle') }}</h2>
            <p>{{ t('paint.form.roomHint') }}</p>
          </div>
          <div class="paint-grid paint-grid--three">
            <NumberField field="roomLength" :label="t('paint.form.roomLength')" suffix="м" :step="0.01" />
            <NumberField field="roomWidth" :label="t('paint.form.roomWidth')" suffix="м" :step="0.01" />
            <NumberField field="wallHeight" :label="t('paint.form.wallHeight')" suffix="м" :step="0.01" />
          </div>
        </section>

        <section class="paint-section" aria-labelledby="paint-openings-title">
          <div class="paint-section__header">
            <h2 id="paint-openings-title">{{ t('paint.form.openingsTitle') }}</h2>
            <p>{{ t('paint.form.openingsHint') }}</p>
          </div>

          <div class="paint-grid paint-grid--three">
            <NumberField field="windowsCount" :label="t('paint.form.windowsCount')" :step="1" />
            <NumberField field="windowWidth" :label="t('paint.form.windowWidth')" suffix="м" :step="0.01" />
            <NumberField field="windowHeight" :label="t('paint.form.windowHeight')" suffix="м" :step="0.01" />
            <NumberField field="doorsCount" :label="t('paint.form.doorsCount')" :step="1" />
            <NumberField field="doorWidth" :label="t('paint.form.doorWidth')" suffix="м" :step="0.01" />
            <NumberField field="doorHeight" :label="t('paint.form.doorHeight')" suffix="м" :step="0.01" />
          </div>

          <NumberField field="extraOpeningsArea" :label="t('paint.form.extraOpeningsArea')" suffix="м²" :step="0.01" />
        </section>

        <section class="paint-section" aria-labelledby="paint-options-title">
          <div class="paint-section__header">
            <h2 id="paint-options-title">{{ t('paint.form.paintTitle') }}</h2>
            <p>{{ t('paint.form.paintHint') }}</p>
          </div>

          <div class="paint-grid paint-grid--two">
            <NumberField field="coats" :label="t('paint.form.coats')" :step="1" />
            <NumberField field="wastePercent" :label="t('paint.form.wastePercent')" suffix="%" :step="1" />
            <NumberField field="coveragePerLiter" :label="t('paint.form.coveragePerLiter')" suffix="м²/л" :step="0.1" />
            <NumberField field="canVolume" :label="t('paint.form.canVolume')" suffix="л" :step="0.1" />
          </div>

          <div class="paint-grid paint-grid--two">
            <div class="paint-field">
              <span class="paint-field__label">{{ t('paint.form.coveragePreset') }}</span>
              <div class="paint-grid paint-grid--three" role="group" :aria-label="t('paint.form.coveragePreset')">
                <button
                  v-for="coverage in coveragePresets"
                  :key="coverage"
                  type="button"
                  class="paint-chip"
                  :class="{ 'paint-chip--active': input.coveragePerLiter === coverage }"
                  @click="setCoverage(coverage)"
                >
                  {{ t('paint.form.coveragePresetValue', { value: n(coverage) }) }}
                </button>
              </div>
            </div>

            <div class="paint-field">
              <span class="paint-field__label">{{ t('paint.form.canPreset') }}</span>
              <div class="paint-grid paint-grid--three" role="group" :aria-label="t('paint.form.canPreset')">
                <button
                  v-for="volume in canPresets"
                  :key="volume"
                  type="button"
                  class="paint-chip"
                  :class="{ 'paint-chip--active': input.canVolume === volume }"
                  @click="setCanVolume(volume)"
                >
                  {{ t('paint.form.canPresetValue', { value: n(volume) }) }}
                </button>
              </div>
            </div>
          </div>

          <NumberField field="canPrice" :label="t('paint.form.canPrice')" suffix="₽" :step="1" />
        </section>
      </form>

      <section class="paint-result" aria-live="polite">
        <p class="paint-result__label">{{ t('paint.result.label') }}</p>

        <template v-if="result">
          <div class="paint-result__total">
            <span>{{ t('paint.result.recommendedPurchase') }}</span>
            <strong>{{ t('paint.result.cansValue', { count: result.cansNeeded }) }}</strong>
          </div>

          <p class="paint-result__summary">
            {{ t('paint.result.litersSummary', { liters: liters(result.litersWithWaste), volume: liters(result.purchaseVolume) }) }}
          </p>

          <div v-if="result.openingsExceedWalls" class="paint-warning">
            {{ t('paint.result.openingsWarning') }}
          </div>

          <div class="paint-result__rows">
            <div class="paint-result__row">
              <span>{{ t('paint.result.grossWallArea') }}</span>
              <strong>{{ area(result.grossWallArea) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.openingsArea') }}</span>
              <strong>{{ area(result.openingsArea) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.paintableArea') }}</span>
              <strong>{{ area(result.paintableArea) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.coatedArea') }}</span>
              <strong>{{ area(result.coatedArea) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.baseLiters') }}</span>
              <strong>{{ liters(result.baseLiters) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.litersWithWaste') }}</span>
              <strong>{{ liters(result.litersWithWaste) }}</strong>
            </div>
            <div class="paint-result__row">
              <span>{{ t('paint.result.leftoverLiters') }}</span>
              <strong>{{ liters(result.leftoverLiters) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="paint-result__row">
              <span>{{ t('paint.result.totalCost') }}</span>
              <strong>{{ money(result.totalCost) }}</strong>
            </div>
          </div>

          <p class="paint-formula">{{ t('paint.formula') }}</p>
        </template>

        <p v-else class="paint-result__empty">{{ t('paint.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePaintCalculator } from '../composables/usePaintCalculator'
import type { PaintInput } from '../types/paint'

const { t, n, locale } = useI18n()

const {
  input,
  result,
  canPresets,
  coveragePresets,
  touch,
  getIssue,
  setCoverage,
  setCanVolume,
} = usePaintCalculator()

const NumberField = defineComponent({
  props: {
    field: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, default: '' },
    step: { type: Number, default: 0.01 },
  },
  setup(props) {
    return () => {
      const field = props.field as keyof PaintInput
      const issue = getIssue(field)

      return h('div', { class: 'paint-field' }, [
        h('label', { for: `paint-${field}` }, props.label),
        h('div', { class: ['paint-input-wrap', { 'paint-input-wrap--error': Boolean(issue) }] }, [
          h('input', {
            id: `paint-${field}`,
            type: 'number',
            min: '0',
            step: props.step,
            inputmode: 'decimal',
            value: input.value[field],
            'aria-invalid': Boolean(issue),
            'aria-describedby': `paint-${field}-error`,
            onInput: (event: Event) => {
              const target = event.target as HTMLInputElement
              input.value[field] = target.value === '' ? Number.NaN : Number(target.value)
            },
            onBlur: () => touch(field),
          }),
          props.suffix ? h('span', { class: 'paint-unit' }, props.suffix) : null,
        ]),
        issue ? h('p', { id: `paint-${field}-error`, class: 'paint-error' }, t(issue.messageKey)) : null,
      ])
    }
  },
})

function area(value: number): string {
  return t('paint.units.squareMetersValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function liters(value: number): string {
  return t('paint.units.litersValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function money(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
