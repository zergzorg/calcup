<template>
  <main class="proportion-page" aria-labelledby="proportion-title">
    <section class="proportion-heading">
      <p class="proportion-eyebrow">{{ t('proportion.eyebrow') }}</p>
      <h1 id="proportion-title">{{ t('proportion.title') }}</h1>
      <p>{{ t('proportion.intro') }}</p>
    </section>

    <div class="proportion-workspace">
      <form class="proportion-form" @submit.prevent>
        <section class="proportion-section">
          <div class="proportion-section__header">
            <h2>{{ t('proportion.form.knownTitle') }}</h2>
            <p>{{ t('proportion.form.knownHelp') }}</p>
          </div>
          <div class="proportion-grid--two">
            <ProportionField
              id="proportion-known-left"
              v-model="knownLeft"
              :label="t('proportion.form.knownLeft')"
              :issue="getIssue('knownLeft')"
            />
            <ProportionField
              id="proportion-known-right"
              v-model="knownRight"
              :label="t('proportion.form.knownRight')"
              :issue="getIssue('knownRight')"
            />
          </div>
        </section>

        <section class="proportion-section">
          <div class="proportion-section__header">
            <h2>{{ t('proportion.form.targetTitle') }}</h2>
            <p>{{ t('proportion.form.targetHelp') }}</p>
          </div>
          <ProportionField
            id="proportion-target-left"
            v-model="targetLeft"
            :label="t('proportion.form.targetLeft')"
            :issue="getIssue('targetLeft')"
          />
        </section>
      </form>

      <section class="proportion-result" aria-live="polite">
        <p class="proportion-result__label">{{ t('proportion.result.label') }}</p>

        <template v-if="result">
          <div class="proportion-result__total">
            <span>{{ t('proportion.result.targetRight') }}</span>
            <strong>{{ formatNumber(result.targetRight) }}</strong>
          </div>

          <div class="proportion-result__rows">
            <div class="proportion-result__row">
              <span>{{ t('proportion.result.expression') }}</span>
              <strong>{{ expressionText }}</strong>
            </div>
            <div class="proportion-result__row">
              <span>{{ t('proportion.result.coefficient') }}</span>
              <strong>{{ formatNumber(result.coefficient) }}</strong>
            </div>
            <div class="proportion-result__row">
              <span>{{ t('proportion.result.ratio') }}</span>
              <strong>{{ formatNumber(result.ratio.left) }}:{{ formatNumber(result.ratio.right) }}</strong>
            </div>
            <div class="proportion-result__row">
              <span>{{ t('proportion.result.percent') }}</span>
              <strong>{{ formatNumber(result.targetPercentOfKnown) }}%</strong>
            </div>
          </div>

          <p class="proportion-formula">{{ t('proportion.formula') }}</p>
        </template>

        <p v-else class="proportion-result__empty">{{ t('proportion.result.empty') }}</p>
      </section>
    </div>

    <section class="proportion-popular" aria-labelledby="proportion-popular-title">
      <h2 id="proportion-popular-title">{{ t('proportion.examples.title') }}</h2>
      <ul>
        <li v-for="item in examples" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { calculateProportion } from '../lib/calculations'
import { useProportionCalculator } from '../composables/useProportionCalculator'
import type { ProportionValidationIssue } from '../types/proportion'

const ProportionField = defineComponent({
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    issue: { type: Object as () => ProportionValidationIssue | undefined, default: undefined },
    modelValue: { type: Number, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const errorId = `${props.id}-error`

    return () => h('div', { class: 'proportion-field' }, [
      h('label', { for: props.id }, props.label),
      h('div', { class: 'proportion-input-wrap' }, [
        h('input', {
          id: props.id,
          value: Number.isNaN(props.modelValue) ? '' : props.modelValue,
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
      ]),
      props.issue
        ? h('p', { id: errorId, class: 'proportion-error' }, t(props.issue.messageKey))
        : null,
    ])
  },
})

const { t, n } = useI18n()
const { knownLeft, knownRight, targetLeft, result, getIssue } = useProportionCalculator()

const expressionText = computed(() =>
  `${formatNumber(knownLeft.value)} : ${formatNumber(knownRight.value)} = ${formatNumber(targetLeft.value)} : x`,
)

const examples = computed(() => {
  const items: Array<[number, number, number]> = [
    [5, 20, 8],
    [100, 15, 250],
    [3, 4, 12],
  ]

  return items
    .map(([knownA, knownB, targetA]) => {
      const exampleResult = calculateProportion(knownA, knownB, targetA)
      if (!exampleResult) return ''

      return t('proportion.examples.item', {
        knownA: formatNumber(knownA),
        knownB: formatNumber(knownB),
        targetA: formatNumber(targetA),
        targetB: formatNumber(exampleResult.targetRight),
      })
    })
    .filter(Boolean)
})

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  })
}
</script>
