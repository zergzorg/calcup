<template>
  <main v-if="config" :class="`${config.prefix}-page`" :aria-labelledby="`${config.prefix}-title`">
    <section :class="`${config.prefix}-heading`">
      <p :class="`${config.prefix}-eyebrow`">{{ lang === 'ru' ? 'Финансы' : 'Finance' }}</p>
      <h1 :id="`${config.prefix}-title`">{{ config.title[lang] }}</h1>
      <p>{{ config.intro[lang] }}</p>
    </section>

    <div :class="`${config.prefix}-workspace`">
      <form :class="`${config.prefix}-form`" @submit.prevent>
        <section :class="`${config.prefix}-section`">
          <h2>{{ config.formTitle[lang] }}</h2>
          <div v-for="field in config.fields" :key="field.key" :class="`${config.prefix}-field`">
            <label :for="`${config.prefix}-${field.key}`">{{ field.label[lang] }}</label>
            <div :class="`${config.prefix}-input-wrap`">
              <input
                :id="`${config.prefix}-${field.key}`"
                v-model.number="values[field.key]"
                type="number"
                :min="field.min"
                :max="field.max"
                :step="field.step ?? 'any'"
                inputmode="decimal"
              >
              <span>{{ field.unit[lang] }}</span>
            </div>
          </div>
        </section>

        <aside :class="`${config.prefix}-warning-note`">
          <strong>{{ lang === 'ru' ? 'Допущения' : 'Assumptions' }}</strong>
          <span>{{ config.warning[lang] }}</span>
        </aside>
      </form>

      <section :class="`${config.prefix}-result`" aria-live="polite">
        <p :class="`${config.prefix}-result__label`">{{ lang === 'ru' ? 'Расчёт' : 'Calculation' }}</p>
        <template v-if="result">
          <div :class="`${config.prefix}-result__total`">
            <span>{{ label(result.primary.key) }}</span>
            <strong>{{ formatRow(result.primary) }}</strong>
          </div>
          <div :class="`${config.prefix}-result__rows`">
            <div v-for="row in result.rows" :key="row.key" :class="`${config.prefix}-result__row`">
              <span>{{ label(row.key) }}</span>
              <strong>{{ formatRow(row) }}</strong>
            </div>
          </div>
          <p :class="`${config.prefix}-formula`">{{ config.formula[lang] }}</p>
        </template>
        <p v-else :class="`${config.prefix}-result__empty`">{{ lang === 'ru' ? 'Проверьте значения.' : 'Check input values.' }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { FINANCE_ASSUMPTIONS_CONFIG, TAX_2026_CONFIG } from '../../../config'
import { calculateFinanceMvp } from '../lib/calculations'
import type { FinanceMvpCalculatorId, FinanceMvpResultRow } from '../lib/calculations'

type Lang = 'ru' | 'en'
type Text = Record<Lang, string>

interface FieldConfig {
  key: string
  label: Text
  unit: Text
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

interface Config {
  id: FinanceMvpCalculatorId
  prefix: string
  title: Text
  intro: Text
  formTitle: Text
  warning: Text
  formula: Text
  fields: FieldConfig[]
  labels: Record<string, Text>
}

const configs: Record<FinanceMvpCalculatorId, Config> = {
  budget: {
    id: 'budget',
    prefix: 'budget',
    title: { ru: 'Бюджет', en: 'Budget Calculator' },
    intro: { ru: 'Сведите доходы, расходы, долги и накопления в один свободный остаток.', en: 'Combine income, expenses, debts and savings into free cash flow.' },
    formTitle: { ru: 'Месяц', en: 'Month' },
    warning: { ru: 'MVP считает один месяц и не делит расходы по категориям. Подходит для быстрой оценки, не заменяет финансовое планирование.', en: 'The MVP estimates one month and does not split expenses by category. It is a quick estimate, not financial planning.' },
    formula: { ru: 'Свободный остаток = доход − расходы − платежи по долгам − накопления.', en: 'Free cash = income − expenses − debt payments − savings.' },
    fields: [
      { key: 'income', label: { ru: 'Доход', en: 'Income' }, unit: { ru: '₽', en: '₽' }, defaultValue: 150_000, min: 0, step: 1000 },
      { key: 'expenses', label: { ru: 'Расходы', en: 'Expenses' }, unit: { ru: '₽', en: '₽' }, defaultValue: 80_000, min: 0, step: 1000 },
      { key: 'debtPayments', label: { ru: 'Платежи по долгам', en: 'Debt payments' }, unit: { ru: '₽', en: '₽' }, defaultValue: 25_000, min: 0, step: 1000 },
      { key: 'savings', label: { ru: 'В накопления', en: 'Savings' }, unit: { ru: '₽', en: '₽' }, defaultValue: 20_000, min: 0, step: 1000 },
    ],
    labels: {
      freeCash: { ru: 'Свободный остаток', en: 'Free cash' },
      totalOut: { ru: 'Расходы всего', en: 'Total outflow' },
      savingsRate: { ru: 'Норма накоплений', en: 'Savings rate' },
      debtShare: { ru: 'Доля долгов', en: 'Debt share' },
    },
  },
  inflation: {
    id: 'inflation',
    prefix: 'inflation',
    title: { ru: 'Инфляция', en: 'Inflation Calculator' },
    intro: { ru: 'Оцените будущую цену, покупательную способность и реальную доходность.', en: 'Estimate future cost, purchasing power and real return.' },
    formTitle: { ru: 'Сумма и ставки', en: 'Amount and rates' },
    warning: { ru: 'MVP использует постоянную среднегодовую инфляцию и номинальную доходность. Фактическая инфляция меняется по периодам.', en: 'The MVP uses constant annual inflation and nominal return. Actual inflation changes over time.' },
    formula: { ru: 'Будущая цена = сумма × (1 + инфляция)^лет. Реальная доходность считается по формуле Фишера.', en: 'Future cost = amount × (1 + inflation)^years. Real return uses the Fisher equation.' },
    fields: [
      { key: 'amount', label: { ru: 'Сумма сегодня', en: 'Amount today' }, unit: { ru: '₽', en: '₽' }, defaultValue: 100_000, min: 0, step: 1000 },
      { key: 'inflationRate', label: { ru: 'Инфляция в год', en: 'Annual inflation' }, unit: { ru: '%', en: '%' }, defaultValue: FINANCE_ASSUMPTIONS_CONFIG.inflation.defaultAnnualRatePercent, min: 0, step: 0.1 },
      { key: 'years', label: { ru: 'Лет', en: 'Years' }, unit: { ru: 'лет', en: 'yr' }, defaultValue: 3, min: 0, step: 1 },
      { key: 'nominalReturn', label: { ru: 'Номинальная доходность', en: 'Nominal return' }, unit: { ru: '%', en: '%' }, defaultValue: FINANCE_ASSUMPTIONS_CONFIG.inflation.defaultNominalReturnPercent, min: 0, step: 0.1 },
    ],
    labels: {
      futureCost: { ru: 'Будущая цена', en: 'Future cost' },
      purchasingPower: { ru: 'Покупательная способность', en: 'Purchasing power' },
      realReturn: { ru: 'Реальная доходность', en: 'Real return' },
      growth: { ru: 'Рост цены', en: 'Price growth' },
    },
  },
  'tax-deduction': {
    id: 'tax-deduction',
    prefix: 'tax-deduction',
    title: { ru: 'Налоговый вычет', en: 'Tax Deduction Calculator' },
    intro: { ru: 'Оцените возврат НДФЛ по расходам, лимиту и уплаченному налогу.', en: 'Estimate personal income tax refund from expenses, limit and paid tax.' },
    formTitle: { ru: 'Расходы и лимит', en: 'Expenses and limit' },
    warning: { ru: 'Актуально на 26.04.2026. MVP считает общий вычет как min(расходы, лимит) × ставка, но не больше уплаченного НДФЛ. Специальные правила лечения, обучения, ИИС и жилья не детализируются.', en: 'Current as of 2026-04-26. The MVP estimates a generic deduction as min(expenses, limit) × rate, capped by paid tax. Special rules for medical, education, investment and housing deductions are not detailed.' },
    formula: { ru: 'Возврат = min(расходы, лимит) × ставка НДФЛ, но не больше уже уплаченного налога.', en: 'Refund = min(expenses, limit) × tax rate, capped by already paid tax.' },
    fields: [
      { key: 'expenses', label: { ru: 'Расходы', en: 'Expenses' }, unit: { ru: '₽', en: '₽' }, defaultValue: 200_000, min: 0, step: 1000 },
      { key: 'limit', label: { ru: 'Лимит вычета', en: 'Deduction limit' }, unit: { ru: '₽', en: '₽' }, defaultValue: 150_000, min: 0, step: 1000 },
      { key: 'ratePercent', label: { ru: 'Ставка НДФЛ', en: 'Tax rate' }, unit: { ru: '%', en: '%' }, defaultValue: TAX_2026_CONFIG.personalIncomeTax.defaultRatePercent, min: 0, max: 100, step: 0.1 },
      { key: 'taxPaid', label: { ru: 'Уплачено НДФЛ', en: 'Tax paid' }, unit: { ru: '₽', en: '₽' }, defaultValue: 100_000, min: 0, step: 1000 },
    ],
    labels: {
      refund: { ru: 'Возврат', en: 'Refund' },
      base: { ru: 'База вычета', en: 'Deduction base' },
      unusedExpenses: { ru: 'Сверх лимита', en: 'Over limit' },
      rate: { ru: 'Ставка', en: 'Rate' },
    },
  },
  'debt-load': {
    id: 'debt-load',
    prefix: 'debt-load',
    title: { ru: 'Долговая нагрузка', en: 'Debt Load Calculator' },
    intro: { ru: 'Посчитайте долю ежемесячных платежей по долгам в доходе.', en: 'Calculate the share of monthly debt payments in income.' },
    formTitle: { ru: 'Доход и платежи', en: 'Income and payments' },
    warning: { ru: 'MVP считает простую долговую нагрузку без кредитных лимитов, созаёмщиков и методик конкретных банков.', en: 'The MVP calculates a simple debt burden without credit limits, co-borrowers or bank-specific methods.' },
    formula: { ru: 'Долговая нагрузка = платежи по долгам / месячный доход × 100%.', en: 'Debt load = debt payments / monthly income × 100%.' },
    fields: [
      { key: 'monthlyIncome', label: { ru: 'Месячный доход', en: 'Monthly income' }, unit: { ru: '₽', en: '₽' }, defaultValue: 120_000, min: 1, step: 1000 },
      { key: 'creditPayments', label: { ru: 'Кредиты', en: 'Loans' }, unit: { ru: '₽', en: '₽' }, defaultValue: 35_000, min: 0, step: 1000 },
      { key: 'otherDebtPayments', label: { ru: 'Другие долги', en: 'Other debts' }, unit: { ru: '₽', en: '₽' }, defaultValue: 10_000, min: 0, step: 1000 },
    ],
    labels: {
      load: { ru: 'Долговая нагрузка', en: 'Debt load' },
      payments: { ru: 'Платежи всего', en: 'Total payments' },
      freeIncome: { ru: 'Остаток дохода', en: 'Remaining income' },
    },
  },
  'rent-vs-buy': {
    id: 'rent-vs-buy',
    prefix: 'rent-vs-buy',
    title: { ru: 'Аренда или покупка', en: 'Rent vs Buy' },
    intro: { ru: 'Сравните денежный отток по аренде и покупке жилья за выбранный срок.', en: 'Compare rent and home-buying cash outflow over a chosen horizon.' },
    formTitle: { ru: 'Сценарии', en: 'Scenarios' },
    warning: { ru: 'MVP сравнивает только денежный отток: аренду, ипотечный платёж, расходы владения и первоначальный взнос. Рост цены жилья, доходность капитала, налоги и продажа объекта не учитываются.', en: 'The MVP compares only cash outflow: rent, mortgage payment, ownership costs and down payment. Home appreciation, capital return, taxes and sale proceeds are not included.' },
    formula: { ru: 'Аренда = аренда × месяцы. Покупка = первоначальный взнос + (ипотека + расходы владения) × месяцы.', en: 'Rent = rent × months. Buy = down payment + (mortgage + ownership costs) × months.' },
    fields: [
      { key: 'rent', label: { ru: 'Аренда в месяц', en: 'Monthly rent' }, unit: { ru: '₽', en: '₽' }, defaultValue: 60_000, min: 0, step: 1000 },
      { key: 'mortgagePayment', label: { ru: 'Ипотека в месяц', en: 'Monthly mortgage' }, unit: { ru: '₽', en: '₽' }, defaultValue: 90_000, min: 0, step: 1000 },
      { key: 'ownershipCosts', label: { ru: 'Расходы владения', en: 'Ownership costs' }, unit: { ru: '₽', en: '₽' }, defaultValue: 12_000, min: 0, step: 1000 },
      { key: 'downPayment', label: { ru: 'Первоначальный взнос', en: 'Down payment' }, unit: { ru: '₽', en: '₽' }, defaultValue: 1_500_000, min: 0, step: 10000 },
      { key: 'horizonYears', label: { ru: 'Срок сравнения', en: 'Comparison horizon' }, unit: { ru: 'лет', en: 'yr' }, defaultValue: 5, min: 1, step: 1 },
    ],
    labels: {
      buyAdvantage: { ru: 'Покупка дешевле на', en: 'Buying cheaper by' },
      rentAdvantage: { ru: 'Аренда дешевле на', en: 'Renting cheaper by' },
      rentTotal: { ru: 'Аренда всего', en: 'Total rent' },
      buyCashOut: { ru: 'Покупка всего', en: 'Total buy cash-out' },
      months: { ru: 'Месяцев', en: 'Months' },
    },
  },
}

const route = useRoute()
const { locale, n } = useI18n()
const values = reactive<Record<string, number>>({})

const calculatorId = computed(() => route.meta.toolSlug as FinanceMvpCalculatorId)
const config = computed(() => configs[calculatorId.value])
const lang = computed<Lang>(() => String(locale.value).startsWith('ru') ? 'ru' : 'en')

watchEffect(() => {
  const current = config.value
  if (!current) return
  for (const field of current.fields) {
    if (!Number.isFinite(values[field.key])) values[field.key] = field.defaultValue
  }
})

const result = computed(() => {
  const current = config.value
  if (!current) return null
  return calculateFinanceMvp(current.id, values)
})

function label(key: string): string {
  return config.value?.labels[key]?.[lang.value] ?? key
}

function formatRow(row: FinanceMvpResultRow): string {
  const value = n(row.value, { maximumFractionDigits: row.unit === 'money' ? 2 : 2 })
  if (row.unit === 'money') return lang.value === 'ru' ? `${value} ₽` : `₽${value}`
  if (row.unit === 'percent') return `${value}%`
  return value
}
</script>
