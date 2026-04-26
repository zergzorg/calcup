export type MetronomeCadenceMode = 'everyStep' | 'everyOtherStep'

export type MetronomeInputField = 'bpm' | 'beatsPerBar' | 'durationMinutes'

export interface MetronomeInput {
  bpm: number
  beatsPerBar: number
  durationMinutes: number
  cadenceMode: MetronomeCadenceMode
}

export interface MetronomeResult {
  bpm: number
  intervalMs: number
  beatIntervalSeconds: number
  beatsPerBar: number
  barSeconds: number
  durationMinutes: number
  totalBeats: number
  targetCadenceSpm: number
}

export interface MetronomeValidationIssue {
  field: MetronomeInputField
  messageKey: string
}
