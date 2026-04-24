import { ref, watch, computed } from 'vue';

export interface DesktopSettings {
  backgroundColor: string;
  pattern: string;
}

const STORAGE_KEY = 'calcup_desktop_settings';

export const COLORS = [
  { id: 'walnut', i18nKey: 'settings.colors.walnut', value: '#35231e' },
  { id: 'copper', i18nKey: 'settings.colors.copper', value: '#9c5a35' },
  { id: 'graphite', i18nKey: 'settings.colors.graphite', value: '#30343b' },
  { id: 'merlot', i18nKey: 'settings.colors.merlot', value: '#6f2e3f' },
  { id: 'blueprint', i18nKey: 'settings.colors.blueprint', value: '#213f59' },
  { id: 'moss', i18nKey: 'settings.colors.moss', value: '#31483d' },
  { id: 'ink', i18nKey: 'settings.colors.ink', value: '#16171d' },
] as const;

export const PATTERNS = [
  {
    id: 'none',
    i18nKey: 'settings.patterns.none',
    value: 'none',
    size: 'auto',
  },
  {
    id: 'wood',
    i18nKey: 'settings.patterns.wood',
    value: `linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.18) 1px, transparent 1px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0 2px, transparent 2px 9px)`,
    size: '118px 100%, 124px 100%, 100% 18px',
  },
  {
    id: 'grid',
    i18nKey: 'settings.patterns.grid',
    value: `linear-gradient(rgba(255, 255, 255, 0.13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.13) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)`,
    size: '128px 128px, 128px 128px, 32px 32px, 32px 32px',
  },
  {
    id: 'lined',
    i18nKey: 'settings.patterns.lined',
    value: `linear-gradient(90deg, rgba(255, 120, 120, 0.2) 1px, transparent 1px),
    repeating-linear-gradient(0deg, transparent 0 31px, rgba(255, 255, 255, 0.12) 32px)`,
    size: '96px 100%, 100% 32px',
  },
  {
    id: 'dots',
    i18nKey: 'settings.patterns.dots',
    value: `radial-gradient(circle, rgba(255, 255, 255, 0.17) 1.2px, transparent 1.3px),
    radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1.2px)`,
    size: '24px 24px, 24px 24px',
  },
  {
    id: 'stripes',
    i18nKey: 'settings.patterns.stripes',
    value: `repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 15px),
    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08) 0 1px, transparent 1px 18px)`,
    size: 'auto',
  },
] as const;

const defaultSettings: DesktopSettings = {
  backgroundColor: '#213f59',
  pattern: 'grid',
};

const loadSettings = (): DesktopSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { ...defaultSettings };
  try {
    return { ...defaultSettings, ...(JSON.parse(stored) as Partial<DesktopSettings>) };
  } catch (e) {
    console.error('Failed to parse desktop settings', e);
    return { ...defaultSettings };
  }
};

const settings = ref<DesktopSettings>(loadSettings());

watch(
  settings,
  (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
  { deep: true }
);

const currentStyle = computed(() => {
  const patternObj = PATTERNS.find((p) => p.id === settings.value.pattern) ?? PATTERNS[0];
  return {
    backgroundColor: settings.value.backgroundColor,
    backgroundImage: patternObj.value,
    backgroundSize: patternObj.size,
  };
});

const updateSetting = <K extends keyof DesktopSettings>(key: K, value: DesktopSettings[K]) => {
  settings.value[key] = value;
};

export function useDesktopSettings() {
  return {
    settings,
    COLORS,
    PATTERNS,
    updateSetting,
    currentStyle,
  };
}
