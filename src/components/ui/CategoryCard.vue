<template>
  <RouterLink
    :to="category.path"
    class="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-gray-300"
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
      :style="{ backgroundColor: category.color + '22' }"
    >
      {{ category.icon }}
    </div>

    <div>
      <p class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {{ category.title.ru }}
      </p>
      <p class="mt-1 text-sm text-gray-500 leading-snug">{{ category.description.ru }}</p>
    </div>

    <p v-if="count !== undefined" class="text-xs text-gray-400">
      {{ countLabel }}
    </p>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { CategoryMeta } from '../../data/types'

const props = defineProps<{
  category: CategoryMeta
  count?: number
}>()

const countLabel = computed(() => {
  const n = props.count ?? 0
  if (n === 0) return 'Скоро'
  if (n === 1) return '1 калькулятор'
  if (n >= 2 && n <= 4) return `${n} калькулятора`
  return `${n} калькуляторов`
})
</script>
