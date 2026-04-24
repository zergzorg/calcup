import { ref, computed, watch } from 'vue'
import { CALCULATORS } from '../data/calculators'
import type { CalculatorMeta } from '../data/types'

function normalize(s: string): string {
  return s.toLowerCase().trim()
}

function matches(calc: CalculatorMeta, q: string): boolean {
  const haystack = [
    calc.title.ru,
    calc.title.en,
    ...calc.tags,
    ...(calc.aliases ?? []),
  ].map(normalize)
  return haystack.some(t => t.includes(q))
}

export function useSearch() {
  const query = ref('')
  const debouncedQuery = ref('')

  let timer: ReturnType<typeof setTimeout>
  watch(query, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => { debouncedQuery.value = val }, 200)
  })

  const results = computed<CalculatorMeta[]>(() => {
    const q = normalize(debouncedQuery.value)
    if (q.length < 2) return []
    return CALCULATORS.filter(c => c.status === 'ready' && matches(c, q))
  })

  const isActive = computed(() => debouncedQuery.value.length >= 2)

  function clear() {
    query.value = ''
    debouncedQuery.value = ''
  }

  return { query, results, isActive, clear }
}
