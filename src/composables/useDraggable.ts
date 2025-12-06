import { ref, onMounted } from 'vue';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(storageKey: string, initialX: number, initialY: number) {
  const position = ref<Position>({ x: initialX, y: initialY });
  const isDragging = ref(false);
  
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
    
    const dx = e.clientX - initialMouseX;
    const dy = e.clientY - initialMouseY;
    
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

  onMounted(() => {
    loadPosition();
  });

  return {
    position,
    isDragging,
    onMouseDown
  };
}
