import { describe, expect, it } from 'vitest'
import indexHtml from '../../index.html?raw'
import focusSoundsHtml from '../../public/focus-sounds/index.html?raw'
import manifestWebmanifest from '../../public/manifest.webmanifest?raw'
import pomodoroTimerHtml from '../../public/pomodoro-timer/index.html?raw'
import sitemapXml from '../../public/sitemap.xml?raw'
import taskPlannerHtml from '../../public/task-planner/index.html?raw'
import timerPomodoroHtml from '../../public/timer-pomodoro/index.html?raw'
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

  it('keeps the static SEO fallback aligned with the calculator portal', () => {
    const manifest = JSON.parse(manifestWebmanifest) as { name: string, description: string, categories: string[] }

    expect(indexHtml).toContain('онлайн калькуляторы')
    expect(indexHtml).toContain('Кредитный калькулятор')
    expect(indexHtml).not.toContain('ретро рабочий стол')
    expect(indexHtml).not.toContain('Pomodoro-таймер')

    expect(manifest.name).toContain('Online Calculators')
    expect(manifest.description).toContain('Free online calculators')
    expect(manifest.categories).toContain('utilities')
  })

  it('keeps retired productivity landing pages out of the index', () => {
    const retiredPages = [
      timerPomodoroHtml,
      pomodoroTimerHtml,
      taskPlannerHtml,
      focusSoundsHtml,
    ]

    for (const html of retiredPages) {
      expect(html).toContain('name="robots" content="noindex,follow"')
    }

    const locs = readSitemapLocs()
    expect(locs.has(`${SITE_URL}/timer-pomodoro/`)).toBe(false)
    expect(locs.has(`${SITE_URL}/pomodoro-timer/`)).toBe(false)
    expect(locs.has(`${SITE_URL}/task-planner/`)).toBe(false)
    expect(locs.has(`${SITE_URL}/focus-sounds/`)).toBe(false)
    expect(locs.has(`${SITE_URL}/workspace/`)).toBe(false)
  })
})
