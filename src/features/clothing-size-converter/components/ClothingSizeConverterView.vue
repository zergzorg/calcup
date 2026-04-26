<template>
  <main class="clothing-size-page" aria-labelledby="clothing-size-title">
    <section class="clothing-size-heading">
      <p class="clothing-size-eyebrow">{{ t('clothingSize.eyebrow') }}</p>
      <h1 id="clothing-size-title">{{ t('clothingSize.title') }}</h1>
      <p>{{ t('clothingSize.intro') }}</p>
    </section>

    <div class="clothing-size-workspace">
      <form class="clothing-size-form" @submit.prevent>
        <section class="clothing-size-section">
          <div class="clothing-size-section__header">
            <h2>{{ t('clothingSize.form.knownTitle') }}</h2>
            <p>{{ t('clothingSize.form.knownHint') }}</p>
          </div>

          <div class="clothing-size-field">
            <span class="clothing-size-field__label">{{ t('clothingSize.form.system') }}</span>
            <div class="clothing-size-chip-list" role="group" :aria-label="t('clothingSize.form.system')">
              <button
                v-for="item in systems"
                :key="item"
                type="button"
                class="clothing-size-chip"
                :class="{ 'clothing-size-chip--active': system === item }"
                @click="system = item"
              >
                {{ t(`clothingSize.systems.${item}`) }}
              </button>
            </div>
          </div>

          <div class="clothing-size-field">
            <label for="clothing-size-value">{{ t('clothingSize.form.value') }}</label>
            <select id="clothing-size-value" v-model="sizeKey">
              <option v-for="option in options" :key="option.key" :value="option.key">
                {{ option.label }}
              </option>
            </select>
          </div>
        </section>

        <section class="clothing-size-warning-note">
          <p><strong>{{ t('clothingSize.assumptions.title') }}</strong></p>
          <p>{{ t('clothingSize.assumptions.body') }}</p>
          <p>{{ t('clothingSize.assumptions.fit') }}</p>
        </section>
      </form>

      <section class="clothing-size-result" aria-live="polite">
        <p class="clothing-size-result__label">{{ t('clothingSize.result.label') }}</p>

        <template v-if="result">
          <div class="clothing-size-result__total">
            <span>{{ t('clothingSize.result.primary') }}</span>
            <strong>{{ result.international }}</strong>
          </div>

          <div class="clothing-size-result__rows">
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.international') }}</span>
              <strong>{{ result.international }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.ru') }}</span>
              <strong>{{ result.ru }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.eu') }}</span>
              <strong>{{ result.eu }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.us') }}</span>
              <strong>{{ result.us }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.uk') }}</span>
              <strong>{{ result.uk }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.chest') }}</span>
              <strong>{{ t('clothingSize.result.cmRange', { value: result.chest }) }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.waist') }}</span>
              <strong>{{ t('clothingSize.result.cmRange', { value: result.waist }) }}</strong>
            </div>
            <div class="clothing-size-result__row">
              <span>{{ t('clothingSize.result.hips') }}</span>
              <strong>{{ t('clothingSize.result.cmRange', { value: result.hips }) }}</strong>
            </div>
          </div>

          <p class="clothing-size-formula">{{ t('clothingSize.formula') }}</p>
        </template>

        <p v-else class="clothing-size-result__empty">{{ t('clothingSize.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useClothingSizeConverter } from '../composables/useClothingSizeConverter'

const { t } = useI18n()
const { system, sizeKey, systems, options, result } = useClothingSizeConverter()
</script>
