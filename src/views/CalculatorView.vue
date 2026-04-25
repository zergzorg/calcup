<template>
  <div :class="['calculator-view', isCreditCalculator ? 'calculator-view--credit' : 'max-w-7xl mx-auto px-4 py-8']">
    <AppBreadcrumb :class="isCreditCalculator ? 'calculator-view__breadcrumb mb-6' : 'mb-6'" />
    <component :is="asyncComponent" v-if="asyncComponent" :key="calc?.id" />
    <SoonPlaceholder v-else-if="calc?.status === 'soon'" :calc="calc" />
    <NotFoundView v-else />
    <div v-if="calc?.status === 'ready'" :class="isCreditCalculator ? 'calculator-view__related' : ''">
      <RelatedCalculators :calc="calc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { CALCULATORS } from '../data/calculators'
import NotFoundView from './NotFoundView.vue'
import AppBreadcrumb from '../components/layout/AppBreadcrumb.vue'
import SoonPlaceholder from '../components/ui/SoonPlaceholder.vue'
import RelatedCalculators from '../components/ui/RelatedCalculators.vue'

const route = useRoute()

const calc = computed(() =>
  CALCULATORS.find(
    c => c.categorySlug === route.meta.categorySlug && c.slug === route.meta.toolSlug,
  ),
)

const isCreditCalculator = computed(() => calc.value?.id === 'credit')

const asyncComponent = shallowRef<Component | null>(null)

watch(
  () => calc.value?.id,
  () => {
    asyncComponent.value = calc.value?.componentLoader
      ? defineAsyncComponent({
          loader: calc.value.componentLoader,
          delay: 100,
          timeout: 10_000,
        })
      : null
  },
  { immediate: true },
)
</script>

<style scoped>
.calculator-view--credit {
  min-height: 100%;
  padding: 32px 0 72px;
  background:
    radial-gradient(circle at 18% 12%, rgba(255, 212, 142, 0.16), transparent 28%),
    linear-gradient(145deg, #1d2f43 0%, #0d141c 58%, #17202a 100%);
}

.calculator-view--credit :deep(.calculator-view__breadcrumb) {
  width: min(1240px, calc(100vw - 80px));
  margin-right: auto;
  margin-left: auto;
}

.calculator-view__related {
  width: min(1240px, calc(100vw - 80px));
  margin-right: auto;
  margin-left: auto;
}

.calculator-view--credit :deep(.related-calculators__divider) {
  background: rgba(255, 255, 255, 0.16);
}

.calculator-view--credit :deep(.related-calculators__heading h2) {
  color: #fff;
}

.calculator-view--credit :deep(.related-calculators__heading p) {
  color: rgba(255, 255, 255, 0.62);
}

.calculator-view--credit :deep(.calculator-view__breadcrumb a) {
  color: rgba(255, 255, 255, 0.68);
}

.calculator-view--credit :deep(.calculator-view__breadcrumb span) {
  color: rgba(255, 255, 255, 0.42);
}

.calculator-view--credit :deep(.calculator-view__breadcrumb span[aria-current="page"]) {
  color: #fff;
}

@media (max-width: 767px) {
  .calculator-view--credit {
    padding-top: 24px;
  }

  .calculator-view--credit :deep(.calculator-view__breadcrumb) {
    width: min(100% - 28px, 430px);
  }

  .calculator-view__related {
    width: min(100% - 28px, 430px);
  }
}
</style>
