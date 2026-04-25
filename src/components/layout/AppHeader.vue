<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0">
        <img src="/calcup.svg" alt="" class="h-7 w-7" aria-hidden="true" />
        <span class="font-bold text-lg text-gray-900">Calcup</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
        <div ref="categoryRoot" class="relative" @pointerenter="openCategoryMenu">
          <button
            ref="categoryButton"
            class="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-1"
            aria-haspopup="true"
            :aria-expanded="catOpen"
            @focus="openCategoryMenu"
          >
            Калькуляторы
            <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': catOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            ref="categoryMenu"
            v-show="catOpen"
            class="site-category-menu absolute left-1/2 -translate-x-1/2 w-80"
            @mouseenter="openCategoryMenu"
          >
            <div class="site-category-menu__panel rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <RouterLink
                v-for="cat in CATEGORIES"
                :key="cat.slug"
                :to="cat.path"
                class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                @click="closeCategoryMenu"
              >
                <span class="text-xl leading-none w-6 text-center">{{ cat.icon }}</span>
                <span class="text-sm text-gray-700">{{ cat.title.ru }}</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          to="/workspace"
          class="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >Рабочий стол</RouterLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <LanguageSwitcher />

        <button
          :class="route.path === '/' ? 'invisible pointer-events-none' : ''"
          class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          aria-label="Поиск калькуляторов"
          @click="$emit('search')"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden sm:inline">Поиск</span>
        </button>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
          :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="mobileOpen"
      class="md:hidden border-t border-gray-100 bg-white px-4 pb-4"
      @click="mobileOpen = false"
    >
      <p class="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Категории</p>
      <RouterLink
        v-for="cat in CATEGORIES"
        :key="cat.slug"
        :to="cat.path"
        class="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <span class="text-lg leading-none w-5 text-center">{{ cat.icon }}</span>
        {{ cat.title.ru }}
      </RouterLink>
      <div class="my-2 border-t border-gray-100" />
      <RouterLink to="/workspace" class="block py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900">Рабочий стол</RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CATEGORIES } from '../../data/categories'
import LanguageSwitcher from '../LanguageSwitcher.vue'

defineEmits<{ search: [] }>()

const route = useRoute()
const catOpen = ref(false)
const mobileOpen = ref(false)
const categoryRoot = ref<HTMLElement | null>(null)
const categoryButton = ref<HTMLElement | null>(null)
const categoryMenu = ref<HTMLElement | null>(null)
let categoryPointerListenerActive = false

function isPointInsideRect(rect: DOMRect, x: number, y: number) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function openCategoryMenu() {
  catOpen.value = true
  if (categoryPointerListenerActive || typeof window === 'undefined') return
  window.addEventListener('pointermove', handleCategoryPointerMove)
  categoryPointerListenerActive = true
}

function closeCategoryMenu() {
  catOpen.value = false
  if (!categoryPointerListenerActive || typeof window === 'undefined') return
  window.removeEventListener('pointermove', handleCategoryPointerMove)
  categoryPointerListenerActive = false
}

function handleCategoryPointerMove(event: PointerEvent) {
  if (!catOpen.value) return

  const buttonRect = categoryButton.value?.getBoundingClientRect()
  const menuRect = categoryMenu.value?.getBoundingClientRect()
  const rootRect = categoryRoot.value?.getBoundingClientRect()

  const isInsideButton = buttonRect ? isPointInsideRect(buttonRect, event.clientX, event.clientY) : false
  const isInsideMenu = menuRect ? isPointInsideRect(menuRect, event.clientX, event.clientY) : false
  const isInsideRoot = rootRect ? isPointInsideRect(rootRect, event.clientX, event.clientY) : false

  if (isInsideButton || isInsideMenu || isInsideRoot) return
  closeCategoryMenu()
}

onBeforeUnmount(closeCategoryMenu)
</script>

<style scoped>
.site-category-menu {
  top: 100%;
  padding-top: 10px;
}

.site-category-menu__panel {
  position: relative;
}
</style>
