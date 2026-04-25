<template>
  <main class="pace-page" aria-labelledby="pace-title">
    <section class="pace-heading">
      <p class="pace-eyebrow">{{ t('paceSpeed.eyebrow') }}</p>
      <h1 id="pace-title">{{ t('paceSpeed.title') }}</h1>
      <p>{{ t('paceSpeed.intro') }}</p>
    </section>

    <div class="pace-workspace">
      <form class="pace-form" @submit.prevent>
        <section class="pace-section">
          <div class="pace-section__header">
            <h2>{{ t('paceSpeed.modes.label') }}</h2>
          </div>
          <div class="pace-chip-list" role="radiogroup" :aria-label="t('paceSpeed.modes.label')">
            <button
              v-for="item in modes"
              :key="item"
              type="button"
              class="pace-chip"
              :class="{ 'pace-chip--active': mode === item }"
              role="radio"
              :aria-checked="mode === item"
              @click="mode = item"
            >
              {{ t(`paceSpeed.modes.${item}`) }}
            </button>
          </div>
        </section>

        <section v-if="mode === 'paceToSpeed'" class="pace-section">
          <div class="pace-section__header">
            <h2>{{ t('paceSpeed.form.paceTitle') }}</h2>
            <p>{{ t('paceSpeed.form.paceHint') }}</p>
          </div>

          <div class="pace-grid pace-grid--two">
            <div class="pace-field">
              <label for="pace-minutes">{{ t('paceSpeed.form.minutes') }}</label>
              <div class="pace-input-wrap">
                <input
                  id="pace-minutes"
                  v-model.number="paceMinutes"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getIssue('paceMinutes'))"
                  aria-describedby="pace-minutes-error"
                  @blur="touch('paceMinutes')"
                >
                <span class="pace-unit">{{ t('paceSpeed.units.min') }}</span>
              </div>
              <p v-if="getIssue('paceMinutes')" id="pace-minutes-error" class="pace-error">
                {{ t(getIssue('paceMinutes')!.messageKey) }}
              </p>
            </div>

            <div class="pace-field">
              <label for="pace-seconds">{{ t('paceSpeed.form.seconds') }}</label>
              <div class="pace-input-wrap">
                <input
                  id="pace-seconds"
                  v-model.number="paceSeconds"
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getIssue('paceSeconds'))"
                  aria-describedby="pace-seconds-error"
                  @blur="touch('paceSeconds')"
                >
                <span class="pace-unit">{{ t('paceSpeed.units.sec') }}</span>
              </div>
              <p v-if="getIssue('paceSeconds')" id="pace-seconds-error" class="pace-error">
                {{ t(getIssue('paceSeconds')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <section v-else class="pace-section">
          <div class="pace-section__header">
            <h2>{{ t('paceSpeed.form.speedTitle') }}</h2>
            <p>{{ t('paceSpeed.form.speedHint') }}</p>
          </div>

          <div class="pace-field">
            <label for="pace-speed">{{ t('paceSpeed.form.speed') }}</label>
            <div class="pace-input-wrap">
              <input
                id="pace-speed"
                v-model.number="speedKmH"
                type="number"
                min="0.01"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('speed'))"
                aria-describedby="pace-speed-error"
                @blur="touch('speed')"
              >
              <span class="pace-unit">{{ t('paceSpeed.units.kmh') }}</span>
            </div>
            <p v-if="getIssue('speed')" id="pace-speed-error" class="pace-error">
              {{ t(getIssue('speed')!.messageKey) }}
            </p>
          </div>
        </section>
      </form>

      <section class="pace-result" aria-live="polite">
        <p class="pace-result__label">{{ t('paceSpeed.result.label') }}</p>

        <template v-if="result">
          <div class="pace-result__total">
            <span>{{ mode === 'paceToSpeed' ? t('paceSpeed.result.speed') : t('paceSpeed.result.pace') }}</span>
            <strong>
              {{ mode === 'paceToSpeed'
                ? t('paceSpeed.result.speedValue', { value: formatNumber(result.speedKmH) })
                : formatPace(result.paceMinPerKm, t('paceSpeed.units.minPerKm')) }}
            </strong>
          </div>

          <div class="pace-result__rows">
            <div class="pace-result__row">
              <span>{{ t('paceSpeed.result.kmh') }}</span>
              <strong>{{ t('paceSpeed.result.speedValue', { value: formatNumber(result.speedKmH) }) }}</strong>
            </div>
            <div class="pace-result__row">
              <span>{{ t('paceSpeed.result.mph') }}</span>
              <strong>{{ t('paceSpeed.result.mphValue', { value: formatNumber(result.speedMph) }) }}</strong>
            </div>
            <div class="pace-result__row">
              <span>{{ t('paceSpeed.result.minPerKm') }}</span>
              <strong>{{ formatPace(result.paceMinPerKm, t('paceSpeed.units.minPerKm')) }}</strong>
            </div>
            <div class="pace-result__row">
              <span>{{ t('paceSpeed.result.minPerMile') }}</span>
              <strong>{{ formatPace(result.paceMinPerMile, t('paceSpeed.units.minPerMile')) }}</strong>
            </div>
          </div>

          <p class="pace-formula">
            {{ mode === 'paceToSpeed' ? t('paceSpeed.formula.paceToSpeed') : t('paceSpeed.formula.speedToPace') }}
          </p>
        </template>

        <p v-else class="pace-result__empty">{{ t('paceSpeed.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePaceSpeedCalculator } from '../composables/usePaceSpeedCalculator'
import type { PaceParts, PaceSpeedMode } from '../types/pace-speed'

const { t, n } = useI18n()
const modes: PaceSpeedMode[] = ['paceToSpeed', 'speedToPace']

const {
  mode,
  paceMinutes,
  paceSeconds,
  speedKmH,
  getIssue,
  touch,
  result,
} = usePaceSpeedCalculator()

function formatNumber(value: number): string {
  return n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 })
}

function formatPace(parts: PaceParts, unit: string): string {
  return t('paceSpeed.result.paceValue', {
    minutes: parts.minutes,
    seconds: String(parts.seconds).padStart(2, '0'),
    unit,
  })
}
</script>
