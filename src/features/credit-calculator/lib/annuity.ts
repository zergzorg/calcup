import { roundMoney } from './money';

export function calculateAnnuityPayment(principal: number, annualRate: number, termMonths: number) {
  if (principal <= 0 || termMonths <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return roundMoney(principal / termMonths);
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return roundMoney(principal * monthlyRate * factor / (factor - 1));
}
