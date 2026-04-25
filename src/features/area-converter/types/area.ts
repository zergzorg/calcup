export type AreaUnit =
  | 'squareMillimeter'
  | 'squareCentimeter'
  | 'squareMeter'
  | 'squareKilometer'
  | 'hectare'
  | 'are'
  | 'squareInch'
  | 'squareFoot'
  | 'squareYard'
  | 'acre'

export interface AreaUnitMeta {
  unit: AreaUnit
  squareMeters: number
}

export interface AreaValidationIssue {
  field: 'value'
  messageKey: string
}
