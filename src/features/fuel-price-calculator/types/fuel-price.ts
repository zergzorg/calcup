export interface FuelPriceInput {
  budget: number
  pricePerLiter: number
  consumptionPer100Km: number
}

export interface FuelPriceResult {
  liters: number
  distanceKm: number
  costPer100Km: number
}

export type FuelPriceInputField = keyof FuelPriceInput

export interface FuelPriceValidationIssue {
  field: FuelPriceInputField
  messageKey: string
}
