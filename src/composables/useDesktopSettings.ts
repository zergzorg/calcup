import { ref, watch, computed } from 'vue';

export interface DesktopSettings {
  backgroundColor: string;
  pattern: string;
}

const STORAGE_KEY = 'calcup_desktop_settings';

// Rich, Professional Colors (replacing light pastels)
export const COLORS = [
  { id: 'wood', i18nKey: 'settings.colors.wood', value: '#3e2723' },
  { id: 'terracotta', i18nKey: 'settings.colors.terracotta', value: '#A0522D' },
  { id: 'slate', i18nKey: 'settings.colors.slate', value: '#4A5568' },
  { id: 'wine', i18nKey: 'settings.colors.wine', value: '#722F37' },
  
  // Professional/Dark Colors
  { id: 'blueprint', i18nKey: 'settings.colors.blueprint', value: '#2B4257' },
  { id: 'cuttingMat', i18nKey: 'settings.colors.cuttingMat', value: '#2F3E32' },
  { id: 'midnight', i18nKey: 'settings.colors.midnight', value: '#18181b' },
];

// Patterns
// Using CSS gradients to create patterns
export const PATTERNS = [
  { 
    id: 'none', 
    i18nKey: 'settings.patterns.none', 
    value: 'none',
    size: 'auto'
  },
  { 
    id: 'wood', 
    i18nKey: 'settings.patterns.wood', 
    value: `linear-gradient(rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
    size: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
  },
  { 
    id: 'grid', 
    i18nKey: 'settings.patterns.grid', 
    value: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
    size: '20px 20px'
  },
  { 
    id: 'lined', 
    i18nKey: 'settings.patterns.lined', 
    value: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255, 255, 255, 0.1) 20px)`,
    size: 'auto'
  },
  { 
    id: 'dots', 
    i18nKey: 'settings.patterns.dots', 
    value: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
    size: '20px 20px'
  },
  { 
    id: 'stripes', 
    i18nKey: 'settings.patterns.stripes', 
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
