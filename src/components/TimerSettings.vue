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
  justify-content: center;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
  padding: 0 20px;
}

.setting {
  text-align: center;
  background: #e0e0e0;
  padding: 20px 25px;
  border-radius: 16px;
  /* Soft neumorphic-ish base for the container */
  box-shadow: 
    inset 2px 2px 5px #bebebe, 
    inset -2px -2px 5px #ffffff;
  min-width: 160px;
}

.setting label {
  display: block;
  font-size: 14px;
  margin-bottom: 15px;
  color: #777;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

/* Base button reset */
.adjust-btn {
  -webkit-appearance: none; /* Auto-fix: Removed empty ruleset for .adjust-btn */
  appearance: none;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  
  /* Flexbox Centering */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Sizing and Shape */
  width: 44px;
  height: 44px;
  border-radius: 50%;
  
  /* Skeuomorphic Look */
  background: linear-gradient(to bottom, #f0f0f0 0%, #dcdcdc 100%);
  box-shadow: 
    0 4px 0 #b3b3b3,         /* The "3D" side */
    0 5px 10px rgba(0,0,0,0.2), /* Drop shadow */
    inset 0 1px 0 rgba(255,255,255,1); /* Top highlight */
    
  color: #555;
  font-size: 28px; /* Slightly larger for better icon ratio */
  font-weight: 400; /* Lighter weight often helps alignment of symbols */
  font-family: Arial, sans-serif; /* Arial often has better vertical centering for simple symbols */
  
  /* Text inset effect */
  text-shadow: 0 1px 1px #fff;
  
  transition: all 0.1s ease;
  position: relative;
}

/* Specific optical correction for minus if needed, but flex usually handles it. 
   Sometimes - sits high or low. Let's start with pure flex. */

.adjust-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, #f5f5f5 0%, #e6e6e6 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 5px 0 #b3b3b3, 
    0 6px 12px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,1);
}

.adjust-btn:active:not(:disabled) {
  transform: translateY(4px); /* Push down by shadow height */
  box-shadow: 
    0 0 0 #b3b3b3, /* Shadow disappears */
    inset 0 2px 5px rgba(0,0,0,0.2); /* Inner shadow for pressed look */
  background: #dcdcdc;
}

.adjust-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  background: #ddd;
  transform: translateY(4px); /* Look permanently pressed or flat */
}

.value-display {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  min-width: 60px;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  text-shadow: 0 1px 0 rgba(255,255,255,0.8);
}
</style>
