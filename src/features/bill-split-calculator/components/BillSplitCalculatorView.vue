<template>
  <main class="bill-split-page" aria-labelledby="bill-split-title">
    <section class="bill-split-heading">
      <p class="bill-split-eyebrow">{{ t('billSplit.eyebrow') }}</p>
      <h1 id="bill-split-title">{{ t('billSplit.title') }}</h1>
      <p>{{ t('billSplit.intro') }}</p>
    </section>

    <div class="bill-split-workspace">
      <form class="bill-split-form" @submit.prevent>
        <section class="bill-split-section">
          <div class="bill-split-section__header">
            <h2>{{ t('billSplit.form.title') }}</h2>
            <p>{{ t('billSplit.form.description') }}</p>
          </div>

          <div class="bill-split-grid bill-split-grid--two">
            <div class="bill-split-field">
              <label for="bill-split-amount">{{ t('billSplit.form.billAmount') }}</label>
              <div class="bill-split-input-wrap">
                <input
                  id="bill-split-amount"
                  v-model.number="input.billAmount"
                  type="number"
                  min="0"
                  step="any"
                  :aria-invalid="Boolean(getIssue('billAmount'))"
                  aria-describedby="bill-split-amount-error"
                  @blur="touch('billAmount')"
                >
                <span>₽</span>
              </div>
              <p v-if="getIssue('billAmount')" id="bill-split-amount-error" class="bill-split-error">
                {{ t(getIssue('billAmount')!.messageKey) }}
              </p>
            </div>

            <div class="bill-split-field">
              <label for="bill-split-people">{{ t('billSplit.form.peopleCount') }}</label>
              <div class="bill-split-input-wrap">
                <input
                  id="bill-split-people"
                  v-model.number="input.peopleCount"
                  type="number"
                  min="1"
                  step="1"
                  :aria-invalid="Boolean(getIssue('peopleCount'))"
                  aria-describedby="bill-split-people-error"
                  @blur="touch('peopleCount')"
                >
              </div>
              <p v-if="getIssue('peopleCount')" id="bill-split-people-error" class="bill-split-error">
                {{ t(getIssue('peopleCount')!.messageKey) }}
              </p>
            </div>
          </div>
        </section>

        <section class="bill-split-section">
          <div class="bill-split-section__header bill-split-section__header--tight">
            <h2>{{ t('billSplit.form.extras') }}</h2>
          </div>

          <div class="bill-split-field">
            <span class="bill-split-field__label">{{ t('billSplit.form.tipPercent') }}</span>
            <div class="bill-split-chip-list" role="group" :aria-label="t('billSplit.form.tipPercent')">
              <button
                v-for="rate in TIP_PRESETS"
                :key="rate"
                type="button"
                class="bill-split-chip"
                :class="{ 'bill-split-chip--active': input.tipPercent === rate }"
                @click="input.tipPercent = rate"
              >
                {{ rate }}%
              </button>
            </div>
            <div class="bill-split-input-wrap">
              <input
                v-model.number="input.tipPercent"
                type="number"
                min="0"
                step="any"
                :aria-invalid="Boolean(getIssue('tipPercent'))"
                :aria-label="t('billSplit.form.tipPercent')"
                @blur="touch('tipPercent')"
              >
              <span>%</span>
            </div>
            <p v-if="getIssue('tipPercent')" class="bill-split-error">
              {{ t(getIssue('tipPercent')!.messageKey) }}
            </p>
          </div>

          <div class="bill-split-field">
            <label for="bill-split-service">{{ t('billSplit.form.serviceFee') }}</label>
            <div class="bill-split-input-wrap">
              <input
                id="bill-split-service"
                v-model.number="input.serviceFee"
                type="number"
                min="0"
                step="any"
                :aria-invalid="Boolean(getIssue('serviceFee'))"
                aria-describedby="bill-split-service-error"
                @blur="touch('serviceFee')"
              >
              <span>₽</span>
            </div>
            <p v-if="getIssue('serviceFee')" id="bill-split-service-error" class="bill-split-error">
              {{ t(getIssue('serviceFee')!.messageKey) }}
            </p>
          </div>
        </section>

        <section class="bill-split-section">
          <div class="bill-split-field">
            <span class="bill-split-field__label">{{ t('billSplit.form.roundTo') }}</span>
            <div class="bill-split-chip-list" role="group" :aria-label="t('billSplit.form.roundTo')">
              <button
                v-for="step in ROUNDING_PRESETS"
                :key="step"
                type="button"
                class="bill-split-chip"
                :class="{ 'bill-split-chip--active': input.roundTo === step }"
                @click="input.roundTo = step"
              >
                {{ t(`billSplit.form.rounding.${roundingKey(step)}`) }}
              </button>
            </div>
          </div>
        </section>
      </form>

      <section class="bill-split-result" aria-live="polite">
        <p class="bill-split-result__label">{{ t('billSplit.result.label') }}</p>

        <template v-if="result">
          <div class="bill-split-result__total">
            <span>{{ t('billSplit.result.perPerson') }}</span>
            <strong>{{ money(result.roundedPerPerson) }}</strong>
          </div>

          <div class="bill-split-result__rows">
            <div class="bill-split-result__row">
              <span>{{ t('billSplit.result.totalAmount') }}</span>
              <strong>{{ money(result.totalAmount) }}</strong>
            </div>
            <div class="bill-split-result__row">
              <span>{{ t('billSplit.result.tipAmount') }}</span>
              <strong>{{ money(result.tipAmount) }}</strong>
            </div>
            <div class="bill-split-result__row">
              <span>{{ t('billSplit.result.serviceFee') }}</span>
              <strong>{{ money(result.serviceFee) }}</strong>
            </div>
            <div class="bill-split-result__row">
              <span>{{ t('billSplit.result.exactPerPerson') }}</span>
              <strong>{{ money(result.exactPerPerson) }}</strong>
            </div>
            <div class="bill-split-result__row">
              <span>{{ t('billSplit.result.roundingReserve') }}</span>
              <strong>{{ money(result.roundingReserve) }}</strong>
            </div>
          </div>

          <p class="bill-split-formula">{{ t('billSplit.formula') }}</p>
        </template>

        <p v-else class="bill-split-result__empty">{{ t('billSplit.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ROUNDING_PRESETS, TIP_PRESETS, useBillSplitCalculator } from '../composables/useBillSplitCalculator'

const { t, n } = useI18n()
const { input, result, touch, getIssue } = useBillSplitCalculator()

function money(value: number): string {
  return `${n(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
}

function roundingKey(step: number): string {
  if (step === 0.01) {
    return 'kopeck'
  }

  if (step === 1) {
    return 'ruble'
  }

  return 'ten'
}
</script>
