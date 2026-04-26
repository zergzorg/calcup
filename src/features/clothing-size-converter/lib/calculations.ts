import type { ClothingSizeKey, ClothingSizeOption, ClothingSizeRow, ClothingSizeSystem } from '../types/clothingSize'

export const CLOTHING_SIZE_SYSTEMS: ClothingSizeSystem[] = ['international', 'ru', 'eu', 'us', 'uk']

export const CLOTHING_SIZE_ROWS: ClothingSizeRow[] = [
  {
    key: 'xs',
    international: 'XS',
    ru: '40-42',
    eu: '34-36',
    us: '2-4',
    uk: '6-8',
    chest: '80-84',
    waist: '60-64',
    hips: '86-90',
  },
  {
    key: 's',
    international: 'S',
    ru: '42-44',
    eu: '36-38',
    us: '4-6',
    uk: '8-10',
    chest: '84-88',
    waist: '64-68',
    hips: '90-94',
  },
  {
    key: 'm',
    international: 'M',
    ru: '46-48',
    eu: '40-42',
    us: '8-10',
    uk: '12-14',
    chest: '92-96',
    waist: '72-76',
    hips: '98-102',
  },
  {
    key: 'l',
    international: 'L',
    ru: '50-52',
    eu: '44-46',
    us: '12-14',
    uk: '16-18',
    chest: '100-104',
    waist: '80-84',
    hips: '106-110',
  },
  {
    key: 'xl',
    international: 'XL',
    ru: '54-56',
    eu: '48-50',
    us: '16-18',
    uk: '20-22',
    chest: '108-112',
    waist: '88-92',
    hips: '114-118',
  },
  {
    key: 'xxl',
    international: 'XXL',
    ru: '58-60',
    eu: '52-54',
    us: '20-22',
    uk: '24-26',
    chest: '116-120',
    waist: '96-100',
    hips: '122-126',
  },
]

export function resolveClothingSize(sizeKey: ClothingSizeKey): ClothingSizeRow | null {
  return CLOTHING_SIZE_ROWS.find((row) => row.key === sizeKey) ?? null
}

export function getClothingSizeOptions(system: ClothingSizeSystem): ClothingSizeOption[] {
  return CLOTHING_SIZE_ROWS.map((row) => ({
    key: row.key,
    label: row[system],
  }))
}
