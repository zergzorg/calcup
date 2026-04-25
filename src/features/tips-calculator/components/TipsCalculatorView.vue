<template>
  <main class="tips-page" aria-labelledby="tips-title">
    <section class="tips-heading">
      <p class="tips-eyebrow">{{ t('tips.eyebrow') }}</p>
      <h1 id="tips-title">{{ t('tips.title') }}</h1>
      <p>{{ t('tips.intro') }}</p>
    </section>

    <div class="tips-workspace">
      <form class="tips-form" @submit.prevent>
        <p class="tips-form-eyebrow">{{ t('tips.form.label') }}</p>

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
      </form>

      <section class="tips-result" aria-live="polite">
        <p class="tips-result-label">{{ t('tips.result.label') }}</p>

        <template v-if="result">
          <!-- Main totals -->
          <div class="tips-result-rows">
            <div class="tips-result-row">
              <span class="tips-result-row-label">{{ t('tips.result.tipAmount') }}</span>
              <span class="tips-result-row-value">{{ n(result.tipAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
            </div>
            <div class="tips-result-row tips-result-row--total">
              <span class="tips-result-row-label">{{ t('tips.result.totalAmount') }}</span>
              <span class="tips-result-row-value tips-result-row-value--accent">{{ n(result.totalAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
            </div>
          </div>

          <!-- Per person (only if >1) -->
          <template v-if="peopleCount > 1">
            <div class="tips-divider" />
            <p class="tips-section-label">{{ t('tips.result.perPersonTitle') }}</p>
            <div class="tips-result-rows">
              <div class="tips-result-row">
                <span class="tips-result-row-label">{{ t('tips.result.billPerPerson') }}</span>
                <span class="tips-result-row-value">{{ n(result.billPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
              </div>
              <div class="tips-result-row">
                <span class="tips-result-row-label">{{ t('tips.result.tipPerPerson') }}</span>
                <span class="tips-result-row-value">{{ n(result.tipPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
              </div>
              <div class="tips-result-row tips-result-row--total">
                <span class="tips-result-row-label">{{ t('tips.result.amountPerPerson') }}</span>
                <span class="tips-result-row-value tips-result-row-value--accent">{{ n(result.amountPerPerson, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽</span>
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
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTipsCalculator, PRESET_RATES } from '../composables/useTipsCalculator'

const { t, n } = useI18n()
const { billAmount, presetRate, customRate, peopleCount, result, touch, getIssue } = useTipsCalculator()
</script>

<style scoped>
.tips-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.tips-heading {
  max-width: 760px;
}

.tips-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.tips-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.tips-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.tips-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 20px;
  align-items: stretch;
}

.tips-form,
.tips-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.tips-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

.tips-form-eyebrow {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 4px;
}

.tips-field {
  display: grid;
  gap: 8px;
}

.tips-label {
  color: #27364a;
  font-weight: 750;
}

.tips-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  max-width: 280px;
}
.tips-input-wrap--narrow {
  max-width: 140px;
}
.tips-input-wrap:focus-within {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}
.tips-input-wrap--error {
  border-color: #ef4444;
}

.tips-input {
  min-width: 0;
  border: none;
  padding: 14px;
  color: #111827;
  background: transparent;
  font: inherit;
  outline: 0;
}

.tips-suffix {
  padding: 0 14px;
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  user-select: none;
}

.tips-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.tips-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tips-preset {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  padding: 10px 16px;
  color: #526174;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.1s, background 0.1s, color 0.1s;
}
.tips-preset:hover {
  border-color: #0d9488;
  color: #0d9488;
}
.tips-preset--active {
  border-color: #0d9488;
  color: #0d9488;
  background: #f0fdfa;
}

.tips-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.tips-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 252px;
  padding: 24px;
}

.tips-result-label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tips-result-rows {
  display: grid;
  gap: 10px;
}

.tips-result-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2eaf2;
}

.tips-result-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.tips-result-row-label {
  color: #526174;
  font-size: 0.92rem;
}

.tips-result-row-value {
  color: #172033;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
}

.tips-result-row--total .tips-result-row-value--accent {
  color: #0d9488;
  font-size: 1.5rem;
  font-weight: 850;
}

.tips-divider {
  height: 1px;
  background: #e2eaf2;
  margin: 18px 0 14px;
}

.tips-section-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 10px;
}

.tips-formula {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #e2eaf2;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 0.82rem;
  color: #94a3b8;
  font-family: monospace;
}

.tips-formula-sep {
  color: #cbd7e6;
}

.tips-empty {
  color: #94a3b8;
}

@media (max-width: 900px) {
  .tips-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .tips-page {
    gap: 20px;
  }

  .tips-heading h1 {
    font-size: 2.15rem;
  }

  .tips-heading p:last-child {
    font-size: 1rem;
  }

  .tips-form,
  .tips-result {
    padding: 18px;
  }

  .tips-result {
    min-height: auto;
  }

  .tips-result-row-value--accent {
    font-size: 1.3rem !important;
  }
}
</style>
