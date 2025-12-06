<template>
  <div class="desktop-layout">
    <div class="desk-surface" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100/scale}%`, height: `${100/scale}%` }">
      <!-- Slot for desktop items (Timer, Notepad, Radio) -->
      <slot></slot>
    </div>
    
    <!-- Global Controls (e.g., Clear Data) -->
    <div class="desk-controls">
      <button @click="$emit('clearAll')" class="clear-btn" title="Очистить все данные">
        🗑️ Reset Desk
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScale } from '../composables/useScale';

defineEmits(['clearAll']);

const { scale } = useScale();
</script>

<style scoped>
.desktop-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Changed from hidden to auto if we want scrolling, but design calls for fit */
  position: relative;
  /* Dark Wooden Desk Texture */
  background-color: #3e2723;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  box-shadow: inset 0 0 150px rgba(0,0,0,0.7);
}

.desk-surface {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  /* Flex removed to allow absolute positioning of draggable items */
}

.desk-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.desk-controls:hover {
  opacity: 1;
}

.clear-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  transition: transform 0.2s;
}

.clear-btn:hover {
  transform: scale(1.1);
}
</style>
