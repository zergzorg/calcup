import { describe, expect, it } from 'vitest'
import {
  AVERAGE_CALENDAR_DAYS_PER_MONTH,
  calculateAccountingDays,
  calculateVacationPay,
} from './calculations'

describe('vacation pay calculations', () => {
  it('uses 29.3 days for each fully worked month', () => {
    expect(calculateAccountingDays(12, 0)).toBeCloseTo(351.6, 10)
    expect(AVERAGE_CALENDAR_DAYS_PER_MONTH).toBe(29.3)
  })

  it('calculates gross, tax and net vacation pay', () => {
    const result = calculateVacationPay({
      earnings: 1_200_000,
      fullMonths: 12,
      partialMonthDays: 0,
      vacationDays: 14,
      taxPercent: 13,
    })

    expect(result?.accountingDays).toBe(351.6)
    expect(result?.averageDailyEarnings).toBe(3412.97)
    expect(result?.grossVacationPay).toBe(47781.58)
    expect(result?.taxAmount).toBe(6211.61)
    expect(result?.netVacationPay).toBe(41569.97)
  })

  it('supports a partially worked calculation period', () => {
    const result = calculateVacationPay({
      earnings: 900_000,
      fullMonths: 10,
      partialMonthDays: 20,
      vacationDays: 7,
      taxPercent: 0,
    })

    expect(result?.accountingDays).toBe(313)
    expect(result?.grossVacationPay).toBe(20127.8)
    expect(result?.netVacationPay).toBe(20127.8)
  })

  it('rejects invalid inputs', () => {
    const valid = {
      earnings: 1_200_000,
      fullMonths: 12,
      partialMonthDays: 0,
      vacationDays: 14,
      taxPercent: 13,
    }

    expect(calculateVacationPay({ ...valid, earnings: 0 })).toBeNull()
    expect(calculateVacationPay({ ...valid, fullMonths: 13 })).toBeNull()
    expect(calculateVacationPay({ ...valid, partialMonthDays: 32 })).toBeNull()
    expect(calculateVacationPay({ ...valid, vacationDays: 0 })).toBeNull()
    expect(calculateVacationPay({ ...valid, taxPercent: 101 })).toBeNull()
  })
})
