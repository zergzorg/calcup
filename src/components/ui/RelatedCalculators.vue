<template>
  <section v-if="relatedCalcs.length" class="related-calculators" aria-labelledby="related-calculators-title">
    <div class="related-calculators__divider" />

    <div class="related-calculators__heading">
      <h2 id="related-calculators-title">Похожие калькуляторы</h2>
      <p>{{ category?.title.ru }}: ещё несколько быстрых инструментов для близких расчётов.</p>
    </div>

    <div class="related-calculators__grid">
      <CalculatorCard
        v-for="related in relatedCalcs"
        :key="related.id"
        :calc="related"
        compact
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CalculatorMeta } from '../../data/types'
import { CATEGORIES } from '../../data/categories'
import { CALCULATORS } from '../../data/calculators'
import CalculatorCard from './CalculatorCard.vue'

const props = defineProps<{
  calc: CalculatorMeta
}>()

const category = computed(() =>
  CATEGORIES.find(c => c.slug === props.calc.categorySlug),
)

const relatedCalcs = computed(() =>
  CALCULATORS
    .filter(c =>
      c.status === 'ready'
      && c.categorySlug === props.calc.categorySlug
      && c.id !== props.calc.id
    )
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 4),
)
</script>

<style scoped>
.related-calculators {
  margin-top: 32px;
}

.related-calculators__divider {
  height: 1px;
  background: #e5e7eb;
}

.related-calculators__heading {
  margin-top: 22px;
  margin-bottom: 14px;
}

.related-calculators__heading h2 {
  margin: 0;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
}

.related-calculators__heading p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.45;
}

.related-calculators__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1023px) {
  .related-calculators__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .related-calculators {
    margin-top: 26px;
  }

  .related-calculators__grid {
    gap: 10px;
  }
}
</style>
