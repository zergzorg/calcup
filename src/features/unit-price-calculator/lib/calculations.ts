import type {
  ComparisonResult,
  ProductInput,
  ProductResult,
  SavingsResult,
  UnitGroup,
  UnitPriceUnit,
} from '../types/unit-price'

export const UNIT_GROUPS: Record<UnitPriceUnit, UnitGroup> = {
  gram: 'mass',
  kilogram: 'mass',
  milliliter: 'volume',
  liter: 'volume',
  piece: 'count',
}

export const BASE_UNITS: Record<UnitGroup, UnitPriceUnit> = {
  mass: 'kilogram',
  volume: 'liter',
  count: 'piece',
}

export function getUnitGroup(unit: UnitPriceUnit): UnitGroup {
  return UNIT_GROUPS[unit]
}

export function getBaseUnit(unit: UnitPriceUnit): UnitPriceUnit {
  return BASE_UNITS[getUnitGroup(unit)]
}

export function normalizeAmount(amount: number, unit: UnitPriceUnit): number | null {
  if (!isValidAmount(amount)) return null
  if (unit === 'gram' || unit === 'milliliter') return amount / 1000
  return amount
}

export function getEffectivePrice(product: ProductInput): number | null {
  const price = toNumber(product.price)
  if (!isValidPrice(price)) return null
  return price
}

export function calculateUnitPrice(
  price: number,
  amount: number,
  unit: UnitPriceUnit,
): number | null {
  if (!isValidPrice(price)) return null
  const normalizedAmount = normalizeAmount(amount, unit)
  if (normalizedAmount === null || normalizedAmount === 0) return null
  return price / normalizedAmount
}

export function calculateProductResult(product: ProductInput): ProductResult | null {
  const price = toNumber(product.price)
  const amount = toNumber(product.amount)
  const effectivePrice = getEffectivePrice(product)
  const normalizedAmount = normalizeAmount(amount, product.unit)

  if (
    effectivePrice === null
    || normalizedAmount === null
    || !isValidPrice(price)
    || !isValidAmount(amount)
  ) {
    return null
  }

  const unitPrice = calculateUnitPrice(effectivePrice, amount, product.unit)
  if (unitPrice === null) return null

  return {
    id: product.id,
    name: product.name,
    price,
    amount,
    unit: product.unit,
    unitGroup: getUnitGroup(product.unit),
    effectivePrice,
    normalizedAmount,
    unitPrice,
    displayBaseUnit: getBaseUnit(product.unit),
    isValid: true,
  }
}

export function canCompareProducts(results: ProductResult[]): boolean {
  const groups = new Set(results.filter(result => result.isValid).map(result => result.unitGroup))
  return groups.size <= 1
}

export function findBestProduct(results: ProductResult[]): ProductResult | null {
  const validResults = results.filter(result => result.isValid)
  if (validResults.length < 2 || !canCompareProducts(validResults)) return null

  return validResults.reduce((best, current) =>
    current.unitPrice < best.unitPrice ? current : best,
  )
}

export function calculateSavings(bestUnitPrice: number, otherUnitPrice: number): SavingsResult | null {
  if (!isValidPrice(bestUnitPrice) || !isValidPrice(otherUnitPrice) || bestUnitPrice === 0) return null
  const savingsPerBaseUnit = otherUnitPrice - bestUnitPrice
  return {
    savingsPerBaseUnit,
    savingsPercent: savingsPerBaseUnit / bestUnitPrice * 100,
  }
}

export function calculateComparison(products: ProductInput[]): ComparisonResult {
  if (products.some(product => !isValidPrice(toNumber(product.price)))) {
    return emptyComparison()
  }

  const results = products
    .map(product => calculateProductResult(product))
    .filter((result): result is ProductResult => result !== null)
  const canCompare = canCompareProducts(results)
  const winner = findBestProduct(results)
  const savingsByProductId: Record<string, SavingsResult> = {}

  if (winner) {
    for (const result of results) {
      if (result.id === winner.id) continue
      const savings = calculateSavings(winner.unitPrice, result.unitPrice)
      if (savings) savingsByProductId[result.id] = savings
    }
  }

  return {
    results,
    canCompare,
    hasMixedGroups: !canCompare,
    winner,
    savingsByProductId,
  }
}

export function isValidProduct(product: ProductInput): boolean {
  return calculateProductResult(product) !== null
}

export function isValidPrice(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

function toNumber(value: number | string | null | undefined): number {
  if (value === '' || value === null || value === undefined) return Number.NaN
  return Number(value)
}

function emptyComparison(): ComparisonResult {
  return {
    results: [],
    canCompare: true,
    hasMixedGroups: false,
    winner: null,
    savingsByProductId: {},
  }
}
