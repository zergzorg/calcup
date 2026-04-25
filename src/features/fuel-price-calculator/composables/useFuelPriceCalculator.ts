import { computed, reactive } from 'vue'
import { calculateFuelPrice, isPositive } from '../lib/calculations'
import type { FuelPriceInput, FuelPriceInputField, FuelPriceValidationIssue } from '../types/fuel-price'

export function useFuelPriceCalculator() {
  const input = reactive<FuelPriceInput>({
    budget: 3000,
    pricePerLiter: 62,
    consumptionPer100Km: 8.2,
  })

  const issues = computed<FuelPriceValidationIssue[]>(() => {
    const next: FuelPriceValidationIssue[] = []

    for (const field of ['budget', 'pricePerLiter', 'consumptionPer100Km'] as FuelPriceInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `fuelPrice.validation.${field}.positive` })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateFuelPrice(input),
  )

  function getIssue(field: FuelPriceInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    input,
    result,
    getIssue,
  }
}
