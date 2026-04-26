import { describe, expect, it } from 'vitest'
import { calculateBillSplit } from './calculations'

describe('bill split calculations', () => {
  it('splits a bill equally without extras', () => {
    const result = calculateBillSplit({
      billAmount: 1200,
      peopleCount: 4,
      tipPercent: 0,
      serviceFee: 0,
      roundTo: 0.01,
    })

    expect(result).toMatchObject({
      totalAmount: 1200,
      exactPerPerson: 300,
      roundedPerPerson: 300,
      roundingReserve: 0,
    })
  })

  it('adds tips and a fixed service fee', () => {
    const result = calculateBillSplit({
      billAmount: 2400,
      peopleCount: 3,
      tipPercent: 10,
      serviceFee: 150,
      roundTo: 0.01,
    })

    expect(result).toMatchObject({
      tipAmount: 240,
      serviceFee: 150,
      totalAmount: 2790,
      exactPerPerson: 930,
      roundedPerPerson: 930,
    })
  })

  it('rounds each share up to the selected step', () => {
    const result = calculateBillSplit({
      billAmount: 1000,
      peopleCount: 3,
      tipPercent: 0,
      serviceFee: 0,
      roundTo: 10,
    })

    expect(result).toMatchObject({
      exactPerPerson: 333.33,
      roundedPerPerson: 340,
      collectedTotal: 1020,
      roundingReserve: 20,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateBillSplit({
      billAmount: -1,
      peopleCount: 2,
      tipPercent: 10,
      serviceFee: 0,
      roundTo: 1,
    })).toBeNull()

    expect(calculateBillSplit({
      billAmount: 1000,
      peopleCount: 0,
      tipPercent: 10,
      serviceFee: 0,
      roundTo: 1,
    })).toBeNull()
  })
})
