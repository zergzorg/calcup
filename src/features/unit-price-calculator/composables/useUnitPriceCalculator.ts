import { computed, ref } from 'vue'
import { calculateComparison, isValidAmount, isValidPrice } from '../lib/calculations'
import type {
  ProductInput,
  UnitPriceUnit,
  ValidationIssue,
} from '../types/unit-price'

const DEFAULT_UNITS: UnitPriceUnit[] = ['gram', 'kilogram', 'milliliter', 'liter', 'piece']

export function useUnitPriceCalculator() {
  const products = ref<ProductInput[]>([
    { id: createProductId(), name: '', price: 200, amount: 500, unit: 'gram' },
    { id: createProductId(), name: '', price: 350, amount: 1, unit: 'kilogram' },
  ])
  const touched = ref(new Set<ValidationIssue['field']>())

  function touch(field: ValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function addProduct() {
    products.value = [
      ...products.value,
      { id: createProductId(), name: '', price: 0, amount: 1, unit: 'gram' },
    ]
  }

  function removeProduct(index: number) {
    if (products.value.length <= 1) return
    products.value = products.value.filter((_, currentIndex) => currentIndex !== index)
  }

  const allIssues = computed<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = []

    products.value.forEach((product, index) => {
      const price = toNumber(product.price)
      const amount = toNumber(product.amount)

      if (!Number.isFinite(price)) {
        issues.push({ field: `product.${index}.price`, messageKey: 'unitPrice.validation.price.required' })
      } else if (!isValidPrice(price)) {
        issues.push({ field: `product.${index}.price`, messageKey: 'unitPrice.validation.price.nonNegative' })
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
    unitOptions: DEFAULT_UNITS,
    allIssues,
    result,
    touch,
    getIssue,
    addProduct,
    removeProduct,
  }
}

function createProductId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function toNumber(value: number | string | null | undefined): number {
  if (value === '' || value === null || value === undefined) return Number.NaN
  return Number(value)
}
