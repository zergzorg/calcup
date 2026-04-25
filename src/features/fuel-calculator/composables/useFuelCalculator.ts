import { computed, ref } from 'vue'
import {
  calcConsumptionPer100Km,
  calcRequiredFuel,
  calcTripCost,
  isValidNonNegative,
  isValidPositive,
} from '../lib/calculations'
import type { FuelMode, FuelValidationIssue } from '../types/fuel'

export function useFuelCalculator() {
  const mode = ref<FuelMode>('consumption')

  const distance = ref<number>(NaN)
  const fuelLiters = ref<number>(NaN)
  const consumptionPer100 = ref<number>(NaN)
  const pricePerLiter = ref<number>(NaN)

  const touched = ref(new Set<FuelValidationIssue['field']>())

  function touch(field: FuelValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<FuelValidationIssue[]>(() => {
    const result: FuelValidationIssue[] = []
    const d = distance.value
    const fl = fuelLiters.value
    const c = consumptionPer100.value
    const p = pricePerLiter.value

    if (!Number.isFinite(d)) {
      result.push({ field: 'distance', messageKey: 'fuel.validation.distance.required' })
    } else if (!isValidPositive(d)) {
      result.push({ field: 'distance', messageKey: 'fuel.validation.distance.positive' })
    }

    if (mode.value === 'consumption') {
      if (!Number.isFinite(fl)) {
        result.push({ field: 'fuel', messageKey: 'fuel.validation.fuel.required' })
      } else if (!isValidPositive(fl)) {
        result.push({ field: 'fuel', messageKey: 'fuel.validation.fuel.positive' })
      }
    }

    if (mode.value === 'requiredFuel' || mode.value === 'tripCost') {
      if (!Number.isFinite(c)) {
        result.push({ field: 'consumption', messageKey: 'fuel.validation.consumption.required' })
      } else if (!isValidPositive(c)) {
        result.push({ field: 'consumption', messageKey: 'fuel.validation.consumption.positive' })
      }
    }

    if (mode.value === 'tripCost') {
      if (!Number.isFinite(p)) {
        result.push({ field: 'price', messageKey: 'fuel.validation.price.required' })
      } else if (!isValidNonNegative(p)) {
        result.push({ field: 'price', messageKey: 'fuel.validation.price.nonNegative' })
      }
    }

    return result
  })

  function getIssue(field: FuelValidationIssue['field']): FuelValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(i => i.field === field)
  }

  const consumptionResult = computed(() => {
    if (mode.value !== 'consumption' || allIssues.value.length > 0) return null
    return calcConsumptionPer100Km(distance.value, fuelLiters.value)
  })

  const requiredFuelResult = computed(() => {
    if (mode.value !== 'requiredFuel' || allIssues.value.length > 0) return null
    return calcRequiredFuel(distance.value, consumptionPer100.value)
  })

  const tripCostResult = computed(() => {
    if (mode.value !== 'tripCost' || allIssues.value.length > 0) return null
    return calcTripCost(distance.value, consumptionPer100.value, pricePerLiter.value)
  })

  return {
    mode,
    distance,
    fuelLiters,
    consumptionPer100,
    pricePerLiter,
    touch,
    getIssue,
    consumptionResult,
    requiredFuelResult,
    tripCostResult,
  }
}
