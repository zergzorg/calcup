<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <AppBreadcrumb class="mb-6" />

    <template v-if="category">
      <div class="flex items-center gap-4 mb-8">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shrink-0"
          :style="{ backgroundColor: category.color + '22' }"
        >
          {{ category.icon }}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ category.title.ru }}</h1>
          <p class="text-gray-500 mt-1">{{ category.description.ru }}</p>
        </div>
      </div>

      <div v-if="visibleCalcs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CalculatorCard v-for="calc in visibleCalcs" :key="calc.id" :calc="calc" />
      </div>

      <div v-else class="py-16 text-center text-gray-400">
        Калькуляторы в этой категории появятся скоро
      </div>
    </template>

    <div v-else class="py-16 text-center">
      <p class="text-2xl font-bold text-gray-900 mb-2">Категория не найдена</p>
      <RouterLink to="/" class="text-sm text-blue-600 hover:underline">На главную</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { CALCULATORS } from '../data/calculators'
import AppBreadcrumb from '../components/layout/AppBreadcrumb.vue'
import CalculatorCard from '../components/ui/CalculatorCard.vue'

const route = useRoute()

const category = computed(() =>
  CATEGORIES.find(c => c.slug === route.meta.categorySlug),
)

const visibleCalcs = computed(() =>
  CALCULATORS
    .filter(c => c.categorySlug === route.meta.categorySlug && c.status !== 'planned')
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || (b.popularity ?? 0) - (a.popularity ?? 0)),
)
</script>
