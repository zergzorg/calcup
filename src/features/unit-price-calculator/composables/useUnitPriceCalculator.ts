import { computed, ref, watch } from 'vue'
import { calculateComparison, isValidAmount, isValidPrice } from '../lib/calculations'
import type {
  ProductInput,
  UnitPriceUnit,
  ValidationIssue,
} from '../types/unit-price'

const DEFAULT_UNITS: UnitPriceUnit[] = ['gram', 'milliliter', 'piece']

export function useUnitPriceCalculator() {
  const selectedUnit = ref<UnitPriceUnit>('gram')
  const products = ref<ProductInput[]>([
    { id: createProductId(), name: '', price: 200, amount: 500, unit: 'gram' },
    { id: createProductId(), name: '', price: 350, amount: 1000, unit: 'gram' },
  ])
  const touched = ref(new Set<ValidationIssue['field']>())

  watch(selectedUnit, (unit) => {
    products.value = products.value.map(product => ({ ...product, unit }))
  })

  function touch(field: ValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function addProduct() {
    products.value = [
      ...products.value,
      createEmptyProduct(selectedUnit.value),
    ]
  }

  function removeProduct(index: number) {
    if (products.value.length <= 1) return
    products.value = products.value.filter((_, currentIndex) => currentIndex !== index)
  }

  function clearProducts() {
    products.value = [
      createEmptyProduct(selectedUnit.value),
      createEmptyProduct(selectedUnit.value),
    ]
    touched.value = new Set()
  }

  const allIssues = computed<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = []

    products.value.forEach((product, index) => {
      const price = toNumber(product.price)
      const amount = toNumber(product.amount)

      if (!Number.isFinite(price)) {
        issues.push({ field: `product.${index}.price`, messageKey: 'unitPrice.validation.price.required' })
      } else if (!isValidPrice(price)) {
        issues.push({ field: `product.${index}.price`, messageKey: 'unitPrice.validation.price.positive' })
      }

      if (!Number.isFinite(amount)) {
        issues.push({ field: `product.${index}.amount`, messageKey: 'unitPrice.validation.amount.required' })
      } else if (!isValidAmount(amount)) {
        issues.push({ field: `product.${index}.amount`, messageKey: 'unitPrice.validation.amount.positive' })
      }

      if (!DEFAULT_UNITS.includes(product.unit)) {
        issues.push({ field: `product.${index}.unit`, messageKey: 'unitPrice.validation.unit.required' })
      }
    })

    return issues
  })

  function getIssue(field: ValidationIssue['field']): ValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => calculateComparison(products.value))

  return {
    products,
    selectedUnit,
    unitOptions: DEFAULT_UNITS,
    allIssues,
    result,
    touch,
    getIssue,
    addProduct,
    removeProduct,
    clearProducts,
  }
}

function createProductId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createEmptyProduct(unit: UnitPriceUnit): ProductInput {
  return { id: createProductId(), name: '', price: '', amount: '', unit }
}

function toNumber(value: number | string | null | undefined): number {
  if (value === '' || value === null || value === undefined) return Number.NaN
  return Number(value)
}
