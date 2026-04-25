export interface ConcreteInput {
  lengthM: number
  widthM: number
  thicknessMm: number
  wastePercent: number
  bagYieldLiters: number
  pricePerM3: number
}

export interface ConcreteResult {
  area: number
  baseVolumeM3: number
  volumeWithWasteM3: number
  volumeLiters: number
  bagsNeeded: number
  purchaseLiters: number
  leftoverLiters: number
  totalCost: number | null
}

export type ConcreteInputField = keyof ConcreteInput

export interface ConcreteValidationIssue {
  field: ConcreteInputField
  messageKey: string
}
