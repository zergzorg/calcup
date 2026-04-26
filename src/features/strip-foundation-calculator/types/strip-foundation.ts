export type StripFoundationInputField =
  | 'totalLengthM'
  | 'widthMm'
  | 'heightMm'
  | 'sandDepthMm'
  | 'wastePercent'
  | 'rebarRuns'
  | 'rebarDiameterMm'
  | 'concretePricePerM3'
  | 'rebarPricePerKg'

export interface StripFoundationInput {
  totalLengthM: number
  widthMm: number
  heightMm: number
  sandDepthMm: number
  wastePercent: number
  rebarRuns: number
  rebarDiameterMm: number
  concretePricePerM3: number
  rebarPricePerKg: number
}

export interface StripFoundationResult {
  baseConcreteVolumeM3: number
  concreteVolumeWithWasteM3: number
  sandVolumeM3: number
  formworkAreaM2: number
  rebarLengthM: number
  rebarWeightKg: number
  concreteCost: number | null
  rebarCost: number | null
  totalCost: number | null
}

export interface StripFoundationValidationIssue {
  field: StripFoundationInputField
  messageKey: string
}
