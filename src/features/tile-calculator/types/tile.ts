export interface TileInput {
  surfaceLength: number
  surfaceWidth: number
  tileLengthCm: number
  tileWidthCm: number
  wastePercent: number
  tilesPerBox: number
  boxPrice: number
}

export interface TileResult {
  surfaceArea: number
  tileArea: number
  baseTiles: number
  tilesWithWaste: number
  boxesNeeded: number
  purchaseTiles: number
  leftoverTiles: number
  totalCost: number | null
}

export type TileInputField = keyof TileInput

export interface TileValidationIssue {
  field: TileInputField
  messageKey: string
}
