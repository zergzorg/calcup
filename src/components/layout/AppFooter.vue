<template>
  <footer class="border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <RouterLink to="/" class="text-lg font-bold text-gray-900">Calcup</RouterLink>
          <p class="mt-2 text-sm text-gray-500 leading-relaxed">
            Бесплатные онлайн калькуляторы для финансов, здоровья, математики и повседневных задач.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-gray-900 mb-3">Категории</p>
          <ul class="space-y-2">
            <li v-for="cat in mainCategories" :key="cat.slug">
              <RouterLink :to="cat.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {{ cat.title.ru }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-gray-900 mb-3">Инструменты</p>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/workspace" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Рабочий стол
              </RouterLink>
            </li>
            <li v-for="calc in readyCalcs" :key="calc.id">
              <RouterLink :to="calc.path" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {{ calc.title.ru }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-6 text-xs text-gray-400 text-center">
        © {{ year }} Calcup. Все калькуляторы бесплатны.
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
const mainCategories = CATEGORIES.slice(0, 5)
const readyCalcs = computed(() => CALCULATORS.filter(c => c.status === 'ready'))
</script>
