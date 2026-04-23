import { ref, onMounted, onUnmounted } from 'vue';

const now = ref(new Date());
let intervalId: number | null = null;
let subscribers = 0;

const tick = () => {
  now.value = new Date();
};

export function useNow() {
  onMounted(() => {
    if (subscribers === 0) {
      tick();
      intervalId = window.setInterval(tick, 1000);
    }
    subscribers++;
  });

  onUnmounted(() => {
    subscribers--;
    if (subscribers === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  return { now };
}
