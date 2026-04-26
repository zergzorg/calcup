export type EquationMode = 'linear' | 'quadratic'

export type EquationInputField = 'linearA' | 'linearB' | 'quadraticA' | 'quadraticB' | 'quadraticC'

export interface LinearEquationResult {
  type: 'one' | 'none' | 'infinite'
  root: number | null
}

export interface QuadraticEquationResult {
  type: 'two' | 'one' | 'none' | 'linear'
  discriminant: number
  roots: number[]
}

export interface EquationValidationIssue {
  field: EquationInputField
  messageKey: string
}
