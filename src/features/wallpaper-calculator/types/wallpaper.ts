export interface WallpaperInput {
  roomLength: number
  roomWidth: number
  wallHeight: number
  windowsCount: number
  windowWidth: number
  windowHeight: number
  doorsCount: number
  doorWidth: number
  doorHeight: number
  extraOpeningsArea: number
  rollWidth: number
  rollLength: number
  wastePercent: number
  usePatternRepeat: boolean
  patternRepeat: number
  rollPrice: number
}

export interface WallpaperResult {
  perimeter: number
  grossWallArea: number
  windowsArea: number
  doorsArea: number
  openingsArea: number
  netWallArea: number
  areaWithWaste: number
  rollArea: number
  stripHeight: number
  adjustedStripHeight: number
  stripsNeeded: number
  stripsPerRoll: number
  rollsByArea: number
  rollsByStrips: number
  recommendedRolls: number
  totalCost: number | null
  openingsExceedWalls: boolean
  calculationBasis: 'area' | 'strips'
}

export interface RollPreset {
  id: 'standard' | 'medium' | 'wide'
  width: number
  length: number
}

export type RollPresetId = RollPreset['id'] | 'custom'
export type WallpaperNumericField = Exclude<keyof WallpaperInput, 'usePatternRepeat'>

export interface WallpaperValidationIssue {
  field: WallpaperNumericField
  messageKey: string
}
