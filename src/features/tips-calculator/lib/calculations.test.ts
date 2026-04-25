import { describe, it, expect } from 'vitest'
import { calculateTips, isValidAmount, isValidPercent, isValidPeopleCount } from './calculations'

describe('calculateTips', () => {
  it('1000, 10% → tip=100, total=1100', () => {
    const r = calculateTips(1000, 10, 1)!
    expect(r.tipAmount).toBe(100)
    expect(r.totalAmount).toBe(1100)
  })

  it('1000, 0% → tip=0, total=1000', () => {
    const r = calculateTips(1000, 0, 1)!
    expect(r.tipAmount).toBe(0)
    expect(r.totalAmount).toBe(1000)
  })

  it('1200, 10%, 3 people → billPerPerson=400, tipPerPerson=40, amountPerPerson=440', () => {
    const r = calculateTips(1200, 10, 3)!
    expect(r.billPerPerson).toBe(400)
    expect(r.tipPerPerson).toBe(40)
    expect(r.amountPerPerson).toBe(440)
  })

  it('custom percent 12.5%', () => {
    const r = calculateTips(200, 12.5, 1)!
    expect(r.tipAmount).toBe(25)
    expect(r.totalAmount).toBe(225)
  })

  it('bill=0 is valid → all zeros', () => {
    const r = calculateTips(0, 10, 1)!
    expect(r.tipAmount).toBe(0)
    expect(r.totalAmount).toBe(0)
  })

  it('peopleCount=1 is valid', () => {
    const r = calculateTips(500, 15, 1)!
    expect(r.amountPerPerson).toBe(575)
  })

  it('5 people split', () => {
    const r = calculateTips(500, 20, 5)!
    expect(r.amountPerPerson).toBe(120)
    expect(r.tipPerPerson).toBe(20)
    expect(r.billPerPerson).toBe(100)
  })

  it('rounds to 2 decimal places', () => {
    const r = calculateTips(100, 10, 3)!
    expect(r.amountPerPerson).toBe(36.67)
    expect(r.tipPerPerson).toBe(3.33)
  })

  it('peopleCount=0 → null', () => {
    expect(calculateTips(1000, 10, 0)).toBeNull()
  })

  it('fractional peopleCount → null', () => {
    expect(calculateTips(1000, 10, 1.5)).toBeNull()
  })

  it('negative bill → null', () => {
    expect(calculateTips(-100, 10, 1)).toBeNull()
  })

  it('negative percent → null', () => {
    expect(calculateTips(1000, -5, 1)).toBeNull()
  })

  it('NaN bill → null', () => {
    expect(calculateTips(NaN, 10, 1)).toBeNull()
  })

  it('Infinity percent → null', () => {
    expect(calculateTips(1000, Infinity, 1)).toBeNull()
  })

  it('NaN peopleCount → null', () => {
    expect(calculateTips(1000, 10, NaN)).toBeNull()
  })
})

describe('isValidAmount', () => {
  it('0 is valid', () => expect(isValidAmount(0)).toBe(true))
  it('positive is valid', () => expect(isValidAmount(1500)).toBe(true))
  it('negative is invalid', () => expect(isValidAmount(-1)).toBe(false))
  it('NaN is invalid', () => expect(isValidAmount(NaN)).toBe(false))
  it('Infinity is invalid', () => expect(isValidAmount(Infinity)).toBe(false))
})

describe('isValidPercent', () => {
  it('0 is valid', () => expect(isValidPercent(0)).toBe(true))
  it('100 is valid', () => expect(isValidPercent(100)).toBe(true))
  it('negative is invalid', () => expect(isValidPercent(-1)).toBe(false))
  it('NaN is invalid', () => expect(isValidPercent(NaN)).toBe(false))
})

describe('isValidPeopleCount', () => {
  it('1 is valid', () => expect(isValidPeopleCount(1)).toBe(true))
  it('10 is valid', () => expect(isValidPeopleCount(10)).toBe(true))
  it('0 is invalid', () => expect(isValidPeopleCount(0)).toBe(false))
  it('fractional is invalid', () => expect(isValidPeopleCount(2.5)).toBe(false))
  it('negative is invalid', () => expect(isValidPeopleCount(-1)).toBe(false))
  it('NaN is invalid', () => expect(isValidPeopleCount(NaN)).toBe(false))
})
