<template>
  <component :is="asyncComponent" v-if="asyncComponent" :key="calc?.id" />
  <div v-else-if="calc?.status === 'soon'" class="soon-stub">
    <RouterLink :to="'/' + calc.categorySlug">← {{ calc.categorySlug }}</RouterLink>
    <h1>{{ calc.title.ru }}</h1>
    <p>Этот калькулятор находится в разработке. Скоро здесь появится инструмент.</p>
  </div>
  <NotFoundView v-else />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { CALCULATORS } from '../data/calculators'
import NotFoundView from './NotFoundView.vue'

const route = useRoute()

const calc = computed(() =>
  CALCULATORS.find(
    c => c.categorySlug === route.meta.categorySlug && c.slug === route.meta.toolSlug
  )
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
  { immediate: true }
)
</script>

<style scoped>
.soon-stub {
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
</style>
