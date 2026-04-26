export type DogPregnancyMode = 'mating' | 'ovulation'
export type DogPregnancyInputField = 'matingDate' | 'ovulationDate' | 'todayDate'
export type DogPregnancyPhase = 'beforeStart' | 'early' | 'mid' | 'late' | 'whelpingWindow' | 'pastWindow'

export interface DogPregnancyInput {
  mode: DogPregnancyMode
  matingDate: string
  ovulationDate: string
  todayDate: string
}

export interface DogPregnancyResult {
  mode: DogPregnancyMode
  anchorDate: string
  dueDate: string
  earliestDate: string
  latestDate: string
  dayOfPregnancy: number
  daysUntilDue: number
  daysUntilEarliest: number
  daysUntilLatest: number
  phase: DogPregnancyPhase
}

export interface DogPregnancyValidationIssue {
  field: DogPregnancyInputField
  messageKey: string
}
