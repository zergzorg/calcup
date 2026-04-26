import { computed, ref } from 'vue'
import { calculateIdealWeightResult } from '../lib/calculations'
import type {
  IdealWeightInputField,
  IdealWeightSex,
  IdealWeightValidationIssue,
} from '../types/ideal-weight'

function validateHeight(heightCm: number): IdealWeightValidationIssue | null {
  if (!Number.isFinite(heightCm)) {
    return { field: 'heightCm', messageKey: 'idealWeight.validation.heightCm.required' }
  }

  if (heightCm < 120 || heightCm > 230) {
    return { field: 'heightCm', messageKey: 'idealWeight.validation.heightCm.range' }
  }

  return null
}

export function useIdealWeightCalculator() {
  const sex = ref<IdealWeightSex>('male')
  const heightCm = ref(180)

  const issues = computed<IdealWeightValidationIssue[]>(() => {
    const issue = validateHeight(heightCm.value)
    return issue ? [issue] : []
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateIdealWeightResult(sex.value, heightCm.value)
  })

  function getIssue(field: IdealWeightInputField): IdealWeightValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    sex,
    heightCm,
    issues,
    result,
    getIssue,
  }
}
