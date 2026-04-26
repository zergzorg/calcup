import tax2026 from './rates/tax-2026.json'
import financeAssumptions from './rates/finance-assumptions.json'
import conversionUnits from './units/conversion-units.json'
import calculatorPresets from './presets/calculator-presets.json'
import constructionMaterials from './catalogs/construction-materials.json'

export const TAX_2026_CONFIG = tax2026
export const FINANCE_ASSUMPTIONS_CONFIG = financeAssumptions
export const CONVERSION_UNITS_CONFIG = conversionUnits
export const CALCULATOR_PRESETS_CONFIG = calculatorPresets
export const CONSTRUCTION_MATERIALS_CONFIG = constructionMaterials

export type Tax2026Config = typeof TAX_2026_CONFIG
export type FinanceAssumptionsConfig = typeof FINANCE_ASSUMPTIONS_CONFIG
export type ConversionUnitsConfig = typeof CONVERSION_UNITS_CONFIG
export type CalculatorPresetsConfig = typeof CALCULATOR_PRESETS_CONFIG
export type ConstructionMaterialsConfig = typeof CONSTRUCTION_MATERIALS_CONFIG
