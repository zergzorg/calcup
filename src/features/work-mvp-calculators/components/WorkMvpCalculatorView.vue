<template>
  <main v-if="config" :class="`${config.prefix}-page`" :aria-labelledby="`${config.prefix}-title`">
    <section :class="`${config.prefix}-heading`">
      <p :class="`${config.prefix}-eyebrow`">{{ text.eyebrow }}</p>
      <h1 :id="`${config.prefix}-title`">{{ text.title }}</h1>
      <p>{{ text.intro }}</p>
    </section>

    <div :class="`${config.prefix}-workspace`">
      <form :class="`${config.prefix}-form`" @submit.prevent>
        <section :class="`${config.prefix}-section`">
          <h2>{{ text.formTitle }}</h2>

          <div v-for="field in config.fields" :key="field.key" :class="`${config.prefix}-field`">
            <label :for="`${config.prefix}-${field.key}`">{{ field.label[language] }}</label>
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
              <span>{{ field.unit[language] }}</span>
            </div>
          </div>
        </section>

        <aside :class="`${config.prefix}-warning-note`">
          <strong>{{ text.warningTitle }}</strong>
          <span>{{ text.warningBody }}</span>
        </aside>
      </form>

      <section :class="`${config.prefix}-result`" aria-live="polite">
        <p :class="`${config.prefix}-result__label`">{{ text.resultLabel }}</p>

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

          <p :class="`${config.prefix}-formula`">{{ text.formula }}</p>
        </template>

        <p v-else :class="`${config.prefix}-result__empty`">{{ text.empty }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { FINANCE_ASSUMPTIONS_CONFIG, TAX_2026_CONFIG } from '../../../config'
import { calculateWorkMvp } from '../lib/calculations'
import type { WorkMvpCalculatorId, WorkMvpResultRow } from '../lib/calculations'

type Lang = 'ru' | 'en'

interface WorkMvpField {
  key: string
  label: Record<Lang, string>
  unit: Record<Lang, string>
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

interface WorkMvpConfig {
  id: WorkMvpCalculatorId
  prefix: string
  title: Record<Lang, string>
  intro: Record<Lang, string>
  formTitle: Record<Lang, string>
  warningBody: Record<Lang, string>
  formula: Record<Lang, string>
  fields: WorkMvpField[]
  labels: Record<string, Record<Lang, string>>
}

const configs: Record<WorkMvpCalculatorId, WorkMvpConfig> = {
  'usn-tax': {
    id: 'usn-tax',
    prefix: 'usn-tax',
    title: { ru: 'УСН', en: 'Simplified Tax System' },
    intro: {
      ru: 'Сравните УСН “Доходы” и “Доходы минус расходы” по базовым ставкам.',
      en: 'Compare simplified tax system income and income-minus-expenses modes.',
    },
    formTitle: { ru: 'Доходы и расходы', en: 'Income and expenses' },
    warningBody: {
      ru: 'Актуально на 26.04.2026. MVP использует базовые ставки 6% и 15%, минимальный налог 1% от доходов и ручной ввод взносов. Региональные льготы, торговый сбор и перенос убытков не учитываются. Расчёт справочный и не является бухгалтерской или налоговой консультацией.',
      en: 'Current as of 2026-04-26. The MVP uses base 6% and 15% rates, 1% minimum tax and manual insurance contribution input. Regional benefits, trade tax and loss carryforward are not included. This is not accounting or tax advice.',
    },
    formula: {
      ru: 'УСН “Доходы” = доход × 6% − взносы. УСН “Доходы минус расходы” = максимум между (доход − расходы) × 15% и 1% от дохода.',
      en: 'Income mode = income × 6% − contributions. Income-minus-expenses mode = max((income − expenses) × 15%, income × 1%).',
    },
    fields: [
      { key: 'income', label: { ru: 'Доходы', en: 'Income' }, unit: { ru: '₽', en: '₽' }, defaultValue: 2_000_000, min: 0, step: 1000 },
      { key: 'expenses', label: { ru: 'Расходы', en: 'Expenses' }, unit: { ru: '₽', en: '₽' }, defaultValue: 1_200_000, min: 0, step: 1000 },
      { key: 'contributions', label: { ru: 'Взносы к уменьшению', en: 'Deductible contributions' }, unit: { ru: '₽', en: '₽' }, defaultValue: 60_000, min: 0, step: 1000 },
    ],
    labels: {
      usnIncomeTax: { ru: 'УСН Доходы к уплате', en: 'Income mode tax due' },
      usnIncomeBeforeContributions: { ru: 'Доходы до уменьшения', en: 'Income mode before deduction' },
      usnIncomeMinusExpensesTax: { ru: 'Доходы минус расходы', en: 'Income-minus-expenses tax' },
      minTax: { ru: 'Минимальный налог', en: 'Minimum tax' },
      profit: { ru: 'Налоговая база', en: 'Tax base' },
    },
  },
  'ip-insurance': {
    id: 'ip-insurance',
    prefix: 'ip-insurance',
    title: { ru: 'Страховые взносы ИП', en: 'Sole Proprietor Insurance Contributions' },
    intro: { ru: 'Рассчитайте фиксированные взносы ИП за себя и 1% с превышения дохода.', en: 'Estimate fixed sole proprietor contributions and 1% over-threshold payment.' },
    formTitle: { ru: 'Параметры ИП', en: 'Business parameters' },
    warningBody: {
      ru: 'Актуально на 26.04.2026 по материалам ФНС: фиксированные взносы за 2026 год — 57 390 ₽, дополнительный взнос — 1% с суммы свыше 300 000 ₽, максимум 321 818 ₽. Расчёт справочный и не является бухгалтерской или налоговой консультацией.',
      en: 'Current as of 2026-04-26 based on Russian Federal Tax Service materials: 2026 fixed contribution is ₽57,390, extra contribution is 1% above ₽300,000, capped at ₽321,818. This is not accounting or tax advice.',
    },
    formula: { ru: 'Итого = 57 390 ₽ × месяцы / 12 + min((доход − 300 000 ₽) × 1%, 321 818 ₽).', en: 'Total = ₽57,390 × months / 12 + min((income − ₽300,000) × 1%, ₽321,818).' },
    fields: [
      { key: 'income', label: { ru: 'Годовой доход', en: 'Annual income' }, unit: { ru: '₽', en: '₽' }, defaultValue: 1_500_000, min: 0, step: 1000 },
      { key: 'activeMonths', label: { ru: 'Месяцев деятельности', en: 'Active months' }, unit: { ru: 'мес.', en: 'mo' }, defaultValue: 12, min: 1, max: 12, step: 1 },
    ],
    labels: {
      total: { ru: 'Взносы всего', en: 'Total contributions' },
      fixed: { ru: 'Фиксированная часть', en: 'Fixed part' },
      extra: { ru: '1% сверх лимита', en: '1% above threshold' },
      threshold: { ru: 'Порог дохода', en: 'Income threshold' },
    },
  },
  'penalty-interest': {
    id: 'penalty-interest',
    prefix: 'penalty-interest',
    title: { ru: 'Пени по ключевой ставке', en: 'Penalty Interest' },
    intro: { ru: 'Оцените пени по сумме долга, дням просрочки и ключевой ставке.', en: 'Estimate penalty interest from debt, overdue days and key rate.' },
    formTitle: { ru: 'Долг и просрочка', en: 'Debt and delay' },
    warningBody: {
      ru: 'Актуально на 26.04.2026. MVP считает по формуле долг × ставка / делитель × дни. По умолчанию используется 1/300 ключевой ставки; для конкретных налогов, договоров и периодов могут действовать другие правила. Расчёт справочный и не является юридической, бухгалтерской или налоговой консультацией.',
      en: 'Current as of 2026-04-26. The MVP uses debt × rate / divisor × days. Default divisor is 300; specific taxes, contracts and periods may use different rules. This is not legal, accounting or tax advice.',
    },
    formula: { ru: 'Пени = долг × ключевая ставка / 100 / делитель × дни просрочки.', en: 'Penalty = debt × key rate / 100 / divisor × overdue days.' },
    fields: [
      { key: 'debt', label: { ru: 'Сумма долга', en: 'Debt amount' }, unit: { ru: '₽', en: '₽' }, defaultValue: 100_000, min: 0, step: 1000 },
      { key: 'days', label: { ru: 'Дней просрочки', en: 'Overdue days' }, unit: { ru: 'дн.', en: 'days' }, defaultValue: 30, min: 1, step: 1 },
      { key: 'keyRate', label: { ru: 'Ключевая ставка', en: 'Key rate' }, unit: { ru: '%', en: '%' }, defaultValue: FINANCE_ASSUMPTIONS_CONFIG.penalty.defaultKeyRatePercent, min: 0, step: 0.1 },
      { key: 'divisor', label: { ru: 'Делитель', en: 'Divisor' }, unit: { ru: '', en: '' }, defaultValue: FINANCE_ASSUMPTIONS_CONFIG.penalty.defaultDivisor, min: 1, step: 1 },
    ],
    labels: {
      penalty: { ru: 'Пени', en: 'Penalty' },
      dailyPenalty: { ru: 'Пени за день', en: 'Daily penalty' },
      totalDebt: { ru: 'Долг с пенями', en: 'Debt with penalty' },
      rate: { ru: 'Ставка', en: 'Rate' },
    },
  },
  'dismissal-pay': {
    id: 'dismissal-pay',
    prefix: 'dismissal-pay',
    title: { ru: 'Расчёт при увольнении', en: 'Dismissal Pay Calculator' },
    intro: { ru: 'Оцените компенсацию за отпуск, выходное пособие и сумму после НДФЛ.', en: 'Estimate unused vacation compensation, severance and net amount.' },
    formTitle: { ru: 'Выплаты', en: 'Payments' },
    warningBody: {
      ru: 'Актуально на 26.04.2026. MVP считает компенсацию за неиспользованный отпуск и выходное пособие вручную указанным количеством средних месячных заработков. НДФЛ применяется только к компенсации отпуска; лимиты необлагаемого выходного пособия и особые основания увольнения не учитываются. Расчёт справочный и не является бухгалтерской или юридической консультацией.',
      en: 'Current as of 2026-04-26. The MVP estimates unused vacation compensation and severance entered as monthly average earnings. Personal income tax is applied only to vacation compensation; non-taxable severance limits and dismissal grounds are not included. This is not accounting or legal advice.',
    },
    formula: { ru: 'Итого = средний день × дни отпуска + средний месяц × месяцы пособия − НДФЛ с компенсации отпуска.', en: 'Total = average day × unused vacation days + average month × severance months − tax on vacation compensation.' },
    fields: [
      { key: 'averageDaily', label: { ru: 'Средний дневной заработок', en: 'Average daily earnings' }, unit: { ru: '₽', en: '₽' }, defaultValue: 3500, min: 0, step: 100 },
      { key: 'unusedVacationDays', label: { ru: 'Неиспользованных дней отпуска', en: 'Unused vacation days' }, unit: { ru: 'дн.', en: 'days' }, defaultValue: 10, min: 0, step: 1 },
      { key: 'severanceAverageMonthly', label: { ru: 'Средний месячный заработок', en: 'Average monthly earnings' }, unit: { ru: '₽', en: '₽' }, defaultValue: 90_000, min: 0, step: 1000 },
      { key: 'severanceMonths', label: { ru: 'Месяцев пособия', en: 'Severance months' }, unit: { ru: 'мес.', en: 'mo' }, defaultValue: 1, min: 0, step: 0.5 },
      { key: 'taxPercent', label: { ru: 'НДФЛ', en: 'Tax' }, unit: { ru: '%', en: '%' }, defaultValue: TAX_2026_CONFIG.personalIncomeTax.defaultRatePercent, min: 0, max: 100, step: 0.1 },
    ],
    labels: {
      net: { ru: 'К выплате', en: 'Net amount' },
      gross: { ru: 'Начислено', en: 'Gross amount' },
      vacationCompensation: { ru: 'Компенсация отпуска', en: 'Vacation compensation' },
      severance: { ru: 'Выходное пособие', en: 'Severance' },
      tax: { ru: 'НДФЛ', en: 'Tax' },
    },
  },
  'work-hours-month': {
    id: 'work-hours-month',
    prefix: 'work-hours-month',
    title: { ru: 'Рабочие часы за месяц', en: 'Monthly Work Hours' },
    intro: { ru: 'Оцените количество рабочих дней и часов в месяце по фиксированным праздникам.', en: 'Estimate workdays and hours in a month using fixed public holidays.' },
    formTitle: { ru: 'Месяц и неделя', en: 'Month and week' },
    warningBody: {
      ru: 'Актуально на 26.04.2026. MVP учитывает пятидневную неделю и фиксированные праздничные даты РФ без переносов выходных и сокращённых предпраздничных дней. Для кадровых документов сверяйтесь с производственным календарём. Расчёт справочный.',
      en: 'Current as of 2026-04-26. The MVP uses a five-day week and fixed Russian holidays without weekend transfers or shortened pre-holiday days. Check the official production calendar for HR documents. Informational estimate only.',
    },
    formula: { ru: 'Часы = рабочие дни × недельная норма / 5.', en: 'Hours = workdays × weekly hour norm / 5.' },
    fields: [
      { key: 'year', label: { ru: 'Год', en: 'Year' }, unit: { ru: '', en: '' }, defaultValue: 2026, min: 1900, max: 2100, step: 1 },
      { key: 'month', label: { ru: 'Месяц', en: 'Month' }, unit: { ru: '1–12', en: '1–12' }, defaultValue: 4, min: 1, max: 12, step: 1 },
      { key: 'weeklyHours', label: { ru: 'Недельная норма', en: 'Weekly norm' }, unit: { ru: 'ч', en: 'h' }, defaultValue: 40, min: 1, max: 80, step: 1 },
    ],
    labels: {
      hours: { ru: 'Рабочие часы', en: 'Work hours' },
      workdays: { ru: 'Рабочие дни', en: 'Workdays' },
      dailyHours: { ru: 'Часов в день', en: 'Hours per day' },
      calendarDays: { ru: 'Календарные дни', en: 'Calendar days' },
    },
  },
  'work-experience': {
    id: 'work-experience',
    prefix: 'work-experience',
    title: { ru: 'Стаж работы', en: 'Work Experience Calculator' },
    intro: { ru: 'Посчитайте стаж между датой начала и окончания работы.', en: 'Calculate work experience between start and end dates.' },
    formTitle: { ru: 'Даты', en: 'Dates' },
    warningBody: {
      ru: 'MVP считает календарную разницу между двумя датами. Периоды, исключаемые из специального или страхового стажа, несколько мест работы и льготные правила не учитываются. Расчёт справочный.',
      en: 'The MVP calculates the calendar difference between two dates. Excluded periods, multiple jobs and special insurance-record rules are not included. Informational estimate only.',
    },
    formula: { ru: 'Стаж = календарная разница между датой окончания и датой начала.', en: 'Experience = calendar difference between end and start dates.' },
    fields: [
      { key: 'startYear', label: { ru: 'Год начала', en: 'Start year' }, unit: { ru: '', en: '' }, defaultValue: 2020, min: 1900, max: 2100, step: 1 },
      { key: 'startMonth', label: { ru: 'Месяц начала', en: 'Start month' }, unit: { ru: '1–12', en: '1–12' }, defaultValue: 2, min: 1, max: 12, step: 1 },
      { key: 'startDay', label: { ru: 'День начала', en: 'Start day' }, unit: { ru: '1–31', en: '1–31' }, defaultValue: 15, min: 1, max: 31, step: 1 },
      { key: 'endYear', label: { ru: 'Год окончания', en: 'End year' }, unit: { ru: '', en: '' }, defaultValue: 2026, min: 1900, max: 2100, step: 1 },
      { key: 'endMonth', label: { ru: 'Месяц окончания', en: 'End month' }, unit: { ru: '1–12', en: '1–12' }, defaultValue: 4, min: 1, max: 12, step: 1 },
      { key: 'endDay', label: { ru: 'День окончания', en: 'End day' }, unit: { ru: '1–31', en: '1–31' }, defaultValue: 26, min: 1, max: 31, step: 1 },
    ],
    labels: {
      years: { ru: 'Полных лет', en: 'Full years' },
      months: { ru: 'Месяцев сверх лет', en: 'Extra months' },
      days: { ru: 'Дней сверх месяцев', en: 'Extra days' },
      totalDays: { ru: 'Всего дней', en: 'Total days' },
    },
  },
}

const route = useRoute()
const { locale, n } = useI18n()
const values = reactive<Record<string, number>>({})

const calculatorId = computed(() => route.meta.toolSlug as WorkMvpCalculatorId)
const config = computed(() => configs[calculatorId.value])
const language = computed<Lang>(() => String(locale.value).startsWith('ru') ? 'ru' : 'en')

const text = computed(() => {
  const current = config.value
  const lang = language.value

  return {
    eyebrow: lang === 'ru' ? 'Налоги и работа' : 'Taxes & Work',
    title: current?.title[lang] ?? '',
    intro: current?.intro[lang] ?? '',
    formTitle: current?.formTitle[lang] ?? '',
    warningTitle: lang === 'ru' ? 'Актуальность и допущения' : 'Actuality and assumptions',
    warningBody: current?.warningBody[lang] ?? '',
    resultLabel: lang === 'ru' ? 'Расчёт' : 'Calculation',
    empty: lang === 'ru' ? 'Проверьте входные значения.' : 'Check input values.',
    formula: current?.formula[lang] ?? '',
  }
})

watchEffect(() => {
  const current = config.value
  if (!current) return

  for (const field of current.fields) {
    if (!Number.isFinite(values[field.key])) {
      values[field.key] = field.defaultValue
    }
  }
})

const result = computed(() => {
  const current = config.value
  if (!current) return null
  return calculateWorkMvp(current.id, values)
})

function label(key: string): string {
  return config.value?.labels[key]?.[language.value] ?? key
}

function formatRow(row: WorkMvpResultRow): string {
  const value = n(row.value, { maximumFractionDigits: row.unit === 'money' ? 2 : 2 })

  if (row.unit === 'money') {
    return language.value === 'ru' ? `${value} ₽` : `₽${value}`
  }

  if (row.unit === 'percent') return `${value}%`
  if (row.unit === 'days') return language.value === 'ru' ? `${value} дн.` : `${value} days`
  if (row.unit === 'hours') return language.value === 'ru' ? `${value} ч` : `${value} h`
  return value
}
</script>
