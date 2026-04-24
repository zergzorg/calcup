<template>
  <div class="flex flex-col items-center justify-center gap-6 py-20 px-4 text-center">
    <span class="text-6xl" role="img" :aria-label="calc.title.ru">{{ calc.icon }}</span>

    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ calc.title.ru }}</h1>
      <p class="mt-2 text-gray-500">{{ calc.description.ru }}</p>
    </div>

    <div class="rounded-xl border border-amber-200 bg-amber-50 px-6 py-4 max-w-sm">
      <p class="text-sm font-medium text-amber-800">Калькулятор в разработке</p>
      <p class="mt-1 text-xs text-amber-600">Он скоро появится. Следите за обновлениями.</p>
    </div>

    <RouterLink
      :to="backPath"
      class="text-sm text-blue-600 hover:underline"
    >
      ← Назад к категории
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { CalculatorMeta } from '../../data/types'
import { CATEGORIES } from '../../data/categories'

const props = defineProps<{ calc: CalculatorMeta }>()

const backPath = computed(() => {
  const cat = CATEGORIES.find(c => c.slug === props.calc.categorySlug)
  return cat?.path ?? '/'
})
</script>
