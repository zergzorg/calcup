export type ProportionInputField = 'knownLeft' | 'knownRight' | 'targetLeft'

export interface RatioValue {
  left: number
  right: number
}

export interface ProportionResult {
  targetRight: number
  coefficient: number
  ratio: RatioValue
  targetPercentOfKnown: number
}

export interface ProportionValidationIssue {
  field: ProportionInputField
  messageKey: string
}
