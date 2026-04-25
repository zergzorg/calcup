export type HeartRateZoneMethod = 'max' | 'reserve'

export interface HeartRateZone {
  key: 'z1' | 'z2' | 'z3' | 'z4' | 'z5'
  minPercent: number
  maxPercent: number
  minBpm: number
  maxBpm: number
}

export interface HeartRateZonesResult {
  maxHeartRate: number
  restingHeartRate: number | null
  method: HeartRateZoneMethod
  zones: HeartRateZone[]
}

export interface HeartRateValidationIssue {
  field: 'age' | 'maxHeartRate' | 'restingHeartRate'
  messageKey: string
}
