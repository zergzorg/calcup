<template>
  <div class="relative" ref="root">
    <button
      @click="open = !open"
      class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      :class="{ 'border-blue-400 ring-1 ring-blue-100': open }"
      aria-haspopup="listbox"
      :aria-expanded="open"
    >
      <span class="text-base leading-none">{{ current.flag }}</span>
      <span class="hidden sm:inline font-medium">{{ current.label }}</span>
      <svg
        class="w-3.5 h-3.5 text-gray-400 transition-transform"
        :class="{ 'rotate-180': open }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open"
        role="listbox"
        class="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50 origin-top-right"
      >
        <li
          v-for="lang in LANGUAGES"
          :key="lang.code"
          role="option"
          :aria-selected="locale === lang.code"
          @click="select(lang.code)"
          class="flex items-center gap-2.5 w-full px-3 py-2 text-sm cursor-pointer transition-colors"
          :class="locale === lang.code
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <span class="text-base leading-none">{{ lang.flag }}</span>
          {{ lang.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

const current = computed(() => LANGUAGES.find(l => l.code === locale.value) ?? LANGUAGES[0])

const select = (code: string) => {
  locale.value = code
  localStorage.setItem('user-locale', code)
  open.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
