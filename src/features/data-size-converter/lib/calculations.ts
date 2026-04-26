import type { DataSizeMode, DataSizeUnit } from '../types/data-size'

export const DECIMAL_DATA_SIZE_UNITS: DataSizeUnit[] = [
  'byte',
  'kilobyte',
  'megabyte',
  'gigabyte',
  'terabyte',
]

export const BINARY_DATA_SIZE_UNITS: DataSizeUnit[] = [
  'byte',
  'kibibyte',
  'mebibyte',
  'gibibyte',
  'tebibyte',
]

export const BYTES_PER_DATA_SIZE_UNIT: Record<DataSizeUnit, number> = {
  byte: 1,
  kilobyte: 1000,
  megabyte: 1000 ** 2,
  gigabyte: 1000 ** 3,
  terabyte: 1000 ** 4,
  kibibyte: 1024,
  mebibyte: 1024 ** 2,
  gibibyte: 1024 ** 3,
  tebibyte: 1024 ** 4,
}

export function getDataSizeUnits(mode: DataSizeMode): DataSizeUnit[] {
  return mode === 'binary' ? BINARY_DATA_SIZE_UNITS : DECIMAL_DATA_SIZE_UNITS
}

export function convertDataSize(value: number, from: DataSizeUnit, to: DataSizeUnit): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null
  }

  const fromFactor = BYTES_PER_DATA_SIZE_UNIT[from]
  const toFactor = BYTES_PER_DATA_SIZE_UNIT[to]

  if (!fromFactor || !toFactor) {
    return null
  }

  return value * fromFactor / toFactor
}
