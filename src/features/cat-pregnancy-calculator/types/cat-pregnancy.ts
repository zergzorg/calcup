export type CatPregnancyInputField = 'matingDate' | 'todayDate'
export type CatPregnancyPhase = 'beforeStart' | 'early' | 'mid' | 'late' | 'queeningWindow' | 'pastWindow'

export interface CatPregnancyInput {
  matingDate: string
  todayDate: string
}

export interface CatPregnancyResult {
  matingDate: string
  dueDate: string
  earliestDate: string
  latestDate: string
  dayOfPregnancy: number
  daysUntilDue: number
  daysUntilEarliest: number
  daysUntilLatest: number
  phase: CatPregnancyPhase
}

export interface CatPregnancyValidationIssue {
  field: CatPregnancyInputField
  messageKey: string
}
