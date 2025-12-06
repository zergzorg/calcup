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
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 0; /* Remove horizontal padding as parent handles it */
}

.setting {
  text-align: center;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 
    0 2px 5px rgba(0,0,0,0.05),
    inset 0 0 0 1px rgba(0,0,0,0.03);
  flex: 1; /* Distribute space equally */
  min-width: 0; /* Allow shrinking */
}

.setting label {
  display: block;
  font-size: 10px;
  margin-bottom: 8px;
  color: #999;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Base button reset */
.adjust-btn {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 28px;
  height: 28px;
  border-radius: 50%;
  
  background: #f0f0f0;
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,1);
    
  color: #555;
  font-size: 16px; 
  font-weight: 600;
  font-family: Arial, sans-serif;
  
  transition: all 0.1s ease;
}

.adjust-btn:hover:not(:disabled) {
  background: #e9e9e9;
  transform: translateY(-1px);
}

.adjust-btn:active:not(:disabled) {
  transform: translateY(1px);
  background: #dcdcdc;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.adjust-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.value-display {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  min-width: 40px;
  font-family: 'Inter', sans-serif;
}
</style>
