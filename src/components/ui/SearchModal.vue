<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-16"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <span class="text-gray-400 text-lg">🔍</span>
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            placeholder="Поиск калькуляторов..."
            class="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
            @keydown.escape="$emit('close')"
          />
          <button
            class="rounded px-2 py-1 text-xs text-gray-400 border border-gray-200 hover:bg-gray-50"
            @click="$emit('close')"
          >ESC</button>
        </div>

        <div class="max-h-80 overflow-y-auto">
          <template v-if="isActive">
            <RouterLink
              v-for="calc in results"
              :key="calc.id"
              :to="calc.path"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              @click="$emit('close')"
            >
              <span class="text-2xl leading-none w-8 text-center">{{ calc.icon }}</span>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ calc.title.ru }}</p>
                <p class="text-xs text-gray-500">{{ calc.description.ru }}</p>
              </div>
            </RouterLink>

            <div v-if="!results.length" class="px-4 py-6 text-center text-sm text-gray-400">
              Ничего не найдено по запросу «{{ query }}»
            </div>
          </template>

          <div v-else class="px-4 py-6 text-center text-sm text-gray-400">
            Введите минимум 2 символа
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSearch } from '../../composables/useSearch'

defineEmits<{ close: [] }>()

const { query, results, isActive } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)
onMounted(() => inputRef.value?.focus())
</script>
