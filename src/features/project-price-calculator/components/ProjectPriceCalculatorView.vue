<template>
  <main class="project-page" aria-labelledby="project-title">
    <section class="project-heading">
      <p class="project-eyebrow">{{ t('projectPrice.eyebrow') }}</p>
      <h1 id="project-title">{{ t('projectPrice.title') }}</h1>
      <p>{{ t('projectPrice.intro') }}</p>
    </section>

    <div class="project-workspace">
      <form class="project-form" @submit.prevent>
        <div class="project-field">
          <label for="project-hourly-rate">{{ t('projectPrice.form.hourlyRate') }}</label>
          <div class="project-input-wrap">
            <input
              id="project-hourly-rate"
              v-model.number="hourlyRate"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('hourlyRate'))"
              aria-describedby="project-hourly-rate-error"
              @blur="touch('hourlyRate')"
            />
            <span>{{ t('projectPrice.units.currencyPerHour') }}</span>
          </div>
          <p v-if="getIssue('hourlyRate')" id="project-hourly-rate-error" class="project-error">
            {{ t(getIssue('hourlyRate')!.messageKey) }}
          </p>
        </div>

        <div class="project-field">
          <label for="project-hours">{{ t('projectPrice.form.projectHours') }}</label>
          <div class="project-input-wrap">
            <input
              id="project-hours"
              v-model.number="projectHours"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              :aria-invalid="Boolean(getIssue('projectHours'))"
              aria-describedby="project-hours-error"
              @blur="touch('projectHours')"
            />
            <span>{{ t('projectPrice.units.hours') }}</span>
          </div>
          <p v-if="getIssue('projectHours')" id="project-hours-error" class="project-error">
            {{ t(getIssue('projectHours')!.messageKey) }}
          </p>
        </div>

        <div class="project-two-columns">
          <div class="project-field">
            <label for="project-complexity">{{ t('projectPrice.form.complexityLevel') }}</label>
            <select id="project-complexity" v-model="complexityLevel">
              <option v-for="option in complexityOptions" :key="option" :value="option">
                {{ t(`projectPrice.complexity.${option}`) }}
              </option>
            </select>
          </div>

          <div class="project-field">
            <label for="project-urgency">{{ t('projectPrice.form.urgencyLevel') }}</label>
            <select id="project-urgency" v-model="urgencyLevel">
              <option v-for="option in urgencyOptions" :key="option" :value="option">
                {{ t(`projectPrice.urgency.${option}`) }}
              </option>
            </select>
          </div>
        </div>

        <div class="project-two-columns">
          <div class="project-field">
            <label for="project-expenses">{{ t('projectPrice.form.expenseAmount') }}</label>
            <div class="project-input-wrap">
              <input
                id="project-expenses"
                v-model.number="expenseAmount"
                type="number"
                min="0"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('expenseAmount'))"
                aria-describedby="project-expenses-error"
                @blur="touch('expenseAmount')"
              />
              <span>{{ t('projectPrice.units.currency') }}</span>
            </div>
            <p v-if="getIssue('expenseAmount')" id="project-expenses-error" class="project-error">
              {{ t(getIssue('expenseAmount')!.messageKey) }}
            </p>
          </div>

          <div class="project-field">
            <label for="project-tax">{{ t('projectPrice.form.taxPercent') }}</label>
            <div class="project-input-wrap">
              <input
                id="project-tax"
                v-model.number="taxPercent"
                type="number"
                min="0"
                max="100"
                step="any"
                inputmode="decimal"
                :aria-invalid="Boolean(getIssue('taxPercent'))"
                aria-describedby="project-tax-error"
                @blur="touch('taxPercent')"
              />
              <span>%</span>
            </div>
            <p v-if="getIssue('taxPercent')" id="project-tax-error" class="project-error">
              {{ t(getIssue('taxPercent')!.messageKey) }}
            </p>
          </div>
        </div>
      </form>

      <section class="project-result" aria-live="polite">
        <p class="project-result__label">{{ t('projectPrice.result.label') }}</p>

        <template v-if="result">
          <div class="project-result__total">
            <span>{{ t('projectPrice.result.totalProjectPrice') }}</span>
            <strong>{{ money(result.totalProjectPrice) }}</strong>
          </div>

          <p class="project-result__rate">
            {{ t('projectPrice.result.adjustedHourlyRate') }}:
            <strong>{{ money(result.adjustedHourlyRate) }}</strong>
          </p>

          <div class="project-result__rows">
            <div class="project-result__row">
              <span>{{ t('projectPrice.result.baseHourlyRate') }}</span>
              <strong>{{ money(hourlyRate) }}</strong>
            </div>
            <div class="project-result__row">
              <span>{{ t('projectPrice.result.laborCost') }}</span>
              <strong>{{ money(result.laborCost) }}</strong>
            </div>
            <div class="project-result__row">
              <span>{{ t('projectPrice.result.expenseAmount') }}</span>
              <strong>{{ money(expenseAmount) }}</strong>
            </div>
            <div class="project-result__row">
              <span>{{ t('projectPrice.result.taxAmount') }}</span>
              <strong>{{ money(result.taxAmount) }}</strong>
            </div>
          </div>

          <div class="project-formula">
            <p>{{ t('projectPrice.formula.price') }}</p>
          </div>
        </template>

        <p v-else class="project-result__empty">{{ t('projectPrice.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProjectPriceCalculator } from '../composables/useProjectPriceCalculator'
import type { ComplexityLevel, UrgencyLevel } from '../types/project-price'

const { t, locale } = useI18n()
const {
  hourlyRate,
  projectHours,
  complexityLevel,
  urgencyLevel,
  expenseAmount,
  taxPercent,
  touch,
  getIssue,
  result,
} = useProjectPriceCalculator()

const complexityOptions: ComplexityLevel[] = ['simple', 'normal', 'complex', 'expert']
const urgencyOptions: UrgencyLevel[] = ['normal', 'soon', 'urgent']

function money(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.project-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.project-heading {
  max-width: 780px;
}

.project-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.project-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3rem;
  line-height: 1.05;
  font-weight: 850;
}

.project-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.project-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 20px;
  align-items: start;
}

.project-form,
.project-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.project-form {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.project-field {
  display: grid;
  gap: 6px;
}

.project-field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.project-field select,
.project-input-wrap {
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s, background 0.15s;
}

.project-field select {
  box-sizing: border-box;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.project-input-wrap {
  display: flex;
  align-items: center;
  min-height: 44px;
  overflow: hidden;
}

.project-input-wrap input {
  min-width: 0;
  flex: 1;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  color: #111827;
  font-size: 15px;
}

.project-input-wrap span {
  flex: 0 0 auto;
  padding: 0 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.project-field select:focus,
.project-input-wrap:focus-within {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

.project-input-wrap input:focus {
  outline: none;
}

.project-input-wrap:has(input[aria-invalid="true"]) {
  border-color: #ef4444;
}

.project-error {
  margin: 0;
  color: #ef4444;
  font-size: 12px;
}

.project-two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.project-result {
  position: sticky;
  top: 88px;
  display: grid;
  gap: 18px;
  padding: 24px;
}

.project-result__label {
  margin: 0;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.project-result__total {
  display: grid;
  gap: 6px;
}

.project-result__total span,
.project-result__rate,
.project-result__empty {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.project-result__total strong {
  color: #111827;
  font-size: 2.55rem;
  line-height: 1.05;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.project-result__rate strong {
  color: #0f766e;
}

.project-result__rows {
  display: grid;
  gap: 10px;
}

.project-result__row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #e5edf2;
  padding-bottom: 10px;
  color: #475569;
  font-size: 14px;
}

.project-result__row strong {
  color: #111827;
  text-align: right;
  white-space: nowrap;
}

.project-formula {
  border-radius: 8px;
  background: #eef8f6;
  padding: 12px;
}

.project-formula p {
  margin: 0;
  color: #31544f;
  font-size: 13px;
}

@media (max-width: 900px) {
  .project-workspace {
    grid-template-columns: 1fr;
  }

  .project-result {
    position: static;
  }
}

@media (max-width: 640px) {
  .project-heading h1 {
    font-size: 2.1rem;
  }

  .project-form,
  .project-result {
    padding: 18px;
  }

  .project-two-columns {
    grid-template-columns: 1fr;
  }

  .project-result__total strong {
    font-size: 2rem;
  }
}
</style>
