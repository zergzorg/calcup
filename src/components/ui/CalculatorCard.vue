<template>
  <component
    :is="calc.status === 'ready' ? RouterLink : 'div'"
    v-bind="calc.status === 'ready' ? { to: calc.path } : {}"
    class="group relative flex flex-col gap-3 rounded-xl border p-5 transition-all"
    :class="calc.status === 'ready'
      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'
      : 'border-gray-100 bg-gray-50 cursor-default'"
  >
    <div class="flex items-start justify-between">
      <span class="text-3xl leading-none" role="img" :aria-label="calc.title.ru">{{ calc.icon }}</span>
      <span
        v-if="calc.status === 'soon'"
        class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
      >Скоро</span>
    </div>

    <div>
      <p class="font-semibold leading-snug" :class="calc.status === 'soon' ? 'text-gray-400' : 'text-gray-900'">
        {{ calc.title.ru }}
      </p>
      <p class="mt-1 text-sm leading-snug" :class="calc.status === 'soon' ? 'text-gray-300' : 'text-gray-500'">
        {{ calc.description.ru }}
      </p>
    </div>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CalculatorMeta } from '../../data/types'

defineProps<{ calc: CalculatorMeta }>()
</script>
