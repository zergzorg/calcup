<template>
  <main class="electricity-page" aria-labelledby="electricity-title">
    <section class="electricity-heading">
      <p class="electricity-eyebrow">{{ t('electricity.eyebrow') }}</p>
      <h1 id="electricity-title">{{ t('electricity.title') }}</h1>
      <p>{{ t('electricity.intro') }}</p>
    </section>

    <div class="electricity-workspace">
      <form class="electricity-form" @submit.prevent>
        <section class="electricity-section">
          <div class="electricity-section__header">
            <h2>{{ t('electricity.form.applianceTitle') }}</h2>
            <p>{{ t('electricity.form.applianceHint') }}</p>
          </div>

          <div class="electricity-grid electricity-grid--two">
            <div class="electricity-field">
              <label for="electricity-power">{{ t('electricity.form.power') }}</label>
              <div class="electricity-input-wrap">
                <input
                  id="electricity-power"
                  v-model.number="form.powerW"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('powerW'))"
                >
                <span>{{ t('electricity.units.w') }}</span>
              </div>
            </div>

            <div class="electricity-field">
              <label for="electricity-devices">{{ t('electricity.form.devicesCount') }}</label>
              <div class="electricity-input-wrap">
                <input
                  id="electricity-devices"
                  v-model.number="form.devicesCount"
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getFieldIssue('devicesCount'))"
                >
              </div>
            </div>
          </div>

          <div class="electricity-field">
            <span class="electricity-field__label">{{ t('electricity.form.powerPresets') }}</span>
            <div class="electricity-chip-list">
              <button
                v-for="power in powerPresets"
                :key="power"
                type="button"
                class="electricity-chip"
                :class="{ 'electricity-chip--active': form.powerW === power }"
                @click="setPower(power)"
              >
                {{ t('electricity.units.wattsValue', { value: formatNumber(power) }) }}
              </button>
            </div>
          </div>
        </section>

        <section class="electricity-section">
          <div class="electricity-section__header">
            <h2>{{ t('electricity.form.usageTitle') }}</h2>
            <p>{{ t('electricity.form.usageHint') }}</p>
          </div>

          <div class="electricity-grid electricity-grid--three">
            <div class="electricity-field">
              <label for="electricity-hours">{{ t('electricity.form.hoursPerDay') }}</label>
              <div class="electricity-input-wrap">
                <input
                  id="electricity-hours"
                  v-model.number="form.hoursPerDay"
                  type="number"
                  min="0"
                  max="24"
                  step="0.25"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('hoursPerDay'))"
                >
                <span>{{ t('electricity.units.h') }}</span>
              </div>
            </div>

            <div class="electricity-field">
              <label for="electricity-days">{{ t('electricity.form.daysPerMonth') }}</label>
              <div class="electricity-input-wrap">
                <input
                  id="electricity-days"
                  v-model.number="form.daysPerMonth"
                  type="number"
                  min="1"
                  max="31"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getFieldIssue('daysPerMonth'))"
                >
                <span>{{ t('electricity.units.days') }}</span>
              </div>
            </div>

            <div class="electricity-field">
              <label for="electricity-tariff">{{ t('electricity.form.tariff') }}</label>
              <div class="electricity-input-wrap">
                <input
                  id="electricity-tariff"
                  v-model.number="form.tariffPerKwh"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('tariffPerKwh'))"
                >
                <span>{{ t('electricity.units.currencyPerKwh') }}</span>
              </div>
            </div>
          </div>

          <div class="electricity-field">
            <span class="electricity-field__label">{{ t('electricity.form.hoursPresets') }}</span>
            <div class="electricity-chip-list">
              <button
                v-for="hours in hourPresets"
                :key="hours"
                type="button"
                class="electricity-chip"
                :class="{ 'electricity-chip--active': form.hoursPerDay === hours }"
                @click="setHours(hours)"
              >
                {{ t('electricity.units.hoursValue', { value: formatNumber(hours) }) }}
              </button>
            </div>
          </div>
        </section>
      </form>

      <section class="electricity-result" aria-live="polite">
        <p class="electricity-result__label">{{ t('electricity.result.label') }}</p>

        <template v-if="result">
          <div class="electricity-result__total">
            <span>{{ t('electricity.result.monthlyCost') }}</span>
            <strong>{{ formatCurrency(result.monthlyCost) }}</strong>
          </div>

          <div class="electricity-result__rows">
            <div class="electricity-result__row">
              <span>{{ t('electricity.result.monthlyKwh') }}</span>
              <strong>{{ formatNumber(result.monthlyKwh) }} {{ t('electricity.units.kwh') }}</strong>
            </div>
            <div class="electricity-result__row">
              <span>{{ t('electricity.result.dailyKwh') }}</span>
              <strong>{{ formatNumber(result.dailyKwh) }} {{ t('electricity.units.kwh') }}</strong>
            </div>
            <div class="electricity-result__row">
              <span>{{ t('electricity.result.dailyCost') }}</span>
              <strong>{{ formatCurrency(result.dailyCost) }}</strong>
            </div>
            <div class="electricity-result__row">
              <span>{{ t('electricity.result.yearlyKwh') }}</span>
              <strong>{{ formatNumber(result.yearlyKwh) }} {{ t('electricity.units.kwh') }}</strong>
            </div>
            <div class="electricity-result__row">
              <span>{{ t('electricity.result.yearlyCost') }}</span>
              <strong>{{ formatCurrency(result.yearlyCost) }}</strong>
            </div>
          </div>

          <p class="electricity-formula">{{ t('electricity.formula') }}</p>
        </template>

        <p v-else class="electricity-result__empty">{{ t('electricity.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import { useElectricityCalculator } from '../composables/useElectricityCalculator'

const { t, n } = useI18n()
const { form, result, setPower, setHours, getFieldIssue } = useElectricityCalculator()

const powerPresets = CALCULATOR_PRESETS_CONFIG.electricity.powerWatts
const hourPresets = CALCULATOR_PRESETS_CONFIG.electricity.hours

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}

function formatCurrency(value: number): string {
  return n(value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}
</script>
