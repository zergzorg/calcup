export type TripDirection = 'oneWay' | 'roundTrip'

export interface TripCostInput {
  distanceKm: number
  consumptionPer100Km: number
  fuelPricePerLiter: number
  tolls: number
  parking: number
  otherCosts: number
  passengers: number
  direction: TripDirection
}

export interface TripCostResult {
  effectiveDistanceKm: number
  fuelLiters: number
  fuelCost: number
  extraCosts: number
  totalCost: number
  costPerPerson: number
}

export type TripCostInputField = Exclude<keyof TripCostInput, 'direction'>

export interface TripCostValidationIssue {
  field: TripCostInputField
  messageKey: string
}
