<template>
  <SiteLayout v-if="route.meta.layout === 'site'">
    <RouterView />
  </SiteLayout>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeo } from './composables/useSeo'
import SiteLayout from './components/layout/SiteLayout.vue'

useSeo()
const route = useRoute()
</script>
