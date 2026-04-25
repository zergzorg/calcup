import { describe, expect, it } from 'vitest'
import sitemapXml from '../../public/sitemap.xml?raw'
import { CALCULATORS } from './calculators'
import { CATEGORIES } from './categories'
import { validateRegistry } from './registry-guards'

const SITE_URL = 'https://calcup.ru'

function toCanonicalUrl(path: string): string {
  return `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`
}

function readSitemapLocs(): Set<string> {
  return new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]))
}

describe('calculator registry guards', () => {
  it('keeps registry identifiers and category references valid', () => {
    expect(() => validateRegistry()).not.toThrow()
  })

  it('requires ready calculators to have loader, popularity and search tags', () => {
    const invalidReadyCalculators = CALCULATORS
      .filter(calc => calc.status === 'ready')
      .filter(calc =>
        !calc.componentLoader ||
        typeof calc.popularity !== 'number' ||
        calc.popularity < 0 ||
        calc.tags.length === 0,
      )
      .map(calc => calc.id)

    expect(invalidReadyCalculators).toEqual([])
  })

  it('keeps sitemap aligned with ready calculators and categories', () => {
    const locs = readSitemapLocs()
    const readyCalculators = CALCULATORS.filter(calc => calc.status === 'ready')
    const readyCategorySlugs = new Set(readyCalculators.map(calc => calc.categorySlug))

    const missingReadyCalculatorUrls = readyCalculators
      .map(calc => toCanonicalUrl(calc.path))
      .filter(url => !locs.has(url))

    const missingReadyCategoryUrls = CATEGORIES
      .filter(category => readyCategorySlugs.has(category.slug))
      .map(category => toCanonicalUrl(category.path))
      .filter(url => !locs.has(url))

    const indexedUnreadyCalculatorUrls = CALCULATORS
      .filter(calc => calc.status !== 'ready')
      .map(calc => toCanonicalUrl(calc.path))
      .filter(url => locs.has(url))

    const indexedEmptyCategoryUrls = CATEGORIES
      .filter(category => !readyCategorySlugs.has(category.slug))
      .map(category => toCanonicalUrl(category.path))
      .filter(url => locs.has(url))

    expect(missingReadyCalculatorUrls).toEqual([])
    expect(missingReadyCategoryUrls).toEqual([])
    expect(indexedUnreadyCalculatorUrls).toEqual([])
    expect(indexedEmptyCategoryUrls).toEqual([])
  })
})
