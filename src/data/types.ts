import type { Component } from 'vue'

export type CalculatorStatus = 'ready' | 'soon' | 'planned'
export type CalculatorPriority = 'P0' | 'P1' | 'P2' | 'P3'
export type CategorySlug =
  | 'finance'
  | 'math'
  | 'construction'
  | 'health'
  | 'datetime'
  | 'work'
  | 'transport'
  | 'sport'
  | 'animals'
  | 'clothing'
  | 'convert'
  | 'everyday'
  | 'informatics'

export interface CalculatorMeta {
  id: string
  slug: string
  categorySlug: CategorySlug
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  icon: string
  status: CalculatorStatus
  priority: CalculatorPriority
  tags: string[]
  aliases?: string[]
  path: string
  popularity?: number
  isPopular: boolean
  componentLoader?: () => Promise<{ default: Component }>
}

export interface CategoryMeta {
  slug: CategorySlug
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  icon: string
  color: string
  path: string
}
