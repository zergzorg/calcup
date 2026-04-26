<template>
  <main class="time-duration-page" aria-labelledby="time-duration-title">
    <section class="time-duration-heading">
      <p class="time-duration-eyebrow">{{ t('timeDuration.eyebrow') }}</p>
      <h1 id="time-duration-title">{{ t('timeDuration.title') }}</h1>
      <p>{{ t('timeDuration.intro') }}</p>
    </section>

    <div class="time-duration-workspace">
      <form class="time-duration-form" @submit.prevent>
        <section class="time-duration-section">
          <div class="time-duration-section__header">
            <h2>{{ t('timeDuration.form.firstTitle') }}</h2>
          </div>
          <div class="time-duration-grid time-duration-grid--three">
            <NumberField field="firstHours" :label="t('timeDuration.form.hours')" :suffix="t('timeDuration.units.h')" />
            <NumberField field="firstMinutes" :label="t('timeDuration.form.minutes')" :suffix="t('timeDuration.units.min')" />
            <NumberField field="firstSeconds" :label="t('timeDuration.form.seconds')" :suffix="t('timeDuration.units.sec')" />
          </div>
        </section>

        <section class="time-duration-section">
          <div class="time-duration-chip-list" role="group" :aria-label="t('timeDuration.form.operation')">
            <button
              v-for="operation in operations"
              :key="operation"
              type="button"
              class="time-duration-chip"
              :class="{ 'time-duration-chip--active': input.operation === operation }"
              :aria-pressed="input.operation === operation"
              @click="setOperation(operation)"
            >
              {{ t(`timeDuration.form.operations.${operation}`) }}
            </button>
          </div>
        </section>

        <section class="time-duration-section">
          <div class="time-duration-section__header">
            <h2>{{ t('timeDuration.form.secondTitle') }}</h2>
          </div>
          <div class="time-duration-grid time-duration-grid--three">
            <NumberField field="secondHours" :label="t('timeDuration.form.hours')" :suffix="t('timeDuration.units.h')" />
            <NumberField field="secondMinutes" :label="t('timeDuration.form.minutes')" :suffix="t('timeDuration.units.min')" />
            <NumberField field="secondSeconds" :label="t('timeDuration.form.seconds')" :suffix="t('timeDuration.units.sec')" />
          </div>
        </section>
      </form>

      <section class="time-duration-result" aria-live="polite">
        <p class="time-duration-result__label">{{ t('timeDuration.result.label') }}</p>

        <template v-if="result">
          <div class="time-duration-result__total">
            <span>{{ t('timeDuration.result.duration') }}</span>
            <strong>{{ result.formatted }}</strong>
          </div>

          <div class="time-duration-result__rows">
            <div class="time-duration-result__row">
              <span>{{ t('timeDuration.result.hours') }}</span>
              <strong>{{ n(result.totalHours, { maximumFractionDigits: 2 }) }}</strong>
            </div>
            <div class="time-duration-result__row">
              <span>{{ t('timeDuration.result.minutes') }}</span>
              <strong>{{ n(result.totalMinutes, { maximumFractionDigits: 2 }) }}</strong>
            </div>
            <div class="time-duration-result__row">
              <span>{{ t('timeDuration.result.seconds') }}</span>
              <strong>{{ n(result.absoluteSeconds, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="time-duration-result__row">
              <span>{{ t('timeDuration.result.sign') }}</span>
              <strong>{{ result.sign < 0 ? t('timeDuration.result.negative') : t('timeDuration.result.positive') }}</strong>
            </div>
          </div>

          <p class="time-duration-formula">{{ t('timeDuration.formula') }}</p>
        </template>

        <p v-else class="time-duration-result__empty">{{ t('timeDuration.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTimeDurationCalculator } from '../composables/useTimeDurationCalculator'
import type { TimeDurationInputField, TimeDurationOperation } from '../types/time-duration'

const { t, n } = useI18n()
const { input, result, touch, getIssue, setOperation } = useTimeDurationCalculator()
const operations: TimeDurationOperation[] = ['add', 'subtract']

const NumberField = defineComponent<{ field: TimeDurationInputField; label: string; suffix: string }>({
  props: ['field', 'label', 'suffix'],
  setup(props) {
    return () => h('div', { class: 'time-duration-field' }, [
      h('label', { for: `time-duration-${props.field}` }, props.label),
      h('div', { class: 'time-duration-input-wrap' }, [
        h('input', {
          id: `time-duration-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: 0,
          step: 1,
          inputmode: 'numeric',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `time-duration-${props.field}-error`,
          onBlur: () => touch(props.field),
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        h('span', { class: 'time-duration-unit' }, props.suffix),
      ]),
      getIssue(props.field)
        ? h('p', { id: `time-duration-${props.field}-error`, class: 'time-duration-error' }, t(getIssue(props.field)!.messageKey))
        : null,
    ])
  },
})
</script>
