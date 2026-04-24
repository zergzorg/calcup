import type { CalculatorMeta } from './types'

export const CALCULATORS: CalculatorMeta[] = [
  // ===== FINANCE =====
  {
    id: 'credit',
    slug: 'credit',
    categorySlug: 'finance',
    title: { ru: 'Кредитный калькулятор', en: 'Loan Calculator' },
    description: {
      ru: 'Ежемесячный платёж, переплата, график и досрочное погашение',
      en: 'Monthly payment, total interest, schedule and early repayment',
    },
    icon: '🏦',
    status: 'ready',
    priority: 'P0',
    popularity: 100,
    path: '/finance/credit',
    tags: ['кредит', 'ипотека', 'платеж', 'loan', 'mortgage', 'payment'],
    aliases: ['займ', 'кредит наличными'],
    componentLoader: () => import('../features/credit-calculator'),
  },
  {
    id: 'mortgage',
    slug: 'mortgage',
    categorySlug: 'finance',
    title: { ru: 'Ипотечный калькулятор', en: 'Mortgage Calculator' },
    description: {
      ru: 'Расчёт ипотеки с первоначальным взносом',
      en: 'Mortgage calculation with down payment',
    },
    icon: '🏘️',
    status: 'soon',
    priority: 'P1',
    path: '/finance/mortgage',
    tags: ['ипотека', 'жильё', 'mortgage', 'housing'],
  },
  {
    id: 'vat',
    slug: 'vat',
    categorySlug: 'finance',
    title: { ru: 'Калькулятор НДС', en: 'VAT Calculator' },
    description: {
      ru: 'Расчёт НДС: выделить и начислить',
      en: 'Calculate VAT: include and exclude',
    },
    icon: '🧾',
    status: 'soon',
    priority: 'P1',
    path: '/finance/vat',
    tags: ['ндс', 'налог', 'vat', 'tax'],
  },
  // ===== MATH =====
  {
    id: 'percentage',
    slug: 'percentage',
    categorySlug: 'math',
    title: { ru: 'Калькулятор процентов', en: 'Percentage Calculator' },
    description: {
      ru: 'Процент от числа, прирост, скидка',
      en: 'Percent of a number, growth, discount',
    },
    icon: '📊',
    status: 'soon',
    priority: 'P1',
    path: '/math/percentage',
    tags: ['процент', 'скидка', 'процентов', 'percent', 'discount'],
  },
  // ===== HEALTH =====
  {
    id: 'bmi',
    slug: 'bmi',
    categorySlug: 'health',
    title: { ru: 'Калькулятор ИМТ', en: 'BMI Calculator' },
    description: {
      ru: 'Индекс массы тела по росту и весу с интерпретацией',
      en: 'Body mass index with interpretation',
    },
    icon: '⚖️',
    status: 'soon',
    priority: 'P0',
    path: '/health/bmi',
    tags: ['имт', 'вес', 'рост', 'bmi', 'weight', 'height'],
  },
  // ===== CONVERT =====
  {
    id: 'length',
    slug: 'length',
    categorySlug: 'convert',
    title: { ru: 'Конвертер длины', en: 'Length Converter' },
    description: {
      ru: 'Метры, километры, мили, дюймы, футы',
      en: 'Meters, kilometers, miles, inches, feet',
    },
    icon: '📏',
    status: 'soon',
    priority: 'P1',
    path: '/convert/length',
    tags: ['длина', 'метр', 'миля', 'length', 'meter', 'mile'],
  },
  // ===== TRANSPORT =====
  {
    id: 'fuel',
    slug: 'fuel',
    categorySlug: 'transport',
    title: { ru: 'Расход топлива', en: 'Fuel Consumption' },
    description: {
      ru: 'Расход топлива на 100 км и стоимость поездки',
      en: 'Fuel consumption per 100 km and trip cost',
    },
    icon: '⛽',
    status: 'soon',
    priority: 'P1',
    path: '/transport/fuel',
    tags: ['топливо', 'расход', 'бензин', 'fuel', 'gas', 'consumption'],
  },
  // ===== DATETIME =====
  {
    id: 'date-diff',
    slug: 'date-diff',
    categorySlug: 'datetime',
    title: { ru: 'Разница между датами', en: 'Date Difference' },
    description: {
      ru: 'Количество дней, месяцев и лет между датами',
      en: 'Number of days, months, and years between dates',
    },
    icon: '📆',
    status: 'soon',
    priority: 'P1',
    path: '/datetime/date-diff',
    tags: ['дата', 'разница', 'дней', 'date', 'diff', 'days'],
  },
  // ===== EVERYDAY =====
  {
    id: 'tips',
    slug: 'tips',
    categorySlug: 'everyday',
    title: { ru: 'Калькулятор чаевых', en: 'Tip Calculator' },
    description: {
      ru: 'Размер чаевых и разделение счёта',
      en: 'Tip amount and bill split',
    },
    icon: '🍽️',
    status: 'soon',
    priority: 'P1',
    path: '/everyday/tips',
    tags: ['чаевые', 'счёт', 'ресторан', 'tips', 'bill', 'restaurant'],
  },
]

export const getCalculatorsByCategory = (slug: string) =>
  CALCULATORS.filter(c => c.categorySlug === slug)

export const getCalculatorByPath = (path: string) =>
  CALCULATORS.find(c => c.path === path)

export const getReadyCalculators = () =>
  CALCULATORS.filter(c => c.status === 'ready')
