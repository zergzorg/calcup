import { CALCULATORS } from '../data/calculators'
import { CATEGORIES } from '../data/categories'
import type { CalculatorMeta, CategoryMeta } from '../data/types'

export function useCalculatorRegistry() {
  function getCategoryBySlug(slug: string): CategoryMeta | undefined {
    return CATEGORIES.find(c => c.slug === slug)
  }

  function getCalculatorBySlug(categorySlug: string, toolSlug: string): CalculatorMeta | undefined {
    return CALCULATORS.find(c => c.categorySlug === categorySlug && c.slug === toolSlug)
  }

  function getCalculatorsByCategory(categorySlug: string): CalculatorMeta[] {
    return CALCULATORS.filter(c => c.categorySlug === categorySlug)
  }

  function getReadyCalculators(): CalculatorMeta[] {
    return CALCULATORS.filter(c => c.status === 'ready')
  }

  function getPublicCalculators(): CalculatorMeta[] {
    return CALCULATORS.filter(c => c.status !== 'planned')
  }

  function getSitemapCalculators(): CalculatorMeta[] {
    return CALCULATORS.filter(c => c.status === 'ready')
  }

  function getSitemapCategories(): CategoryMeta[] {
    const readySlugs = new Set(getReadyCalculators().map(c => c.categorySlug))
    return CATEGORIES.filter(c => readySlugs.has(c.slug))
  }

  function isKnownCategory(slug: string): boolean {
    return CATEGORIES.some(c => c.slug === slug)
  }

  function isKnownCalculator(categorySlug: string, toolSlug: string): boolean {
    return CALCULATORS.some(c => c.categorySlug === categorySlug && c.slug === toolSlug)
  }

  return {
    CATEGORIES,
    CALCULATORS,
    getCategoryBySlug,
    getCalculatorBySlug,
    getCalculatorsByCategory,
    getReadyCalculators,
    getPublicCalculators,
    getSitemapCalculators,
    getSitemapCategories,
    isKnownCategory,
    isKnownCalculator,
  }
}
