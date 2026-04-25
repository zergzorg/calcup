import type { CategoryMeta } from './types'

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'finance',
    title: { ru: 'Финансы', en: 'Finance' },
    description: { ru: 'Кредиты, вклады, налоги, зарплата', en: 'Loans, deposits, taxes, salary' },
    icon: '💰',
    color: '#22c55e',
    path: '/finance',
  },
  {
    slug: 'math',
    title: { ru: 'Математика', en: 'Math' },
    description: { ru: 'Проценты, дроби, степени, площади', en: 'Percentages, fractions, powers, areas' },
    icon: '🔢',
    color: '#3b82f6',
    path: '/math',
  },
  {
    slug: 'construction',
    title: { ru: 'Строительство', en: 'Construction' },
    description: {
      ru: 'Материалы для ремонта, отделки и строительства',
      en: 'Materials for renovation, finishing and construction',
    },
    icon: '🏗️',
    color: '#f59e0b',
    path: '/construction',
  },
  {
    slug: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    description: { ru: 'ИМТ, калории, вес, пульс', en: 'BMI, calories, weight, pulse' },
    icon: '❤️',
    color: '#ef4444',
    path: '/health',
  },
  {
    slug: 'datetime',
    title: { ru: 'Дата и время', en: 'Date & Time' },
    description: { ru: 'Разница дат, возраст, рабочие дни', en: 'Date diff, age, workdays' },
    icon: '📅',
    color: '#8b5cf6',
    path: '/datetime',
  },
  {
    slug: 'transport',
    title: { ru: 'Транспорт', en: 'Transport' },
    description: { ru: 'Расход топлива, стоимость поездки', en: 'Fuel consumption, trip cost' },
    icon: '🚗',
    color: '#06b6d4',
    path: '/transport',
  },
  {
    slug: 'convert',
    title: { ru: 'Конвертеры', en: 'Converters' },
    description: { ru: 'Длина, вес, температура, объём', en: 'Length, weight, temperature, volume' },
    icon: '🔄',
    color: '#ec4899',
    path: '/convert',
  },
  {
    slug: 'everyday',
    title: { ru: 'Быт и повседневное', en: 'Everyday' },
    description: { ru: 'Чаевые, счёт, скидки, электроэнергия', en: 'Tips, bill split, discounts, electricity' },
    icon: '🏠',
    color: '#84cc16',
    path: '/everyday',
  },
]

export const getCategoryBySlug = (slug: string) =>
  CATEGORIES.find(c => c.slug === slug)
