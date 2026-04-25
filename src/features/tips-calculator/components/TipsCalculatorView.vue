<template>
  <div class="tips-calc max-w-2xl mx-auto px-4 py-8">
    <!-- Header -->
    <p class="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">{{ t('tips.eyebrow') }}</p>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('tips.title') }}</h1>
    <p class="text-gray-500 mb-8">{{ t('tips.intro') }}</p>

    <!-- Form -->
    <div class="tips-card mb-6">
      <p class="tips-card-eyebrow">{{ t('tips.form.label') }}</p>

      <!-- Bill amount -->
      <div class="tips-field">
        <label class="tips-label" for="tips-bill">{{ t('tips.form.billAmount') }}</label>
        <div class="tips-input-wrap" :class="{ 'tips-input-wrap--error': getIssue('billAmount') }">
          <input
            id="tips-bill"
            v-model.number="billAmount"
            type="number"
            min="0"
            step="any"
            class="tips-input"
            @blur="touch('billAmount')"
          />
          <span class="tips-suffix">₽</span>
        </div>
        <p v-if="getIssue('billAmount')" class="tips-error">{{ t(getIssue('billAmount')!.messageKey) }}</p>
      </div>

      <!-- Tip percent presets -->
      <div class="tips-field">
        <span class="tips-label">{{ t('tips.form.tipPercent') }}</span>
        <div class="tips-presets" role="group" :aria-label="t('tips.form.tipPercent')">
          <label
            v-for="rate in PRESET_RATES"
            :key="rate"
            class="tips-preset"
            :class="{ 'tips-preset--active': presetRate === rate }"
          >
            <input
              type="radio"
              name="tipRate"
              :value="rate"
              v-model="presetRate"
              class="tips-radio"
            />
            {{ rate }}%
          </label>
          <label
            class="tips-preset"
            :class="{ 'tips-preset--active': presetRate === 'custom' }"
          >
            <input
              type="radio"
              name="tipRate"
              value="custom"
              v-model="presetRate"
              class="tips-radio"
            />
            {{ t('tips.form.customRate') }}
          </label>
        </div>

        <!-- Custom rate input -->
        <div v-if="presetRate === 'custom'" class="mt-3">
          <div class="tips-input-wrap" :class="{ 'tips-input-wrap--error': getIssue('tipPercent') }">
            <input
              v-model.number="customRate"
              type="number"
              min="0"
              step="any"
              :placeholder="t('tips.form.customRateLabel')"
              class="tips-input"
              @blur="touch('tipPercent')"
            />
            <span class="tips-suffix">%</span>
          </div>
          <p v-if="getIssue('tipPercent')" class="tips-error">{{ t(getIssue('tipPercent')!.messageKey) }}</p>
        </div>
      </div>

      <!-- People count -->
      <div class="tips-field">
        <label class="tips-label" for="tips-people">{{ t('tips.form.peopleCount') }}</label>
        <div class="tips-input-wrap tips-input-wrap--narrow" :class="{ 'tips-input-wrap--error': getIssue('peopleCount') }">
          <input
            id="tips-people"
            v-model.number="peopleCount"
            type="number"
            min="1"
            step="1"
            class="tips-input"
            @blur="touch('peopleCount')"
          />
        </div>
        <p v-if="getIssue('peopleCount')" class="tips-error">{{ t(getIssue('peopleCount')!.messageKey) }}</p>
      </div>
    </div>

    <!-- Result -->
    <div class="tips-card">
      <p class="tips-card-eyebrow">{{ t('tips.result.label') }}</p>

      <template v-if="result">
        <!-- Main totals -->
        <div class="tips-result-grid">
          <div class="tips-result-row">
            <span class="tips-result-label">{{ t('tips.result.tipAmount') }}</span>
            <span class="tips-result-value">{{ n(result.tipAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
          </div>
          <div class="tips-result-row tips-result-row--total">
            <span class="tips-result-label">{{ t('tips.result.totalAmount') }}</span>
            <span class="tips-result-value tips-result-value--teal">{{ n(result.totalAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
          </div>
        </div>

        <!-- Per person (only if >1) -->
        <template v-if="peopleCount > 1">
          <div class="tips-divider" />
          <p class="tips-section-label">{{ t('tips.result.perPersonTitle') }}</p>
          <div class="tips-result-grid">
            <div class="tips-result-row">
              <span class="tips-result-label">{{ t('tips.result.billPerPerson') }}</span>
              <span class="tips-result-value">{{ n(result.billPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
            </div>
            <div class="tips-result-row">
              <span class="tips-result-label">{{ t('tips.result.tipPerPerson') }}</span>
              <span class="tips-result-value">{{ n(result.tipPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
            </div>
            <div class="tips-result-row tips-result-row--total">
              <span class="tips-result-label">{{ t('tips.result.amountPerPerson') }}</span>
              <span class="tips-result-value tips-result-value--teal">{{ n(result.amountPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
            </div>
          </div>
        </template>

        <!-- Formula hint -->
        <div class="tips-formula">
          <span>{{ t('tips.formula.tip') }}</span>
          <template v-if="peopleCount > 1">
            <span class="tips-formula-sep">·</span>
            <span>{{ t('tips.formula.split') }}</span>
          </template>
        </div>
      </template>

      <p v-else class="tips-empty">{{ t('tips.result.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTipsCalculator, PRESET_RATES } from '../composables/useTipsCalculator'

const { t, n } = useI18n()
const { billAmount, presetRate, customRate, peopleCount, result, touch, getIssue } = useTipsCalculator()
</script>

<style scoped>
.tips-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.tips-card-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 20px;
}

.tips-field {
  margin-bottom: 20px;
}
.tips-field:last-child {
  margin-bottom: 0;
}

.tips-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.tips-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s;
  max-width: 280px;
}
.tips-input-wrap--narrow {
  max-width: 140px;
}
.tips-input-wrap:focus-within {
  border-color: #14b8a6;
  background: #fff;
}
.tips-input-wrap--error {
  border-color: #ef4444;
}

.tips-input {
  padding: 10px 12px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111827;
  width: 100%;
  min-width: 0;
}

.tips-suffix {
  padding: 0 12px 0 4px;
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}

.tips-error {
  margin-top: 5px;
  font-size: 12px;
  color: #ef4444;
}

/* Preset rate buttons */
.tips-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tips-preset {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  background: #f9fafb;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
  user-select: none;
}
.tips-preset:hover {
  border-color: #14b8a6;
  color: #0f766e;
}
.tips-preset--active {
  border-color: #14b8a6;
  background: #f0fdfa;
  color: #0f766e;
}

.tips-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Result */
.tips-result-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tips-result-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.tips-result-row--total {
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}

.tips-result-label {
  font-size: 14px;
  color: #6b7280;
}
.tips-result-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}
.tips-result-value--teal {
  color: #0d9488;
  font-size: 20px;
}

.tips-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 18px 0 14px;
}

.tips-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 10px;
}

.tips-formula {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 12px;
  color: #9ca3af;
  font-family: ui-monospace, monospace;
}
.tips-formula-sep {
  color: #d1d5db;
}

.tips-empty {
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
  padding: 16px 0;
}
</style>
