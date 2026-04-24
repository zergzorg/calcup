export type PaymentType = 'annuity' | 'differentiated';

export type EarlyRepaymentStrategy = 'reduce_term' | 'reduce_payment';

export type EarlyRepaymentFrequency = 'once' | 'monthly';

export interface CreditInput {
  amount: number;
  annualRate: number;
  termMonths: number;
  issueDate: string;
  firstPaymentDate: string;
  paymentType: PaymentType;
  earlyRepayments: EarlyRepayment[];
}

export interface EarlyRepayment {
  id: string;
  date: string;
  amount: number;
  strategy: EarlyRepaymentStrategy;
  frequency?: EarlyRepaymentFrequency;
}

export interface PaymentScheduleItem {
  number: number;
  date: string;
  payment: number;
  interest: number;
  principal: number;
  earlyRepayment: number;
  balance: number;
}

export interface CreditCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  overpayment: number;
  interestSavings: number;
  payoffDate: string;
  actualTermMonths: number;
  paymentCount: number;
  schedule: PaymentScheduleItem[];
}

export interface ValidationIssue {
  field: string;
  message: string;
}
