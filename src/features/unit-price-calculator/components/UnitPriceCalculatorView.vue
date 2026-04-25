<template>
  <main class="unit-page" aria-labelledby="unit-title">
    <section class="unit-heading">
      <p class="unit-eyebrow">{{ t('unitPrice.eyebrow') }}</p>
      <h1 id="unit-title">{{ t('unitPrice.title') }}</h1>
      <p>{{ t('unitPrice.intro') }}</p>
    </section>

    <div class="unit-workspace">
      <form class="unit-form" @submit.prevent>
        <div class="unit-form__top">
          <p>{{ t('unitPrice.form.hint') }}</p>
          <div class="unit-form__actions">
            <label class="unit-common-choice">
              <span>{{ t('unitPrice.form.comparePrice') }}</span>
              <select v-model="selectedUnit">
                <option v-for="unit in unitOptions" :key="unit" :value="unit">
                  {{ t(`unitPrice.compareUnit.${unit}`) }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <section
          v-for="(product, index) in products"
          :key="product.id"
          class="unit-product"
          :class="{
            'unit-product--best': result.winner?.id === product.id,
            'unit-product--expensive': Boolean(result.savingsByProductId[product.id]),
          }"
          :aria-labelledby="`unit-product-${product.id}`"
        >
          <div class="unit-product__header">
            <h2 :id="`unit-product-${product.id}`">{{ productTitle(product, index) }}</h2>
            <button
              v-if="products.length > 2"
              type="button"
              class="unit-remove"
              :aria-label="t('unitPrice.form.removeProduct')"
              :title="t('unitPrice.form.removeProduct')"
              @click="removeProduct(index)"
            />
          </div>

          <div class="unit-grid">
            <div class="unit-field unit-field--name">
              <label :for="`unit-name-${product.id}`">{{ t('unitPrice.form.name') }}</label>
              <input
                :id="`unit-name-${product.id}`"
                v-model.trim="product.name"
                type="text"
                :placeholder="t('unitPrice.form.namePlaceholder', { number: index + 1 })"
              />
            </div>

            <div class="unit-field unit-field--price">
              <label :for="`unit-price-${product.id}`">{{ t('unitPrice.form.price') }}</label>
              <div class="unit-input-wrap" :class="{ 'unit-input-wrap--error': getIssue(`product.${index}.price`) }">
                <input
                  :id="`unit-price-${product.id}`"
                  v-model.number="product.price"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                  @blur="touch(`product.${index}.price`)"
                />
                <span>{{ t('unitPrice.units.currency') }}</span>
              </div>
              <p v-if="getIssue(`product.${index}.price`)" class="unit-error">
                {{ t(getIssue(`product.${index}.price`)!.messageKey) }}
              </p>
            </div>

            <div class="unit-field unit-field--amount">
              <label :for="`unit-amount-${product.id}`">{{ amountLabel(product.unit) }}</label>
              <div class="unit-input-wrap" :class="{ 'unit-input-wrap--error': getIssue(`product.${index}.amount`) }">
                <input
                  :id="`unit-amount-${product.id}`"
                  v-model.number="product.amount"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                  @blur="touch(`product.${index}.amount`)"
                />
                <span>{{ amountUnitShort(product.unit) }}</span>
              </div>
              <p v-if="getIssue(`product.${index}.amount`)" class="unit-error">
                {{ t(getIssue(`product.${index}.amount`)!.messageKey) }}
              </p>
            </div>

            <div class="unit-row-total" aria-live="polite">
              <template v-if="productResult(product.id)">
                <strong>{{ unitPriceText(productResult(product.id)!.unitPrice, productResult(product.id)!.displayBaseUnit) }}</strong>
                <span v-if="result.winner?.id === product.id">{{ t('unitPrice.result.bestBadge') }}</span>
                <span v-else-if="result.savingsByProductId[product.id]">
                  {{ savingsText(result.savingsByProductId[product.id].savingsPercent) }}
                </span>
              </template>
            </div>
          </div>
        </section>

        <div class="unit-form__footer">
          <button type="button" class="unit-add-more" @click="addProduct">
            {{ t('unitPrice.form.addMoreProduct') }}
          </button>
          <button type="button" class="unit-clear" @click="clearProducts">
            {{ t('unitPrice.form.clear') }}
          </button>
        </div>
      </form>

      <section class="unit-result" aria-live="polite">
        <p class="unit-result__label">{{ t('unitPrice.result.label') }}</p>

        <div v-if="result.hasMixedGroups" class="unit-warning">
          {{ t('unitPrice.result.mixedWarning') }}
        </div>

        <template v-if="result.winner">
          <div class="unit-winner">
            <span>{{ t('unitPrice.result.winner') }}</span>
            <strong>{{ resultTitle(result.winner.id) }}</strong>
            <p>{{ unitPriceText(result.winner.unitPrice, result.winner.displayBaseUnit) }}</p>
          </div>
        </template>

        <p v-else-if="result.results.length === 0" class="unit-result__empty">
          {{ t('unitPrice.result.empty') }}
        </p>

        <p v-else class="unit-result__empty">
          {{ t(result.hasMixedGroups ? 'unitPrice.result.noWinnerMixed' : 'unitPrice.result.noWinnerSingle') }}
        </p>

        <div v-if="result.results.length" class="unit-result__list">
          <article
            v-for="item in result.results"
            :key="item.id"
            class="unit-result-item"
            :class="{ 'unit-result-item--best': result.winner?.id === item.id }"
          >
            <div>
              <h3>{{ resultTitle(item.id) }}</h3>
              <p>{{ packageText(item) }}</p>
            </div>
            <div class="unit-result-item__value">
              <strong>{{ unitPriceText(item.unitPrice, item.displayBaseUnit) }}</strong>
              <span v-if="result.winner?.id === item.id">{{ t('unitPrice.result.bestBadge') }}</span>
              <span v-else-if="result.savingsByProductId[item.id]">
                {{ savingsText(result.savingsByProductId[item.id].savingsPercent) }}
              </span>
            </div>
          </article>
        </div>

        <div class="unit-formula">
          {{ t('unitPrice.formula') }}
        </div>
      </section>
    </div>

    <section class="unit-install" aria-labelledby="unit-install-title">
      <h2 id="unit-install-title">{{ t('unitPrice.install.title') }}</h2>
      <div class="unit-install__grid">
        <div>
          <h3>{{ t('unitPrice.install.iosTitle') }}</h3>
          <ol>
            <li>{{ t('unitPrice.install.iosStep1') }}</li>
            <li>{{ t('unitPrice.install.iosStep2') }}</li>
            <li>{{ t('unitPrice.install.iosStep3') }}</li>
          </ol>
        </div>
        <div>
          <h3>{{ t('unitPrice.install.androidTitle') }}</h3>
          <ol>
            <li>{{ t('unitPrice.install.androidStep1') }}</li>
            <li>{{ t('unitPrice.install.androidStep2') }}</li>
            <li>{{ t('unitPrice.install.androidStep3') }}</li>
          </ol>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUnitPriceCalculator } from '../composables/useUnitPriceCalculator'
