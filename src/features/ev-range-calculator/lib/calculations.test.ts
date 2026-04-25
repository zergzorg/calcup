import { describe, expect, it } from 'vitest'
import { calculateEvRange, isPercent } from './calculations'

describe('ev range calculations', () => {
  it('calculates usable range, charge energy and cost', () => {
    expect(calculateEvRange({
      batteryCapacityKwh: 75,
      currentChargePercent: 80,
      targetChargePercent: 100,
      consumptionKwhPer100Km: 18,
      reservePercent: 10,
      electricityPrice: 6,
    })).toEqual({
      currentEnergyKwh: 60,
      targetEnergyKwh: 75,
      chargeEnergyKwh: 15,
      usableEnergyKwh: 52.5,
      rangeKm: 291.7,
      rangeMiles: 181.2,
      chargeCost: 90,
      costPer100Km: 108,
    })
  })

  it('does not charge when target is below current charge', () => {
    expect(calculateEvRange({
      batteryCapacityKwh: 60,
      currentChargePercent: 70,
      targetChargePercent: 50,
      consumptionKwhPer100Km: 15,
      reservePercent: 10,
      electricityPrice: 0,
    })).toMatchObject({
      chargeEnergyKwh: 0,
      chargeCost: null,
      costPer100Km: null,
    })
  })

  it('rejects invalid percentages and reserve', () => {
    expect(isPercent(101)).toBe(false)
    expect(calculateEvRange({
      batteryCapacityKwh: 60,
      currentChargePercent: 10,
      targetChargePercent: 80,
      consumptionKwhPer100Km: 15,
      reservePercent: 10,
      electricityPrice: 6,
    })).toBeNull()
  })
})
