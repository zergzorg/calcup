<template>
  <section class="credit-print-view" aria-label="Печатная форма расчета кредита">
    <div class="print-watermark">{{ watermark }}</div>
    <header class="print-header">
      <img :src="logoSrc" alt="Calcup" />
      <div>
        <p>{{ t('credit.print.document') }}</p>
        <h2>{{ t('credit.title') }}</h2>
      </div>
    </header>

    <div class="print-grid">
      <div><span>{{ t('credit.form.amount') }}</span><strong>{{ money(input.amount) }}</strong></div>
      <div><span>{{ t('credit.form.annualRate') }}</span><strong>{{ input.annualRate }}%</strong></div>
      <div><span>{{ t('credit.form.termMonths') }}</span><strong>{{ input.termMonths }}</strong></div>
      <div><span>{{ t('credit.results.monthlyPayment') }}</span><strong>{{ money(result.monthlyPayment) }}</strong></div>
      <div><span>{{ t('credit.results.overpayment') }}</span><strong>{{ money(result.overpayment) }}</strong></div>
      <div><span>{{ t('credit.results.payoffDate') }}</span><strong>{{ date(result.payoffDate) }}</strong></div>
    </div>

    <h3>{{ t('credit.early.title') }}</h3>
    <p v-if="!input.earlyRepayments.length" class="print-muted">{{ t('credit.early.empty') }}</p>
    <table v-else class="print-table compact">
      <thead><tr><th>{{ t('credit.early.date') }}</th><th>{{ t('credit.early.amount') }}</th><th>{{ t('credit.early.strategy') }}</th><th>{{ t('credit.early.frequency') }}</th></tr></thead>
      <tbody>
        <tr v-for="item in input.earlyRepayments" :key="item.id">
          <td>{{ date(item.date) }}</td>
          <td>{{ money(item.amount) }}</td>
          <td>{{ strategyLabel(item.strategy) }}</td>
          <td>{{ frequencyLabel(item.frequency) }}</td>
        </tr>
      </tbody>
    </table>

    <h3>{{ t('credit.schedule.title') }}</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>{{ t('credit.schedule.number') }}</th>
          <th>{{ t('credit.schedule.date') }}</th>
          <th>{{ t('credit.schedule.payment') }}</th>
          <th>{{ t('credit.schedule.interest') }}</th>
          <th>{{ t('credit.schedule.principal') }}</th>
          <th>{{ t('credit.schedule.early') }}</th>
          <th>{{ t('credit.schedule.balance') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in result.schedule" :key="item.number">
          <td>{{ item.number }}</td>
          <td>{{ date(item.date) }}</td>
          <td>{{ money(item.payment) }}</td>
          <td>{{ money(item.interest) }}</td>
          <td>{{ money(item.principal) }}</td>
          <td>{{ money(item.earlyRepayment) }}</td>
          <td>{{ money(item.balance) }}</td>
        </tr>
      </tbody>
    </table>

    <p class="print-disclaimer">{{ t('credit.print.disclaimer') }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { CreditCalculationResult, CreditInput, EarlyRepaymentFrequency, EarlyRepaymentStrategy } from '../types/credit';
import { formatDisplayDate } from '../lib/date';
import { formatMoney } from '../lib/money';

withDefaults(defineProps<{
  input: CreditInput;
  result: CreditCalculationResult;
  logoSrc?: string;
  watermark?: string;
}>(), {
  logoSrc: '/calcup.svg',
  watermark: 'CALCUP',
});

const { t, locale } = useI18n();
const money = (value: number) => formatMoney(value, locale.value);
const date = (value: string) => formatDisplayDate(value, locale.value);
const strategyLabel = (value: EarlyRepaymentStrategy) => value === 'reduce_term'
  ? t('credit.early.reduceTermShort')
  : t('credit.early.reducePaymentShort');
const frequencyLabel = (value?: EarlyRepaymentFrequency) => value === 'monthly'
  ? t('credit.early.monthly')
  : t('credit.early.once');
</script>
