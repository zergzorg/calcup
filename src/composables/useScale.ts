import { ref, onMounted, onUnmounted } from 'vue';

const scale = ref(1);
const listeners = new Set<() => void>();

const updateScale = () => {
  const width = window.innerWidth;
  const baseWidth = 1400; // Ideal width to fit everything comfortably
  const minScale = 0.5; // Don't shrink below 50%

  // Check if we need to scale down
  if (width < baseWidth) {
    // Calculate ratio
    let newScale = width / baseWidth;
    
    // Ensure we don't go too small
    newScale = Math.max(newScale, minScale);
    
    scale.value = newScale;
  } else {
    scale.value = 1;
  }
};

export const useScale = () => {
  onMounted(() => {
    if (listeners.size === 0) {
      updateScale();
      window.addEventListener('resize', updateScale);
    }
    listeners.add(updateScale);
  });

  onUnmounted(() => {
    listeners.delete(updateScale);
    if (listeners.size === 0) {
      window.removeEventListener('resize', updateScale);
    }
  });

  return {
    scale
  };
};
