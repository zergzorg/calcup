import { ref, watch } from 'vue';

export interface Widget {
  id: string;
  name: string;
  visible: boolean;
  componentName: string; // The literal component name for dynamic rendering if needed, or just ID mapping
}

const STORAGE_KEY = 'calcup_widgets_state';

const initialWidgets: Widget[] = [
  { id: 'timer', name: 'timer.title', visible: true, componentName: 'TimerWidget' },
  { id: 'tasks', name: 'tasks.title', visible: true, componentName: 'TaskPlanner' },
  { id: 'sound', name: 'sounds.title', visible: true, componentName: 'SoundMachine' },
  { id: 'dateTimer', name: 'dateTimer.title', visible: true, componentName: 'DateTimerWidget' },
];

const widgets = ref<Widget[]>([]);

export function useWidgets() {
  const init = () => {
    if (widgets.value.length > 0) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge stored state with initial structure to handle new widgets in future updates
        widgets.value = initialWidgets.map(w => {
          const saved = parsed.find((p: Widget) => p.id === w.id);
          return saved ? { ...w, visible: saved.visible } : w;
        });
      } catch (e) {
        console.error('Failed to parse widget state', e);
        widgets.value = [...initialWidgets];
      }
    } else {
      widgets.value = [...initialWidgets];
    }
  };

  const toggleWidget = (id: string) => {
    const widget = widgets.value.find(w => w.id === id);
    if (widget) {
      widget.visible = !widget.visible;
    }
  };

  // Watch for changes and save to localStorage
  watch(widgets, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
  }, { deep: true });

  init();

  return {
    widgets,
    toggleWidget,
  };
}
