<template>
  <main class="countdown-page" aria-labelledby="countdown-title">
    <section class="countdown-heading">
      <p class="countdown-eyebrow">{{ t('countdown.eyebrow') }}</p>
      <h1 id="countdown-title">{{ t('countdown.title') }}</h1>
      <p>{{ t('countdown.intro') }}</p>
    </section>

    <div class="countdown-workspace">
      <form class="countdown-form" @submit.prevent>
        <section class="countdown-section">
          <div class="countdown-section__header">
            <h2>{{ t('countdown.form.title') }}</h2>
            <p>{{ t('countdown.form.description') }}</p>
          </div>

          <div class="countdown-grid countdown-grid--two">
            <div class="countdown-field">
              <label for="countdown-start">{{ t('countdown.form.startDate') }}</label>
              <div class="countdown-input-wrap">
                <input
                  id="countdown-start"
                  v-model="input.startDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('startDate'))"
                  aria-describedby="countdown-start-error"
                  @blur="touch('startDate')"
                >
              </div>
              <p v-if="getIssue('startDate')" id="countdown-start-error" class="countdown-error">
                {{ t(getIssue('startDate')!.messageKey) }}
              </p>
            </div>

            <div class="countdown-field">
              <label for="countdown-target">{{ t('countdown.form.targetDate') }}</label>
              <div class="countdown-input-wrap">
                <input
                  id="countdown-target"
                  v-model="input.targetDate"
                  type="date"
                  :aria-invalid="Boolean(getIssue('targetDate'))"
                  aria-describedby="countdown-target-error"
                  @blur="touch('targetDate')"
                >
              </div>
              <p v-if="getIssue('targetDate')" id="countdown-target-error" class="countdown-error">
                {{ t(getIssue('targetDate')!.messageKey) }}
              </p>
            </div>
          </div>

          <label class="countdown-toggle">
            <input v-model="input.includeStartDate" type="checkbox">
            {{ t('countdown.form.includeStartDate') }}
          </label>
        </section>
      </form>

      <section class="countdown-result" aria-live="polite">
        <p class="countdown-result__label">{{ t('countdown.result.label') }}</p>

        <template v-if="result">
          <div class="countdown-result__total">
            <span>{{ t(`countdown.result.directionTitle.${result.direction}`) }}</span>
            <strong>{{ t('countdown.result.daysValue', { count: n(result.calendarDays, { maximumFractionDigits: 0 }) }) }}</strong>
          </div>

          <div class="countdown-result__rows">
            <div class="countdown-result__row">
              <span>{{ t('countdown.result.exactDays') }}</span>
              <strong>{{ n(result.days, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="countdown-result__row">
              <span>{{ t('countdown.result.fullWeeks') }}</span>
              <strong>{{ n(result.fullWeeks, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="countdown-result__row">
              <span>{{ t('countdown.result.remainingDays') }}</span>
              <strong>{{ n(result.remainingDays, { maximumFractionDigits: 0 }) }}</strong>
            </div>
            <div class="countdown-result__row">
              <span>{{ t('countdown.result.direction') }}</span>
              <strong>{{ t(`countdown.result.directionValue.${result.direction}`) }}</strong>
            </div>
          </div>

          <p class="countdown-formula">{{ t('countdown.formula') }}</p>
        </template>

        <p v-else class="countdown-result__empty">{{ t('countdown.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCountdownCalculator } from '../composables/useCountdownCalculator'

const { t, n } = useI18n()
const { input, result, touch, getIssue } = useCountdownCalculator()
</script>
