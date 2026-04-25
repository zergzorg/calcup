export type ShoeSizeSystem = 'cm' | 'mondopoint' | 'eu' | 'uk' | 'usMen' | 'usWomen'

export interface ShoeSizeSystemMeta {
  system: ShoeSizeSystem
}

export interface ShoeSizeConversionResult {
  footLengthCm: number
  mondopointMm: number
  eu: number
  ru: number
  uk: number
  usMen: number
  usWomen: number
  footLengthIn: number
}

export interface ShoeSizeValidationIssue {
  field: 'value'
  messageKey: string
}
