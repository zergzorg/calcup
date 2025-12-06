<template>
  <div class="settings">
    <div class="setting">
      <label>Work</label>
      <div class="time-input">
        <button class="adjust-btn" @click="$emit('decrementWork')" :disabled="isActive">-</button>
        <span class="value-display">{{ workMinutes }}m</span>
        <button class="adjust-btn" @click="$emit('incrementWork')" :disabled="isActive">+</button>
      </div>
    </div>

    <div class="setting">
      <label>Break</label>
      <div class="time-input">
        <button class="adjust-btn" @click="$emit('decrementRest')" :disabled="isActive">-</button>
        <span class="value-display">{{ restMinutes }}m</span>
        <button class="adjust-btn" @click="$emit('incrementRest')" :disabled="isActive">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  workMinutes: number;
  restMinutes: number;
  isActive: boolean;
}>();

defineEmits<{
  (e: 'incrementWork'): void;
  (e: 'decrementWork'): void;
  (e: 'incrementRest'): void;
  (e: 'decrementRest'): void;
}>();
</script>

<style scoped>
.settings {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 40px;
  padding: 0 20px;
}

.setting {
  text-align: center;
  background: rgba(0,0,0,0.05); /* Light gray background for grouping */
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
}

.setting label {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.adjust-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  font-size: 18px;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.1s;
}

.adjust-btn:hover:not(:disabled) {
  background: #f0f0f0;
  transform: scale(1.1);
}

.adjust-btn:active:not(:disabled) {
  transform: scale(0.95);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.adjust-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.value-display {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  min-width: 45px;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  letter-spacing: -1px;
}
</style>