import type { ProductInput, ProductResult, SavingsResult, UnitPriceUnit } from '../types/unit-price'

const { t, n, locale } = useI18n()
const {
  products,
  selectedUnit,
  unitOptions,
  result,
  touch,
  getIssue,
  addProduct,
  removeProduct,
  clearProducts,
} = useUnitPriceCalculator()

const resultsByProductId = computed(() => new Map(result.value.results.map(item => [item.id, item])))

function productTitle(product: ProductInput, index: number): string {
  return product.name.trim() || t('unitPrice.productFallback', { number: index + 1 })
}

function amountLabel(unit: UnitPriceUnit): string {
  if (unit === 'liter' || unit === 'milliliter') return t('unitPrice.form.amountVolume')
  if (unit === 'piece') return t('unitPrice.form.amountCount')
  return t('unitPrice.form.amount')
}

function amountUnitShort(unit: UnitPriceUnit): string {
  return t(`unitPrice.unitShort.${unit}`)
}

function resultTitle(id: string): string {
  const index = products.value.findIndex(product => product.id === id)
  if (index === -1) return t('unitPrice.productFallback', { number: 1 })
  return productTitle(products.value[index], index)
}

function productResult(id: string): ProductResult | undefined {
  return resultsByProductId.value.get(id)
}

function money(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value)
}

function amount(value: number): string {
  return n(value, { maximumFractionDigits: 3, minimumFractionDigits: 0 })
}

function unitPriceText(value: number, unit: UnitPriceUnit): string {
  return t('unitPrice.result.unitPriceText', {
    price: money(value),
    unit: t(`unitPrice.baseUnit.${unit}`),
  })
}

function packageText(item: ProductResult): string {
  return t('unitPrice.result.packageText', {
    price: money(item.effectivePrice),
    amount: amount(item.amount),
    unit: t(`unitPrice.unitShort.${item.unit}`),
  })
}

function savingsText(value: SavingsResult['savingsPercent']): string {
  return t('unitPrice.result.savingsPercent', {
    percent: n(value, { maximumFractionDigits: 1, minimumFractionDigits: 0 }),
  })
}
</script>

<style scoped>
.unit-page {
  display: grid;
  gap: 24px;
  color: #172033;
}

