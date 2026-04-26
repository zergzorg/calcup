import { describe, expect, it } from 'vitest'
import {
  CALCULATOR_PRESETS_CONFIG,
  CONSTRUCTION_MATERIALS_CONFIG,
  CONVERSION_UNITS_CONFIG,
  FINANCE_ASSUMPTIONS_CONFIG,
  TAX_2026_CONFIG,
} from './index'

describe('calculator configs', () => {
  it('keeps tax rates and salary references in the central 2026 config', () => {
    expect(TAX_2026_CONFIG.metadata.actualAsOf).toBe('2026-04-26')
    expect(TAX_2026_CONFIG.vat.presetRates).toContain(TAX_2026_CONFIG.vat.defaultRate)
    expect(TAX_2026_CONFIG.personalIncomeTax.defaultRatePercent).toBe(13)
    expect(TAX_2026_CONFIG.salary.monthsPerYear).toBe(12)
    expect(TAX_2026_CONFIG.salary.workDaysPerYear.fiveTwo).toBeGreaterThan(200)
    const lastBracket = TAX_2026_CONFIG.salary.russiaNdflBrackets[
      TAX_2026_CONFIG.salary.russiaNdflBrackets.length - 1
    ]
    expect(lastBracket?.limit).toBeNull()
  })

  it('provides converter units and calculator presets from reusable configs', () => {
    expect(CONVERSION_UNITS_CONFIG.length.units.find(unit => unit.unit === 'meter')?.factor).toBe(1)
    expect(CONVERSION_UNITS_CONFIG.cooking.units.find(unit => unit.unit === 'cup')?.factor).toBe(240)
    expect(CONVERSION_UNITS_CONFIG.temperature.absoluteZero.celsius).toBe(-273.15)
    expect(CALCULATOR_PRESETS_CONFIG.paint.canLiters).toContain(2.5)
    expect(CALCULATOR_PRESETS_CONFIG.laminate.wastePercent).toContain(10)
    expect(CALCULATOR_PRESETS_CONFIG.tips.presetRates).toContain(10)
    expect(CALCULATOR_PRESETS_CONFIG.billSplit.roundingSteps).toContain(1)
    expect(CALCULATOR_PRESETS_CONFIG.heartRateZones.definitions).toHaveLength(5)
    expect(CALCULATOR_PRESETS_CONFIG.wallpaper.rollSizes.length).toBeGreaterThan(0)
    expect(CALCULATOR_PRESETS_CONFIG.construction.commonWastePercents).toContain(10)
    expect(CALCULATOR_PRESETS_CONFIG.construction.rebar.diameterMillimeters).toContain(12)
    expect(CALCULATOR_PRESETS_CONFIG.construction.tile.tileSizes).toHaveLength(4)
    expect(CALCULATOR_PRESETS_CONFIG.construction.brick.brickSizes).toHaveLength(3)
    expect(CALCULATOR_PRESETS_CONFIG.electricity.powerWatts).toContain(1000)
  })

  it('keeps finance assumptions in the rates layer', () => {
    expect(FINANCE_ASSUMPTIONS_CONFIG.metadata.actualAsOf).toBe('2026-04-26')
    expect(FINANCE_ASSUMPTIONS_CONFIG.inflation.defaultAnnualRatePercent).toBeGreaterThan(0)
    expect(FINANCE_ASSUMPTIONS_CONFIG.penalty.defaultDivisor).toBe(300)
  })

  it('keeps construction material constants in the catalog layer', () => {
    expect(CONSTRUCTION_MATERIALS_CONFIG.rebar.steelDensityKgM3).toBe(7850)
  })
})
