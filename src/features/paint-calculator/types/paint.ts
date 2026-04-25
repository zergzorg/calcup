export interface PaintInput {
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
  coats: number
  coveragePerLiter: number
  wastePercent: number
  canVolume: number
  canPrice: number
}

export interface PaintResult {
  perimeter: number
  grossWallArea: number
  openingsArea: number
  paintableArea: number
  coatedArea: number
  baseLiters: number
  litersWithWaste: number
  cansNeeded: number
  purchaseVolume: number
  leftoverLiters: number
  totalCost: number | null
  openingsExceedWalls: boolean
}

export interface PaintValidationIssue {
  field: keyof PaintInput
  messageKey: string
}
