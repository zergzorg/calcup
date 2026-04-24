<template>
  <main class="percentage-page" aria-labelledby="percentage-title">
    <section class="percentage-heading">
      <p class="percentage-eyebrow">{{ t('percentage.eyebrow') }}</p>
      <h1 id="percentage-title">{{ t('percentage.title') }}</h1>
      <p>{{ t('percentage.intro') }}</p>
    </section>

    <div class="percentage-mode-list" role="tablist" :aria-label="t('percentage.modes.label')">
      <button
        v-for="option in modeOptions"
        :key="option"
        type="button"
        class="percentage-mode-button"
        :class="{ 'percentage-mode-button--active': mode === option }"
        role="tab"
        :aria-selected="mode === option"
        @click="mode = option"
      >
        {{ t(`percentage.modes.${option}`) }}
      </button>
    </div>

    <div class="percentage-workspace">
      <form class="percentage-form" @submit.prevent>
        <template v-if="mode === 'percentOf'">
          <PercentageField
            id="percentage-percent"
            v-model="percent"
            :label="t('percentage.form.percent')"
            suffix="%"
            :issue="getIssue('percent')"
          />
          <PercentageField
            id="percentage-base"
            v-model="base"
            :label="t('percentage.form.base')"
            :issue="getIssue('base')"
          />
        </template>

        <template v-if="mode === 'partOfTotal'">
          <PercentageField
            id="percentage-part"
            v-model="part"
            :label="t('percentage.form.part')"
            :issue="getIssue('part')"
          />
          <PercentageField
            id="percentage-total"
            v-model="total"
            :label="t('percentage.form.total')"
            :issue="getIssue('total')"
          />
        </template>

        <template v-if="mode === 'adjustByPercent'">
          <div class="percentage-direction" role="group" :aria-label="t('percentage.form.direction')">
            <button
              type="button"
              :class="{ 'percentage-direction__button--active': adjustmentDirection === 'increase' }"
              class="percentage-direction__button"
              @click="adjustmentDirection = 'increase'"
            >
              {{ t('percentage.form.increase') }}
            </button>
            <button
              type="button"
              :class="{ 'percentage-direction__button--active': adjustmentDirection === 'decrease' }"
              class="percentage-direction__button"
              @click="adjustmentDirection = 'decrease'"
            >
              {{ t('percentage.form.decrease') }}
            </button>
          </div>
          <PercentageField
            id="percentage-adjust-base"
            v-model="base"
            :label="t('percentage.form.base')"
            :issue="getIssue('base')"
          />
          <PercentageField
            id="percentage-adjust-percent"
            v-model="percent"
            :label="t('percentage.form.percent')"
            suffix="%"
            :issue="getIssue('percent')"
          />
        </template>

        <template v-if="mode === 'percentageChange'">
          <PercentageField
            id="percentage-old"
            v-model="oldValue"
            :label="t('percentage.form.oldValue')"
            :issue="getIssue('oldValue')"
          />
          <PercentageField
            id="percentage-new"
            v-model="newValue"
            :label="t('percentage.form.newValue')"
            :issue="getIssue('newValue')"
          />
        </template>
      </form>

      <section class="percentage-result" aria-live="polite">
        <p class="percentage-result__label">{{ t('percentage.result.label') }}</p>

        <template v-if="result">
          <div class="percentage-result__value">
            {{ formatResult(result.value) }}<span v-if="result.unit === 'percent'">%</span>
          </div>
          <p>{{ t(`percentage.result.${mode}`, resultTextParams) }}</p>
        </template>

        <p v-else class="percentage-result__empty">{{ t('percentage.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePercentageCalculator } from '../composables/usePercentageCalculator'
import type { PercentageMode, PercentageValidationIssue } from '../types/percentage'

const PercentageField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, default: '' },
    issue: { type: Object as () => PercentageValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'percentage-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'percentage-input-wrap' }, [
        h('input', {
          id: props.id,
          value: props.modelValue,
          type: 'number',
          inputmode: 'decimal',
          step: 'any',
          'aria-invalid': Boolean(props.issue),
          'aria-describedby': errorId,
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value
            emit('update:modelValue', value === '' ? Number.NaN : Number(value))
          },
        }),
        props.suffix ? h('span', props.suffix) : null,
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'percentage-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const modeOptions: PercentageMode[] = ['percentOf', 'partOfTotal', 'adjustByPercent', 'percentageChange']

const {
  mode,
  adjustmentDirection,
  percent,
  base,
  part,
  total,
  oldValue,
  newValue,
  result,
  getIssue,
} = usePercentageCalculator()

const resultTextParams = computed(() => ({
  percent: formatResult(percent.value),
  base: formatResult(base.value),
  part: formatResult(part.value),
  total: formatResult(total.value),
  oldValue: formatResult(oldValue.value),
  newValue: formatResult(newValue.value),
  direction: t(`percentage.form.${adjustmentDirection.value}`),
}))

function formatResult(value: number): string {
  return n(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })
}
</script>

<style scoped>
.percentage-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.percentage-heading {
  max-width: 760px;
}

.percentage-eyebrow {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.percentage-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.percentage-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.percentage-mode-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 6px;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  background: #f8fafc;
}

.percentage-mode-button {
  min-height: 54px;
  border: 0;
  border-radius: 6px;
  padding: 10px 12px;
  color: #526174;
  background: transparent;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.15;
  cursor: pointer;
}

.percentage-mode-button:hover,
.percentage-mode-button--active {
  color: #1d4ed8;
  background: #fff;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.14);
}

.percentage-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 20px;
  align-items: stretch;
}

