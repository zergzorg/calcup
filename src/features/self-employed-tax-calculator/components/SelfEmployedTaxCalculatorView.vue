<template>
  <main class="self-employed-tax-page" aria-labelledby="self-employed-tax-title">
    <section class="self-employed-tax-heading">
      <p class="self-employed-tax-eyebrow">{{ t('selfEmployedTax.eyebrow') }}</p>
      <h1 id="self-employed-tax-title">{{ t('selfEmployedTax.title') }}</h1>
      <p>{{ t('selfEmployedTax.intro') }}</p>
    </section>

    <div class="self-employed-tax-workspace">
      <form class="self-employed-tax-form" @submit.prevent>
        <section class="self-employed-tax-section">
          <h2>{{ t('selfEmployedTax.form.incomeTitle') }}</h2>

          <div class="self-employed-tax-field">
            <label for="self-employed-tax-individual">{{ t('selfEmployedTax.form.individualIncome') }}</label>
            <div class="self-employed-tax-input-wrap">
              <input
                id="self-employed-tax-individual"
                v-model.number="individualIncome"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('individualIncome'))"
                aria-describedby="self-employed-tax-individual-error"
                @blur="touch('individualIncome')"
              >
              <span>{{ t('selfEmployedTax.units.currency') }}</span>
            </div>
            <p v-if="getIssue('individualIncome')" id="self-employed-tax-individual-error" class="self-employed-tax-error">
              {{ t(getIssue('individualIncome')!.messageKey) }}
            </p>
          </div>

          <div class="self-employed-tax-field">
            <label for="self-employed-tax-business">{{ t('selfEmployedTax.form.businessIncome') }}</label>
            <div class="self-employed-tax-input-wrap">
              <input
                id="self-employed-tax-business"
                v-model.number="businessIncome"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('businessIncome'))"
                aria-describedby="self-employed-tax-business-error"
                @blur="touch('businessIncome')"
              >
              <span>{{ t('selfEmployedTax.units.currency') }}</span>
            </div>
            <p v-if="getIssue('businessIncome')" id="self-employed-tax-business-error" class="self-employed-tax-error">
              {{ t(getIssue('businessIncome')!.messageKey) }}
            </p>
          </div>

          <div class="self-employed-tax-field">
            <label for="self-employed-tax-bonus">{{ t('selfEmployedTax.form.bonusBalance') }}</label>
            <div class="self-employed-tax-input-wrap">
              <input
                id="self-employed-tax-bonus"
                v-model.number="bonusBalance"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('bonusBalance'))"
                aria-describedby="self-employed-tax-bonus-error"
                @blur="touch('bonusBalance')"
              >
              <span>{{ t('selfEmployedTax.units.currency') }}</span>
            </div>
            <p v-if="getIssue('bonusBalance')" id="self-employed-tax-bonus-error" class="self-employed-tax-error">
              {{ t(getIssue('bonusBalance')!.messageKey) }}
            </p>
          </div>
        </section>

        <aside class="self-employed-tax-warning-note">
          <strong>{{ t('selfEmployedTax.warning.title') }}</strong>
          <span>{{ t('selfEmployedTax.warning.body') }}</span>
        </aside>
      </form>

      <section class="self-employed-tax-result" aria-live="polite">
        <p class="self-employed-tax-result__label">{{ t('selfEmployedTax.result.label') }}</p>

        <template v-if="result">
          <div class="self-employed-tax-result__total">
            <span>{{ t('selfEmployedTax.result.taxToPay') }}</span>
            <strong>{{ formatMoney(result.taxToPay) }}</strong>
          </div>

          <div class="self-employed-tax-result__rows">
            <div class="self-employed-tax-result__row">
              <span>{{ t('selfEmployedTax.result.totalIncome') }}</span>
              <strong>{{ formatMoney(result.totalIncome) }}</strong>
            </div>
            <div class="self-employed-tax-result__row">
              <span>{{ t('selfEmployedTax.result.taxBeforeBonus') }}</span>
              <strong>{{ formatMoney(result.taxBeforeBonus) }}</strong>
            </div>
            <div class="self-employed-tax-result__row">
              <span>{{ t('selfEmployedTax.result.bonusUsed') }}</span>
              <strong>{{ formatMoney(result.bonusUsed) }}</strong>
            </div>
            <div class="self-employed-tax-result__row">
              <span>{{ t('selfEmployedTax.result.netIncome') }}</span>
              <strong>{{ formatMoney(result.netIncome) }}</strong>
            </div>
            <div class="self-employed-tax-result__row">
              <span>{{ result.limitExceededBy > 0 ? t('selfEmployedTax.result.limitExceededBy') : t('selfEmployedTax.result.remainingLimit') }}</span>
              <strong>{{ formatMoney(result.limitExceededBy > 0 ? result.limitExceededBy : result.remainingLimit) }}</strong>
            </div>
          </div>

          <p class="self-employed-tax-formula">{{ t('selfEmployedTax.formula') }}</p>
        </template>

        <p v-else class="self-employed-tax-result__empty">{{ t('selfEmployedTax.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSelfEmployedTaxCalculator } from '../composables/useSelfEmployedTaxCalculator'

const { t, n } = useI18n()

const {
  individualIncome,
  businessIncome,
  bonusBalance,
  result,
  touch,
  getIssue,
} = useSelfEmployedTaxCalculator()

function formatMoney(value: number): string {
  return t('selfEmployedTax.units.currencyValue', {
    value: n(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  })
}
</script>
