export type CompoundInterestInputField = 'initialAmount' | 'monthlyContribution' | 'annualRate' | 'termYears'

export interface CompoundInterestInput {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  termYears: number
}

export interface CompoundInterestResult {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  termYears: number
  termMonths: number
  ownContributions: number
  interestEarned: number
  finalAmount: number
  effectiveGrowthPercent: number
}

export interface CompoundInterestValidationIssue {
  field: CompoundInterestInputField
  messageKey: string
}
