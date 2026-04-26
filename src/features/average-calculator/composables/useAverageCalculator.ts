import { computed, ref } from 'vue'
import { calculateAverageStats, parseNumberList } from '../lib/calculations'
import type { AverageValidationIssue } from '../types/average'

const MAX_VALUES = 500

export function useAverageCalculator() {
  const numbersInput = ref('10 12 9 15 14')

  const parsed = computed(() => parseNumberList(numbersInput.value))

  const issue = computed<AverageValidationIssue | null>(() => {
    if (parsed.value.invalidTokens.length > 0) {
      const issue: AverageValidationIssue = {
        messageKey: 'average.validation.invalidTokens',
        params: { tokens: parsed.value.invalidTokens.slice(0, 3).join(', ') },
      }

      return issue
    }

    if (parsed.value.values.length === 0) {
      return { messageKey: 'average.validation.required' }
    }

    if (parsed.value.values.length > MAX_VALUES) {
      const issue: AverageValidationIssue = {
        messageKey: 'average.validation.tooMany',
        params: { max: MAX_VALUES },
      }

      return issue
    }

    return null
  })

  const result = computed(() => {
    if (issue.value) {
      return null
    }

    return calculateAverageStats(parsed.value.values)
  })

  return {
    numbersInput,
    parsed,
    issue,
    result,
  }
}
