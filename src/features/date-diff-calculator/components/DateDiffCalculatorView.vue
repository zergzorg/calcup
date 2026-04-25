<template>
  <main class="ddiff-page" aria-labelledby="ddiff-title">
    <section class="ddiff-heading">
      <p class="ddiff-eyebrow">{{ t('dateDiff.eyebrow') }}</p>
      <h1 id="ddiff-title">{{ t('dateDiff.title') }}</h1>
      <p>{{ t('dateDiff.intro') }}</p>
    </section>

    <div class="ddiff-workspace">
      <form class="ddiff-form" @submit.prevent>
        <div class="ddiff-date-row">
          <div class="ddiff-field">
            <label for="ddiff-start">{{ t('dateDiff.form.startDate') }}</label>
            <input
              id="ddiff-start"
              v-model="startDate"
              type="date"
              :aria-invalid="Boolean(getIssue('startDate'))"
              aria-describedby="ddiff-start-error"
              @blur="touch('startDate')"
            >
            <p v-if="getIssue('startDate')" id="ddiff-start-error" class="ddiff-error">
              {{ t(getIssue('startDate')!.messageKey) }}
            </p>
          </div>

          <span class="ddiff-arrow" aria-hidden="true">→</span>

          <div class="ddiff-field">
            <label for="ddiff-end">{{ t('dateDiff.form.endDate') }}</label>
            <input
              id="ddiff-end"
              v-model="endDate"
              type="date"
              :aria-invalid="Boolean(getIssue('endDate'))"
              aria-describedby="ddiff-end-error"
              @blur="touch('endDate')"
            >
            <p v-if="getIssue('endDate')" id="ddiff-end-error" class="ddiff-error">
              {{ t(getIssue('endDate')!.messageKey) }}
            </p>
          </div>
        </div>

        <label class="ddiff-toggle">
          <input v-model="includeEndDate" type="checkbox" class="ddiff-toggle__checkbox">
          <span class="ddiff-toggle__mark"></span>
          {{ t('dateDiff.form.includeEndDate') }}
        </label>
      </form>

      <section class="ddiff-result" aria-live="polite">
        <p class="ddiff-result__label">{{ t('dateDiff.result.label') }}</p>

        <template v-if="result !== null">
          <div class="ddiff-result__value">{{ n(result.days, { maximumFractionDigits: 0 }) }}</div>
          <p class="ddiff-result__unit">{{ t('dateDiff.result.days', result.days) }}</p>

          <p v-if="result.direction !== 'same'" class="ddiff-result__direction">
            {{ t(`dateDiff.result.direction.${result.direction}`) }}
          </p>

          <div v-if="result.days > 0" class="ddiff-breakdown">
            <span v-if="result.breakdown.years > 0">
              {{ t('dateDiff.result.breakdown.years', result.breakdown.years) }}
            </span>
            <span v-if="result.breakdown.months > 0">
              {{ t('dateDiff.result.breakdown.months', result.breakdown.months) }}
            </span>
            <span v-if="result.breakdown.days > 0 || (result.breakdown.years === 0 && result.breakdown.months === 0)">
              {{ t('dateDiff.result.breakdown.days', result.breakdown.days) }}
            </span>
          </div>
        </template>

        <p v-else class="ddiff-result__empty">{{ t('dateDiff.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDateDiffCalculator } from '../composables/useDateDiffCalculator'

const { t, n } = useI18n()

const {
  startDate,
  endDate,
  includeEndDate,
  touch,
  getIssue,
  result,
} = useDateDiffCalculator()
</script>

<style scoped>
.ddiff-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.ddiff-heading {
  max-width: 760px;
}

.ddiff-eyebrow {
  margin: 0 0 10px;
  color: #0e7490;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.ddiff-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.ddiff-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.ddiff-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 20px;
  align-items: stretch;
}

.ddiff-form,
.ddiff-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.ddiff-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

.ddiff-date-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: end;
}

.ddiff-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  color: #94a3b8;
  font-size: 1.4rem;
  user-select: none;
}

.ddiff-field {
  display: grid;
  gap: 8px;
}

.ddiff-field label {
  color: #27364a;
  font-weight: 750;
}

.ddiff-field input[type=date] {
  width: 100%;
  min-width: 0;
  border: 1px solid #cbd7e6;
  border-radius: 8px;
  padding: 13px 14px;
  color: #111827;
  background: #fff;
  font: inherit;
  outline: 0;
  box-sizing: border-box;
}

.ddiff-field input[type=date]:focus {
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.12);
}

.ddiff-field input[aria-invalid="true"] {
  border-color: #f87171;
}

.ddiff-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

.ddiff-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.ddiff-toggle__checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.ddiff-toggle__mark {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  border: 1.5px solid #cbd7e6;
  border-radius: 11px;
  background: #f1f5f9;
  transition: background 0.15s, border-color 0.15s;
}

.ddiff-toggle__mark::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,.15);
  transition: transform 0.15s;
}

.ddiff-toggle__checkbox:checked ~ .ddiff-toggle__mark {
  border-color: #0e7490;
  background: #0e7490;
}

.ddiff-toggle__checkbox:checked ~ .ddiff-toggle__mark::after {
  transform: translateX(18px);
}

.ddiff-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 252px;
  padding: 24px;
}

.ddiff-result__label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ddiff-result__value {
  color: #0e7490;
  font-size: 3.6rem;
  line-height: 1;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.ddiff-result__unit {
  margin: 6px 0 0;
  color: #526174;
  font-size: 1rem;
  font-weight: 600;
}

.ddiff-result__direction {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.ddiff-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0 0;
}

.ddiff-breakdown span {
  border-radius: 6px;
  padding: 4px 10px;
  color: #0e7490;
  background: #ecfeff;
  font-size: 0.88rem;
  font-weight: 700;
}

.ddiff-result__empty {
  margin-top: 8px;
  color: #94a3b8;
}

@media (max-width: 900px) {
  .ddiff-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .ddiff-page {
    gap: 20px;
  }

  .ddiff-heading h1 {
    font-size: 2.15rem;
  }

  .ddiff-heading p:last-child {
    font-size: 1rem;
  }

  .ddiff-form,
  .ddiff-result {
    padding: 18px;
  }

  .ddiff-date-row {
    grid-template-columns: 1fr;
  }

  .ddiff-arrow {
    height: auto;
    transform: rotate(90deg);
    justify-self: start;
  }

  .ddiff-result {
    min-height: 220px;
  }

  .ddiff-result__value {
    font-size: 3rem;
  }
}
</style>
