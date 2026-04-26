<template>
  <main class="strip-foundation-page" aria-labelledby="strip-foundation-title">
    <section class="strip-foundation-heading">
      <p class="strip-foundation-eyebrow">{{ t('stripFoundation.eyebrow') }}</p>
      <h1 id="strip-foundation-title">{{ t('stripFoundation.title') }}</h1>
      <p>{{ t('stripFoundation.intro') }}</p>
    </section>

    <div class="strip-foundation-workspace">
      <form class="strip-foundation-form" @submit.prevent>
        <section class="strip-foundation-warning-note">
          <p><strong>{{ t('stripFoundation.warning.title') }}</strong></p>
          <p>{{ t('stripFoundation.warning.body') }}</p>
          <p>{{ t('stripFoundation.warning.norms') }}</p>
        </section>

        <section class="strip-foundation-section">
          <div class="strip-foundation-section__header">
            <h2>{{ t('stripFoundation.form.geometryTitle') }}</h2>
            <p>{{ t('stripFoundation.form.geometryHint') }}</p>
          </div>
          <NumberField field="totalLengthM" :label="t('stripFoundation.form.totalLength')" :suffix="t('stripFoundation.units.m')" :step="0.1" />
          <div class="strip-foundation-grid strip-foundation-grid--two">
            <NumberField field="widthMm" :label="t('stripFoundation.form.width')" :suffix="t('stripFoundation.units.mm')" :step="10" />
            <NumberField field="heightMm" :label="t('stripFoundation.form.height')" :suffix="t('stripFoundation.units.mm')" :step="10" />
          </div>
          <div class="strip-foundation-chip-list" role="group" :aria-label="t('stripFoundation.form.widthPresets')">
            <button
              v-for="preset in widthPresets"
              :key="preset"
              type="button"
              class="strip-foundation-chip"
              :class="{ 'strip-foundation-chip--active': input.widthMm === preset }"
              @click="setWidth(preset)"
            >
              {{ t('stripFoundation.form.mmValue', { value: preset }) }}
            </button>
          </div>
        </section>

        <section class="strip-foundation-section">
          <div class="strip-foundation-section__header">
            <h2>{{ t('stripFoundation.form.materialsTitle') }}</h2>
          </div>
          <div class="strip-foundation-grid strip-foundation-grid--three">
            <NumberField field="sandDepthMm" :label="t('stripFoundation.form.sandDepth')" :suffix="t('stripFoundation.units.mm')" :step="10" :min="0" />
            <NumberField field="wastePercent" :label="t('stripFoundation.form.waste')" suffix="%" :step="1" :min="0" />
            <NumberField field="rebarRuns" :label="t('stripFoundation.form.rebarRuns')" :suffix="t('stripFoundation.units.pcs')" :step="1" :min="1" />
          </div>
          <div class="strip-foundation-grid strip-foundation-grid--three">
            <NumberField field="rebarDiameterMm" :label="t('stripFoundation.form.rebarDiameter')" :suffix="t('stripFoundation.units.mm')" :step="1" />
            <NumberField field="concretePricePerM3" :label="t('stripFoundation.form.concretePrice')" suffix="₽/м³" :step="1" :min="0" />
            <NumberField field="rebarPricePerKg" :label="t('stripFoundation.form.rebarPrice')" suffix="₽/кг" :step="1" :min="0" />
          </div>
          <div class="strip-foundation-chip-list" role="group" :aria-label="t('stripFoundation.form.wastePresets')">
            <button
              v-for="preset in wastePresets"
              :key="preset"
              type="button"
              class="strip-foundation-chip"
              :class="{ 'strip-foundation-chip--active': input.wastePercent === preset }"
              @click="setWaste(preset)"
            >
              {{ t('stripFoundation.form.percentValue', { value: preset }) }}
            </button>
          </div>
        </section>
      </form>

      <section class="strip-foundation-result" aria-live="polite">
        <p class="strip-foundation-result__label">{{ t('stripFoundation.result.label') }}</p>

        <template v-if="result">
          <div class="strip-foundation-result__total">
            <span>{{ t('stripFoundation.result.concreteWithWaste') }}</span>
            <strong>{{ t('stripFoundation.result.m3Value', { value: format(result.concreteVolumeWithWasteM3) }) }}</strong>
          </div>

          <div class="strip-foundation-result__rows">
            <div class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.baseConcrete') }}</span>
              <strong>{{ t('stripFoundation.result.m3Value', { value: format(result.baseConcreteVolumeM3) }) }}</strong>
            </div>
            <div class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.sand') }}</span>
              <strong>{{ t('stripFoundation.result.m3Value', { value: format(result.sandVolumeM3) }) }}</strong>
            </div>
            <div class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.formwork') }}</span>
              <strong>{{ t('stripFoundation.result.m2Value', { value: format(result.formworkAreaM2) }) }}</strong>
            </div>
            <div class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.rebarLength') }}</span>
              <strong>{{ t('stripFoundation.result.mValue', { value: format(result.rebarLengthM) }) }}</strong>
            </div>
            <div class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.rebarWeight') }}</span>
              <strong>{{ t('stripFoundation.result.kgValue', { value: format(result.rebarWeightKg) }) }}</strong>
            </div>
            <div v-if="result.concreteCost !== null" class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.concreteCost') }}</span>
              <strong>{{ t('stripFoundation.result.moneyValue', { value: format(result.concreteCost) }) }}</strong>
            </div>
            <div v-if="result.rebarCost !== null" class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.rebarCost') }}</span>
              <strong>{{ t('stripFoundation.result.moneyValue', { value: format(result.rebarCost) }) }}</strong>
            </div>
            <div v-if="result.totalCost !== null" class="strip-foundation-result__row">
              <span>{{ t('stripFoundation.result.totalCost') }}</span>
              <strong>{{ t('stripFoundation.result.moneyValue', { value: format(result.totalCost) }) }}</strong>
            </div>
          </div>

          <p class="strip-foundation-formula">{{ t('stripFoundation.formula') }}</p>
        </template>

        <p v-else class="strip-foundation-result__empty">{{ t('stripFoundation.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStripFoundationCalculator } from '../composables/useStripFoundationCalculator'
import type { StripFoundationInputField } from '../types/strip-foundation'

const { t, n } = useI18n()
const { input, result, getIssue, setWidth, setWaste } = useStripFoundationCalculator()

const widthPresets = [300, 400, 500]
const wastePresets = [5, 10, 15]

const NumberField = defineComponent<{ field: StripFoundationInputField; label: string; suffix?: string; step?: number; min?: number }>({
  props: ['field', 'label', 'suffix', 'step', 'min'],
  setup(props) {
    return () => h('div', { class: 'strip-foundation-field' }, [
      h('label', { for: `strip-foundation-${props.field}` }, props.label),
      h('div', { class: 'strip-foundation-input-wrap' }, [
        h('input', {
          id: `strip-foundation-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min ?? 0.01,
          step: props.step ?? 'any',
          inputmode: 'decimal',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `strip-foundation-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        props.suffix ? h('span', { class: 'strip-foundation-unit' }, props.suffix) : null,
      ]),
      getIssue(props.field)
        ? h('p', { id: `strip-foundation-${props.field}-error`, class: 'strip-foundation-error' }, t(getIssue(props.field)!.messageKey))
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