.unit-heading {
  max-width: 780px;
}

.unit-eyebrow {
  margin: 0 0 10px;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.unit-heading h1 {
  margin: 0;
  color: #111827;
  font-size: 3rem;
  line-height: 1.05;
  font-weight: 850;
}

.unit-heading p:last-child {
  margin: 14px 0 0;
  color: #526174;
  font-size: 1.05rem;
}

.unit-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 20px;
  align-items: start;
}

.unit-form,
.unit-result {
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
}

.unit-form {
  display: grid;
  gap: 14px;
  padding: 20px;
}

.unit-form__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.unit-form__top p {
  display: none;
}

.unit-form__actions {
  display: inline-flex;
  align-items: end;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.unit-common-choice {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
  color: #111827;
  font-size: 1.08rem;
  font-weight: 850;
  line-height: 1.15;
}

.unit-common-choice span {
  color: inherit;
  font: inherit;
  white-space: nowrap;
}

.unit-common-choice select {
  width: auto;
  min-height: 32px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 0 24px 0 0;
  color: #0d9488;
  font: inherit;
  cursor: pointer;
}

.unit-form__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.unit-add-more,
.unit-clear {
  justify-self: start;
  border: 0;
  background: transparent;
  padding: 2px 0;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 850;
  cursor: pointer;
}

.unit-add-more {
  color: #0d9488;
}

.unit-add-more:hover {
  color: #0f766e;
}

.unit-clear {
  color: #64748b;
}

.unit-clear:hover {
  color: #dc2626;
}

.unit-product {
  display: grid;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 14px;
}

.unit-product--best {
  border-color: #0d9488;
  background: #eef8f6;
}

.unit-product--expensive {
  border-color: #fecaca;
}

.unit-product__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.unit-product h2 {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 850;
}

.unit-remove {
  position: relative;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
}

.unit-remove::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 2px;
  border-radius: 999px;
  background: #64748b;
  content: "";
  transform: translate(-50%, -50%);
}

.unit-remove:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.unit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.unit-field {
  display: grid;
  gap: 6px;
}

.unit-field--full {
  grid-column: 1 / -1;
}

.unit-field label {
  color: #374151;
  font-size: 12px;
  font-weight: 700;
}

.unit-field input,
.unit-field select,
.unit-input-wrap {
  width: 100%;
  min-width: 0;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
  transition: border-color 0.15s, background 0.15s;
}

.unit-field input,
.unit-field select {
  box-sizing: border-box;
  min-height: 42px;
  padding: 9px 10px;
}

.unit-input-wrap {
  display: flex;
  align-items: center;
  min-height: 42px;
  overflow: hidden;
}

