import { computed, reactive } from 'vue'
import { calculateTile, isNonNegative, isPositive } from '../lib/calculations'
import type { TileInput, TileInputField, TileValidationIssue } from '../types/tile'

export function useTileCalculator() {
  const input = reactive<TileInput>({
    surfaceLength: 4,
    surfaceWidth: 3,
    tileLengthCm: 30,
    tileWidthCm: 30,
    wastePercent: 10,
    tilesPerBox: 11,
    boxPrice: 0,
  })

  const issues = computed<TileValidationIssue[]>(() => {
    const next: TileValidationIssue[] = []
    for (const field of ['surfaceLength', 'surfaceWidth', 'tileLengthCm', 'tileWidthCm'] as TileInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `tile.validation.${field}.positive` })
    }

    if (!Number.isInteger(input.tilesPerBox) || input.tilesPerBox <= 0) {
      next.push({ field: 'tilesPerBox', messageKey: 'tile.validation.tilesPerBox.positiveInteger' })
    }

    for (const field of ['wastePercent', 'boxPrice'] as TileInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `tile.validation.${field}.nonNegative` })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateTile(input),
  )

  function getIssue(field: TileInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setTileSize(lengthCm: number, widthCm: number) {
    input.tileLengthCm = lengthCm
    input.tileWidthCm = widthCm
  }

  return {
    input,
    result,
    getIssue,
    setTileSize,
  }
}
