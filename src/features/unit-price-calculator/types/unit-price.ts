export type UnitPriceUnit = 'gram' | 'kilogram' | 'milliliter' | 'liter' | 'piece'

export type UnitGroup = 'mass' | 'volume' | 'count'

export interface ProductInput {
  id: string
  name: string
  price: number | string
  amount: number | string
  unit: UnitPriceUnit
  note?: string
}

export interface ProductResult {
  id: string
  name: string
  price: number
  amount: number
  unit: UnitPriceUnit
  unitGroup: UnitGroup
  effectivePrice: number
  normalizedAmount: number
  unitPrice: number
  displayBaseUnit: UnitPriceUnit
  isValid: boolean
}

export interface SavingsResult {
  savingsPerBaseUnit: number
  savingsPercent: number
}

export interface ComparisonResult {
  results: ProductResult[]
  canCompare: boolean
  hasMixedGroups: boolean
  winner: ProductResult | null
  savingsByProductId: Record<string, SavingsResult>
}

export interface ValidationIssue {
  field:
    | `product.${number}.price`
    | `product.${number}.amount`
    | `product.${number}.unit`
  messageKey: string
}
