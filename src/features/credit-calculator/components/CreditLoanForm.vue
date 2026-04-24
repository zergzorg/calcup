<template>
  <section class="credit-panel credit-loan-form" :aria-label="t('credit.form.title')">
    <div class="credit-section-title">
      <span>{{ t('credit.form.eyebrow') }}</span>
      <h2>{{ t('credit.form.title') }}</h2>
    </div>

    <div class="credit-form-grid">
      <label class="credit-field">
        <span>{{ t('credit.form.amount') }}</span>
        <input v-model.number="draft.amount" type="number" min="1" step="10000" inputmode="decimal" @input="emitUpdate" />
        <small v-if="errorFor('amount')">{{ errorFor('amount') }}</small>
      </label>

      <label class="credit-field">
        <span>{{ t('credit.form.annualRate') }}</span>
        <input v-model.number="draft.annualRate" type="number" min="0" max="100" step="0.1" inputmode="decimal" @input="emitUpdate" />
        <small v-if="errorFor('annualRate')">{{ errorFor('annualRate') }}</small>
      </label>

      <label class="credit-field">
        <span>{{ t('credit.form.termMonths') }}</span>
        <input v-model.number="draft.termMonths" type="number" min="1" max="600" step="1" inputmode="numeric" @input="emitUpdate" />
        <small v-if="errorFor('termMonths')">{{ errorFor('termMonths') }}</small>
      </label>

      <label class="credit-field">
        <span>{{ t('credit.form.issueDate') }}</span>
        <input v-model="draft.issueDate" type="date" @input="emitUpdate" />
        <small v-if="errorFor('issueDate')">{{ errorFor('issueDate') }}</small>
      </label>

      <label class="credit-field">
        <span>{{ t('credit.form.firstPaymentDate') }}</span>
        <input v-model="draft.firstPaymentDate" type="date" @input="emitUpdate" />
        <small v-if="errorFor('firstPaymentDate')">{{ errorFor('firstPaymentDate') }}</small>
      </label>

      <label class="credit-field">
        <span>{{ t('credit.form.paymentType') }}</span>
        <select v-model="draft.paymentType" @change="emitUpdate">
          <option value="annuity">{{ t('credit.form.annuity') }}</option>
        </select>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CreditInput, ValidationIssue } from '../types/credit';

const props = defineProps<{
  modelValue: CreditInput;
  issues: ValidationIssue[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: CreditInput];
}>();

const { t } = useI18n();
const draft = reactive<CreditInput>({ ...props.modelValue, earlyRepayments: props.modelValue.earlyRepayments });

watch(() => props.modelValue, (next) => {
  Object.assign(draft, next);
}, { deep: true });

const emitUpdate = () => {
  emit('update:modelValue', {
    ...draft,
    amount: Number(draft.amount) || 0,
    annualRate: Number(draft.annualRate) || 0,
    termMonths: Math.trunc(Number(draft.termMonths) || 0),
    earlyRepayments: props.modelValue.earlyRepayments,
  });
};

const errorFor = (field: string) => props.issues.find((issue) => issue.field === field)?.message ?? '';
</script>
