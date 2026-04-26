<template>
  <main class="metronome-page" aria-labelledby="metronome-title">
    <section class="metronome-heading">
      <p class="metronome-eyebrow">{{ t('metronome.eyebrow') }}</p>
      <h1 id="metronome-title">{{ t('metronome.title') }}</h1>
      <p>{{ t('metronome.intro') }}</p>
    </section>

    <div class="metronome-workspace">
      <form class="metronome-form" @submit.prevent>
        <section class="metronome-section">
          <div class="metronome-section__header">
            <h2>{{ t('metronome.form.rhythmTitle') }}</h2>
            <p>{{ t('metronome.form.rhythmHint') }}</p>
          </div>

          <div class="metronome-grid metronome-grid--three">
            <NumberField field="bpm" :label="t('metronome.form.bpm')" :suffix="t('metronome.units.bpm')" :min="30" :max="260" />
            <NumberField field="beatsPerBar" :label="t('metronome.form.beatsPerBar')" :suffix="t('metronome.units.beats')" :min="1" :max="12" />
            <NumberField field="durationMinutes" :label="t('metronome.form.duration')" :suffix="t('metronome.units.minutes')" :min="1" :max="180" />
          </div>
        </section>

        <section class="metronome-section">
          <div class="metronome-field">
            <span class="metronome-field__label">{{ t('metronome.form.cadenceMode') }}</span>
            <div class="metronome-chip-list" role="radiogroup" :aria-label="t('metronome.form.cadenceMode')">
              <button
                v-for="mode in cadenceModes"
                :key="mode"
                type="button"
                class="metronome-chip"
                :class="{ 'metronome-chip--active': input.cadenceMode === mode }"
                role="radio"
                :aria-checked="input.cadenceMode === mode"
                @click="input.cadenceMode = mode"
              >
                {{ t(`metronome.cadenceModes.${mode}`) }}
              </button>
            </div>
          </div>
        </section>

        <section class="metronome-section">
          <button
            type="button"
            class="metronome-chip"
            :class="{ 'metronome-chip--active': isPlaying }"
            :disabled="!result"
            @click="togglePlayback"
          >
            {{ isPlaying ? t('metronome.form.stop') : t('metronome.form.start') }}
          </button>
          <p class="metronome-note">{{ t('metronome.form.audioHint') }}</p>
        </section>
      </form>

      <section class="metronome-result" aria-live="polite">
        <p class="metronome-result__label">{{ t('metronome.result.label') }}</p>

        <template v-if="result">
          <div class="metronome-result__total">
            <span>{{ t('metronome.result.interval') }}</span>
            <strong>{{ t('metronome.result.msValue', { value: result.intervalMs }) }}</strong>
          </div>

          <div class="metronome-result__rows">
            <div class="metronome-result__row">
              <span>{{ t('metronome.result.bpm') }}</span>
              <strong>{{ t('metronome.result.bpmValue', { value: result.bpm }) }}</strong>
            </div>
            <div class="metronome-result__row">
              <span>{{ t('metronome.result.cadence') }}</span>
              <strong>{{ t('metronome.result.spmValue', { value: result.targetCadenceSpm }) }}</strong>
            </div>
            <div class="metronome-result__row">
              <span>{{ t('metronome.result.beatInterval') }}</span>
              <strong>{{ t('metronome.result.secondsValue', { value: format(result.beatIntervalSeconds, 3) }) }}</strong>
            </div>
            <div class="metronome-result__row">
              <span>{{ t('metronome.result.barLength') }}</span>
              <strong>{{ t('metronome.result.secondsValue', { value: format(result.barSeconds, 2) }) }}</strong>
            </div>
            <div class="metronome-result__row">
              <span>{{ t('metronome.result.totalBeats') }}</span>
              <strong>{{ result.totalBeats }}</strong>
            </div>
          </div>

          <p class="metronome-formula">{{ t('metronome.formula') }}</p>
        </template>

        <p v-else class="metronome-result__empty">{{ t('metronome.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMetronomeCalculator } from '../composables/useMetronomeCalculator'
import type { MetronomeInputField } from '../types/metronome'

const { t, n } = useI18n()
const { input, cadenceModes, result, isPlaying, getIssue, togglePlayback } = useMetronomeCalculator()

const NumberField = defineComponent<{ field: MetronomeInputField; label: string; suffix: string; min: number; max: number }>({
  props: ['field', 'label', 'suffix', 'min', 'max'],
  setup(props) {
    return () => h('div', { class: 'metronome-field' }, [
      h('label', { for: `metronome-${props.field}` }, props.label),
      h('div', { class: 'metronome-input-wrap' }, [
        h('input', {
          id: `metronome-${props.field}`,
          value: input[props.field],
          type: 'number',
          min: props.min,
          max: props.max,
          step: 1,
          inputmode: 'numeric',
          'aria-invalid': Boolean(getIssue(props.field)),
          'aria-describedby': `metronome-${props.field}-error`,
          onInput: (event: Event) => {
            input[props.field] = Number((event.target as HTMLInputElement).value)
          },
        }),
        h('span', { class: 'metronome-unit' }, props.suffix),
      ]),
      getIssue(props.field)
        ? h('p', { id: `metronome-${props.field}-error`, class: 'metronome-error' }, t(getIssue(props.field)!.messageKey))
        : null,
    ])
  },
})

function format(value: number, maximumFractionDigits: number): string {
  return n(value, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })
}
</script>
