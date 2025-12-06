<template>
  <div class="language-switcher">
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'ru' }" 
      @click="switchLang('ru')"
      title="Русский"
    >
      🇷🇺
    </button>
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'en' }" 
      @click="switchLang('en')"
      title="English"
    >
      🇺🇸
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const switchLang = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('user-locale', lang);
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
  opacity: 0.6;
}

.lang-btn:hover {
  transform: scale(1.1);
  opacity: 1;
}

.lang-btn.active {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
