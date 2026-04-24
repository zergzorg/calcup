<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900">
    <AppHeader @search="showSearch = true" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <SearchModal v-if="showSearch" @close="showSearch = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import SearchModal from '../ui/SearchModal.vue'

const showSearch = ref(false)
const openSearch = () => { showSearch.value = true }

provide('openSearch', openSearch)

onMounted(() => {
  document.body.dataset.layout = 'site'
})
onUnmounted(() => {
  delete document.body.dataset.layout
})
</script>
