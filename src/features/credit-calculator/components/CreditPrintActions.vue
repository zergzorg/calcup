<template>
  <div class="credit-print-actions">
    <button class="credit-button" type="button" @click="print">{{ t('credit.print.print') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const print = () => window.print();
</script>
