export type LengthUnit =
  | 'millimeter'
  | 'centimeter'
  | 'meter'
  | 'kilometer'
  | 'inch'
  | 'foot'
  | 'yard'
  | 'mile'

export interface LengthUnitMeta {
  unit: LengthUnit
  meters: number
}

export interface LengthValidationIssue {
  field: 'value'
  messageKey: string
}
