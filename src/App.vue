<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useSeo } from './composables/useSeo'
useSeo()
</script>
