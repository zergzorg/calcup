<template>
  <section class="credit-panel credit-schedule" :aria-label="t('credit.schedule.title')">
    <div class="credit-section-title inline">
      <div>
        <span>{{ t('credit.schedule.eyebrow') }}</span>
        <h2>{{ t('credit.schedule.title') }}</h2>
      </div>
      <button class="credit-button ghost" type="button" @click="expanded = !expanded">
        {{ expanded ? t('credit.schedule.collapse') : t('credit.schedule.expand') }}
      </button>
    </div>

    <div class="credit-table-wrap">
      <table>
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
          <tr v-for="item in visibleItems" :key="item.number">
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PaymentScheduleItem } from '../types/credit';
import { formatDisplayDate } from '../lib/date';
import { formatMoney } from '../lib/money';

const props = defineProps<{
  items: PaymentScheduleItem[];
}>();

const { t, locale } = useI18n();
const expanded = ref(false);
const visibleItems = computed(() => expanded.value ? props.items : props.items.slice(0, 12));
const money = (value: number) => formatMoney(value, locale.value);
const date = (value: string) => formatDisplayDate(value, locale.value);
</script>
