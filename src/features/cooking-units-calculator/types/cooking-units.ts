export type CookingUnit =
  | 'milliliter'
  | 'liter'
  | 'teaspoon'
  | 'tablespoon'
  | 'cup'
  | 'fluidOunce'
  | 'pint'
  | 'quart'

export interface CookingUnitsValidationIssue {
  messageKey: string
}
