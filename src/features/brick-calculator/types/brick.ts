export interface BrickInput {
  wallLength: number
  wallHeight: number
  openingsArea: number
  brickLengthMm: number
  brickWidthMm: number
  brickHeightMm: number
  jointMm: number
  thicknessBricks: number
  wastePercent: number
  mortarSharePercent: number
  brickPrice: number
}

export interface BrickResult {
  grossArea: number
  netArea: number
  bricksPerM2HalfBrick: number
  baseBricks: number
  bricksWithWaste: number
  masonryVolume: number
  mortarVolume: number
  totalCost: number | null
}

export type BrickInputField = keyof BrickInput

export interface BrickValidationIssue {
  field: BrickInputField
  messageKey: string
}
