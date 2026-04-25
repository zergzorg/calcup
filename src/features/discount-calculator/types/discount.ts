export type DiscountMode = 'discount' | 'markup' | 'findPercent' | 'findOriginal'

export interface DiscountResult {
  mode: 'discount'
  discountAmount: number
  finalPrice: number
}

export interface MarkupResult {
  mode: 'markup'
  markupAmount: number
  finalPrice: number
}

export interface FindPercentResult {
  mode: 'findPercent'
  changePercent: number
  direction: 'discount' | 'markup' | 'same'
}

export interface FindOriginalResult {
  mode: 'findOriginal'
  originalPrice: number
  discountAmount: number
}

export type CalcResult = DiscountResult | MarkupResult | FindPercentResult | FindOriginalResult

export interface DiscountValidationIssue {
  field: string
  messageKey: string
}
