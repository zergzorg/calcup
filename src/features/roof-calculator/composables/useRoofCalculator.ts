import { computed, reactive } from 'vue'
import { calculateRoof, isNonNegative, isPositive, isValidPitch } from '../lib/calculations'
import type { RoofInput, RoofInputField, RoofType, RoofValidationIssue } from '../types/roof'

export const defaultRoofInput: RoofInput = {
  roofType: 'gable',
  lengthM: 10,
  widthM: 8,
  overhangMm: 500,
  pitchDegrees: 30,
  sheetLengthM: 3,
  sheetWidthM: 1.1,
  sideOverlapMm: 100,
  endOverlapMm: 200,
  wastePercent: 10,
  pricePerSheet: 0,
}

export function validateRoofInput(input: RoofInput): RoofValidationIssue[] {
  const issues: RoofValidationIssue[] = []

  if (!isPositive(input.lengthM)) issues.push({ field: 'lengthM', messageKey: 'roof.validation.lengthM' })
  if (!isPositive(input.widthM)) issues.push({ field: 'widthM', messageKey: 'roof.validation.widthM' })
  if (!isNonNegative(input.overhangMm)) issues.push({ field: 'overhangMm', messageKey: 'roof.validation.overhangMm' })
  if (!isValidPitch(input.pitchDegrees)) issues.push({ field: 'pitchDegrees', messageKey: 'roof.validation.pitchDegrees' })
  if (!isPositive(input.sheetLengthM)) issues.push({ field: 'sheetLengthM', messageKey: 'roof.validation.sheetLengthM' })
  if (!isPositive(input.sheetWidthM)) issues.push({ field: 'sheetWidthM', messageKey: 'roof.validation.sheetWidthM' })
  if (!isNonNegative(input.sideOverlapMm)) issues.push({ field: 'sideOverlapMm', messageKey: 'roof.validation.sideOverlapMm' })
  if (!isNonNegative(input.endOverlapMm)) issues.push({ field: 'endOverlapMm', messageKey: 'roof.validation.endOverlapMm' })
  if (input.sheetWidthM - input.sideOverlapMm / 1000 <= 0) issues.push({ field: 'sideOverlapMm', messageKey: 'roof.validation.overlapWidth' })
  if (input.sheetLengthM - input.endOverlapMm / 1000 <= 0) issues.push({ field: 'endOverlapMm', messageKey: 'roof.validation.overlapLength' })
  if (!isNonNegative(input.wastePercent)) issues.push({ field: 'wastePercent', messageKey: 'roof.validation.wastePercent' })
  if (!isNonNegative(input.pricePerSheet)) issues.push({ field: 'pricePerSheet', messageKey: 'roof.validation.pricePerSheet' })

  return issues
}

export function useRoofCalculator() {
  const input = reactive<RoofInput>({ ...defaultRoofInput })
  const issues = computed(() => validateRoofInput(input))
  const result = computed(() => issues.value.length ? null : calculateRoof(input))

  function getIssue(field: keyof RoofInput): RoofValidationIssue | undefined {
    return issues.value.find((issue) => issue.field === field)
  }

  function setRoofType(roofType: RoofType): void {
    input.roofType = roofType
  }

  function setPitch(pitchDegrees: number): void {
    input.pitchDegrees = pitchDegrees
  }

  function setWaste(wastePercent: number): void {
    input.wastePercent = wastePercent
  }

  function setSheetSize(lengthM: number, widthM: number): void {
    input.sheetLengthM = lengthM
    input.sheetWidthM = widthM
  }

  function updateNumber(field: RoofInputField, value: number): void {
    input[field] = value
  }

  return {
    input,
    issues,
    result,
    getIssue,
    setRoofType,
    setPitch,
    setWaste,
    setSheetSize,
    updateNumber,
  }
}
