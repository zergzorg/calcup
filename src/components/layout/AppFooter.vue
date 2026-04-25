<template>
  <footer class="border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr_1.3fr_1fr]">
        <div class="max-w-sm">
          <RouterLink to="/" class="inline-flex items-center gap-2 text-lg font-bold text-gray-900">
            <img src="/calcup.svg" alt="" class="h-6 w-6" aria-hidden="true" />
            Calcup
          </RouterLink>
          <p class="mt-3 text-sm text-gray-500 leading-relaxed">
            Бесплатные онлайн калькуляторы для финансов, здоровья, математики и повседневных задач.
          </p>
          <p class="mt-4 text-xs font-medium text-gray-400">
            {{ readyCount }} готовых инструментов. Без регистрации.
          </p>
        </div>

        <div class="hidden md:block">
          <p class="text-sm font-semibold text-gray-900 mb-3">Категории</p>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            <li v-for="cat in mainCategories" :key="cat.slug">
              <RouterLink :to="cat.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {{ cat.title.ru }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="hidden md:block">
          <p class="text-sm font-semibold text-gray-900 mb-3">Популярные калькуляторы</p>
          <ul class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <li v-for="calc in popularCalcs" :key="calc.id">
              <RouterLink :to="calc.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {{ calc.title.ru }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="hidden md:block">
          <p class="text-sm font-semibold text-gray-900 mb-3">Calcup</p>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Все калькуляторы
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/workspace" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Рабочий стол
              </RouterLink>
            </li>
          </ul>
          <p class="mt-4 text-xs leading-relaxed text-gray-400">
            Добавляем новые расчёты, но держим навигацию короткой и предсказуемой.
          </p>
        </div>

        <div class="space-y-3 md:hidden">
          <details class="border-t border-gray-200 pt-3">
            <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
              Категории
              <span class="text-xs text-gray-400">{{ mainCategories.length }}</span>
            </summary>
            <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <li v-for="cat in mainCategories" :key="cat.slug">
                <RouterLink :to="cat.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {{ cat.title.ru }}
                </RouterLink>
              </li>
            </ul>
          </details>

          <details class="border-t border-gray-200 pt-3">
            <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
              Популярные калькуляторы
              <span class="text-xs text-gray-400">{{ popularCalcs.length }}</span>
            </summary>
            <ul class="mt-3 grid grid-cols-1 gap-y-2">
              <li v-for="calc in popularCalcs" :key="calc.id">
                <RouterLink :to="calc.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {{ calc.title.ru }}
                </RouterLink>
              </li>
            </ul>
          </details>

          <div class="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-200 pt-3">
            <RouterLink to="/" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Все калькуляторы
            </RouterLink>
            <RouterLink to="/workspace" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Рабочий стол
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© {{ year }} Calcup. Все калькуляторы бесплатны.</span>
        <span>Финансы, здоровье, математика, строительство и повседневные расчёты.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '../../data/categories'
import { CALCULATORS } from '../../data/calculators'

const year = new Date().getFullYear()
const mainCategories = CATEGORIES.slice(0, 8)
const readyCalcs = computed(() => CALCULATORS.filter(c => c.status === 'ready'))
const readyCount = computed(() => readyCalcs.value.length)
const popularCalcs = computed(() =>
  [...readyCalcs.value]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 8),
)
</script>
