import { ref, computed, watch } from 'vue'
import { CALCULATORS } from '../data/calculators'
import type { CalculatorMeta } from '../data/types'

export function normalizeSearchText(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/[⋅·∙•]/g, ' ')
    .trim()
}

function compactSearchText(s: string): string {
  return normalizeSearchText(s).replace(/[^\p{L}\p{N}]+/gu, '')
}

export function matchesCalculator(calc: CalculatorMeta, query: string): boolean {
  const q = normalizeSearchText(query)
  const compactQ = compactSearchText(query)
  if (q.length < 2) return false

  const haystack = [
    calc.title.ru,
    calc.title.en,
    calc.description.ru,
    calc.description.en,
    ...calc.tags,
    ...(calc.aliases ?? []),
  ]

  return haystack.some((term) => {
    const normalized = normalizeSearchText(term)
    return normalized.includes(q) || compactSearchText(term).includes(compactQ)
  })
}

export function searchCalculators(query: string, calculators: CalculatorMeta[] = CALCULATORS): CalculatorMeta[] {
  const q = normalizeSearchText(query)
  if (q.length < 2) return []
  return calculators.filter(calc => calc.status === 'ready' && matchesCalculator(calc, q))
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
    return searchCalculators(debouncedQuery.value)
  })

  const isActive = computed(() => debouncedQuery.value.length >= 2)

  function clear() {
    query.value = ''
    debouncedQuery.value = ''
  }

  return { query, results, isActive, clear }
}
