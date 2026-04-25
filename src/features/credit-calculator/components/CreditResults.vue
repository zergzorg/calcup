<template>
  <section class="credit-result" :aria-label="t('credit.results.title')" aria-live="polite">
    <p class="credit-result__label">{{ t('credit.results.eyebrow') }}</p>

    <div v-if="hasIssues" class="credit-warning">
      {{ t('credit.results.fixErrors') }}
    </div>

    <div v-else>
      <div class="credit-result__total">
        <span>{{ paymentLabel }}</span>
        <strong>{{ money(result.monthlyPayment) }}</strong>
      </div>

      <div class="credit-result__rows">
        <div class="credit-result__row">
          <span>{{ t('credit.results.overpayment') }}</span>
          <strong>{{ money(result.overpayment) }}</strong>
        </div>
        <div class="credit-result__row">
          <span>{{ t('credit.results.totalPayment') }}</span>
          <strong>{{ money(result.totalPayment) }}</strong>
        </div>
        <div class="credit-result__row">
          <span>{{ t('credit.results.payoffDate') }}</span>
          <strong>{{ date(result.payoffDate) }}</strong>
        </div>
        <div class="credit-result__row">
          <span>{{ t('credit.results.interestSavings') }}</span>
          <strong>{{ money(result.interestSavings) }}</strong>
        </div>
        <div class="credit-result__row">
          <span>{{ t('credit.results.paymentCount') }}</span>
          <strong>{{ result.paymentCount }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { CreditCalculationResult, PaymentType } from '../types/credit';
import { formatDisplayDate } from '../lib/date';
import { formatMoney } from '../lib/money';

const props = defineProps<{
  result: CreditCalculationResult;
  hasIssues: boolean;
  paymentType: PaymentType;
}>();

const { t, locale } = useI18n();
const paymentLabel = computed(() => props.paymentType === 'differentiated'
  ? t('credit.results.firstPayment')
  : t('credit.results.monthlyPayment'));
const money = (value: number) => formatMoney(value, locale.value);
const date = (value: string) => formatDisplayDate(value, locale.value);
</script>
