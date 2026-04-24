<template>
  <nav v-if="crumbs.length > 1" aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm text-gray-500">
    <template v-for="(crumb, i) in crumbs" :key="crumb.path">
      <span v-if="i > 0" class="text-gray-300" aria-hidden="true">/</span>
      <RouterLink
        v-if="i < crumbs.length - 1"
        :to="crumb.path"
        class="hover:text-gray-900 transition-colors"
      >{{ crumb.label }}</RouterLink>
      <span v-else class="text-gray-900 font-medium" aria-current="page">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { CATEGORIES } from '../../data/categories'
import { CALCULATORS } from '../../data/calculators'

const route = useRoute()

const crumbs = computed(() => {
  const list: Array<{ label: string; path: string }> = [
    { label: 'Calcup', path: '/' },
  ]

  const { categorySlug, toolSlug } = route.meta

  if (categorySlug) {
    const cat = CATEGORIES.find(c => c.slug === categorySlug)
    if (cat) list.push({ label: cat.title.ru, path: cat.path })
  }

  if (categorySlug && toolSlug) {
    const calc = CALCULATORS.find(c => c.categorySlug === categorySlug && c.slug === toolSlug)
    if (calc) list.push({ label: calc.title.ru, path: calc.path })
  }

  return list
})
</script>
