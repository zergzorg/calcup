<template>
  <main class="vat-page" aria-labelledby="vat-title">
    <section class="vat-heading">
      <p class="vat-eyebrow">{{ t('vat.eyebrow') }}</p>
      <h1 id="vat-title">{{ t('vat.title') }}</h1>
      <p>{{ t('vat.intro') }}</p>
    </section>

    <div class="vat-workspace">
      <form class="vat-form" @submit.prevent>
        <fieldset class="vat-modes">
          <legend class="vat-modes__legend">{{ t('vat.modes.label') }}</legend>
          <div class="vat-modes__list">
            <label
              v-for="m in (['add', 'extract'] as const)"
              :key="m"
              class="vat-mode-option"
              :class="{ 'vat-mode-option--active': mode === m }"
            >
              <input
                v-model="mode"
                type="radio"
                name="vat-mode"
                :value="m"
                class="vat-mode-option__radio"
              >
              {{ t(`vat.modes.${m}`) }}
            </label>
          </div>
        </fieldset>

        <div class="vat-field">
          <label for="vat-amount">
            {{ mode === 'add' ? t('vat.form.amountWithout') : t('vat.form.amountWith') }}
          </label>
          <div class="vat-input-wrap">
            <input
              id="vat-amount"
              v-model.number="amount"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('amount'))"
              aria-describedby="vat-amount-error"
              @blur="touch('amount')"
            >
            <span class="vat-unit">₽</span>
          </div>
          <p v-if="getIssue('amount')" id="vat-amount-error" class="vat-error">
            {{ t(getIssue('amount')!.messageKey) }}
          </p>
        </div>

        <div class="vat-field">
          <span class="vat-field__label">{{ t('vat.form.rate') }}</span>
          <div class="vat-rates">
            <label
              v-for="r in PRESET_RATES"
              :key="r"
              class="vat-rate-option"
              :class="{ 'vat-rate-option--active': presetRate === r }"
            >
              <input
                v-model="presetRate"
                type="radio"
                name="vat-rate"
                :value="r"
                class="vat-rate-option__radio"
              >
              {{ r }}%
            </label>
            <label
              class="vat-rate-option"
              :class="{ 'vat-rate-option--active': presetRate === 'custom' }"
            >
              <input
                v-model="presetRate"
                type="radio"
                name="vat-rate"
                value="custom"
                class="vat-rate-option__radio"
              >
              {{ t('vat.form.customRate') }}
            </label>
          </div>
        </div>

        <aside class="vat-warning-note">
          <strong>{{ t('vat.form.actualityTitle') }}</strong>
          <span>{{ t('vat.form.actualityBody') }}</span>
        </aside>

        <div v-if="presetRate === 'custom'" class="vat-field">
          <label for="vat-custom-rate">{{ t('vat.form.customRateLabel') }}</label>
          <div class="vat-input-wrap">
            <input
              id="vat-custom-rate"
              v-model.number="customRate"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('rate'))"
              aria-describedby="vat-rate-error"
              @blur="touch('rate')"
            >
            <span class="vat-unit">%</span>
          </div>
          <p v-if="getIssue('rate')" id="vat-rate-error" class="vat-error">
            {{ t(getIssue('rate')!.messageKey) }}
          </p>
        </div>
      </form>

      <section class="vat-result" aria-live="polite">
        <p class="vat-result__label">{{ t('vat.result.label') }}</p>

        <template v-if="mode === 'add' && addResult !== null">
          <div class="vat-result__rows">
            <div class="vat-result__row">
              <span class="vat-result__row-label">{{ t('vat.result.amountWithout') }}</span>
              <span class="vat-result__row-value">{{ formatMoney(amount) }}</span>
            </div>
            <div class="vat-result__row vat-result__row--vat">
              <span class="vat-result__row-label">{{ t('vat.result.vatAmount', { rate: effectiveRate }) }}</span>
              <span class="vat-result__row-value vat-result__row-value--accent">{{ formatMoney(addResult.vatAmount) }}</span>
            </div>
            <div class="vat-result__row vat-result__row--total">
              <span class="vat-result__row-label">{{ t('vat.result.amountWith') }}</span>
              <span class="vat-result__row-value vat-result__row-value--big">{{ formatMoney(addResult.amountWithVat) }}</span>
            </div>
          </div>
          <p class="vat-result__formula">{{ t('vat.result.formula.add') }}</p>
        </template>

        <template v-else-if="mode === 'extract' && extractResult !== null">
          <div class="vat-result__rows">
            <div class="vat-result__row">
              <span class="vat-result__row-label">{{ t('vat.result.amountWith') }}</span>
              <span class="vat-result__row-value">{{ formatMoney(amount) }}</span>
            </div>
            <div class="vat-result__row vat-result__row--vat">
              <span class="vat-result__row-label">{{ t('vat.result.vatAmount', { rate: effectiveRate }) }}</span>
              <span class="vat-result__row-value vat-result__row-value--accent">{{ formatMoney(extractResult.vatAmount) }}</span>
            </div>
            <div class="vat-result__row vat-result__row--total">
              <span class="vat-result__row-label">{{ t('vat.result.amountWithout') }}</span>
              <span class="vat-result__row-value vat-result__row-value--big">{{ formatMoney(extractResult.amountWithoutVat) }}</span>
            </div>
          </div>
          <p class="vat-result__formula">{{ t('vat.result.formula.extract') }}</p>
        </template>

        <p v-else class="vat-result__empty">{{ t('vat.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useVatCalculator } from '../composables/useVatCalculator'

const { t, n } = useI18n()

const {
  mode,
  amount,
  presetRate,
  customRate,
  effectiveRate,
  touch,
  getIssue,
  addResult,
  extractResult,
  PRESET_RATES,
} = useVatCalculator()

function formatMoney(value: number): string {
  return n(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.vat-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.vat-heading {
  max-width: 760px;
}

.vat-eyebrow {
  margin: 0 0 10px;
  color: #0e7490;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.vat-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.vat-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.vat-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 20px;
  align-items: stretch;
}

.vat-form,
.vat-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.vat-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

.vat-modes {
  margin: 0;
  padding: 0;
  border: none;
}

.vat-modes__legend,
.vat-field__label {
  display: block;
  margin: 0 0 10px;
  color: #27364a;
  font-weight: 750;
}

.vat-modes__list,
.vat-rates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.vat-mode-option,
.vat-rate-option {
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

.vat-mode-option--active,
.vat-rate-option--active {
  border-color: #0e7490;
  color: #0e7490;
  background: #ecfeff;
}

.vat-mode-option__radio,
.vat-rate-option__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.vat-field {
  display: grid;
  gap: 8px;
}

.vat-field label {
  color: #27364a;
  font-weight: 750;
}

.vat-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.vat-input-wrap:focus-within {
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.12);
}

.vat-input-wrap input {
  min-width: 0;
  border: none;
  padding: 14px;
  color: #111827;
  background: transparent;
  font: inherit;
  outline: 0;
}

.vat-input-wrap input[aria-invalid="true"] {
  color: #991b1b;
}

.vat-unit {
  padding: 0 14px;
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  user-select: none;
}

.vat-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.vat-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 252px;
  padding: 24px;
}

.vat-result__label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.vat-result__rows {
  display: grid;
  gap: 10px;
}

.vat-result__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2eaf2;
}

.vat-result__row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.vat-result__row-label {
  color: #526174;
  font-size: 0.92rem;
}

.vat-result__row-value {
  color: #172033;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
}

.vat-result__row--vat .vat-result__row-value--accent {
  color: #0e7490;
}

.vat-result__row--total .vat-result__row-value--big {
  color: #0e7490;
  font-size: 1.5rem;
  font-weight: 850;
}

.vat-result__formula {
  margin: 16px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
  font-family: monospace;
}

.vat-result__empty {
  color: #94a3b8;
}

@media (max-width: 900px) {
  .vat-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .vat-page {
    gap: 20px;
  }

  .vat-heading h1 {
    font-size: 2.15rem;
  }

  .vat-heading p:last-child {
    font-size: 1rem;
  }

  .vat-form,
  .vat-result {
    padding: 18px;
  }

  .vat-result {
    min-height: auto;
  }

  .vat-result__row-value--big {
    font-size: 1.3rem !important;
  }
}
</style>
