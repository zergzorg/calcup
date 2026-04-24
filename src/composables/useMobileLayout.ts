import { onMounted, onUnmounted, ref } from 'vue';

const MOBILE_BREAKPOINT = 768;
const isMobileLayout = ref(false);
let subscribers = 0;
let mediaQuery: MediaQueryList | null = null;

const syncMobileLayout = () => {
  if (mediaQuery) {
    isMobileLayout.value = mediaQuery.matches;
    return;
  }

  isMobileLayout.value = window.innerWidth < MOBILE_BREAKPOINT;
};

const handleMediaChange = () => {
  syncMobileLayout();
};

export const useMobileLayout = () => {
  onMounted(() => {
    if (subscribers === 0) {
      mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      syncMobileLayout();
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    subscribers++;
  });

  onUnmounted(() => {
    subscribers--;

    if (subscribers === 0 && mediaQuery) {
      mediaQuery.removeEventListener('change', handleMediaChange);
      mediaQuery = null;
    }
  });

  return { isMobileLayout };
};
