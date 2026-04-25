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

          <div class="heart-rate-zone-list">
            <div
              v-for="zone in result.zones"
              :key="zone.key"
              class="heart-rate-zone-card"
              :class="`heart-rate-zone-card--${zone.key}`"
            >
              <h3>{{ t(`heartRateZones.zones.${zone.key}.title`) }}</h3>
              <p>{{ t(`heartRateZones.zones.${zone.key}.description`) }}</p>
              <div class="heart-rate-zone-card__metrics">
                <div>
                  <strong>{{ t('heartRateZones.result.rangePlain', { min: zone.minBpm, max: zone.maxBpm }) }}</strong>
                  <span>{{ t('heartRateZones.result.zoneRange') }}</span>
                </div>
                <div>
                  <strong>{{ zone.targetBpm }}</strong>
                  <span>{{ t('heartRateZones.result.targetPulse') }}</span>
                </div>
              </div>
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

.heart-rate-zone-list {
  display: grid;
  gap: 12px;
  margin: 18px 0 0;
}

.heart-rate-zone-card {
  display: grid;
  gap: 10px;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
}

.heart-rate-zone-card h3,
.heart-rate-zone-card p {
  margin: 0;
}

.heart-rate-zone-card h3 {
  font-size: 1.15rem;
  line-height: 1.2;
  font-weight: 850;
}

.heart-rate-zone-card p {
  color: rgba(255, 255, 255, 0.86);
}

.heart-rate-zone-card__metrics {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  gap: 14px;
}

.heart-rate-zone-card__metrics div {
  display: grid;
  gap: 2px;
}

.heart-rate-zone-card__metrics strong {
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  font-weight: 850;
}

.heart-rate-zone-card__metrics span {
  color: rgba(255, 255, 255, 0.86);
  font-weight: 700;
}

.heart-rate-zone-card--z1 {
  background: #38bdf8;
}

.heart-rate-zone-card--z2 {
  background: #22c55e;
}

.heart-rate-zone-card--z3 {
  background: #facc15;
}

.heart-rate-zone-card--z4 {
  background: #fb923c;
}

.heart-rate-zone-card--z5 {
  background: #ef4444;
}

@media (max-width: 420px) {
  .heart-rate-zone-card__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
