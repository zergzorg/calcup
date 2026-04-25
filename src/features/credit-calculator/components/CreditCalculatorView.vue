<template>
  <main class="credit-page" aria-labelledby="credit-title">
    <section class="credit-heading">
      <p class="credit-eyebrow">{{ t('credit.eyebrow') }}</p>
      <h1 id="credit-title">{{ t('credit.title') }}</h1>
      <p>{{ t('credit.intro') }}</p>
    </section>

    <div class="credit-workspace">
      <div class="credit-workspace__main">
        <CreditLoanForm v-model="input" :issues="issues" />
        <CreditEarlyRepayments
          :repayments="input.earlyRepayments"
          :first-payment-date="input.firstPaymentDate"
          @change="setEarlyRepayments"
        />
        <CreditScheduleTable :items="result.schedule" :term-months="input.termMonths" />
      </div>

      <aside class="credit-workspace__summary">
        <CreditResults :result="result" :has-issues="issues.length > 0" :payment-type="input.paymentType" />
        <CreditPrintActions />
      </aside>
    </div>

    <CreditPrintView :input="input" :result="result" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import CreditEarlyRepayments from './CreditEarlyRepayments.vue';
import CreditLoanForm from './CreditLoanForm.vue';
import CreditPrintActions from './CreditPrintActions.vue';
import CreditPrintView from './CreditPrintView.vue';
import CreditResults from './CreditResults.vue';
import CreditScheduleTable from './CreditScheduleTable.vue';
import { calculateCreditSchedule } from '../lib/calculateCreditSchedule';
import { defaultFirstPaymentDate, todayIsoDate } from '../lib/date';
import { validateCreditInput } from '../lib/validation';
import type { CreditInput, EarlyRepayment } from '../types/credit';
import '../credit-calculator.css';
import '../../calculator-design-system.css';

const STORAGE_KEY = 'calcup_credit_calculator';

const createDefaultInput = (): CreditInput => {
  const issueDate = todayIsoDate();

  return {
    amount: 1000000,
    annualRate: 20,
    termMonths: 60,
    issueDate,
    firstPaymentDate: defaultFirstPaymentDate(issueDate),
    paymentType: 'annuity',
    earlyRepayments: [],
  };
};

const loadInput = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...createDefaultInput(), ...(JSON.parse(saved) as Partial<CreditInput>) } : createDefaultInput();
  } catch {
    return createDefaultInput();
  }
};

const { t } = useI18n();
const input = ref<CreditInput>(loadInput());
const issues = computed(() => validateCreditInput(input.value));
const result = computed(() => calculateCreditSchedule(input.value));

watch(input, (next) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}, { deep: true });

const setEarlyRepayments = (earlyRepayments: EarlyRepayment[]) => {
  input.value = {
    ...input.value,
    earlyRepayments,
  };
};
</script>
