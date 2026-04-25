import { describe, it, expect } from 'vitest'
import {
  calcDiscount,
  calcMarkup,
  calcFindPercent,
  calcFindOriginal,
  isValidPrice,
  isValidPercent,
} from './calculations'

describe('calcDiscount', () => {
  it('1000, 10% → discount 100, final 900', () => {
    const r = calcDiscount(1000, 10)!
    expect(r.discountAmount).toBe(100)
    expect(r.finalPrice).toBe(900)
  })

  it('1000, 0% → discount 0, final 1000', () => {
    const r = calcDiscount(1000, 0)!
    expect(r.discountAmount).toBe(0)
    expect(r.finalPrice).toBe(1000)
  })

  it('200, 25% → discount 50, final 150', () => {
    const r = calcDiscount(200, 25)!
    expect(r.discountAmount).toBe(50)
    expect(r.finalPrice).toBe(150)
  })

  it('0 price → discount 0, final 0', () => {
    const r = calcDiscount(0, 10)!
    expect(r.discountAmount).toBe(0)
    expect(r.finalPrice).toBe(0)
  })

  it('negative price → null', () => { expect(calcDiscount(-100, 10)).toBeNull() })
  it('negative percent → null', () => { expect(calcDiscount(1000, -5)).toBeNull() })
  it('NaN price → null', () => { expect(calcDiscount(NaN, 10)).toBeNull() })
  it('Infinity percent → null', () => { expect(calcDiscount(1000, Infinity)).toBeNull() })
})

describe('calcMarkup', () => {
  it('1000, 20% → markup 200, final 1200', () => {
    const r = calcMarkup(1000, 20)!
    expect(r.markupAmount).toBe(200)
    expect(r.finalPrice).toBe(1200)
  })

  it('500, 50% → markup 250, final 750', () => {
    const r = calcMarkup(500, 50)!
    expect(r.markupAmount).toBe(250)
    expect(r.finalPrice).toBe(750)
  })

  it('0% → markup 0, same final price', () => {
    const r = calcMarkup(800, 0)!
    expect(r.markupAmount).toBe(0)
    expect(r.finalPrice).toBe(800)
  })

  it('negative price → null', () => { expect(calcMarkup(-1, 10)).toBeNull() })
  it('NaN → null', () => { expect(calcMarkup(NaN, 10)).toBeNull() })
})

describe('calcFindPercent', () => {
  it('1000 → 900: -10%, direction discount', () => {
    const r = calcFindPercent(1000, 900)!
    expect(r.changePercent).toBe(-10)
    expect(r.direction).toBe('discount')
  })

  it('1000 → 1200: +20%, direction markup', () => {
    const r = calcFindPercent(1000, 1200)!
    expect(r.changePercent).toBe(20)
    expect(r.direction).toBe('markup')
  })

  it('1000 → 1000: 0%, direction same', () => {
    const r = calcFindPercent(1000, 1000)!
    expect(r.changePercent).toBe(0)
    expect(r.direction).toBe('same')
  })

  it('oldPrice 0 → null', () => { expect(calcFindPercent(0, 900)).toBeNull() })
  it('negative oldPrice → null', () => { expect(calcFindPercent(-100, 900)).toBeNull() })
  it('negative newPrice → null', () => { expect(calcFindPercent(1000, -1)).toBeNull() })
  it('NaN → null', () => { expect(calcFindPercent(NaN, 900)).toBeNull() })
})

describe('calcFindOriginal', () => {
  it('900, 10% → original 1000, discount 100', () => {
    const r = calcFindOriginal(900, 10)!
    expect(r.originalPrice).toBe(1000)
    expect(r.discountAmount).toBe(100)
  })

  it('750, 25% → original 1000, discount 250', () => {
    const r = calcFindOriginal(750, 25)!
    expect(r.originalPrice).toBe(1000)
    expect(r.discountAmount).toBe(250)
  })

  it('0% discount → original equals final', () => {
    const r = calcFindOriginal(500, 0)!
    expect(r.originalPrice).toBe(500)
    expect(r.discountAmount).toBe(0)
  })

  it('100% discount → null (division by zero)', () => { expect(calcFindOriginal(0, 100)).toBeNull() })
  it('101% discount → null', () => { expect(calcFindOriginal(100, 101)).toBeNull() })
  it('negative final price → null', () => { expect(calcFindOriginal(-100, 10)).toBeNull() })
  it('NaN → null', () => { expect(calcFindOriginal(NaN, 10)).toBeNull() })
})

describe('isValidPrice', () => {
  it('0 valid', () => expect(isValidPrice(0)).toBe(true))
  it('positive valid', () => expect(isValidPrice(999)).toBe(true))
  it('negative invalid', () => expect(isValidPrice(-1)).toBe(false))
  it('NaN invalid', () => expect(isValidPrice(NaN)).toBe(false))
  it('Infinity invalid', () => expect(isValidPrice(Infinity)).toBe(false))
})

describe('isValidPercent', () => {
  it('0 valid', () => expect(isValidPercent(0)).toBe(true))
  it('50 valid', () => expect(isValidPercent(50)).toBe(true))
  it('negative invalid', () => expect(isValidPercent(-1)).toBe(false))
  it('NaN invalid', () => expect(isValidPercent(NaN)).toBe(false))
})
