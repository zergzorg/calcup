export interface BlocksInput {
  wallLength: number
  wallHeight: number
  openingsArea: number
  blockLengthMm: number
  blockHeightMm: number
  blockWidthMm: number
  wastePercent: number
  adhesiveKgPerM2: number
  bagWeightKg: number
  blockPrice: number
}

export interface BlocksResult {
  grossArea: number
  netArea: number
  blockFaceArea: number
  blockVolume: number
  wallVolume: number
  baseBlocks: number
  blocksWithWaste: number
  adhesiveKg: number
  adhesiveBags: number
  totalCost: number | null
}

export type BlocksInputField = keyof BlocksInput

export interface BlocksValidationIssue {
  field: BlocksInputField
  messageKey: string
}
