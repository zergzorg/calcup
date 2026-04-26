export interface AverageStats {
  values: number[]
  count: number
  sum: number
  mean: number
  median: number
  min: number
  max: number
  range: number
}

export interface NumberListParseResult {
  values: number[]
  invalidTokens: string[]
}

export interface AverageValidationIssue {
  messageKey: string
  params?: Record<string, string | number>
}
