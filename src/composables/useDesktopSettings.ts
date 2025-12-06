import { ref, watch, computed } from 'vue';

export interface DesktopSettings {
  backgroundColor: string;
  pattern: string;
}

const STORAGE_KEY = 'calcup_desktop_settings';

// Pastel & Professional Colors
export const COLORS = [
  { id: '#3e2723', name: 'Original Wood', value: '#3e2723' },
  { id: '#F7F2E8', name: 'Paper White', value: '#F7F2E8' },
  { id: '#D8E2DC', name: 'Sage Green', value: '#D8E2DC' },
  { id: '#EAE4E9', name: 'Dusty Pink', value: '#EAE4E9' },
  
  // New Professional/Dark Colors
  { id: '#2B4257', name: 'Blueprint Blue', value: '#2B4257' },
  { id: '#2F3E32', name: 'Cutting Mat Green', value: '#2F3E32' },
  { id: '#18181b', name: 'Midnight', value: '#18181b' },
];

// Patterns
// Using CSS gradients to create patterns
export const PATTERNS = [
  { 
    id: 'none', 
    name: 'Solid', 
    value: 'none',
    size: 'auto'
  },
  { 
    id: 'wood', 
    name: 'Classic Wood', 
    value: `linear-gradient(rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
    size: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
  },
  { 
    id: 'grid', 
    name: 'Subtle Grid', 
    value: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
    size: '20px 20px'
  },
  { 
    id: 'lined', 
    name: 'Notebook Lines', 
    value: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255, 255, 255, 0.1) 20px)`,
    size: 'auto'
  },
  { 
    id: 'dots', 
    name: 'Polka Dots', 
    value: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
    size: '20px 20px'
  },
  { 
    id: 'stripes', 
    name: 'Stripes', 
    value: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 10px, transparent 10px, transparent 20px)`,
    size: 'auto'
  }
];

const defaultSettings: DesktopSettings = {
  backgroundColor: '#3e2723',
  pattern: 'wood'
};

const settings = ref<DesktopSettings>({ ...defaultSettings });

export function useDesktopSettings() {
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        settings.value = { ...defaultSettings, ...parsed };
      } catch (e) {
        console.error('Failed to parse desktop settings', e);
        settings.value = { ...defaultSettings };
      }
    }
  };

  const updateSetting = <K extends keyof DesktopSettings>(key: K, value: DesktopSettings[K]) => {
    settings.value[key] = value;
  };

  const currentStyle = computed(() => {
    const patternObj = PATTERNS.find(p => p.id === settings.value.pattern) || PATTERNS[0];
    return {
      backgroundColor: settings.value.backgroundColor,
      backgroundImage: patternObj.value,
      backgroundSize: patternObj.size
    };
  });

  watch(settings, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
  }, { deep: true });

  init();

  return {
    settings,
    COLORS,
    PATTERNS,
    updateSetting,
    currentStyle
  };
}
