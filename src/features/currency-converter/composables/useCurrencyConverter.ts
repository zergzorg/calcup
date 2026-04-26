import { computed, ref } from 'vue'
import { CURRENCIES, PRESET_PAIRS, convertCurrency, isValidAmount, isValidRate, roundRate } from '../lib/calculations'
import type { CurrencyCode, CurrencyPresetPair, CurrencyValidationIssue } from '../types/currency'

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useCurrencyConverter() {
  const amount = ref<number>(100)
  const fromCurrency = ref<CurrencyCode>('USD')
  const toCurrency = ref<CurrencyCode>('RUB')
  const rate = ref<number>(90)
  const rateUpdatedAt = ref<string>(getTodayIsoDate())

  const touched = ref(new Set<CurrencyValidationIssue['field']>())

  const issues = computed<CurrencyValidationIssue[]>(() => {
    const result: CurrencyValidationIssue[] = []

    if (!Number.isFinite(amount.value)) {
      result.push({ field: 'amount', messageKey: 'currency.validation.amount.required' })
    } else if (!isValidAmount(amount.value)) {
      result.push({ field: 'amount', messageKey: 'currency.validation.amount.nonNegative' })
    }

    if (!Number.isFinite(rate.value)) {
      result.push({ field: 'rate', messageKey: 'currency.validation.rate.required' })
    } else if (!isValidRate(rate.value)) {
      result.push({ field: 'rate', messageKey: 'currency.validation.rate.positive' })
    }

    return result
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null
    return convertCurrency(amount.value, rate.value)
  })

  const activePresetId = computed(() => {
    const pair = PRESET_PAIRS.find(item =>
      item.from === fromCurrency.value &&
      item.to === toCurrency.value &&
      item.rate === rate.value,
    )

    return pair?.id ?? null
  })

  function touch(field: CurrencyValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function getIssue(field: CurrencyValidationIssue['field']): CurrencyValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return issues.value.find(issue => issue.field === field)
  }

  function applyPreset(pair: CurrencyPresetPair) {
    fromCurrency.value = pair.from
    toCurrency.value = pair.to
    rate.value = pair.rate
  }

  function swapCurrencies() {
    const nextFrom = toCurrency.value
    toCurrency.value = fromCurrency.value
    fromCurrency.value = nextFrom

    if (isValidRate(rate.value)) {
      rate.value = roundRate(1 / rate.value)
    }
  }

  return {
    amount,
    fromCurrency,
    toCurrency,
    rate,
    rateUpdatedAt,
    currencies: CURRENCIES,
    presetPairs: PRESET_PAIRS,
    issues,
    result,
    activePresetId,
    touch,
    getIssue,
    applyPreset,
    swapCurrencies,
  }
}
