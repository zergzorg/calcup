<template>
  <main class="wallpaper-page" aria-labelledby="wallpaper-title">
    <section class="wallpaper-heading">
      <p class="wallpaper-eyebrow">{{ t('wallpaper.eyebrow') }}</p>
      <h1 id="wallpaper-title">{{ t('wallpaper.title') }}</h1>
      <p>{{ t('wallpaper.intro') }}</p>
    </section>

    <div class="wallpaper-workspace">
      <form class="wallpaper-form" @submit.prevent>
        <div class="wallpaper-note">{{ t('wallpaper.form.quickHint') }}</div>

        <section class="wallpaper-section" aria-labelledby="wallpaper-room-title">
          <h2 id="wallpaper-room-title">{{ t('wallpaper.form.roomTitle') }}</h2>
          <div class="wallpaper-grid wallpaper-grid--three">
            <NumberField
              field="roomLength"
              :label="t('wallpaper.form.roomLength')"
              suffix="м"
              :step="0.01"
            />
            <NumberField
              field="roomWidth"
              :label="t('wallpaper.form.roomWidth')"
              suffix="м"
              :step="0.01"
            />
            <NumberField
              field="wallHeight"
              :label="t('wallpaper.form.wallHeight')"
              suffix="м"
              :step="0.01"
            />
          </div>
        </section>

        <section class="wallpaper-section" aria-labelledby="wallpaper-openings-title">
          <div class="wallpaper-section__header">
            <h2 id="wallpaper-openings-title">{{ t('wallpaper.form.openingsTitle') }}</h2>
            <p>{{ t('wallpaper.form.openingsHint') }}</p>
          </div>

          <div class="wallpaper-openings">
            <section class="wallpaper-opening-card">
              <h3>{{ t('wallpaper.form.windows') }}</h3>
              <div class="wallpaper-grid wallpaper-grid--three">
                <NumberField field="windowHeight" :label="t('wallpaper.form.height')" suffix="м" :step="0.01" />
                <NumberField field="windowWidth" :label="t('wallpaper.form.width')" suffix="м" :step="0.01" />
                <NumberField field="windowsCount" :label="t('wallpaper.form.count')" :step="1" />
              </div>
            </section>
            <section class="wallpaper-opening-card">
              <h3>{{ t('wallpaper.form.doors') }}</h3>
              <div class="wallpaper-grid wallpaper-grid--three">
                <NumberField field="doorHeight" :label="t('wallpaper.form.height')" suffix="м" :step="0.01" />
                <NumberField field="doorWidth" :label="t('wallpaper.form.width')" suffix="м" :step="0.01" />
                <NumberField field="doorsCount" :label="t('wallpaper.form.count')" :step="1" />
              </div>
            </section>
          </div>

          <NumberField
            field="extraOpeningsArea"
            :label="t('wallpaper.form.extraOpeningsArea')"
            suffix="м²"
            :step="0.01"
          />
        </section>

        <section class="wallpaper-section" aria-labelledby="wallpaper-roll-title">
          <div class="wallpaper-section__header">
            <h2 id="wallpaper-roll-title">{{ t('wallpaper.form.rollTitle') }}</h2>
            <p>{{ t('wallpaper.form.rollHint') }}</p>
          </div>

          <div class="wallpaper-field">
            <label for="wallpaper-roll-preset">{{ t('wallpaper.form.rollPreset') }}</label>
            <select id="wallpaper-roll-preset" :value="selectedPreset" @change="selectRollPreset">
              <option v-for="preset in rollPresets" :key="preset.id" :value="preset.id">
                {{ t(`wallpaper.rollPreset.${preset.id}`) }}
              </option>
              <option v-if="selectedPreset === 'custom'" value="custom">
                {{ t('wallpaper.rollPreset.custom') }}
              </option>
            </select>
          </div>

          <div class="wallpaper-grid wallpaper-grid--two">
            <NumberField
              field="rollWidth"
              :label="t('wallpaper.form.rollWidth')"
              suffix="м"
              :step="0.01"
              @changed="markCustomRoll"
            />
            <div class="wallpaper-roll-length">
              <NumberField
                field="rollLength"
                :label="t('wallpaper.form.rollLength')"
                suffix="м"
                :step="0.01"
                @changed="markCustomRoll"
              />
              <div class="wallpaper-preset-row" role="group" :aria-label="t('wallpaper.form.rollLengthPreset')">
                <button
                  v-for="length in rollLengthPresets"
                  :key="length"
                  type="button"
                  class="wallpaper-chip wallpaper-chip--small"
                  @click="setRollLength(length)"
                >
                  {{ n(length, { maximumFractionDigits: 2 }) }} м
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="wallpaper-section" aria-labelledby="wallpaper-options-title">
          <h2 id="wallpaper-options-title">{{ t('wallpaper.form.optionsTitle') }}</h2>
          <div class="wallpaper-grid wallpaper-grid--two">
            <NumberField
              field="wastePercent"
              :label="t('wallpaper.form.wastePercent')"
              suffix="%"
              :step="1"
            />
            <NumberField
              field="rollPrice"
              :label="t('wallpaper.form.rollPrice')"
              suffix="₽"
              :step="1"
            />
          </div>

          <div class="wallpaper-section__header wallpaper-section__header--tight">
            <h3>{{ t('wallpaper.form.patternTitle') }}</h3>
            <p>{{ t('wallpaper.form.patternHint') }}</p>
          </div>

          <div class="wallpaper-field">
            <label for="wallpaper-pattern-preset">{{ t('wallpaper.form.patternPreset') }}</label>
            <select id="wallpaper-pattern-preset" v-model="patternRepeatValue">
              <option v-for="repeat in patternRepeatPresets" :key="repeat" :value="String(repeat)">
                {{ repeat === 0 ? t('wallpaper.pattern.none') : t('wallpaper.pattern.cm', { value: cm(repeat) }) }}
              </option>
            </select>
          </div>

          <label class="wallpaper-toggle">
            <input v-model="input.usePatternRepeat" type="checkbox" />
            <span class="wallpaper-toggle__control" aria-hidden="true"></span>
            <span class="wallpaper-toggle__text">{{ t('wallpaper.form.usePatternRepeat') }}</span>
          </label>

          <NumberField
            v-if="input.usePatternRepeat"
            field="patternRepeat"
            :label="t('wallpaper.form.patternRepeat')"
            suffix="м"
            :step="0.01"
          />
        </section>
      </form>

      <section class="wallpaper-result" aria-live="polite">
        <p class="wallpaper-result__label">{{ t('wallpaper.result.label') }}</p>

        <template v-if="result">
          <div class="wallpaper-result__hero">
            <span>{{ t('wallpaper.result.recommendedRolls') }}</span>
            <strong>{{ t('wallpaper.result.rollsValue', { count: result.recommendedRolls }) }}</strong>
            <p>{{ t(`wallpaper.result.basis.${result.calculationBasis}`) }}</p>
          </div>

          <div v-if="result.openingsExceedWalls" class="wallpaper-warning">
            {{ t('wallpaper.result.openingsWarning') }}
          </div>

          <dl class="wallpaper-breakdown">
            <div>
              <dt>{{ t('wallpaper.result.grossWallArea') }}</dt>
              <dd>{{ area(result.grossWallArea) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.openingsArea') }}</dt>
              <dd>{{ area(result.openingsArea) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.netWallArea') }}</dt>
              <dd>{{ area(result.netWallArea) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.areaWithWaste') }}</dt>
              <dd>{{ area(result.areaWithWaste) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.rollArea') }}</dt>
              <dd>{{ area(result.rollArea) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.stripsNeeded') }}</dt>
              <dd>{{ n(result.stripsNeeded, { maximumFractionDigits: 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.stripsPerRoll') }}</dt>
              <dd>{{ n(result.stripsPerRoll, { maximumFractionDigits: 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.rollsByArea') }}</dt>
              <dd>{{ n(result.rollsByArea, { maximumFractionDigits: 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('wallpaper.result.rollsByStrips') }}</dt>
              <dd>{{ n(result.rollsByStrips, { maximumFractionDigits: 0 }) }}</dd>
            </div>
            <div v-if="input.usePatternRepeat">
              <dt>{{ t('wallpaper.result.adjustedStripHeight') }}</dt>
              <dd>{{ meters(result.adjustedStripHeight) }}</dd>
            </div>
            <div v-if="result.totalCost !== null">
              <dt>{{ t('wallpaper.result.totalCost') }}</dt>
              <dd>{{ money(result.totalCost) }}</dd>
            </div>
          </dl>

          <div class="wallpaper-formula">
            <p>{{ t('wallpaper.formula.area') }}</p>
            <p>{{ t('wallpaper.formula.strips') }}</p>
          </div>
        </template>

        <p v-else class="wallpaper-result__empty">
          {{ t('wallpaper.result.empty') }}
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWallpaperCalculator } from '../composables/useWallpaperCalculator'
import type { WallpaperNumericField } from '../types/wallpaper'

const { t, n, locale } = useI18n()
const {
  input,
  selectedPreset,
  rollPresets,
  rollLengthPresets,
  patternRepeatPresets,
  result,
  touch,
  getIssue,
  setRollPreset,
  markCustomRoll,
  setRollLength,
  setPatternRepeat,
} = useWallpaperCalculator()

const NumberField = defineComponent({
  props: {
    field: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, default: '' },
    step: { type: Number, default: 0.01 },
  },
  emits: ['changed'],
  setup(props, { emit }) {
    return () => {
      const field = props.field as WallpaperNumericField
      const issue = getIssue(field)

      return h('div', { class: 'wallpaper-field' }, [
        h('label', { for: `wallpaper-${field}` }, props.label),
        h('div', { class: ['wallpaper-input-wrap', { 'wallpaper-input-wrap--error': Boolean(issue) }] }, [
          h('input', {
            id: `wallpaper-${field}`,
            type: 'number',
            min: '0',
            step: props.step,
            inputmode: 'decimal',
            value: input.value[field],
            onInput: (event: Event) => {
              const target = event.target as HTMLInputElement
              input.value[field] = target.value === '' ? Number.NaN : Number(target.value)
              emit('changed')
            },
            onBlur: () => touch(field),
          }),
          props.suffix ? h('span', props.suffix) : null,
        ]),
        issue ? h('p', { class: 'wallpaper-error' }, t(issue.messageKey)) : null,
      ])
    }
  },
})

const patternRepeatValue = computed({
  get: () => (input.value.usePatternRepeat ? String(input.value.patternRepeat) : '0'),
  set: (value: string) => setPatternRepeat(Number(value)),
})

function selectRollPreset(event: Event) {
  const target = event.target as HTMLSelectElement
  const preset = rollPresets.find(item => item.id === target.value)
  if (preset) setRollPreset(preset)
}

function money(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function area(value: number): string {
  return t('wallpaper.units.squareMetersValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function meters(value: number): string {
  return t('wallpaper.units.metersValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function cm(value: number): string {
  return n(value * 100, { maximumFractionDigits: 0 })
}

</script>

<style scoped>
.wallpaper-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.wallpaper-heading {
  max-width: 760px;
}

.wallpaper-eyebrow,
.wallpaper-result__label {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.wallpaper-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3rem;
  line-height: 1.05;
  font-weight: 850;
}

.wallpaper-heading p:not(.wallpaper-eyebrow) {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.wallpaper-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 20px;
  align-items: start;
}

.wallpaper-form,
.wallpaper-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.wallpaper-form {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.wallpaper-result {
  position: sticky;
  top: 88px;
  padding: 24px;
}

.wallpaper-note {
  border: 1px solid #fde68a;
  border-radius: 8px;
  background: #fffbeb;
  color: #92400e;
  padding: 1rem;
  line-height: 1.5;
}

.wallpaper-section {
  display: grid;
  gap: 14px;
}

.wallpaper-section h2,
.wallpaper-section h3 {
  margin: 0;
  color: #111827;
  line-height: 1.2;
}

.wallpaper-section h2 {
  font-size: 1.15rem;
}

.wallpaper-section h3 {
  font-size: 1rem;
}

.wallpaper-section__header {
  display: grid;
  gap: 0.35rem;
}

.wallpaper-section__header--tight {
  margin-top: 0.25rem;
}

.wallpaper-section__header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.45;
}

.wallpaper-grid {
  display: grid;
  gap: 14px;
  align-items: start;
}

.wallpaper-grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wallpaper-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

:deep(.wallpaper-field) {
  display: grid;
  gap: 6px;
  min-width: 0;
}

:deep(.wallpaper-field label) {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

:deep(.wallpaper-field select),
:deep(.wallpaper-input-wrap) {
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s, background 0.15s;
}

:deep(.wallpaper-field select) {
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

:deep(.wallpaper-input-wrap) {
  display: flex;
  align-items: center;
  min-height: 44px;
  overflow: hidden;
}

:deep(.wallpaper-field select:focus),
:deep(.wallpaper-input-wrap:focus-within) {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

:deep(.wallpaper-input-wrap--error) {
  border-color: #ef4444;
}

:deep(.wallpaper-input-wrap input) {
  min-width: 0;
  flex: 1;
  border: 0;
  background: transparent;
  color: #111827;
  font-size: 15px;
  padding: 10px 12px;
  outline: 0;
}

:deep(.wallpaper-input-wrap span) {
  flex: 0 0 auto;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  padding: 0 12px;
}

:deep(.wallpaper-error) {
  margin: 0;
  color: #ef4444;
  font-size: 12px;
}

.wallpaper-openings {
  display: grid;
  gap: 12px;
}

.wallpaper-opening-card {
  display: grid;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  padding: 12px;
}

.wallpaper-opening-card h3 {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 800;
}

.wallpaper-preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wallpaper-roll-length {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.wallpaper-chip {
  min-height: 36px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 7px 10px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.wallpaper-chip:hover,
.wallpaper-chip--active {
  border-color: #0d9488;
  background: #fff;
  color: #0f766e;
}

.wallpaper-chip--small {
  min-height: 2.2rem;
  padding: 0.4rem 0.7rem;
}

.wallpaper-toggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
}

.wallpaper-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.wallpaper-toggle__control {
  position: relative;
  flex: 0 0 auto;
  transition: background 0.16s, border-color 0.16s;
}

.wallpaper-toggle__control::after {
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 999px;
  content: "";
  transition: transform 0.16s;
}

.wallpaper-toggle input:checked + .wallpaper-toggle__control::after {
  transform: translateX(18px);
}

.wallpaper-toggle input:focus-visible + .wallpaper-toggle__control {
  outline: 3px solid rgba(13, 148, 136, 0.18);
  outline-offset: 2px;
}

.wallpaper-result__hero {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.wallpaper-result__hero span,
.wallpaper-result__hero p {
  margin: 0;
  color: #64748b;
}

.wallpaper-result__hero strong {
  color: #111827;
  font-size: 2.55rem;
  line-height: 1.05;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.wallpaper-warning {
  border: 1px solid #fde68a;
  border-radius: 8px;
  background: #fffbeb;
  color: #92400e;
  margin-bottom: 1rem;
  padding: 0.9rem;
  line-height: 1.45;
}

.wallpaper-breakdown {
  display: grid;
  gap: 0;
  margin: 0;
}

.wallpaper-breakdown div {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  border-bottom: 1px solid #e5edf4;
  padding: 0.75rem 0;
}

.wallpaper-breakdown dt {
  color: #64748b;
}

.wallpaper-breakdown dd {
  margin: 0;
  color: #111827;
  font-weight: 800;
  text-align: right;
}

.wallpaper-formula {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.25rem;
  border-radius: 8px;
  background: #eef8f6;
  color: #31544f;
  padding: 12px;
  line-height: 1.45;
}

.wallpaper-formula p,
.wallpaper-result__empty {
  margin: 0;
}

.wallpaper-result__empty {
  color: #64748b;
  line-height: 1.5;
}

@media (max-width: 960px) {
  .wallpaper-workspace {
    grid-template-columns: 1fr;
  }

  .wallpaper-result {
    position: static;
  }
}

@media (max-width: 640px) {
  .wallpaper-heading h1 {
    font-size: 2.25rem;
  }

  .wallpaper-form,
  .wallpaper-result {
    padding: 1rem;
  }

  .wallpaper-grid--three,
  .wallpaper-grid--two {
    grid-template-columns: 1fr !important;
  }

  .wallpaper-breakdown div {
    align-items: flex-start;
  }
}
</style>
