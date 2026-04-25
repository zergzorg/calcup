import { computed, reactive, ref } from 'vue'
import { calculateTripCost, isNonNegative, isPositive } from '../lib/calculations'
import type { TripCostInput, TripCostInputField, TripCostValidationIssue, TripDirection } from '../types/trip-cost'

export function useTripCostCalculator() {
  const direction = ref<TripDirection>('oneWay')

  const input = reactive<Omit<TripCostInput, 'direction'>>({
    distanceKm: 320,
    consumptionPer100Km: 8.2,
    fuelPricePerLiter: 62,
    tolls: 0,
    parking: 0,
    otherCosts: 0,
    passengers: 1,
  })

  const issues = computed<TripCostValidationIssue[]>(() => {
    const next: TripCostValidationIssue[] = []

    for (const field of ['distanceKm', 'consumptionPer100Km'] as TripCostInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `tripCost.validation.${field}.positive` })
    }

    for (const field of ['fuelPricePerLiter', 'tolls', 'parking', 'otherCosts'] as TripCostInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `tripCost.validation.${field}.nonNegative` })
    }

    if (!Number.isInteger(input.passengers) || input.passengers <= 0) {
      next.push({ field: 'passengers', messageKey: 'tripCost.validation.passengers.positiveInteger' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateTripCost({ ...input, direction: direction.value }),
  )

  function getIssue(field: TripCostInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    input,
    direction,
    result,
    getIssue,
  }
}
