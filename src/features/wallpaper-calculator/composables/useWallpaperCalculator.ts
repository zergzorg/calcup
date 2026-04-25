import { computed, ref } from 'vue'
import { calculateWallpaper, isValidNonNegativeInteger, isValidNonNegativeNumber, isValidPositiveNumber } from '../lib/calculations'
import type { RollPreset, RollPresetId, WallpaperInput, WallpaperValidationIssue } from '../types/wallpaper'

export const ROLL_PRESETS: RollPreset[] = [
  { id: 'standard', width: 0.53, length: 10 },
  { id: 'medium', width: 0.7, length: 10 },
  { id: 'wide', width: 1.06, length: 10 },
]

export const ROLL_LENGTH_PRESETS = [10.05, 15, 25] as const
export const PATTERN_REPEAT_PRESETS = [0, 0.32, 0.64, 0.75] as const

export function useWallpaperCalculator() {
  const input = ref<WallpaperInput>({
    roomLength: 5,
    roomWidth: 4,
    wallHeight: 2.7,
    windowsCount: 1,
    windowWidth: 1.5,
    windowHeight: 1.4,
    doorsCount: 1,
    doorWidth: 0.9,
    doorHeight: 2,
    extraOpeningsArea: 0,
    rollWidth: 1.06,
    rollLength: 10,
    wastePercent: 10,
    usePatternRepeat: false,
    patternRepeat: 0.64,
    rollPrice: 0,
  })
  const selectedPreset = ref<RollPresetId>('wide')
  const touched = ref(new Set<WallpaperValidationIssue['field']>())

  function touch(field: WallpaperValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function setRollPreset(preset: RollPreset) {
    selectedPreset.value = preset.id
    input.value.rollWidth = preset.width
    input.value.rollLength = preset.length
  }

  function markCustomRoll() {
    selectedPreset.value = 'custom'
  }

  function setRollLength(length: number) {
    input.value.rollLength = length
    markCustomRoll()
  }

  function setPatternRepeat(value: number) {
    input.value.usePatternRepeat = value > 0
    if (value > 0) input.value.patternRepeat = value
  }

  const allIssues = computed<WallpaperValidationIssue[]>(() => {
    const issues: WallpaperValidationIssue[] = []
    const value = input.value

    positiveField(issues, 'roomLength', value.roomLength)
    positiveField(issues, 'roomWidth', value.roomWidth)
    positiveField(issues, 'wallHeight', value.wallHeight)
    positiveField(issues, 'rollWidth', value.rollWidth)
    positiveField(issues, 'rollLength', value.rollLength)
    nonNegativeIntegerField(issues, 'windowsCount', value.windowsCount)
    nonNegativeIntegerField(issues, 'doorsCount', value.doorsCount)
    nonNegativeField(issues, 'windowWidth', value.windowWidth)
    nonNegativeField(issues, 'windowHeight', value.windowHeight)
    nonNegativeField(issues, 'doorWidth', value.doorWidth)
    nonNegativeField(issues, 'doorHeight', value.doorHeight)
    nonNegativeField(issues, 'extraOpeningsArea', value.extraOpeningsArea)
    percentField(issues, 'wastePercent', value.wastePercent)
    nonNegativeField(issues, 'rollPrice', value.rollPrice)

    if (value.usePatternRepeat) {
      positiveField(issues, 'patternRepeat', value.patternRepeat)
    }

    const result = calculateWallpaper(value)
    if (issues.length === 0 && result === null) {
      issues.push({ field: 'rollLength', messageKey: 'wallpaper.validation.rollTooShort' })
    }

    return issues
  })

  function getIssue(field: WallpaperValidationIssue['field']): WallpaperValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateWallpaper(input.value)
  })

  return {
    input,
    selectedPreset,
    rollPresets: ROLL_PRESETS,
    rollLengthPresets: ROLL_LENGTH_PRESETS,
    patternRepeatPresets: PATTERN_REPEAT_PRESETS,
    allIssues,
    result,
    touch,
    getIssue,
    setRollPreset,
    markCustomRoll,
    setRollLength,
    setPatternRepeat,
  }
}

function positiveField(
  issues: WallpaperValidationIssue[],
  field: WallpaperValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.required` })
  } else if (!isValidPositiveNumber(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.positive` })
  }
}

function nonNegativeField(
  issues: WallpaperValidationIssue[],
  field: WallpaperValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.required` })
  } else if (!isValidNonNegativeNumber(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.nonNegative` })
  }
}

function nonNegativeIntegerField(
  issues: WallpaperValidationIssue[],
  field: WallpaperValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.integer` })
  } else if (!isValidNonNegativeInteger(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.nonNegative` })
  }
}

function percentField(
  issues: WallpaperValidationIssue[],
  field: WallpaperValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.required` })
  } else if (!isValidNonNegativeNumber(value)) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.nonNegative` })
  } else if (value > 100) {
    issues.push({ field, messageKey: `wallpaper.validation.${field}.max` })
  }
}
