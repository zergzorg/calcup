<template>
  <div class="flip-card">
    <div class="top">{{ currentValue }}</div>
    <div class="bottom">{{ previousValue }}</div>
    
    <div class="top-flip" 
         :class="{ flipping: isFlipping }" 
         @animationend="onAnimationEnd">
      {{ previousValue }}
    </div>
    
    <div class="bottom-flip" 
         :class="{ flipping: isFlipping }">
      {{ currentValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  value: string | number;
}>();

const currentValue = ref(props.value);
const previousValue = ref(props.value);
const isFlipping = ref(false);

watch(() => props.value, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    previousValue.value = oldVal !== undefined ? oldVal : newVal;
    currentValue.value = newVal;
    isFlipping.value = true;
  }
});

const onAnimationEnd = () => {
  isFlipping.value = false;
  previousValue.value = currentValue.value;
};
</script>

<style scoped>
.flip-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  font-family: 'Helvetica Neue', Helvetica, monospace;
  font-weight: bold;
  font-size: 80px;
  color: #e0e0e0;
  width: 70px;
  height: 100px;
  perspective: 400px;
  background-color: #333;
}

.top, .bottom, .top-flip, .bottom-flip {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background-color: #3a3a3a;
  color: #f5f5f5;
  text-align: center;
  box-sizing: border-box;
}

.top, .top-flip {
  top: 0;
  line-height: 100px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.bottom, .bottom-flip {
  bottom: 0;
  line-height: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.top,
.bottom {
  z-index: 1;
}

.top-flip {
  z-index: 2;
  transform-origin: bottom;
  backface-visibility: hidden;
}

.bottom-flip {
  z-index: 2;
  transform-origin: top;
  transform: rotateX(90deg);
  backface-visibility: hidden;
}

/* Animation Classes */
.top-flip.flipping {
  animation: flip-top 0.6s ease-in;
}

.bottom-flip.flipping {
  animation: flip-bottom 0.6s ease-out;
}

@keyframes flip-top {
  0% { transform: rotateX(0deg); }
  50%, 100% { transform: rotateX(-90deg); opacity: 1; }
}

@keyframes flip-bottom {
  0%, 50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}

/* Shadow on Top Flip as it falls down */
.top-flip::after {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: black;
  opacity: 0;
  z-index: 3;
}
.top-flip.flipping::after {
  animation: shadow-top 0.6s ease-in;
}
@keyframes shadow-top {
  0% { opacity: 0; }
  50%, 100% { opacity: 0.8; }
}

/* Shadow on Bottom Flip (starts dark, gets lighter) */
.bottom-flip::after {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: black;
  opacity: 1; /* Starts hidden at 90deg anyway */
  z-index: 3;
}
.bottom-flip.flipping::after {
  animation: shadow-bottom 0.6s ease-out;
}
@keyframes shadow-bottom {
  0%, 50% { opacity: 0.8; }
  100% { opacity: 0; }
}
</style>
