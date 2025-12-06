<template>
  <div class="flip-card">
    <div class="top">{{ currentValue }}</div>
    <div class="bottom">{{ currentValue }}</div>
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  font-family: 'Helvetica Neue', Helvetica, monospace;
  font-weight: bold;
  font-size: 80px;
  color: #e0e0e0;
  width: 60px;
  height: 90px;
  perspective: 200px;
  background-color: #333;
}

.top, .bottom, .top-flip, .bottom-flip {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background-color: #333;
  color: #f5f5f5;
  text-align: center;
  line-height: 90px; /* height of the card */
}

.top, .top-flip {
  top: 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}

.bottom, .bottom-flip {
  bottom: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  line-height: 0; /* Align text for bottom half */
}

/* Base layers */
.top {
  z-index: 1;
}
.bottom {
  z-index: 0;
}

/* Animating layers */
.top-flip {
  z-index: 2;
  transform-origin: bottom;
  backface-visibility: hidden;
}

.bottom-flip {
  z-index: 1;
  transform-origin: top;
  backface-visibility: hidden;
  transform: rotateX(90deg);
}

.top-flip.flipping {
  animation: flip-top 0.6s ease-in;
}

.bottom-flip.flipping {
  animation: flip-bottom 0.6s ease-out 0.3s forwards; /* Delay half the duration */
  /* Actually, for a smooth flip:
     Top flips 0->90 in first half.
     Bottom flips 90->0 in second half.
  */
  animation: flip-bottom-enter 0.3s ease-out 0.3s forwards;
}

/* Wait, standard flip css animation logic */
@keyframes flip-top {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}

@keyframes flip-bottom-enter {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
</style>
