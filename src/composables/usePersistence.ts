import { ref, watch } from 'vue';

export function usePersistence<T>(key: string, initialValue: T) {
  const data = ref<T>(initialValue) as any;

  // Load from cookie on mount
  const load = () => {
    try {
      const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
      if (match) {
        data.value = JSON.parse(decodeURIComponent(match[2]));
      }
    } catch (e) {
      console.error('Failed to load data from cookie', e);
    }
  };

  // Save to cookie on change
  watch(data, (newValue) => {
    try {
      const json = JSON.stringify(newValue);
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1); // 1 year
      document.cookie = `${key}=${encodeURIComponent(json)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    } catch (e) {
      console.error('Failed to save data to cookie', e);
    }
  }, { deep: true });

  load();

  return data;
}
