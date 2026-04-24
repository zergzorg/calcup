<template>
  <section class="credit-panel credit-results" :aria-label="t('credit.results.title')">
    <div class="credit-section-title">
      <span>{{ t('credit.results.eyebrow') }}</span>
      <h2>{{ t('credit.results.title') }}</h2>
    </div>

    <div v-if="hasIssues" class="credit-warning">
      {{ t('credit.results.fixErrors') }}
    </div>

    <div v-else class="credit-result-grid">
      <article class="credit-result-card primary">
        <span>{{ paymentLabel }}</span>
        <strong>{{ money(result.monthlyPayment) }}</strong>
      </article>
      <article class="credit-result-card">
        <span>{{ t('credit.results.overpayment') }}</span>
        <strong>{{ money(result.overpayment) }}</strong>
      </article>
      <article class="credit-result-card">
        <span>{{ t('credit.results.totalPayment') }}</span>
        <strong>{{ money(result.totalPayment) }}</strong>
      </article>
      <article class="credit-result-card">
        <span>{{ t('credit.results.payoffDate') }}</span>
        <strong>{{ date(result.payoffDate) }}</strong>
      </article>
      <article class="credit-result-card">
        <span>{{ t('credit.results.interestSavings') }}</span>
        <strong>{{ money(result.interestSavings) }}</strong>
      </article>
      <article class="credit-result-card">
        <span>{{ t('credit.results.paymentCount') }}</span>
        <strong>{{ result.paymentCount }}</strong>
      </article>
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
