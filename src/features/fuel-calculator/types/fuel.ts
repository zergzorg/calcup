export type FuelMode = 'consumption' | 'requiredFuel' | 'tripCost'

export interface FuelValidationIssue {
  field: 'distance' | 'fuel' | 'consumption' | 'price'
  messageKey: string
}
