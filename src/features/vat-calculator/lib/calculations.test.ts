import { describe, expect, it } from 'vitest'
import { addVat, extractVat, isValidAmount, isValidRate } from './calculations'

describe('addVat', () => {
  it('1000 + 22% -> VAT 220, total 1220', () => {
    const r = addVat(1000, 22)
    expect(r?.vatAmount).toBe(220)
    expect(r?.amountWithVat).toBe(1220)
  })

  it('1000 + 10% → VAT 100, total 1100', () => {
    const r = addVat(1000, 10)
    expect(r?.vatAmount).toBe(100)
    expect(r?.amountWithVat).toBe(1100)
  })

  it('1000 + 7% -> VAT 70, total 1070', () => {
    const r = addVat(1000, 7)
    expect(r?.vatAmount).toBe(70)
    expect(r?.amountWithVat).toBe(1070)
  })

  it('1000 + 5% -> VAT 50, total 1050', () => {
    const r = addVat(1000, 5)
    expect(r?.vatAmount).toBe(50)
    expect(r?.amountWithVat).toBe(1050)
  })

  it('0% rate → VAT 0, total equals amount', () => {
    const r = addVat(1000, 0)
    expect(r?.vatAmount).toBe(0)
    expect(r?.amountWithVat).toBe(1000)
  })

  it('custom rate 15%', () => {
    const r = addVat(1000, 15)
    expect(r?.vatAmount).toBe(150)
    expect(r?.amountWithVat).toBe(1150)
  })

  it('amount = 0 is valid', () => {
    const r = addVat(0, 22)
    expect(r?.vatAmount).toBe(0)
    expect(r?.amountWithVat).toBe(0)
  })

  it('negative amount is invalid', () => {
    expect(addVat(-100, 22)).toBeNull()
  })

  it('negative rate is invalid', () => {
    expect(addVat(1000, -5)).toBeNull()
  })

  it('NaN is invalid', () => {
    expect(addVat(Number.NaN, 22)).toBeNull()
    expect(addVat(1000, Number.NaN)).toBeNull()
  })

  it('Infinity is invalid', () => {
    expect(addVat(Number.POSITIVE_INFINITY, 22)).toBeNull()
    expect(addVat(1000, Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('extractVat', () => {
  it('1220 with 22% -> VAT 220, without 1000', () => {
    const r = extractVat(1220, 22)
    expect(r?.vatAmount).toBe(220)
    expect(r?.amountWithoutVat).toBe(1000)
  })

  it('1100 with 10% → VAT 100, without 1000', () => {
    const r = extractVat(1100, 10)
    expect(r?.vatAmount).toBe(100)
    expect(r?.amountWithoutVat).toBe(1000)
  })

  it('1070 with 7% -> VAT 70, without 1000', () => {
    const r = extractVat(1070, 7)
    expect(r?.vatAmount).toBe(70)
    expect(r?.amountWithoutVat).toBe(1000)
  })

  it('1050 with 5% -> VAT 50, without 1000', () => {
    const r = extractVat(1050, 5)
    expect(r?.vatAmount).toBe(50)
    expect(r?.amountWithoutVat).toBe(1000)
  })

  it('0% rate → VAT 0, without equals amount', () => {
    const r = extractVat(1000, 0)
    expect(r?.vatAmount).toBe(0)
    expect(r?.amountWithoutVat).toBe(1000)
  })

  it('amount = 0 is valid', () => {
    const r = extractVat(0, 22)
    expect(r?.vatAmount).toBe(0)
    expect(r?.amountWithoutVat).toBe(0)
  })

  it('negative amount is invalid', () => {
    expect(extractVat(-100, 22)).toBeNull()
  })

  it('negative rate is invalid', () => {
    expect(extractVat(1200, -5)).toBeNull()
  })

  it('NaN is invalid', () => {
    expect(extractVat(Number.NaN, 22)).toBeNull()
  })

  it('Infinity is invalid', () => {
    expect(extractVat(Number.POSITIVE_INFINITY, 22)).toBeNull()
  })
})

describe('isValidAmount', () => {
  it('zero is valid', () => expect(isValidAmount(0)).toBe(true))
  it('positive is valid', () => expect(isValidAmount(500)).toBe(true))
  it('negative is invalid', () => expect(isValidAmount(-1)).toBe(false))
  it('NaN is invalid', () => expect(isValidAmount(Number.NaN)).toBe(false))
  it('Infinity is invalid', () => expect(isValidAmount(Number.POSITIVE_INFINITY)).toBe(false))
})

describe('isValidRate', () => {
  it('zero is valid', () => expect(isValidRate(0)).toBe(true))
  it('positive is valid', () => expect(isValidRate(22)).toBe(true))
  it('negative is invalid', () => expect(isValidRate(-1)).toBe(false))
  it('NaN is invalid', () => expect(isValidRate(Number.NaN)).toBe(false))
})
