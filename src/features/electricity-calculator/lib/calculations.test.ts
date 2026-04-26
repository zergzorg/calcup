import { describe, expect, it } from 'vitest'
import { calculateElectricity } from './calculations'
import type { ElectricityInput } from '../types/electricity'

const baseInput: ElectricityInput = {
  powerW: 1000,
  devicesCount: 1,
  hoursPerDay: 2,
  daysPerMonth: 30,
  tariffPerKwh: 6,
}

describe('electricity calculations', () => {
  it('calculates kWh and cost for one appliance', () => {
    const result = calculateElectricity(baseInput)

    expect(result?.powerKw).toBe(1)
    expect(result?.dailyKwh).toBe(2)
    expect(result?.monthlyKwh).toBe(60)
    expect(result?.yearlyKwh).toBe(730)
    expect(result?.monthlyCost).toBe(360)
  })

  it('multiplies power by device count', () => {
    const result = calculateElectricity({
      ...baseInput,
      powerW: 60,
      devicesCount: 4,
      hoursPerDay: 5,
    })

    expect(result?.powerKw).toBeCloseTo(0.24, 10)
    expect(result?.dailyKwh).toBeCloseTo(1.2, 10)
  })

  it('allows zero power, hours and tariff', () => {
    const result = calculateElectricity({
      ...baseInput,
      powerW: 0,
      hoursPerDay: 0,
      tariffPerKwh: 0,
    })

    expect(result?.monthlyKwh).toBe(0)
    expect(result?.monthlyCost).toBe(0)
  })

  it('rejects invalid ranges', () => {
    expect(calculateElectricity({ ...baseInput, powerW: -1 })).toBeNull()
    expect(calculateElectricity({ ...baseInput, devicesCount: 1.5 })).toBeNull()
    expect(calculateElectricity({ ...baseInput, hoursPerDay: 25 })).toBeNull()
    expect(calculateElectricity({ ...baseInput, daysPerMonth: 32 })).toBeNull()
  })
})
