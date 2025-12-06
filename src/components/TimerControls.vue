<template>
  <div class="controls">
    <button class="control-button" @click="$emit('toggle')" :class="{ active: isActive }">
      {{ isActive ? 'Pause' : 'Start' }}
    </button>
    <button class="control-button" @click="$emit('reset')">Reset</button>
    <button class="control-button" @click="$emit('skip')">Skip</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
}>();
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.control-button {
  padding: 14px 30px;
  border: 2px solid #0f0;
  border-radius: 8px;
  background: #000;
  color: #0f0;
  font-weight: 600;
  cursor: pointer;
  text-shadow:
      0 0 6px #0f0;
  transition: all 0.2s;
}
.control-button:hover {
  background: #222;
}
.control-button.active {
  background: #0f0;
  color: #000;
  text-shadow: none;
}
</style>
