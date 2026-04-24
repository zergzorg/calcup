<template>
  <DesktopLayout @clearAll="handleClearAll" @contextmenu.prevent>
    <TimerWidget v-if="isWidgetVisible('timer')" />
    <DateTimerWidget v-if="isWidgetVisible('dateTimer')" />
    <TaskPlanner v-if="isWidgetVisible('tasks')" />
    <SoundMachine v-if="isWidgetVisible('sound')" />
    <SnakeGame v-if="isWidgetVisible('snake')" />
  </DesktopLayout>
</template>

<script setup lang="ts">
import DesktopLayout from './components/DesktopLayout.vue';
import TimerWidget from './components/TimerWidget.vue';
import DateTimerWidget from './components/DateTimerWidget.vue';
import TaskPlanner from './components/TaskPlanner.vue';
import SoundMachine from './components/SoundMachine.vue';
import SnakeGame from './components/SnakeGame.vue';
import { useSeo } from './composables/useSeo';
import { useI18n } from 'vue-i18n';
import { useWidgets } from './composables/useWidgets';

useSeo();
const { t } = useI18n();
const { widgets } = useWidgets();

const isWidgetVisible = (id: string) => {
  return widgets.value.find((w) => w.id === id)?.visible ?? true;
};

const clearAllCookies = () => {
  document.cookie.split(';').forEach((c) => {
    const name = c.replace(/^ +/, '').replace(/=.*/, '');
    document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
  });
};

const handleClearAll = () => {
  if (!confirm(t('confirm_reset'))) return;
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('Failed to clear localStorage', e);
  }
  clearAllCookies();
  location.reload();
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #1e1e1e;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
}
</style>
