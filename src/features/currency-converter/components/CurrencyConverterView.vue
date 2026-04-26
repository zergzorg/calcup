<template>
  <main class="currency-page" aria-labelledby="currency-title">
    <section class="currency-heading">
      <p class="currency-eyebrow">{{ t('currency.eyebrow') }}</p>
      <h1 id="currency-title">{{ t('currency.title') }}</h1>
      <p>{{ t('currency.intro') }}</p>
    </section>

    <div class="currency-workspace">
      <form class="currency-form" @submit.prevent>
        <section class="currency-section">
          <h2>{{ t('currency.form.conversionTitle') }}</h2>

          <div class="currency-field">
            <label for="currency-amount">{{ t('currency.form.amount') }}</label>
            <div class="currency-input-wrap">
              <input
                id="currency-amount"
                v-model.number="amount"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('amount'))"
                aria-describedby="currency-amount-error"
                @blur="touch('amount')"
              >
              <span>{{ fromCurrency }}</span>
            </div>
            <p v-if="getIssue('amount')" id="currency-amount-error" class="currency-error">
              {{ t(getIssue('amount')!.messageKey) }}
            </p>
          </div>

          <div class="currency-unit-grid">
            <div class="currency-field">
              <label for="currency-from">{{ t('currency.form.from') }}</label>
              <select id="currency-from" v-model="fromCurrency">
                <option v-for="code in currencies" :key="code" :value="code">
                  {{ t(`currency.codes.${code}`) }}
                </option>
              </select>
            </div>

            <button
              type="button"
              class="currency-swap"
              :aria-label="t('currency.form.swap')"
              :title="t('currency.form.swap')"
              @click="swapCurrencies"
            >
              ⇄
            </button>

            <div class="currency-field">
              <label for="currency-to">{{ t('currency.form.to') }}</label>
              <select id="currency-to" v-model="toCurrency">
                <option v-for="code in currencies" :key="code" :value="code">
                  {{ t(`currency.codes.${code}`) }}
                </option>
              </select>
            </div>
          </div>

          <div class="currency-field">
            <label for="currency-rate">{{ t('currency.form.rate', { from: fromCurrency, to: toCurrency }) }}</label>
            <div class="currency-input-wrap">
              <input
                id="currency-rate"
                v-model.number="rate"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('rate'))"
                aria-describedby="currency-rate-error"
                @blur="touch('rate')"
              >
              <span>{{ toCurrency }}</span>
            </div>
            <p v-if="getIssue('rate')" id="currency-rate-error" class="currency-error">
              {{ t(getIssue('rate')!.messageKey) }}
            </p>
          </div>

          <div class="currency-field">
            <label for="currency-updated-at">{{ t('currency.form.updatedAt') }}</label>
            <input id="currency-updated-at" v-model="rateUpdatedAt" type="date">
          </div>
        </section>

        <section class="currency-section">
          <h2>{{ t('currency.presets.title') }}</h2>
          <p>{{ t('currency.presets.help') }}</p>
          <div class="currency-chip-list">
            <button
              v-for="pair in presetPairs"
              :key="pair.id"
              type="button"
              class="currency-chip"
              :class="{ 'currency-chip--active': activePresetId === pair.id }"
              @click="applyPreset(pair)"
            >
              {{ t(`currency.presets.${pair.id}`) }}
            </button>
          </div>
        </section>

        <aside class="currency-warning-note">
          <strong>{{ t('currency.warning.title') }}</strong>
          <span>{{ t('currency.warning.body') }}</span>
        </aside>
      </form>

      <section class="currency-result" aria-live="polite">
        <p class="currency-result__label">{{ t('currency.result.label') }}</p>

        <template v-if="result">
          <div class="currency-result__total">
            <span>{{ t('currency.result.converted') }}</span>
            <strong>{{ formatMoney(result.converted) }} {{ toCurrency }}</strong>
          </div>

          <div class="currency-result__rows">
            <div class="currency-result__row">
              <span>{{ t('currency.result.source') }}</span>
              <strong>{{ formatMoney(amount) }} {{ fromCurrency }}</strong>
            </div>
            <div class="currency-result__row">
              <span>{{ t('currency.result.rate') }}</span>
              <strong>1 {{ fromCurrency }} = {{ formatRate(rate) }} {{ toCurrency }}</strong>
            </div>
            <div class="currency-result__row">
              <span>{{ t('currency.result.updatedAt') }}</span>
              <strong>{{ formatDate(rateUpdatedAt) }}</strong>
            </div>
          </div>

          <p class="currency-formula">{{ t('currency.formula') }}</p>
        </template>

        <p v-else class="currency-result__empty">{{ t('currency.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCurrencyConverter } from '../composables/useCurrencyConverter'

const { t, n, locale } = useI18n()

const {
  amount,
  fromCurrency,
  toCurrency,
  rate,
  rateUpdatedAt,
  currencies,
  presetPairs,
  result,
  activePresetId,
  touch,
  getIssue,
  applyPreset,
  swapCurrencies,
} = useCurrencyConverter()

function formatMoney(value: number): string {
  return n(value, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatRate(value: number): string {
  return n(value, { minimumFractionDigits: 0, maximumFractionDigits: 4 })
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return t('currency.result.noDate')

  return new Intl.DateTimeFormat(locale.value).format(date)
}
</script>
