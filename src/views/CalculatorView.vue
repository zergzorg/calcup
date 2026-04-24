<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <AppBreadcrumb class="mb-6" />
    <component :is="asyncComponent" v-if="asyncComponent" :key="calc?.id" />
    <SoonPlaceholder v-else-if="calc?.status === 'soon'" :calc="calc" />
    <NotFoundView v-else />
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

const route = useRoute()

const calc = computed(() =>
  CALCULATORS.find(
    c => c.categorySlug === route.meta.categorySlug && c.slug === route.meta.toolSlug,
  ),
)

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