.percentage-form,
.percentage-result {
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  background: #fbfdff;
}

.percentage-form {
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 24px;
}

.percentage-field {
  display: grid;
  gap: 8px;
}

.percentage-field :deep(label) {
  color: #27364a;
  font-weight: 750;
}

.percentage-field :deep(.percentage-input-wrap) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  overflow: hidden;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
}

.percentage-field :deep(.percentage-input-wrap:focus-within) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.percentage-field :deep(.percentage-input-wrap input) {
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 14px;
  color: #111827;
  background: transparent;
  font: inherit;
  outline: 0;
}

.percentage-field :deep(.percentage-input-wrap span) {
  padding: 0 14px;
  color: #64748b;
  font-weight: 800;
}

.percentage-field :deep(.percentage-input-wrap input[aria-invalid="true"]) {
  color: #991b1b;
}

.percentage-field :deep(.percentage-error) {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.percentage-direction {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.percentage-direction__button {
  min-height: 44px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  color: #526174;
  background: #fff;
  font: inherit;
  font-weight: 750;
  cursor: pointer;
}

.percentage-direction__button--active {
  border-color: #2563eb;
  color: #1d4ed8;
  background: #eff6ff;
}

.percentage-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 270px;
  padding: 24px;
}

.percentage-result__label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.percentage-result__value {
  color: #2563eb;
  font-size: 4rem;
  line-height: 1;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.percentage-result__value span {
  font-size: 2.2rem;
}

.percentage-result p {
  margin: 14px 0 0;
  color: #526174;
}

.percentage-result__empty {
  margin-top: 8px;
}

@media (max-width: 900px) {
  .percentage-mode-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .percentage-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .percentage-page {
    gap: 20px;
  }

  .percentage-heading h1 {
    font-size: 2.15rem;
  }

  .percentage-heading p:last-child {
    font-size: 1rem;
  }

  .percentage-mode-list {
    grid-template-columns: 1fr;
  }

  .percentage-form,
  .percentage-result {
    padding: 18px;
  }

  .percentage-result {
    min-height: 220px;
  }

  .percentage-result__value {
    font-size: 3.15rem;
  }
}
</style>
