<template>
  <!-- Hero -->
  <section class="bg-gradient-to-b from-blue-50 to-white px-4 py-16 text-center">
    <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
      Онлайн калькуляторы
    </h1>
    <p class="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
      Бесплатные инструменты для расчётов: кредиты, здоровье, математика и многое другое.
    </p>
    <button
      class="mt-8 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm text-gray-500 shadow-sm hover:border-blue-300 hover:shadow transition-all"
      @click="openSearch()"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Найти калькулятор...
    </button>
  </section>

  <!-- Categories -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <CategoryCard
        v-for="cat in CATEGORIES"
        :key="cat.slug"
        :category="cat"
        :count="readyCountByCategory[cat.slug]"
      />
    </div>
  </section>

  <!-- Ready calculators -->
  <section v-if="readyCalcs.length" class="max-w-7xl mx-auto px-4 pb-12">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Готовые калькуляторы</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CalculatorCard v-for="calc in readyCalcs" :key="calc.id" :calc="calc" />
    </div>
  </section>

  <!-- Workspace promo -->
  <section class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold">Рабочий стол Calcup</h2>
        <p class="mt-2 text-gray-400 max-w-md">
          Pomodoro-таймер, планировщик задач, фоновые звуки и многое другое — всё в одном месте.
        </p>
      </div>
      <RouterLink
        to="/workspace"
        class="shrink-0 rounded-xl bg-white text-gray-900 px-6 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        Открыть рабочий стол →
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { CALCULATORS } from '../data/calculators'
import CategoryCard from '../components/ui/CategoryCard.vue'
import CalculatorCard from '../components/ui/CalculatorCard.vue'

const openSearch = inject<() => void>('openSearch', () => {})

const readyCalcs = computed(() => CALCULATORS.filter(c => c.status === 'ready'))

const readyCountByCategory = computed(() => {
  const map: Record<string, number> = {}
  for (const c of CALCULATORS) {
    if (c.status === 'ready') {
      map[c.categorySlug] = (map[c.categorySlug] ?? 0) + 1
    }
  }
  return map
})
</script>
