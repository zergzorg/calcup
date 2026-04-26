export type VolumeUnit =
  | 'milliliter'
  | 'liter'
  | 'cubicMeter'
  | 'cubicCentimeter'
  | 'gallon'
  | 'quart'
  | 'pint'
  | 'cup'
  | 'tablespoon'
  | 'teaspoon'

export interface VolumeValidationIssue {
  messageKey: string
}
