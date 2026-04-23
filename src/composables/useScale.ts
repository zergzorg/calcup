import { ref, onMounted, onUnmounted } from 'vue';

const BASE_WIDTH = 1400;
const MIN_SCALE = 0.5;

const scale = ref(1);
let subscribers = 0;

const computeScale = () => {
  const w = window.innerWidth;
  scale.value = w >= BASE_WIDTH ? 1 : Math.max(w / BASE_WIDTH, MIN_SCALE);
};

export const useScale = () => {
  onMounted(() => {
    if (subscribers === 0) {
      computeScale();
      window.addEventListener('resize', computeScale);
    }
    subscribers++;
  });

  onUnmounted(() => {
    subscribers--;
    if (subscribers === 0) {
      window.removeEventListener('resize', computeScale);
    }
  });

  return { scale };
};
