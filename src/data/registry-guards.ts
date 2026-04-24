import { CATEGORIES } from './categories'
import { CALCULATORS } from './calculators'

function assertUnique<T>(items: T[], key: (i: T) => string, label: string) {
  const seen = new Set<string>()
  for (const item of items) {
    const k = key(item)
    if (seen.has(k)) throw new Error(`Duplicate ${label}: "${k}"`)
    seen.add(k)
  }
}

export function validateRegistry() {
  assertUnique(CALCULATORS, c => c.id, 'calculator id')
  assertUnique(CALCULATORS, c => c.path, 'calculator path')
  assertUnique(CALCULATORS, c => `${c.categorySlug}/${c.slug}`, 'categorySlug+slug')
  assertUnique(CATEGORIES, c => c.slug, 'category slug')

  const categorySlugs = new Set(CATEGORIES.map(c => c.slug))
  for (const calc of CALCULATORS) {
    if (!categorySlugs.has(calc.categorySlug)) {
      throw new Error(`Calculator "${calc.id}" references unknown categorySlug: "${calc.categorySlug}"`)
    }
  }
}
