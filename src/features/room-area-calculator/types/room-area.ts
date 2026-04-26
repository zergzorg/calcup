export interface RoomAreaInput {
  lengthM: number
  widthM: number
  heightM: number
  windowsCount: number
  windowWidthM: number
  windowHeightM: number
  doorsCount: number
  doorWidthM: number
  doorHeightM: number
  extraOpeningsAreaM2: number
}

export interface RoomAreaResult {
  floorAreaM2: number
  ceilingAreaM2: number
  perimeterM: number
  grossWallAreaM2: number
  openingsAreaM2: number
  finishWallAreaM2: number
  baseboardLengthM: number
}

export interface RoomAreaValidationIssue {
  field: keyof RoomAreaInput
  messageKey: string
}
