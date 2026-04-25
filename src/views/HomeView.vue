<template>
  <!-- Hero -->
  <section class="bg-gradient-to-b from-blue-50 to-white px-4 pt-8 pb-6 text-center">
    <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
      Онлайн калькуляторы
    </h1>
    <p class="mt-2 text-lg text-gray-500 max-w-xl mx-auto">
      Бесплатные инструменты для расчётов: кредиты, здоровье, математика и многое другое.
    </p>

    <!-- Inline search -->
    <div
      class="relative mt-6 max-w-2xl mx-auto text-left"
      @focusout="onSearchBlur"
    >
      <div class="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 shadow-md px-5 py-3.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="Найти калькулятор..."
          class="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
          @focus="searchOpen = true"
          @keydown.escape="closeSearch"
        />
        <button
          v-if="query"
          class="text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Очистить"
          @mousedown.prevent
          @click="closeSearch"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Results dropdown -->
      <div
        v-if="searchOpen && isActive"
        class="absolute top-full mt-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto"
      >
        <RouterLink
          v-for="calc in results"
          :key="calc.id"
          :to="calc.path"
          class="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors"
          @mousedown.prevent
          @click="closeSearch"
        >
          <span class="text-2xl leading-none w-8 text-center shrink-0">{{ calc.icon }}</span>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ calc.title.ru }}</p>
            <p class="text-xs text-gray-500">{{ calc.description.ru }}</p>
          </div>
        </RouterLink>

        <div v-if="!results.length" class="px-5 py-6 text-center text-sm text-gray-400">
          Ничего не найдено по запросу «{{ query }}»
        </div>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="max-w-7xl mx-auto px-4 pt-8 pb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-5">Категории</h2>
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
  <section v-if="readyCalcs.length" class="max-w-7xl mx-auto px-4 pb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-5">Готовые калькуляторы</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CalculatorCard v-for="calc in readyCalcs" :key="calc.id" :calc="calc" />
    </div>
  </section>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { CALCULATORS } from '../data/calculators'
import CategoryCard from '../components/ui/CategoryCard.vue'
import CalculatorCard from '../components/ui/CalculatorCard.vue'
import { useSearch } from '../composables/useSearch'

const { query, results, isActive, clear } = useSearch()
const searchOpen = ref(false)

function closeSearch() {
  clear()
  searchOpen.value = false
}

function onSearchBlur(e: FocusEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (!related || !(e.currentTarget as HTMLElement).contains(related)) {
    searchOpen.value = false
  }
}

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
