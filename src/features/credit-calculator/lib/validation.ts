import type { CreditInput, ValidationIssue } from '../types/credit';
import { compareIsoDates, parseIsoDate } from './date';

export function validateCreditInput(input: CreditInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    issues.push({ field: 'amount', message: 'Укажите сумму кредита больше 0.' });
  }

  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 100) {
    issues.push({ field: 'annualRate', message: 'Укажите ставку от 0 до 100%.' });
  }

  if (!Number.isInteger(input.termMonths) || input.termMonths < 1 || input.termMonths > 600) {
    issues.push({ field: 'termMonths', message: 'Укажите срок от 1 до 600 месяцев.' });
  }

  if (!parseIsoDate(input.issueDate)) {
    issues.push({ field: 'issueDate', message: 'Укажите корректную дату выдачи.' });
  }

  if (!parseIsoDate(input.firstPaymentDate)) {
    issues.push({ field: 'firstPaymentDate', message: 'Укажите корректную дату первого платежа.' });
  }

  if (parseIsoDate(input.issueDate) && parseIsoDate(input.firstPaymentDate) && compareIsoDates(input.firstPaymentDate, input.issueDate) <= 0) {
    issues.push({ field: 'firstPaymentDate', message: 'Первый платеж должен быть позже даты выдачи.' });
  }

  input.earlyRepayments.forEach((repayment, index) => {
    if (!parseIsoDate(repayment.date)) {
      issues.push({ field: `earlyRepayments.${index}.date`, message: 'Укажите корректную дату досрочного платежа.' });
    }

    if (!Number.isFinite(repayment.amount) || repayment.amount <= 0) {
      issues.push({ field: `earlyRepayments.${index}.amount`, message: 'Сумма досрочного платежа должна быть больше 0.' });
    }

    if (parseIsoDate(repayment.date) && compareIsoDates(repayment.date, input.issueDate) <= 0) {
      issues.push({ field: `earlyRepayments.${index}.date`, message: 'Досрочный платеж должен быть позже даты выдачи.' });
    }
  });

  return issues;
}
