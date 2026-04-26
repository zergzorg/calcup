import { computed, ref } from 'vue'
import { calculateBodyFat } from '../lib/calculations'
import type { BodyFatInputField, BodyFatSex, BodyFatValidationIssue } from '../types/bodyFat'

const FIELD_RANGES: Record<BodyFatInputField, { min: number; max: number }> = {
  heightCm: { min: 120, max: 230 },
  neckCm: { min: 20, max: 80 },
  waistCm: { min: 40, max: 220 },
  hipCm: { min: 40, max: 220 },
}

function validateNumber(field: BodyFatInputField, value: number): BodyFatValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `bodyFat.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `bodyFat.validation.${field}.range` }
  }

  return null
}

export function useBodyFatCalculator() {
  const sex = ref<BodyFatSex>('male')
  const heightCm = ref(178)
  const neckCm = ref(40)
  const waistCm = ref(88)
  const hipCm = ref(96)
  const weightKg = ref(82)

  const issues = computed<BodyFatValidationIssue[]>(() => {
    const fields: Array<[BodyFatInputField, number]> = [
      ['heightCm', heightCm.value],
      ['neckCm', neckCm.value],
      ['waistCm', waistCm.value],
    ]

    if (sex.value === 'female') fields.push(['hipCm', hipCm.value])

    return fields
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is BodyFatValidationIssue => Boolean(issue))
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateBodyFat({
      sex: sex.value,
      heightCm: heightCm.value,
      neckCm: neckCm.value,
      waistCm: waistCm.value,
      hipCm: hipCm.value,
    }, weightKg.value)
  })

  function getIssue(field: BodyFatInputField): BodyFatValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    sex,
    heightCm,
    neckCm,
    waistCm,
    hipCm,
    weightKg,
    issues,
    result,
    getIssue,
  }
}
