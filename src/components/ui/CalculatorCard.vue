<template>
  <component
    :is="calc.status === 'ready' ? RouterLink : 'div'"
    v-bind="calc.status === 'ready' ? { to: calc.path } : {}"
    class="group relative flex flex-col rounded-xl border transition-all"
    :class="[
      compact ? 'gap-2 p-3.5' : 'gap-3 p-5',
      calc.status === 'ready'
        ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'
        : 'border-gray-100 bg-gray-50 cursor-default',
    ]"
  >
    <div class="flex items-start justify-between">
      <span
        class="leading-none"
        :class="compact ? 'text-2xl' : 'text-3xl'"
        role="img"
        :aria-label="calc.title.ru"
      >{{ calc.icon }}</span>
      <span
        v-if="calc.status === 'soon'"
        class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
      >Скоро</span>
      <span
        v-else-if="calc.isPopular"
        class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
        title="Популярный калькулятор"
        aria-label="Популярный калькулятор"
      >
        <span aria-hidden="true">★</span>
        <span v-if="!compact">Популярный</span>
      </span>
    </div>

    <div>
      <p
        class="font-semibold leading-snug"
        :class="[
          calc.status === 'soon' ? 'text-gray-400' : 'text-gray-900',
          compact ? 'text-sm' : '',
        ]"
      >
        {{ calc.title.ru }}
      </p>
      <p
        class="mt-1 leading-snug"
        :class="[
          calc.status === 'soon' ? 'text-gray-300' : 'text-gray-500',
          compact ? 'line-clamp-2 text-xs' : 'text-sm',
        ]"
      >
        {{ calc.description.ru }}
      </p>
    </div>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CalculatorMeta } from '../../data/types'

defineProps<{
  calc: CalculatorMeta
  compact?: boolean
}>()
</script>
