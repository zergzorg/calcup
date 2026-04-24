import type { CreditCalculationResult, CreditInput, EarlyRepayment, PaymentScheduleItem } from '../types/credit';
import { calculateAnnuityPayment } from './annuity';
import { addMonths, compareIsoDates } from './date';
import { roundMoney } from './money';

const MAX_SCHEDULE_LENGTH = 720;
const MIN_BALANCE = 0.01;

function sortEarlyRepayments(items: EarlyRepayment[]) {
  return [...items].sort((left, right) => {
    const dateOrder = compareIsoDates(left.date, right.date);
    return dateOrder || left.id.localeCompare(right.id);
  });
}

function expandEarlyRepayments(input: CreditInput) {
  const lastPlannedPaymentDate = addMonths(input.firstPaymentDate, Math.max(0, input.termMonths - 1));
  const expanded: EarlyRepayment[] = [];

  for (const repayment of input.earlyRepayments) {
    if (repayment.frequency !== 'monthly') {
      expanded.push({ ...repayment, frequency: 'once' });
      continue;
    }

    let date = repayment.date;
    let occurrence = 0;
    while (compareIsoDates(date, lastPlannedPaymentDate) <= 0 && occurrence < input.termMonths) {
      expanded.push({
        ...repayment,
        id: `${repayment.id}:${occurrence}`,
        date,
      });
      date = addMonths(date, 1);
      occurrence++;
    }
  }

  return expanded;
}

function summarize(schedule: PaymentScheduleItem[], monthlyPayment: number, baseInterest = 0): CreditCalculationResult {
  const totalPayment = roundMoney(schedule.reduce((sum, item) => sum + item.payment + item.earlyRepayment, 0));
  const totalInterest = roundMoney(schedule.reduce((sum, item) => sum + item.interest, 0));
  const payoffDate = schedule.length ? schedule[schedule.length - 1].date : '';

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    overpayment: totalInterest,
    interestSavings: Math.max(0, roundMoney(baseInterest - totalInterest)),
    payoffDate,
    actualTermMonths: schedule.length,
    paymentCount: schedule.length,
    schedule,
  };
}

function buildSchedule(input: CreditInput) {
  const monthlyRate = input.annualRate / 100 / 12;
  const earlyRepayments = sortEarlyRepayments(expandEarlyRepayments(input));
  const schedule: PaymentScheduleItem[] = [];
  let balance = roundMoney(input.amount);
  let currentPayment = calculateAnnuityPayment(balance, input.annualRate, input.termMonths);
  let paymentDate = input.firstPaymentDate;
  let repaymentIndex = 0;

  for (let month = 1; month <= MAX_SCHEDULE_LENGTH && balance > MIN_BALANCE; month++) {
    const remainingMonths = Math.max(1, input.termMonths - month + 1);
    const interest = roundMoney(balance * monthlyRate);
    const plannedPrincipal = monthlyRate === 0
      ? roundMoney(balance / remainingMonths)
      : roundMoney(Math.max(0, currentPayment - interest));
    const principal = roundMoney(Math.min(balance, plannedPrincipal));
    const payment = roundMoney(principal + interest);

    balance = roundMoney(balance - principal);

    let earlyRepayment = 0;
    while (repaymentIndex < earlyRepayments.length && compareIsoDates(earlyRepayments[repaymentIndex].date, paymentDate) <= 0 && balance > MIN_BALANCE) {
      const repayment = earlyRepayments[repaymentIndex];
      const appliedAmount = roundMoney(Math.min(repayment.amount, balance));
      earlyRepayment = roundMoney(earlyRepayment + appliedAmount);
      balance = roundMoney(balance - appliedAmount);

      if (repayment.strategy === 'reduce_payment' && balance > MIN_BALANCE) {
        const monthsLeft = Math.max(1, input.termMonths - month);
        currentPayment = calculateAnnuityPayment(balance, input.annualRate, monthsLeft);
      }

      repaymentIndex++;
    }

    if (balance <= MIN_BALANCE) {
      balance = 0;
    }

    schedule.push({
      number: month,
      date: paymentDate,
      payment,
      interest,
      principal,
      earlyRepayment,
      balance,
    });

    paymentDate = addMonths(paymentDate, 1);
  }

  return { schedule, monthlyPayment: schedule[0]?.payment ?? currentPayment };
}

export function calculateCreditSchedule(input: CreditInput): CreditCalculationResult {
  const baseSchedule = buildSchedule({ ...input, earlyRepayments: [] });
  const baseResult = summarize(baseSchedule.schedule, baseSchedule.monthlyPayment);
  const actualSchedule = buildSchedule(input);

  return summarize(actualSchedule.schedule, actualSchedule.monthlyPayment, baseResult.totalInterest);
}
