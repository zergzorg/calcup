export type ClothingSizeSystem = 'international' | 'ru' | 'eu' | 'us' | 'uk'

export type ClothingSizeKey = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

export interface ClothingSizeRow {
  key: ClothingSizeKey
  international: string
  ru: string
  eu: string
  us: string
  uk: string
  chest: string
  waist: string
  hips: string
}

export interface ClothingSizeOption {
  key: ClothingSizeKey
  label: string
}