.unit-input-wrap input {
  flex: 1;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.unit-input-wrap span {
  flex: 0 0 auto;
  padding: 0 10px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.unit-field input:focus,
.unit-field select:focus,
.unit-common-choice select:focus,
.unit-input-wrap:focus-within {
  outline: none;
  border-color: #0d9488;
  background: #fff;
}

.unit-input-wrap input:focus {
  outline: none;
}

.unit-input--error,
.unit-input-wrap--error {
  border-color: #ef4444;
}

.unit-error {
  margin: 0;
  color: #ef4444;
  font-size: 12px;
}

.unit-result {
  position: sticky;
  top: 88px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.unit-result__label {
  margin: 0;
  color: #0d9488;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.unit-warning {
  border: 1px solid #facc15;
  border-left: 4px solid #eab308;
  border-radius: 6px;
  background: #fefce8;
  padding: 10px 12px;
  color: #713f12;
  font-size: 13px;
  font-weight: 700;
}

.unit-winner {
  display: grid;
  gap: 6px;
}

.unit-winner span,
.unit-result__empty {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.unit-winner strong {
  color: #111827;
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.unit-winner p {
  margin: 0;
  color: #0f766e;
  font-size: 1.3rem;
  font-weight: 850;
}

.unit-result__list {
  display: grid;
  gap: 10px;
}

.unit-result-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  border: 1px solid #e5edf2;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
}

.unit-result-item--best {
  border-color: #0d9488;
  background: #eef8f6;
}

.unit-result-item h3 {
  margin: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 850;
}

.unit-result-item p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
}

.unit-result-item__value {
  display: grid;
  gap: 4px;
  justify-items: end;
  text-align: right;
}

.unit-result-item__value strong {
  color: #111827;
  font-size: 14px;
  white-space: nowrap;
}

.unit-result-item__value span {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
}

.unit-result-item:not(.unit-result-item--best) .unit-result-item__value span {
  color: #dc2626;
}

.unit-row-total {
  display: none;
}

.unit-formula {
  border-radius: 8px;
  background: #eef8f6;
  padding: 12px;
  color: #31544f;
  font-size: 13px;
}

.unit-install {
  display: grid;
  gap: 14px;
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #fbfdff;
  padding: 20px;
}

.unit-install h2 {
  margin: 0;
  color: #111827;
  font-size: 1.2rem;
  font-weight: 850;
}

.unit-install__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.unit-install h3 {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 0.95rem;
  font-weight: 850;
}

.unit-install ol {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 14px;
}

@media (max-width: 1020px) {
  .unit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .unit-workspace {
    grid-template-columns: 1fr;
  }

  .unit-result {
    position: static;
  }
}

@media (max-width: 640px) {
  .unit-page {
    gap: 12px !important;
  }

  .unit-heading {
    display: grid;
    gap: 6px;
  }

  .unit-eyebrow {
    display: none;
  }

  .unit-heading h1 {
    font-size: 1.55rem !important;
    line-height: 1.02 !important;
  }

  .unit-heading p:last-child {
    display: none;
  }

  .unit-workspace {
    gap: 12px !important;
  }

  .unit-page .unit-form {
    gap: 10px !important;
    padding: 12px !important;
  }

  .unit-page .unit-form__top {
    display: flex !important;
    justify-content: flex-end;
  }

  .unit-page .unit-form__top p {
    display: none;
  }

  .unit-page .unit-form__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    align-items: center;
  }

  .unit-page .unit-common-choice {
    min-width: 0;
    gap: 6px;
    width: 100%;
    font-size: 1rem;
  }

  .unit-page .unit-common-choice span {
    flex: 0 0 auto;
  }

  .unit-page .unit-common-choice select {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 32px !important;
    padding: 0 22px 0 0 !important;
    font-size: 1rem !important;
  }

  .unit-page .unit-form__footer {
    gap: 10px;
  }

  .unit-page .unit-add-more,
  .unit-page .unit-clear {
    justify-self: start;
    font-size: 0.94rem;
  }

  .unit-page .unit-product {
    gap: 8px !important;
    padding: 10px !important;
  }

  .unit-page .unit-product__header {
    min-height: 30px;
  }

  .unit-page .unit-product h2 {
    font-size: 0.95rem;
  }

  .unit-page .unit-remove {
    width: 30px !important;
    height: 30px !important;
  }

  .unit-page .unit-grid {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr) !important;
    gap: 7px !important;
    align-items: start !important;
  }

  .unit-page .unit-field {
    gap: 4px !important;
  }

  .unit-page .unit-field--name {
    display: none !important;
  }

  .unit-page .unit-field--price {
    grid-column: 1;
  }

  .unit-page .unit-field--amount {
    grid-column: 2;
  }

  .unit-page .unit-field label {
    font-size: 0.74rem !important;
    line-height: 1.1 !important;
  }

  .unit-page .unit-field input,
  .unit-page .unit-field select,
  .unit-page .unit-input-wrap {
    min-height: 38px !important;
    font-size: 1rem !important;
  }

  .unit-page .unit-field input,
  .unit-page .unit-field select {
    padding: 7px 9px !important;
  }

  .unit-page .unit-input-wrap input {
    min-height: 36px !important;
    padding: 0 8px !important;
  }

  .unit-page .unit-input-wrap span {
    padding: 0 8px !important;
  }

  .unit-page .unit-row-total {
    display: grid;
    grid-column: 1 / -1;
    min-height: 22px;
    justify-items: end;
    align-content: start;
    margin-top: -2px;
    text-align: right;
  }

  .unit-page .unit-row-total strong {
    color: #111827;
    font-size: 1rem;
    font-weight: 850;
    line-height: 1.05;
    white-space: nowrap;
  }

  .unit-page .unit-row-total span {
    color: #0f766e;
    font-size: 0.82rem;
    font-weight: 850;
    line-height: 1.05;
  }

  .unit-page .unit-product--expensive .unit-row-total span {
    color: #dc2626;
  }

  .unit-result {
    display: none !important;
  }

  .unit-install {
    display: none !important;
  }

  .unit-error {
    grid-column: 1 / -1;
    font-size: 0.76rem !important;
  }

  .unit-install__grid,
  .unit-result-item {
    grid-template-columns: 1fr;
  }

  .unit-result-item__value {
    justify-items: start;
    text-align: left;
  }

  .unit-winner strong {
    font-size: 1.7rem;
  }
}

@media (max-width: 340px) {
  .unit-page .unit-common-choice {
    gap: 5px;
    font-size: 0.88rem;
  }

  .unit-page .unit-common-choice select {
    padding-right: 18px !important;
    font-size: 0.88rem !important;
  }
}
</style>
