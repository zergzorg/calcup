<template>
  <div class="category-stub">
    <RouterLink to="/">← Главная</RouterLink>
    <h1>{{ category?.title.ru ?? 'Категория' }}</h1>
    <p>{{ category?.description.ru }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { CATEGORIES } from '../data/categories'

const route = useRoute()
const category = computed(() =>
  CATEGORIES.find(c => c.slug === route.meta.categorySlug)
)
</script>

<style scoped>
.category-stub {
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
</style>
