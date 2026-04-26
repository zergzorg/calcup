import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { DataSizeMode, DataSizeUnit } from '../types/data-size'

export const DECIMAL_DATA_SIZE_UNITS = CONVERSION_UNITS_CONFIG.dataSize.decimalUnits as DataSizeUnit[]

export const BINARY_DATA_SIZE_UNITS = CONVERSION_UNITS_CONFIG.dataSize.binaryUnits as DataSizeUnit[]

export const BYTES_PER_DATA_SIZE_UNIT = CONVERSION_UNITS_CONFIG.dataSize.bytesPerUnit as Record<DataSizeUnit, number>

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
