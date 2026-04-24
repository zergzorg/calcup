<template>
  <div class="language-switcher">
    <button
      class="lang-btn"
      :class="{ active: locale === 'ru' }"
      @click="switchLang('ru')"
      title="Русский"
    >
      RU
    </button>
    <button
      class="lang-btn"
      :class="{ active: locale === 'en' }"
      @click="switchLang('en')"
      title="English"
    >
      EN
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
  min-width: 36px;
  min-height: 36px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  padding: 0 8px;
  border-radius: 999px;
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

:global([data-layout="mobile"] .language-switcher){
  gap: 4px;
}

:global([data-layout="mobile"] .lang-btn){
  min-width: 44px;
  min-height: 44px;
}

@media (hover: none) {
  .lang-btn:hover {
    transform: none;
  }
}
</style>
