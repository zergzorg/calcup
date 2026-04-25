export type WeightUnit = 'milligram' | 'gram' | 'kilogram' | 'ton' | 'ounce' | 'pound' | 'stone'

export interface WeightValidationIssue {
  field: 'value'
  messageKey: 'weight.errors.invalid' | 'weight.errors.negative'
}