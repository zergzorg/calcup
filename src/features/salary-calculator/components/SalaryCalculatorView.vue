<template>
  <main class="salary-page" aria-labelledby="salary-title">
    <section class="salary-heading">
      <p class="salary-eyebrow">{{ t('salary.eyebrow') }}</p>
      <h1 id="salary-title">{{ t('salary.title') }}</h1>
      <p>{{ t('salary.intro') }}</p>
    </section>

    <div class="salary-workspace">
      <form class="salary-form" @submit.prevent>
        <section class="salary-form__group" aria-labelledby="salary-base-title">
          <div id="salary-base-title" class="salary-warning-note" role="note">
            {{ t('salary.warning') }}
          </div>

          <div class="salary-field">
            <label for="salary-salary">{{ t('salary.form.monthlySalary') }}</label>
            <div class="salary-input-wrap">
              <input
                id="salary-salary"
                v-model.number="monthlySalary"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('monthlySalary'))"
                aria-describedby="salary-salary-error"
                @blur="touch('monthlySalary')"
              />
              <span>{{ t('salary.units.currency') }}</span>
            </div>
            <p v-if="getIssue('monthlySalary')" id="salary-salary-error" class="salary-error">
              {{ t(getIssue('monthlySalary')!.messageKey) }}
            </p>
          </div>

          <div class="salary-tax-mode">
            <span class="salary-field__label">{{ t('salary.form.salaryTaxMode') }}</span>
            <label
              v-for="option in salaryTaxOptions"
              :key="option"
              class="salary-radio"
              :class="{ 'salary-radio--active': salaryTaxMode === option }"
            >
              <input v-model="salaryTaxMode" type="radio" name="salary-tax-mode" :value="option" />
              <span>{{ t(`salary.salaryTaxMode.${option}`) }}</span>
            </label>
          </div>

          <div v-if="salaryTaxMode === 'custom'" class="salary-field">
            <label for="salary-salary-tax">{{ t('salary.form.customSalaryTaxPercent') }}</label>
            <div class="salary-input-wrap">
              <input
                id="salary-salary-tax"
                v-model.number="customSalaryTaxPercent"
                type="number"
                min="0"
                max="100"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('customSalaryTaxPercent'))"
                aria-describedby="salary-salary-tax-error"
                @blur="touch('customSalaryTaxPercent')"
              />
              <span>%</span>
            </div>
            <p
              v-if="getIssue('customSalaryTaxPercent')"
              id="salary-salary-tax-error"
              class="salary-error"
            >
              {{ t(getIssue('customSalaryTaxPercent')!.messageKey) }}
            </p>
          </div>

          <p class="salary-note">
            {{ t('salary.form.salaryTaxHint') }}
            <a
              href="https://www.garant.ru/1c-wiseadvice/guide/progressivnaya-shkala-ndfl-s-2025-goda/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('salary.form.salaryTaxLink') }}
            </a>
          </p>

          <div class="salary-additional-list">
            <div class="salary-additional-list__head">
              <span>{{ t('salary.form.additionalIncome') }}</span>
              <span>{{ t('salary.form.additionalIncomeTaxPercent') }}</span>
              <span class="sr-only">{{ t('salary.form.additionalIncomeActions') }}</span>
            </div>

            <div
              v-for="(item, index) in additionalIncomes"
              :key="index"
              class="salary-additional-row"
            >
              <div class="salary-field">
                <label class="sr-only" :for="`salary-additional-income-${index}`">
                  {{ t('salary.form.additionalIncome') }}
                </label>
                <div class="salary-input-wrap">
                  <input
                    :id="`salary-additional-income-${index}`"
                    v-model.number="item.amount"
                    type="number"
                    min="0"
                    step="any"
                    inputmode="decimal"
                    :aria-invalid="Boolean(getIssue(`additionalIncome.${index}.amount`))"
                    :aria-describedby="`salary-additional-income-${index}-error`"
                    @blur="touch(`additionalIncome.${index}.amount`)"
                  />
                  <span>{{ t('salary.units.currency') }}</span>
                </div>
                <p
                  v-if="getIssue(`additionalIncome.${index}.amount`)"
                  :id="`salary-additional-income-${index}-error`"
                  class="salary-error"
                >
                  {{ t(getIssue(`additionalIncome.${index}.amount`)!.messageKey) }}
                </p>
              </div>

              <div class="salary-field">
                <label class="sr-only" :for="`salary-additional-tax-${index}`">
                  {{ t('salary.form.additionalIncomeTaxPercent') }}
                </label>
                <div class="salary-input-wrap">
                  <input
                    :id="`salary-additional-tax-${index}`"
                    v-model.number="item.taxPercent"
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    inputmode="decimal"
                    :aria-invalid="Boolean(getIssue(`additionalIncome.${index}.taxPercent`))"
                    :aria-describedby="`salary-additional-tax-${index}-error`"
                    @blur="touch(`additionalIncome.${index}.taxPercent`)"
                  />
                  <span>%</span>
                </div>
                <p
                  v-if="getIssue(`additionalIncome.${index}.taxPercent`)"
                  :id="`salary-additional-tax-${index}-error`"
                  class="salary-error"
                >
                  {{ t(getIssue(`additionalIncome.${index}.taxPercent`)!.messageKey) }}
                </p>
              </div>

              <div class="salary-additional-actions">
                <button
                  v-if="additionalIncomes.length > 1"
                  type="button"
                  class="salary-remove-button"
                  :aria-label="t('salary.form.removeAdditionalIncome')"
                  :title="t('salary.form.removeAdditionalIncome')"
                  @click="removeAdditionalIncome(index)"
                />
                <button
                  type="button"
                  class="salary-add-button"
                  :aria-label="t('salary.form.addAdditionalIncome')"
                  :title="t('salary.form.addAdditionalIncome')"
                  @click="addAdditionalIncome"
                />
              </div>
            </div>
          </div>

          <p class="salary-note">{{ t('salary.form.additionalIncomeHint') }}</p>

          <div class="salary-field">
            <label for="salary-schedule">{{ t('salary.form.scheduleType') }}</label>
            <select id="salary-schedule" v-model="scheduleType">
              <option v-for="option in scheduleOptions" :key="option" :value="option">
                {{ t(`salary.schedule.${option}`) }}
              </option>
            </select>
          </div>

          <div class="salary-field">
            <label for="salary-day-hours">{{ t('salary.form.hoursPerWorkDay') }}</label>
            <div class="salary-input-wrap">
              <input
                id="salary-day-hours"
                v-model.number="hoursPerWorkDay"
                type="number"
                min="0"
                max="24"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('hoursPerWorkDay'))"
                aria-describedby="salary-day-hours-error"
                @blur="touch('hoursPerWorkDay')"
              />
              <span>{{ t('salary.units.hours') }}</span>
            </div>
            <p v-if="getIssue('hoursPerWorkDay')" id="salary-day-hours-error" class="salary-error">
              {{ t(getIssue('hoursPerWorkDay')!.messageKey) }}
            </p>
          </div>

          <div v-if="scheduleType === 'custom'" class="salary-field">
            <label for="salary-work-days">{{ t('salary.form.customWorkDaysPerYear') }}</label>
            <div class="salary-input-wrap">
              <input
                id="salary-work-days"
                v-model.number="customWorkDaysPerYear"
                type="number"
                min="1"
                max="366"
                step="1"
                inputmode="numeric"
                :aria-invalid="Boolean(getIssue('customWorkDaysPerYear'))"
                aria-describedby="salary-work-days-error"
                @blur="touch('customWorkDaysPerYear')"
              />
              <span>{{ t('salary.units.days') }}</span>
            </div>
            <p
              v-if="getIssue('customWorkDaysPerYear')"
              id="salary-work-days-error"
              class="salary-error"
            >
              {{ t(getIssue('customWorkDaysPerYear')!.messageKey) }}
            </p>
          </div>
        </section>
      </form>

      <section class="salary-result" aria-live="polite">
        <p class="salary-result__label">{{ t('salary.result.label') }}</p>

        <template v-if="result">
          <div class="salary-result__total">
            <span>
              {{ t('salary.result.baseSalary') }}
            </span>
            <strong>{{ money(result.baseSalary) }}</strong>
          </div>

          <div class="salary-result__rows">
            <div class="salary-result__row">
              <span>{{ t('salary.result.monthlySalaryGross') }}</span>
              <strong>{{ money(monthlySalary) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.annualGrossSalary') }}</span>
              <strong>{{ money(result.annualGrossSalary) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.additionalIncome') }}</span>
              <strong>{{ money(result.annualAdditionalIncome / 12) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.additionalIncomeTaxAmount') }}</span>
              <strong>{{ money(result.additionalIncomeTaxAmount) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.monthlyTotalIncomeAfterTax') }}</span>
              <strong>{{ money(result.monthlyTotalIncomeAfterTax) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.salaryTaxAmount') }}</span>
              <strong>{{ money(result.salaryTaxAmount) }} · {{ percent(result.salaryTaxPercent) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.monthlySalaryAfterTax') }}</span>
              <strong>{{ money(result.monthlySalaryAfterTax) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.baseSalary') }}</span>
              <strong>{{ money(result.baseSalary) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.workDayPrice') }}</span>
              <strong>{{ money(result.workDayPrice) }}</strong>
            </div>
            <div class="salary-result__row">
              <span>{{ t('salary.result.averageWorkHoursPerMonth') }}</span>
              <strong>{{ hours(result.averageWorkHoursPerMonth) }}</strong>
            </div>
          </div>

          <div class="salary-formula">
            <p>{{ t('salary.formula.rate') }}</p>
          </div>

          <div
            v-if="salaryTaxMode === 'russiaProgressive' && result.monthlyTaxBreakdown.length"
            class="salary-tax-summary"
          >
            <h3>{{ t('salary.taxBreakdown.title') }}</h3>
            <p>{{ t('salary.taxBreakdown.note') }}</p>
            <div class="salary-tax-summary__table">
              <div class="salary-tax-summary__head">
                <span>{{ t('salary.taxBreakdown.month') }}</span>
                <span>{{ t('salary.taxBreakdown.tax') }}</span>
                <span>{{ t('salary.taxBreakdown.afterTax') }}</span>
              </div>
              <div
                v-for="item in result.monthlyTaxBreakdown"
                :key="item.month"
                class="salary-tax-summary__row"
              >
                <span>{{ t(`salary.months.${item.month}`) }}</span>
                <span>{{ money(item.taxAmount) }} · {{ percent(item.effectiveTaxPercent) }}</span>
                <span>{{ money(item.salaryAfterTax) }}</span>
              </div>
            </div>
          </div>
        </template>

        <p v-else class="salary-result__empty">{{ t('salary.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSalaryCalculator } from '../composables/useSalaryCalculator'
import type { ScheduleType } from '../types/salary'

const { t, n, locale } = useI18n()

const {
  monthlySalary,
  salaryTaxMode,
  customSalaryTaxPercent,
  additionalIncomes,
  addAdditionalIncome,
  removeAdditionalIncome,
  scheduleType,
  hoursPerWorkDay,
  customWorkDaysPerYear,
  touch,
  getIssue,
  result,
} = useSalaryCalculator()

const scheduleOptions: ScheduleType[] = ['fiveTwo', 'twoTwo', 'dayThree', 'custom']
const salaryTaxOptions = ['russiaProgressive', 'custom'] as const

function money(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function hours(value: number): string {
  return t('salary.units.hoursValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function percent(value: number): string {
  return n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }) + '%'
}
</script>

<style scoped>
.salary-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.salary-heading {
  max-width: 780px;
}

.salary-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.salary-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3rem;
  line-height: 1.05;
  font-weight: 850;
}

.salary-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.salary-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 20px;
  align-items: start;
}

.salary-form,
.salary-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.salary-form {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.salary-form__group {
  display: grid;
  gap: 16px;
  margin: 0;
}

.salary-form__group h2 {
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
}

.salary-note {
  margin: -4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.salary-warning-note {
  margin: 0;
  border: 1px solid #facc15;
  border-left: 4px solid #eab308;
  border-radius: 6px;
  background: #fefce8;
  padding: 12px 14px;
  color: #713f12;
  font-size: 13px;
  font-weight: 700;
}

.salary-note a {
  color: #0f766e;
  font-weight: 800;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.salary-additional-list {
  display: grid;
  gap: 8px;
}

.salary-additional-list__head,
.salary-additional-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(90px, 150px) auto;
  gap: 8px;
  align-items: start;
}

.salary-additional-list__head {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.salary-additional-actions {
  display: inline-flex;
  gap: 6px;
}

.salary-add-button,
.salary-remove-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.salary-add-button::before,
.salary-add-button::after,
.salary-remove-button::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 3px;
  border-radius: 999px;
  background: #0f766e;
  content: "";
  transform: translate(-50%, -50%);
}

.salary-add-button::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.salary-add-button:hover {
  border-color: #0f766e;
  background: #eef8f6;
}

.salary-remove-button::before {
  background: #64748b;
}

.salary-remove-button:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.salary-toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.salary-toggle-row p,
.salary-optional-note {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.salary-toggle {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.salary-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.salary-toggle__control {
  position: relative;
  width: 42px;
  height: 24px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #e2e8f0;
  transition: background 0.16s, border-color 0.16s;
}

.salary-toggle__control::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
  content: "";
  transition: transform 0.16s;
}

.salary-toggle input:checked + .salary-toggle__control {
  border-color: #0d9488;
  background: #0d9488;
}

.salary-toggle input:checked + .salary-toggle__control::after {
  transform: translateX(18px);
}

.salary-toggle input:focus-visible + .salary-toggle__control {
  outline: 3px solid rgba(13, 148, 136, 0.2);
  outline-offset: 2px;
}

.salary-toggle__text {
  color: #0f766e;
}

.salary-field {
  display: grid;
  gap: 6px;
}

.salary-field__label,
.salary-field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.salary-tax-mode {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.salary-tax-mode .salary-field__label {
  grid-column: 1 / -1;
}

.salary-radio {
  display: flex;
  align-items: center;
  min-height: 44px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  padding: 0 12px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.salary-radio input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.salary-radio--active {
  border-color: #0d9488;
  background: #eef8f6;
  color: #0f766e;
}

.salary-field select,
.salary-input-wrap {
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s, background 0.15s;
}

.salary-field select {
  box-sizing: border-box;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.salary-input-wrap {
  display: flex;
  align-items: center;
  min-height: 44px;
  overflow: hidden;
}

.salary-input-wrap input {
  min-width: 0;
  flex: 1;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.salary-input-wrap span {
  flex: 0 0 auto;
  padding: 0 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.salary-field select:focus,
.salary-input-wrap:focus-within {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

.salary-input-wrap input:focus {
  outline: none;
}

.salary-input-wrap:has(input[aria-invalid="true"]) {
  border-color: #ef4444;
}

.salary-error {
  margin: 0;
  color: #ef4444;
  font-size: 12px;
}

.salary-two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.salary-result {
  position: sticky;
  top: 88px;
  display: grid;
  gap: 18px;
  padding: 24px;
}

.salary-result__label {
  margin: 0;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.salary-result__total {
  display: grid;
  gap: 6px;
}

.salary-result__total span,
.salary-result__rate,
.salary-result__empty {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.salary-result__total strong {
  color: #111827;
  font-size: 2.55rem;
  line-height: 1.05;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.salary-result__rate strong {
  color: #0f766e;
  font-size: 1.05rem;
}

.salary-result__rows {
  display: grid;
  gap: 10px;
}

.salary-result__row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #e5edf2;
  padding-bottom: 10px;
  color: #475569;
  font-size: 14px;
}

.salary-result__row strong {
  color: #111827;
  text-align: right;
  white-space: nowrap;
}

.salary-formula {
  display: grid;
  gap: 8px;
  border-radius: 8px;
  background: #eef8f6;
  padding: 12px;
}

.salary-formula p {
  margin: 0;
  color: #31544f;
  font-size: 13px;
}

.salary-tax-summary {
  display: grid;
  gap: 10px;
  border-top: 1px solid #e5edf2;
  padding-top: 4px;
}

.salary-tax-summary h3 {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
}

.salary-tax-summary p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.salary-tax-summary__table {
  display: grid;
  gap: 0;
  overflow: hidden;
  border: 1px solid #e5edf2;
  border-radius: 8px;
}

.salary-tax-summary__head,
.salary-tax-summary__row {
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  font-size: 12px;
}

.salary-tax-summary__head {
  background: #eef8f6;
  color: #31544f;
  font-weight: 800;
}

.salary-tax-summary__row {
  color: #475569;
}

.salary-tax-summary__row + .salary-tax-summary__row {
  border-top: 1px solid #edf2f7;
}

.salary-tax-summary__row span:not(:first-child),
.salary-tax-summary__head span:not(:first-child) {
  text-align: right;
}

@media (max-width: 900px) {
  .salary-workspace {
    grid-template-columns: 1fr;
  }

  .salary-result {
    position: static;
  }
}

@media (max-width: 640px) {
  .salary-heading h1 {
    font-size: 2.1rem;
  }

  .salary-heading p:last-child {
    font-size: 1rem;
  }

  .salary-form,
  .salary-result {
    padding: 18px;
  }

  .salary-two-columns {
    grid-template-columns: 1fr;
  }

  .salary-tax-mode {
    grid-template-columns: 1fr;
  }

  .salary-additional-list__head,
  .salary-additional-row {
    grid-template-columns: minmax(0, 1fr) minmax(72px, 110px) auto;
  }

  .salary-add-button,
  .salary-remove-button {
    width: 40px;
  }

  .salary-toggle-row {
    display: grid;
  }

  .salary-result__total strong {
    font-size: 2rem;
  }
}
</style>
