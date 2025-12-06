import { ref, onMounted } from 'vue';
import { useScale } from './useScale';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(storageKey: string, initialX: number, initialY: number) {
  const position = ref<Position>({ x: initialX, y: initialY });
  const isDragging = ref(false);
  const { scale } = useScale();
  
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;

  // Load from storage
  const loadPosition = () => {
    try {
      const stored = localStorage.getItem(`draggable_${storageKey}`);
      if (stored) {
        position.value = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load position', e);
    }
  };

  const savePosition = () => {
    try {
      localStorage.setItem(`draggable_${storageKey}`, JSON.stringify(position.value));
    } catch (e) {
      console.error('Failed to save position', e);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;
    
    // Don't drag if clicking interactive elements (inputs, buttons)
    if ((e.target as HTMLElement).tagName.match(/INPUT|BUTTON|TEXTAREA|SELECT|LABEL/)) return;

    e.preventDefault(); // Prevent text selection
    isDragging.value = true;
    
    startX = position.value.x;
    startY = position.value.y;
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Bring to front (z-index) logic could be added here
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    
    // Divide by scale to ensure 1:1 movement relative to the scaled surface
    const dx = (e.clientX - initialMouseX) / scale.value;
    const dy = (e.clientY - initialMouseY) / scale.value;
    
    position.value = {
      x: startX + dx,
      y: startY + dy
    };
  };

  const onMouseUp = () => {
    isDragging.value = false;
    savePosition();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  // Touch Support
  const onTouchStart = (e: TouchEvent) => {
    // Check if touching interactive elements
    if ((e.target as HTMLElement).tagName.match(/INPUT|BUTTON|TEXTAREA|SELECT|LABEL/)) return;
    
    // Prevent default to stop scrolling/zooming while dragging
    if (e.cancelable) e.preventDefault();
    
    isDragging.value = true;
    
    startX = position.value.x;
    startY = position.value.y;
    initialMouseX = e.touches[0].clientX;
    initialMouseY = e.touches[0].clientY;
    
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    if (e.cancelable) e.preventDefault(); // valid for touchmove to prevent scroll

    const dx = (e.touches[0].clientX - initialMouseX) / scale.value;
    const dy = (e.touches[0].clientY - initialMouseY) / scale.value;

    position.value = {
      x: startX + dx,
      y: startY + dy
    };
  };

  const onTouchEnd = () => {
    isDragging.value = false;
    savePosition();
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  };

  onMounted(() => {
    loadPosition();
  });

  return {
    position,
    isDragging,
    onMouseDown,
    onTouchStart
  };
}
