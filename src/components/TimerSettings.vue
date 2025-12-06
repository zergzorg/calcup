<template>
  <div class="settings">
    <div class="setting">
      <label>Work</label>
      <div class="time-input">
        <button @click="$emit('decrementWork')" :disabled="isActive">-</button>
        <span>{{ workMinutes }}m</span>
        <button @click="$emit('incrementWork')" :disabled="isActive">+</button>
      </div>
    </div>

    <div class="setting">
      <label>Break</label>
      <div class="time-input">
        <button @click="$emit('decrementRest')" :disabled="isActive">-</button>
        <span>{{ restMinutes }}m</span>
        <button @click="$emit('incrementRest')" :disabled="isActive">+</button>
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
}

.setting {
  text-align: center;
}

.setting label {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  color: #7f7;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.time-input button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid #0f0;
  background: #000;
  color: #0f0;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.1s;
  text-shadow:
      0 0 6px #0f0;
}

.time-input button:hover:not(:disabled) {
  background: #222;
}

.time-input button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.time-input span {
  font-size: 18px;
  font-weight: 600;
  min-width: 40px;
}
</style>
