<template>
  <main class="disc-page" aria-labelledby="disc-title">
    <section class="disc-heading">
      <p class="disc-eyebrow">{{ t('discount.eyebrow') }}</p>
      <h1 id="disc-title">{{ t('discount.title') }}</h1>
      <p>{{ t('discount.intro') }}</p>
    </section>

    <div class="disc-workspace">
      <!-- ===== FORM ===== -->
      <form class="disc-form" @submit.prevent>
        <!-- Mode switcher -->
        <div class="disc-modes" role="group" :aria-label="t('discount.modes.label')">
          <label
            v-for="m in MODES"
            :key="m"
            class="disc-mode"
            :class="{ 'disc-mode--active': mode === m }"
          >
            <input type="radio" name="discMode" :value="m" v-model="mode" class="disc-radio" />
            {{ t(`discount.modes.${m}`) }}
          </label>
        </div>

        <!-- discount / markup / findOriginal: price + percent -->
        <template v-if="mode === 'discount' || mode === 'markup' || mode === 'findOriginal'">
          <!-- originalPrice: shown in discount / markup modes -->
          <div v-if="mode !== 'findOriginal'" class="disc-field">
            <label class="disc-label" for="disc-price">{{ t('discount.form.originalPrice') }}</label>
            <div class="disc-input-wrap" :class="{ 'disc-input-wrap--error': getIssue('originalPrice') }">
              <input
                id="disc-price"
                v-model.number="originalPrice"
                type="number"
                min="0"
                step="any"
                class="disc-input"
                @blur="touch('originalPrice')"
              />
              <span class="disc-suffix">₽</span>
            </div>
            <p v-if="getIssue('originalPrice')" class="disc-error">
              {{ t(getIssue('originalPrice')!.messageKey) }}
            </p>
          </div>

          <!-- finalPrice: shown in findOriginal mode -->
          <div v-if="mode === 'findOriginal'" class="disc-field">
            <label class="disc-label" for="disc-final-price">{{ t('discount.form.finalPrice') }}</label>
            <div class="disc-input-wrap" :class="{ 'disc-input-wrap--error': getIssue('finalPrice') }">
              <input
                id="disc-final-price"
                v-model.number="finalPrice"
                type="number"
                min="0"
                step="any"
                class="disc-input"
                @blur="touch('finalPrice')"
              />
              <span class="disc-suffix">₽</span>
            </div>
            <p v-if="getIssue('finalPrice')" class="disc-error">
              {{ t(getIssue('finalPrice')!.messageKey) }}
            </p>
          </div>

          <!-- Quick percent buttons -->
          <div class="disc-field">
            <span class="disc-label">{{ t('discount.form.percent') }}</span>
            <div class="disc-presets" role="group" :aria-label="t('discount.form.percent')">
              <label
                v-for="q in QUICK_PERCENTS"
                :key="q"
                class="disc-preset"
                :class="{ 'disc-preset--active': percent === q }"
              >
                <input type="radio" name="discPercent" :value="q" v-model="percent" class="disc-radio" />
                {{ q }}%
              </label>
              <label class="disc-preset" :class="{ 'disc-preset--active': percent === 'custom' }">
                <input type="radio" name="discPercent" value="custom" v-model="percent" class="disc-radio" />
                {{ t('discount.form.customPercent') }}
              </label>
            </div>

            <div v-if="percent === 'custom'" class="disc-custom-wrap">
              <div class="disc-input-wrap disc-input-wrap--narrow" :class="{ 'disc-input-wrap--error': getIssue('percent') }">
                <input
                  v-model.number="customPercent"
                  type="number"
                  min="0"
                  step="any"
                  class="disc-input"
                  @blur="touch('percent')"
                />
                <span class="disc-suffix">%</span>
              </div>
            </div>
            <p v-if="getIssue('percent')" class="disc-error">{{ t(getIssue('percent')!.messageKey) }}</p>
          </div>
        </template>

        <!-- findPercent: old price + new price -->
        <template v-if="mode === 'findPercent'">
          <div class="disc-field">
            <label class="disc-label" for="disc-old">{{ t('discount.form.oldPrice') }}</label>
            <div class="disc-input-wrap" :class="{ 'disc-input-wrap--error': getIssue('oldPrice') }">
              <input
                id="disc-old"
                v-model.number="oldPrice"
                type="number"
                min="0"
                step="any"
                class="disc-input"
                @blur="touch('oldPrice')"
              />
              <span class="disc-suffix">₽</span>
            </div>
            <p v-if="getIssue('oldPrice')" class="disc-error">{{ t(getIssue('oldPrice')!.messageKey) }}</p>
          </div>

          <div class="disc-field">
            <label class="disc-label" for="disc-new">{{ t('discount.form.newPrice') }}</label>
            <div class="disc-input-wrap" :class="{ 'disc-input-wrap--error': getIssue('newPrice') }">
              <input
                id="disc-new"
                v-model.number="newPrice"
                type="number"
                min="0"
                step="any"
                class="disc-input"
                @blur="touch('newPrice')"
              />
              <span class="disc-suffix">₽</span>
            </div>
            <p v-if="getIssue('newPrice')" class="disc-error">{{ t(getIssue('newPrice')!.messageKey) }}</p>
          </div>
        </template>
      </form>

      <!-- ===== RESULT ===== -->
      <section class="disc-result" aria-live="polite">
        <p class="disc-result__label">{{ t('discount.result.label') }}</p>

        <template v-if="result !== null">
          <!-- discount -->
          <template v-if="result.mode === 'discount'">
            <div class="disc-result__big">
              {{ n(result.finalPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span class="disc-result__currency">₽</span>
            </div>
            <div class="disc-result__rows">
              <div class="disc-result__row">
                <span class="disc-result__row-label">{{ t('discount.result.discountAmount') }}</span>
                <span class="disc-result__row-value disc-result__row-value--red">
                  −{{ n(result.discountAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽
                </span>
              </div>
            </div>
            <p class="disc-result__formula">{{ t('discount.formula.discount') }}</p>
          </template>

          <!-- markup -->
          <template v-else-if="result.mode === 'markup'">
            <div class="disc-result__big">
              {{ n(result.finalPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span class="disc-result__currency">₽</span>
            </div>
            <div class="disc-result__rows">
              <div class="disc-result__row">
                <span class="disc-result__row-label">{{ t('discount.result.markupAmount') }}</span>
                <span class="disc-result__row-value disc-result__row-value--green">
                  +{{ n(result.markupAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽
                </span>
              </div>
            </div>
            <p class="disc-result__formula">{{ t('discount.formula.markup') }}</p>
          </template>

          <!-- findPercent -->
          <template v-else-if="result.mode === 'findPercent'">
            <div
              class="disc-result__big"
              :class="{
                'disc-result__big--red': result.direction === 'discount',
                'disc-result__big--green': result.direction === 'markup',
              }"
            >
              {{ result.changePercent > 0 ? '+' : '' }}{{ n(result.changePercent, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}<span class="disc-result__currency">%</span>
            </div>
            <p class="disc-result__direction">{{ t(`discount.result.direction.${result.direction}`) }}</p>
            <p class="disc-result__formula">{{ t('discount.formula.findPercent') }}</p>
          </template>

          <!-- findOriginal -->
          <template v-else-if="result.mode === 'findOriginal'">
            <div class="disc-result__big">
              {{ n(result.originalPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span class="disc-result__currency">₽</span>
            </div>
            <div class="disc-result__rows">
              <div class="disc-result__row">
                <span class="disc-result__row-label">{{ t('discount.result.discountAmount') }}</span>
                <span class="disc-result__row-value disc-result__row-value--red">
                  {{ n(result.discountAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ₽
                </span>
              </div>
            </div>
            <p class="disc-result__formula">{{ t('discount.formula.findOriginal') }}</p>
          </template>
        </template>

        <p v-else class="disc-result__empty">{{ t('discount.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDiscountCalculator, QUICK_PERCENTS } from '../composables/useDiscountCalculator'
import type { DiscountMode } from '../types/discount'

const { t, n } = useI18n()
const {
  mode, originalPrice, percent, customPercent, oldPrice, newPrice, finalPrice,
  touch, getIssue, result,
} = useDiscountCalculator()

const MODES: DiscountMode[] = ['discount', 'markup', 'findPercent', 'findOriginal']
</script>

<style scoped>
.disc-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.disc-heading {
  max-width: 760px;
}

.disc-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.disc-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3.25rem;
  line-height: 1.05;
  font-weight: 850;
}

.disc-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.disc-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 400px);
  gap: 20px;
  align-items: start;
}

.disc-form,
.disc-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.disc-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 24px;
}

/* Mode switcher */
.disc-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.disc-mode {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 7px 13px;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  background: #f9fafb;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
  user-select: none;
}

.disc-mode:hover {
  border-color: #0d9488;
  color: #0f766e;
}

.disc-mode--active {
  border-color: #0d9488;
  background: #f0fdfa;
  color: #0f766e;
}

.disc-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Fields */
.disc-field {
  display: grid;
  gap: 8px;
}

.disc-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.disc-input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  transition: border-color 0.15s;
  max-width: 280px;
}

.disc-input-wrap--narrow {
  max-width: 160px;
}

.disc-input-wrap:focus-within {
  border-color: #0d9488;
  background: #fff;
}

.disc-input-wrap--error {
  border-color: #ef4444;
}

.disc-input {
  padding: 10px 12px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111827;
  width: 100%;
  min-width: 0;
}

.disc-suffix {
  padding: 0 12px 0 4px;
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}

.disc-error {
  margin-top: 2px;
  font-size: 12px;
  color: #ef4444;
}

/* Presets */
.disc-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.disc-preset {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 7px;
  border: 1.5px solid #d1d5db;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  background: #f9fafb;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
  user-select: none;
}

.disc-preset:hover { border-color: #0d9488; color: #0f766e; }
.disc-preset--active { border-color: #0d9488; background: #f0fdfa; color: #0f766e; }

.disc-custom-wrap {
  margin-top: 4px;
}

/* Result */
.disc-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
}

.disc-result__label {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.disc-result__big {
  color: #0d9488;
  font-size: 2.5rem;
  font-weight: 850;
  line-height: 1.1;
}

.disc-result__big--red { color: #dc2626; }
.disc-result__big--green { color: #16a34a; }

.disc-result__currency {
  margin-left: 4px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #94a3b8;
}

.disc-result__rows {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.disc-result__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.disc-result__row-label {
  font-size: 13px;
  color: #6b7280;
}

.disc-result__row-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.disc-result__row-value--red { color: #dc2626; }
.disc-result__row-value--green { color: #16a34a; }

.disc-result__direction {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #526174;
}

.disc-result__formula {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.disc-result__empty {
  color: #94a3b8;
  font-size: 14px;
}

@media (max-width: 900px) {
  .disc-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .disc-heading h1 { font-size: 2.15rem; }
  .disc-form, .disc-result { padding: 18px; }
  .disc-result__big { font-size: 2rem; }
}
</style>
