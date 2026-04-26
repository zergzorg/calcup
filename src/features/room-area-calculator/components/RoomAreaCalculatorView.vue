<template>
  <main class="room-area-page" aria-labelledby="room-area-title">
    <section class="room-area-heading">
      <p class="room-area-eyebrow">{{ t('roomArea.eyebrow') }}</p>
      <h1 id="room-area-title">{{ t('roomArea.title') }}</h1>
      <p>{{ t('roomArea.intro') }}</p>
    </section>

    <div class="room-area-workspace">
      <form class="room-area-form" @submit.prevent>
        <section class="room-area-section">
          <div class="room-area-section__header">
            <h2>{{ t('roomArea.form.roomTitle') }}</h2>
            <p>{{ t('roomArea.form.roomHint') }}</p>
          </div>

          <div class="room-area-grid room-area-grid--three">
            <div class="room-area-field">
              <label for="room-area-length">{{ t('roomArea.form.length') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-length"
                  v-model.number="form.lengthM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('lengthM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
              <p v-if="getFieldIssue('lengthM')" class="room-area-error">
                {{ t(getFieldIssue('lengthM')?.messageKey ?? '') }}
              </p>
            </div>

            <div class="room-area-field">
              <label for="room-area-width">{{ t('roomArea.form.width') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-width"
                  v-model.number="form.widthM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('widthM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
              <p v-if="getFieldIssue('widthM')" class="room-area-error">
                {{ t(getFieldIssue('widthM')?.messageKey ?? '') }}
              </p>
            </div>

            <div class="room-area-field">
              <label for="room-area-height">{{ t('roomArea.form.height') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-height"
                  v-model.number="form.heightM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('heightM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
              <p v-if="getFieldIssue('heightM')" class="room-area-error">
                {{ t(getFieldIssue('heightM')?.messageKey ?? '') }}
              </p>
            </div>
          </div>

          <div class="room-area-field">
            <span class="room-area-field__label">{{ t('roomArea.form.heightPresets') }}</span>
            <div class="room-area-chip-list">
              <button
                v-for="height in heightPresets"
                :key="height"
                type="button"
                class="room-area-chip"
                :class="{ 'room-area-chip--active': form.heightM === height }"
                @click="setHeight(height)"
              >
                {{ t('roomArea.units.metersValue', { value: formatNumber(height) }) }}
              </button>
            </div>
          </div>
        </section>

        <section class="room-area-section">
          <div class="room-area-section__header">
            <h2>{{ t('roomArea.form.openingsTitle') }}</h2>
            <p>{{ t('roomArea.form.openingsHint') }}</p>
          </div>

          <div class="room-area-grid room-area-grid--three">
            <div class="room-area-field">
              <label for="room-area-windows-count">{{ t('roomArea.form.windowsCount') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-windows-count"
                  v-model.number="form.windowsCount"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getFieldIssue('windowsCount'))"
                >
              </div>
              <p v-if="getFieldIssue('windowsCount')" class="room-area-error">
                {{ t(getFieldIssue('windowsCount')?.messageKey ?? '') }}
              </p>
            </div>

            <div class="room-area-field">
              <label for="room-area-window-width">{{ t('roomArea.form.windowWidth') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-window-width"
                  v-model.number="form.windowWidthM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('windowWidthM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
            </div>

            <div class="room-area-field">
              <label for="room-area-window-height">{{ t('roomArea.form.windowHeight') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-window-height"
                  v-model.number="form.windowHeightM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('windowHeightM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
            </div>
          </div>

          <div class="room-area-grid room-area-grid--three">
            <div class="room-area-field">
              <label for="room-area-doors-count">{{ t('roomArea.form.doorsCount') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-doors-count"
                  v-model.number="form.doorsCount"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  :aria-invalid="Boolean(getFieldIssue('doorsCount'))"
                >
              </div>
            </div>

            <div class="room-area-field">
              <label for="room-area-door-width">{{ t('roomArea.form.doorWidth') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-door-width"
                  v-model.number="form.doorWidthM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('doorWidthM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
            </div>

            <div class="room-area-field">
              <label for="room-area-door-height">{{ t('roomArea.form.doorHeight') }}</label>
              <div class="room-area-input-wrap">
                <input
                  id="room-area-door-height"
                  v-model.number="form.doorHeightM"
                  type="number"
                  min="0"
                  step="0.01"
                  inputmode="decimal"
                  :aria-invalid="Boolean(getFieldIssue('doorHeightM'))"
                >
                <span>{{ t('roomArea.units.m') }}</span>
              </div>
            </div>
          </div>

          <div class="room-area-field">
            <label for="room-area-extra-openings">{{ t('roomArea.form.extraOpeningsArea') }}</label>
            <div class="room-area-input-wrap">
              <input
                id="room-area-extra-openings"
                v-model.number="form.extraOpeningsAreaM2"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                :aria-invalid="Boolean(getFieldIssue('extraOpeningsAreaM2'))"
              >
              <span>{{ t('roomArea.units.m2') }}</span>
            </div>
          </div>
        </section>
      </form>

      <section class="room-area-result" aria-live="polite">
        <p class="room-area-result__label">{{ t('roomArea.result.label') }}</p>

        <template v-if="result">
          <div class="room-area-result__total">
            <span>{{ t('roomArea.result.finishWallArea') }}</span>
            <strong>{{ formatNumber(result.finishWallAreaM2) }} {{ t('roomArea.units.m2') }}</strong>
          </div>

          <div class="room-area-result__rows">
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.floorArea') }}</span>
              <strong>{{ formatNumber(result.floorAreaM2) }} {{ t('roomArea.units.m2') }}</strong>
            </div>
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.ceilingArea') }}</span>
              <strong>{{ formatNumber(result.ceilingAreaM2) }} {{ t('roomArea.units.m2') }}</strong>
            </div>
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.perimeter') }}</span>
              <strong>{{ formatNumber(result.perimeterM) }} {{ t('roomArea.units.m') }}</strong>
            </div>
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.grossWallArea') }}</span>
              <strong>{{ formatNumber(result.grossWallAreaM2) }} {{ t('roomArea.units.m2') }}</strong>
            </div>
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.openingsArea') }}</span>
              <strong>{{ formatNumber(result.openingsAreaM2) }} {{ t('roomArea.units.m2') }}</strong>
            </div>
            <div class="room-area-result__row">
              <span>{{ t('roomArea.result.baseboardLength') }}</span>
              <strong>{{ formatNumber(result.baseboardLengthM) }} {{ t('roomArea.units.m') }}</strong>
            </div>
          </div>

          <p class="room-area-formula">{{ t('roomArea.formula') }}</p>
        </template>

        <p v-else class="room-area-result__empty">{{ t('roomArea.result.empty') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoomAreaCalculator } from '../composables/useRoomAreaCalculator'

const { t, n } = useI18n()
const { form, result, setHeight, getFieldIssue } = useRoomAreaCalculator()

const heightPresets = [2.5, 2.7, 3]

function formatNumber(value: number): string {
  return n(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}
</script>
