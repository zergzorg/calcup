<template>
  <section class="credit-panel credit-early" :aria-label="t('credit.early.title')">
    <div class="credit-section-title">
      <span>{{ t('credit.early.eyebrow') }}</span>
      <h2>{{ t('credit.early.title') }}</h2>
    </div>

    <div class="credit-early-form">
      <label class="credit-field">
        <span>{{ t('credit.early.date') }}</span>
        <input v-model="date" type="date" />
      </label>
      <label class="credit-field">
        <span>{{ t('credit.early.amount') }}</span>
        <input v-model.number="amount" type="number" min="1" step="10000" inputmode="decimal" />
      </label>
      <label class="credit-field">
        <span>{{ t('credit.early.strategy') }}</span>
        <select v-model="strategy">
          <option value="reduce_term">{{ t('credit.early.reduceTerm') }}</option>
          <option value="reduce_payment">{{ t('credit.early.reducePayment') }}</option>
        </select>
      </label>
      <label class="credit-field">
        <span>{{ t('credit.early.frequency') }}</span>
        <select v-model="frequency">
          <option value="once">{{ t('credit.early.once') }}</option>
          <option value="monthly">{{ t('credit.early.monthly') }}</option>
        </select>
      </label>
      <button class="credit-button" type="button" @click="addRepayment">{{ t('credit.early.add') }}</button>
    </div>

    <div v-if="repayments.length" class="credit-early-list">
      <article v-for="repayment in sortedRepayments" :key="repayment.id" class="credit-early-item">
        <input
          :value="repayment.date"
          type="date"
          :aria-label="t('credit.early.date')"
          @input="updateRepayment(repayment.id, { date: ($event.target as HTMLInputElement).value })"
        />
        <input
          :value="repayment.amount"
          type="number"
          min="1"
          step="10000"
          :aria-label="t('credit.early.amount')"
          @input="updateRepayment(repayment.id, { amount: Number(($event.target as HTMLInputElement).value) || 0 })"
        />
        <select
          :value="repayment.strategy"
          :aria-label="t('credit.early.strategy')"
          @change="updateRepayment(repayment.id, { strategy: ($event.target as HTMLSelectElement).value as EarlyRepaymentStrategy })"
        >
          <option value="reduce_term">{{ t('credit.early.reduceTermShort') }}</option>
          <option value="reduce_payment">{{ t('credit.early.reducePaymentShort') }}</option>
        </select>
        <select
          :value="repayment.frequency ?? 'once'"
          :aria-label="t('credit.early.frequency')"
          @change="updateRepayment(repayment.id, { frequency: ($event.target as HTMLSelectElement).value as EarlyRepaymentFrequency })"
        >
          <option value="once">{{ t('credit.early.once') }}</option>
          <option value="monthly">{{ t('credit.early.monthly') }}</option>
        </select>
        <button class="credit-icon-button" type="button" :aria-label="t('credit.early.remove')" @click="removeRepayment(repayment.id)">×</button>
      </article>
    </div>

    <p v-else class="credit-muted">{{ t('credit.early.empty') }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { EarlyRepayment, EarlyRepaymentFrequency, EarlyRepaymentStrategy } from '../types/credit';
import { addMonths, compareIsoDates, todayIsoDate } from '../lib/date';

const props = defineProps<{
  repayments: EarlyRepayment[];
  firstPaymentDate: string;
}>();

const emit = defineEmits<{
  change: [value: EarlyRepayment[]];
}>();

const { t } = useI18n();
const date = ref(props.firstPaymentDate || addMonths(todayIsoDate(), 1));
const amount = ref(100000);
const strategy = ref<EarlyRepaymentStrategy>('reduce_term');
const frequency = ref<EarlyRepaymentFrequency>('once');

const sortedRepayments = computed(() => [...props.repayments].sort((left, right) => compareIsoDates(left.date, right.date)));

watch(() => props.firstPaymentDate, (next) => {
  if (!date.value || frequency.value === 'monthly') {
    date.value = next;
  }
});

watch(frequency, (next) => {
  if (next === 'monthly') {
    date.value = props.firstPaymentDate;
  }
});

const addRepayment = () => {
  if (!date.value || amount.value <= 0) return;
  const repaymentDate = date.value;

  emit('change', [
    ...props.repayments,
    {
      id: crypto.randomUUID(),
      date: repaymentDate,
      amount: Number(amount.value),
      strategy: strategy.value,
      frequency: frequency.value,
    },
  ]);

  date.value = addMonths(repaymentDate, 1);
};

const updateRepayment = (id: string, patch: Partial<EarlyRepayment>) => {
  emit('change', props.repayments.map((item) => item.id === id ? { ...item, ...patch } : item));
};

const removeRepayment = (id: string) => {
  emit('change', props.repayments.filter((item) => item.id !== id));
};
</script>
