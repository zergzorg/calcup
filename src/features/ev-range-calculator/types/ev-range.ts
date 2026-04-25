export interface EvRangeInput {
  batteryCapacityKwh: number
  currentChargePercent: number
  targetChargePercent: number
  consumptionKwhPer100Km: number
  reservePercent: number
  electricityPrice: number
}

export interface EvRangeResult {
  currentEnergyKwh: number
  targetEnergyKwh: number
  chargeEnergyKwh: number
  usableEnergyKwh: number
  rangeKm: number
  rangeMiles: number
  chargeCost: number | null
  costPer100Km: number | null
}

export type EvRangeInputField = keyof EvRangeInput

export interface EvRangeValidationIssue {
  field: EvRangeInputField
  messageKey: string
}
