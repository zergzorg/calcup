<template>
  <main class="heart-rate-page" aria-labelledby="heart-rate-title">
    <section class="heart-rate-heading">
      <p class="heart-rate-eyebrow">{{ t('heartRateZones.eyebrow') }}</p>
      <h1 id="heart-rate-title">{{ t('heartRateZones.title') }}</h1>
      <p>{{ t('heartRateZones.intro') }}</p>
    </section>

    <div class="heart-rate-workspace">
      <form class="heart-rate-form" @submit.prevent>
        <section class="heart-rate-section">
          <div class="heart-rate-section__header">
            <h2>{{ t('heartRateZones.form.method') }}</h2>
          </div>
          <div class="heart-rate-chip-list" role="radiogroup" :aria-label="t('heartRateZones.form.method')">
            <button
              v-for="item in methods"
              :key="item"
              type="button"
              class="heart-rate-chip"
              :class="{ 'heart-rate-chip--active': method === item }"
              role="radio"
              :aria-checked="method === item"
              @click="method = item"
            >
              {{ t(`heartRateZones.methods.${item}`) }}
            </button>
          </div>
        </section>

        <section class="heart-rate-section">
          <div class="heart-rate-field">
            <label for="heart-rate-age">{{ t('heartRateZones.form.age') }}</label>
            <div class="heart-rate-input-wrap">
              <input
                id="heart-rate-age"
                v-model.number="age"
                type="number"
                min="10"
                max="100"
                step="1"
                inputmode="numeric"
                :aria-invalid="Boolean(getIssue('age'))"
                aria-describedby="heart-rate-age-error"
              >
              <span>{{ t('heartRateZones.units.years') }}</span>
            </div>
            <p v-if="getIssue('age')" id="heart-rate-age-error" class="heart-rate-error">
              {{ t(getIssue('age')!.messageKey) }}
            </p>
          </div>

          <div class="heart-rate-field">
            <label for="heart-rate-max">{{ t('heartRateZones.form.maxHeartRate') }}</label>
            <div class="heart-rate-input-wrap">
              <input
                id="heart-rate-max"
                v-model.number="maxHeartRate"
                type="number"
                min="80"
                max="240"
                step="1"
                inputmode="numeric"
                :placeholder="t('heartRateZones.form.auto')"
                :aria-invalid="Boolean(getIssue('maxHeartRate'))"
                aria-describedby="heart-rate-max-help heart-rate-max-error"
              >
              <span>{{ t('heartRateZones.units.bpm') }}</span>
            </div>
            <p id="heart-rate-max-help" class="heart-rate-help">{{ t('heartRateZones.form.maxHint') }}</p>
            <p v-if="getIssue('maxHeartRate')" id="heart-rate-max-error" class="heart-rate-error">
              {{ t(getIssue('maxHeartRate')!.messageKey) }}
            </p>
          </div>

          <div v-if="method === 'reserve'" class="heart-rate-field">
            <label for="heart-rate-resting">{{ t('heartRateZones.form.restingHeartRate') }}</label>
            <div class="heart-rate-input-wrap">
              <input
                id="heart-rate-resting"
                v-model.number="restingHeartRate"
                type="number"
                min="30"
                max="120"
                step="1"
                inputmode="numeric"
                :aria-invalid="Boolean(getIssue('restingHeartRate'))"
                aria-describedby="heart-rate-resting-error"
              >
              <span>{{ t('heartRateZones.units.bpm') }}</span>
            </div>
            <p v-if="getIssue('restingHeartRate')" id="heart-rate-resting-error" class="heart-rate-error">
              {{ t(getIssue('restingHeartRate')!.messageKey) }}
            </p>
          </div>
        </section>
      </form>

      <section class="heart-rate-result" aria-live="polite">
        <p class="heart-rate-result__label">{{ t('heartRateZones.result.label') }}</p>

        <template v-if="result">
          <div class="heart-rate-result__total">
            <span>{{ t('heartRateZones.result.maxHeartRate') }}</span>
            <strong>{{ t('heartRateZones.result.bpmValue', { value: result.maxHeartRate }) }}</strong>
          </div>

          <div class="heart-rate-result__rows">
            <div
              v-for="zone in result.zones"
              :key="zone.key"
              class="heart-rate-result__row"
            >
              <span>{{ t(`heartRateZones.zones.${zone.key}`, { min: zone.minPercent, max: zone.maxPercent }) }}</span>
              <strong>{{ t('heartRateZones.result.rangeValue', { min: zone.minBpm, max: zone.maxBpm }) }}</strong>
            </div>
          </div>

          <p class="heart-rate-formula">{{ t(`heartRateZones.formula.${method}`) }}</p>
        </template>

        <p v-else class="heart-rate-result__empty">{{ t('heartRateZones.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHeartRateZonesCalculator } from '../composables/useHeartRateZonesCalculator'
import type { HeartRateZoneMethod } from '../types/heart-rate-zones'

const { t } = useI18n()
const methods: HeartRateZoneMethod[] = ['max', 'reserve']

const {
  age,
  maxHeartRate,
  restingHeartRate,
  method,
  result,
  getIssue,
} = useHeartRateZonesCalculator()
</script>

<style scoped>
.heart-rate-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.heart-rate-heading {
  max-width: 760px;
}

.heart-rate-section {
  display: grid;
  gap: 16px;
}

.heart-rate-section + .heart-rate-section {
  padding-top: 4px;
}

.heart-rate-section__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
}

.heart-rate-help {
  margin: 0;
  color: #64748b;
}

.heart-rate-result__rows {
  display: grid;
}
</style>
