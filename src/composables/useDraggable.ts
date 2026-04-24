import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useScale } from './useScale';
import { useMobileLayout } from './useMobileLayout';

interface Position {
  x: number;
  y: number;
}

interface WidgetPositionEventDetail {
  storageKey: string;
  position: Position;
}

let topLayer = 200;
let initialLayer = 100;

export function useDraggable(storageKey: string, initialX: number, initialY: number) {
  const position = ref<Position>({ x: initialX, y: initialY });
  const isDragging = ref(false);
  const zIndex = ref(initialLayer--);
  const { scale } = useScale();
  const { isMobileLayout } = useMobileLayout();
  
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;

  const loadPosition = () => {
    if (isMobileLayout.value) return;

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
    if (isMobileLayout.value) return;

    try {
      localStorage.setItem(`draggable_${storageKey}`, JSON.stringify(position.value));
    } catch (e) {
      console.error('Failed to save position', e);
    }
  };

  const activateWidget = () => {
    if (isMobileLayout.value) return;

    zIndex.value = ++topLayer;
  };

  const onSetPosition = (event: Event) => {
    if (isMobileLayout.value) return;

    const detail = (event as CustomEvent<WidgetPositionEventDetail>).detail;
    if (!detail || detail.storageKey !== storageKey) return;

    position.value = detail.position;
    savePosition();
  };

  const onMouseDown = (e: MouseEvent) => {
    if (isMobileLayout.value) return;

    activateWidget();

    // Only drag with left mouse button
    if (e.button !== 0) return;
    
    // Don't drag if clicking interactive elements (inputs, buttons, etc)
    const target = e.target as HTMLElement;
    if (target.closest('input, button, textarea, select, label')) return;

    e.preventDefault(); // Prevent text selection
    isDragging.value = true;
    
    startX = position.value.x;
    startY = position.value.y;
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
  };

  const removeMouseListeners = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
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
    removeMouseListeners();
  };

  const removeTouchListeners = () => {
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (isMobileLayout.value) return;

    activateWidget();

    // Check if touching interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('input, button, textarea, select, label')) return;
    
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
    removeTouchListeners();
  };

  onMounted(() => {
    loadPosition();
    window.addEventListener('calcup:set-widget-position', onSetPosition);
  });

  watch(isMobileLayout, (isMobile) => {
    if (isMobile) {
      isDragging.value = false;
      removeMouseListeners();
      removeTouchListeners();
      return;
    }

    loadPosition();
  });

  onUnmounted(() => {
    window.removeEventListener('calcup:set-widget-position', onSetPosition);
    removeMouseListeners();
    removeTouchListeners();
  });

  return {
    position,
    isDragging,
    zIndex,
    activateWidget,
    onMouseDown,
    onTouchStart
  };
}
