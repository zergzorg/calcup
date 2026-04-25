<template>
  <main class="hourly-page" aria-labelledby="hourly-title">
    <section class="hourly-heading">
      <p class="hourly-eyebrow">{{ t('hourlyRate.eyebrow') }}</p>
      <h1 id="hourly-title">{{ t('hourlyRate.title') }}</h1>
      <p>{{ t('hourlyRate.intro') }}</p>
    </section>

    <div class="hourly-workspace">
      <form class="hourly-form" @submit.prevent>
        <section class="hourly-form__group" aria-labelledby="hourly-base-title">
          <div id="hourly-base-title" class="hourly-warning-note" role="note">
            {{ t('hourlyRate.warning') }}
          </div>

          <div class="hourly-field">
            <label for="hourly-salary">{{ t('hourlyRate.form.monthlySalary') }}</label>
            <div class="hourly-input-wrap">
              <input
                id="hourly-salary"
                v-model.number="monthlySalary"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('monthlySalary'))"
                aria-describedby="hourly-salary-error"
                @blur="touch('monthlySalary')"
              />
              <span>{{ t('hourlyRate.units.currency') }}</span>
            </div>
            <p v-if="getIssue('monthlySalary')" id="hourly-salary-error" class="hourly-error">
              {{ t(getIssue('monthlySalary')!.messageKey) }}
            </p>
          </div>

          <div class="hourly-tax-mode">
            <span class="hourly-field__label">{{ t('hourlyRate.form.salaryTaxMode') }}</span>
            <label
              v-for="option in salaryTaxOptions"
              :key="option"
              class="hourly-radio"
              :class="{ 'hourly-radio--active': salaryTaxMode === option }"
            >
              <input v-model="salaryTaxMode" type="radio" name="salary-tax-mode" :value="option" />
              <span>{{ t(`hourlyRate.salaryTaxMode.${option}`) }}</span>
            </label>
          </div>

          <div v-if="salaryTaxMode === 'custom'" class="hourly-field">
            <label for="hourly-salary-tax">{{ t('hourlyRate.form.customSalaryTaxPercent') }}</label>
            <div class="hourly-input-wrap">
              <input
                id="hourly-salary-tax"
                v-model.number="customSalaryTaxPercent"
                type="number"
                min="0"
                max="100"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('customSalaryTaxPercent'))"
                aria-describedby="hourly-salary-tax-error"
                @blur="touch('customSalaryTaxPercent')"
              />
              <span>%</span>
            </div>
            <p
              v-if="getIssue('customSalaryTaxPercent')"
              id="hourly-salary-tax-error"
              class="hourly-error"
            >
              {{ t(getIssue('customSalaryTaxPercent')!.messageKey) }}
            </p>
          </div>

          <p class="hourly-note">
            {{ t('hourlyRate.form.salaryTaxHint') }}
            <a
              href="https://www.garant.ru/1c-wiseadvice/guide/progressivnaya-shkala-ndfl-s-2025-goda/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('hourlyRate.form.salaryTaxLink') }}
            </a>
          </p>

          <div class="hourly-additional-list">
            <div class="hourly-additional-list__head">
              <span>{{ t('hourlyRate.form.additionalIncome') }}</span>
              <span>{{ t('hourlyRate.form.additionalIncomeTaxPercent') }}</span>
              <span class="sr-only">{{ t('hourlyRate.form.additionalIncomeActions') }}</span>
            </div>

            <div
              v-for="(item, index) in additionalIncomes"
              :key="index"
              class="hourly-additional-row"
            >
              <div class="hourly-field">
                <label class="sr-only" :for="`hourly-additional-income-${index}`">
                  {{ t('hourlyRate.form.additionalIncome') }}
                </label>
                <div class="hourly-input-wrap">
                  <input
                    :id="`hourly-additional-income-${index}`"
                    v-model.number="item.amount"
                    type="number"
                    min="0"
                    step="any"
                    inputmode="decimal"
                    :aria-invalid="Boolean(getIssue(`additionalIncome.${index}.amount`))"
                    :aria-describedby="`hourly-additional-income-${index}-error`"
                    @blur="touch(`additionalIncome.${index}.amount`)"
                  />
                  <span>{{ t('hourlyRate.units.currency') }}</span>
                </div>
                <p
                  v-if="getIssue(`additionalIncome.${index}.amount`)"
                  :id="`hourly-additional-income-${index}-error`"
                  class="hourly-error"
                >
                  {{ t(getIssue(`additionalIncome.${index}.amount`)!.messageKey) }}
                </p>
              </div>

              <div class="hourly-field">
                <label class="sr-only" :for="`hourly-additional-tax-${index}`">
                  {{ t('hourlyRate.form.additionalIncomeTaxPercent') }}
                </label>
                <div class="hourly-input-wrap">
                  <input
                    :id="`hourly-additional-tax-${index}`"
                    v-model.number="item.taxPercent"
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    inputmode="decimal"
                    :aria-invalid="Boolean(getIssue(`additionalIncome.${index}.taxPercent`))"
                    :aria-describedby="`hourly-additional-tax-${index}-error`"
                    @blur="touch(`additionalIncome.${index}.taxPercent`)"
                  />
                  <span>%</span>
                </div>
                <p
                  v-if="getIssue(`additionalIncome.${index}.taxPercent`)"
                  :id="`hourly-additional-tax-${index}-error`"
                  class="hourly-error"
                >
                  {{ t(getIssue(`additionalIncome.${index}.taxPercent`)!.messageKey) }}
                </p>
              </div>

              <div class="hourly-additional-actions">
                <button
                  v-if="additionalIncomes.length > 1"
                  type="button"
                  class="hourly-remove-button"
                  :aria-label="t('hourlyRate.form.removeAdditionalIncome')"
                  :title="t('hourlyRate.form.removeAdditionalIncome')"
                  @click="removeAdditionalIncome(index)"
                />
                <button
                  type="button"
                  class="hourly-add-button"
                  :aria-label="t('hourlyRate.form.addAdditionalIncome')"
                  :title="t('hourlyRate.form.addAdditionalIncome')"
                  @click="addAdditionalIncome"
                />
              </div>
            </div>
          </div>

          <p class="hourly-note">{{ t('hourlyRate.form.additionalIncomeHint') }}</p>

          <div class="hourly-field">
            <label for="hourly-schedule">{{ t('hourlyRate.form.scheduleType') }}</label>
            <select id="hourly-schedule" v-model="scheduleType">
              <option v-for="option in scheduleOptions" :key="option" :value="option">
                {{ t(`hourlyRate.schedule.${option}`) }}
              </option>
            </select>
          </div>

          <div class="hourly-field">
            <label for="hourly-day-hours">{{ t('hourlyRate.form.hoursPerWorkDay') }}</label>
            <div class="hourly-input-wrap">
              <input
                id="hourly-day-hours"
                v-model.number="hoursPerWorkDay"
                type="number"
                min="0"
                max="24"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('hoursPerWorkDay'))"
                aria-describedby="hourly-day-hours-error"
                @blur="touch('hoursPerWorkDay')"
              />
              <span>{{ t('hourlyRate.units.hours') }}</span>
            </div>
            <p v-if="getIssue('hoursPerWorkDay')" id="hourly-day-hours-error" class="hourly-error">
              {{ t(getIssue('hoursPerWorkDay')!.messageKey) }}
            </p>
          </div>

          <div v-if="scheduleType === 'custom'" class="hourly-field">
            <label for="hourly-work-days">{{ t('hourlyRate.form.customWorkDaysPerYear') }}</label>
            <div class="hourly-input-wrap">
              <input
                id="hourly-work-days"
                v-model.number="customWorkDaysPerYear"
                type="number"
                min="1"
                max="366"
                step="1"
                inputmode="numeric"
                :aria-invalid="Boolean(getIssue('customWorkDaysPerYear'))"
                aria-describedby="hourly-work-days-error"
                @blur="touch('customWorkDaysPerYear')"
              />
              <span>{{ t('hourlyRate.units.days') }}</span>
            </div>
            <p
              v-if="getIssue('customWorkDaysPerYear')"
              id="hourly-work-days-error"
              class="hourly-error"
            >
              {{ t(getIssue('customWorkDaysPerYear')!.messageKey) }}
            </p>
          </div>
        </section>
      </form>

      <section class="hourly-result" aria-live="polite">
        <p class="hourly-result__label">{{ t('hourlyRate.result.label') }}</p>

        <template v-if="result">
          <div class="hourly-result__total">
            <span>
              {{ t('hourlyRate.result.baseHourlyRate') }}
            </span>
            <strong>{{ money(result.baseHourlyRate) }}</strong>
          </div>

          <div class="hourly-result__rows">
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.monthlySalaryGross') }}</span>
              <strong>{{ money(monthlySalary) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.annualGrossSalary') }}</span>
              <strong>{{ money(result.annualGrossSalary) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.additionalIncome') }}</span>
              <strong>{{ money(result.annualAdditionalIncome / 12) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.additionalIncomeTaxAmount') }}</span>
              <strong>{{ money(result.additionalIncomeTaxAmount) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.monthlyTotalIncomeAfterTax') }}</span>
              <strong>{{ money(result.monthlyTotalIncomeAfterTax) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.salaryTaxAmount') }}</span>
              <strong>{{ money(result.salaryTaxAmount) }} · {{ percent(result.salaryTaxPercent) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.monthlySalaryAfterTax') }}</span>
              <strong>{{ money(result.monthlySalaryAfterTax) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.baseHourlyRate') }}</span>
              <strong>{{ money(result.baseHourlyRate) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.workDayPrice') }}</span>
              <strong>{{ money(result.workDayPrice) }}</strong>
            </div>
            <div class="hourly-result__row">
              <span>{{ t('hourlyRate.result.averageWorkHoursPerMonth') }}</span>
              <strong>{{ hours(result.averageWorkHoursPerMonth) }}</strong>
            </div>
          </div>

          <div class="hourly-formula">
            <p>{{ t('hourlyRate.formula.rate') }}</p>
          </div>

          <div
            v-if="salaryTaxMode === 'russiaProgressive' && result.monthlyTaxBreakdown.length"
            class="hourly-tax-breakdown"
          >
            <h3>{{ t('hourlyRate.taxBreakdown.title') }}</h3>
            <p>{{ t('hourlyRate.taxBreakdown.note') }}</p>
            <div class="hourly-tax-breakdown__table">
              <div class="hourly-tax-breakdown__head">
                <span>{{ t('hourlyRate.taxBreakdown.month') }}</span>
                <span>{{ t('hourlyRate.taxBreakdown.tax') }}</span>
                <span>{{ t('hourlyRate.taxBreakdown.afterTax') }}</span>
              </div>
              <div
                v-for="item in result.monthlyTaxBreakdown"
                :key="item.month"
                class="hourly-tax-breakdown__row"
              >
                <span>{{ t(`hourlyRate.months.${item.month}`) }}</span>
                <span>{{ money(item.taxAmount) }} · {{ percent(item.effectiveTaxPercent) }}</span>
                <span>{{ money(item.salaryAfterTax) }}</span>
              </div>
            </div>
          </div>
        </template>

        <p v-else class="hourly-result__empty">{{ t('hourlyRate.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHourlyRateCalculator } from '../composables/useHourlyRateCalculator'
import type { ScheduleType } from '../types/hourly-rate'

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
} = useHourlyRateCalculator()

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
  return t('hourlyRate.units.hoursValue', {
    value: n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  })
}

function percent(value: number): string {
  return n(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }) + '%'
}
</script>

<style scoped>
.hourly-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.hourly-heading {
  max-width: 780px;
}

.hourly-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hourly-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3rem;
  line-height: 1.05;
  font-weight: 850;
}

.hourly-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.hourly-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 20px;
  align-items: start;
}

.hourly-form,
.hourly-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.hourly-form {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.hourly-form__group {
  display: grid;
  gap: 16px;
  margin: 0;
}

.hourly-form__group h2 {
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
}

.hourly-note {
  margin: -4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.hourly-warning-note {
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

.hourly-note a {
  color: #0f766e;
  font-weight: 800;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.hourly-additional-list {
  display: grid;
  gap: 8px;
}

.hourly-additional-list__head,
.hourly-additional-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(90px, 150px) auto;
  gap: 8px;
  align-items: start;
}

.hourly-additional-list__head {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.hourly-additional-actions {
  display: inline-flex;
  gap: 6px;
}

.hourly-add-button,
.hourly-remove-button {
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

.hourly-add-button::before,
.hourly-add-button::after,
.hourly-remove-button::before {
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

.hourly-add-button::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.hourly-add-button:hover {
  border-color: #0f766e;
  background: #eef8f6;
}

.hourly-remove-button::before {
  background: #64748b;
}

.hourly-remove-button:hover {
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

.hourly-toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hourly-toggle-row p,
.hourly-optional-note {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.hourly-toggle {
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

.hourly-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.hourly-toggle__control {
  position: relative;
  width: 42px;
  height: 24px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #e2e8f0;
  transition: background 0.16s, border-color 0.16s;
}

.hourly-toggle__control::after {
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

.hourly-toggle input:checked + .hourly-toggle__control {
  border-color: #0d9488;
  background: #0d9488;
}

.hourly-toggle input:checked + .hourly-toggle__control::after {
  transform: translateX(18px);
}

.hourly-toggle input:focus-visible + .hourly-toggle__control {
  outline: 3px solid rgba(13, 148, 136, 0.2);
  outline-offset: 2px;
}

.hourly-toggle__text {
  color: #0f766e;
}

.hourly-field {
  display: grid;
  gap: 6px;
}

.hourly-field__label,
.hourly-field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.hourly-tax-mode {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.hourly-tax-mode .hourly-field__label {
  grid-column: 1 / -1;
}

.hourly-radio {
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

.hourly-radio input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.hourly-radio--active {
  border-color: #0d9488;
  background: #eef8f6;
  color: #0f766e;
}

.hourly-field select,
.hourly-input-wrap {
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s, background 0.15s;
}

.hourly-field select {
  box-sizing: border-box;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.hourly-input-wrap {
  display: flex;
  align-items: center;
  min-height: 44px;
  overflow: hidden;
}

.hourly-input-wrap input {
  min-width: 0;
  flex: 1;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.hourly-input-wrap span {
  flex: 0 0 auto;
  padding: 0 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.hourly-field select:focus,
.hourly-input-wrap:focus-within {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

.hourly-input-wrap input:focus {
  outline: none;
}

.hourly-input-wrap:has(input[aria-invalid="true"]) {
  border-color: #ef4444;
}

.hourly-error {
  margin: 0;
  color: #ef4444;
  font-size: 12px;
}

.hourly-two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.hourly-result {
  position: sticky;
  top: 88px;
  display: grid;
  gap: 18px;
  padding: 24px;
}

.hourly-result__label {
  margin: 0;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hourly-result__total {
  display: grid;
  gap: 6px;
}

.hourly-result__total span,
.hourly-result__rate,
.hourly-result__empty {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.hourly-result__total strong {
  color: #111827;
  font-size: 2.55rem;
  line-height: 1.05;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.hourly-result__rate strong {
  color: #0f766e;
  font-size: 1.05rem;
}

.hourly-result__rows {
  display: grid;
  gap: 10px;
}

.hourly-result__row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #e5edf2;
  padding-bottom: 10px;
  color: #475569;
  font-size: 14px;
}

.hourly-result__row strong {
  color: #111827;
  text-align: right;
  white-space: nowrap;
}

.hourly-formula {
  display: grid;
  gap: 8px;
  border-radius: 8px;
  background: #eef8f6;
  padding: 12px;
}

.hourly-formula p {
  margin: 0;
  color: #31544f;
  font-size: 13px;
}

.hourly-tax-breakdown {
  display: grid;
  gap: 10px;
  border-top: 1px solid #e5edf2;
  padding-top: 4px;
}

.hourly-tax-breakdown h3 {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
}

.hourly-tax-breakdown p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.hourly-tax-breakdown__table {
  display: grid;
  gap: 0;
  overflow: hidden;
  border: 1px solid #e5edf2;
  border-radius: 8px;
}

.hourly-tax-breakdown__head,
.hourly-tax-breakdown__row {
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  font-size: 12px;
}

.hourly-tax-breakdown__head {
  background: #eef8f6;
  color: #31544f;
  font-weight: 800;
}

.hourly-tax-breakdown__row {
  color: #475569;
}

.hourly-tax-breakdown__row + .hourly-tax-breakdown__row {
  border-top: 1px solid #edf2f7;
}

.hourly-tax-breakdown__row span:not(:first-child),
.hourly-tax-breakdown__head span:not(:first-child) {
  text-align: right;
}

@media (max-width: 900px) {
  .hourly-workspace {
    grid-template-columns: 1fr;
  }

  .hourly-result {
    position: static;
  }
}

@media (max-width: 640px) {
  .hourly-heading h1 {
    font-size: 2.1rem;
  }

  .hourly-heading p:last-child {
    font-size: 1rem;
  }

  .hourly-form,
  .hourly-result {
    padding: 18px;
  }

  .hourly-two-columns {
    grid-template-columns: 1fr;
  }

  .hourly-tax-mode {
    grid-template-columns: 1fr;
  }

  .hourly-additional-list__head,
  .hourly-additional-row {
    grid-template-columns: minmax(0, 1fr) minmax(72px, 110px) auto;
  }

  .hourly-add-button,
  .hourly-remove-button {
    width: 40px;
  }

  .hourly-toggle-row {
    display: grid;
  }

  .hourly-result__total strong {
    font-size: 2rem;
  }
}
</style>
