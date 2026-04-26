export type SlabFoundationInputField =
  | 'lengthM'
  | 'widthM'
  | 'thicknessMm'
  | 'sandDepthMm'
  | 'gravelDepthMm'
  | 'rebarSpacingMm'
  | 'rebarDiameterMm'
  | 'rebarLayers'
  | 'wastePercent'
  | 'concretePricePerM3'
  | 'rebarPricePerKg'

export interface SlabFoundationInput {
  lengthM: number
  widthM: number
  thicknessMm: number
  sandDepthMm: number
  gravelDepthMm: number
  rebarSpacingMm: number
  rebarDiameterMm: number
  rebarLayers: number
  wastePercent: number
  concretePricePerM3: number
  rebarPricePerKg: number
}

export interface SlabFoundationResult {
  areaM2: number
  baseConcreteVolumeM3: number
  concreteVolumeWithWasteM3: number
  sandVolumeM3: number
  gravelVolumeM3: number
  longitudinalBars: number
  transverseBars: number
  barsPerLayer: number
  totalBarsInGrid: number
  rebarLengthM: number
  rebarWeightKg: number
  concreteCost: number | null
  rebarCost: number | null
  totalCost: number | null
}

export interface SlabFoundationValidationIssue {
  field: SlabFoundationInputField
  messageKey: string
}
