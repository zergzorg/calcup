export type ComplexityLevel = 'simple' | 'normal' | 'complex' | 'expert'
export type UrgencyLevel = 'normal' | 'soon' | 'urgent'

export interface ProjectPriceInput {
  hourlyRate: number
  projectHours: number
  complexityLevel: ComplexityLevel
  urgencyLevel: UrgencyLevel
  expenseAmount: number
  taxPercent: number
}

export interface ProjectPriceResult {
  complexityMultiplier: number
  urgencyMultiplier: number
  adjustedHourlyRate: number
  laborCost: number
  subtotal: number
  taxAmount: number
  totalProjectPrice: number
}

export interface ProjectPriceValidationIssue {
  field: 'hourlyRate' | 'projectHours' | 'expenseAmount' | 'taxPercent'
  messageKey: string
}
