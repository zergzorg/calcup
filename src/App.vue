<template>
  <DesktopLayout @clearAll="handleClearAll" @contextmenu.prevent>
    <TimerWidget v-if="isWidgetVisible('timer')" />
    <DateTimerWidget v-if="isWidgetVisible('dateTimer')" />
    <TaskPlanner v-if="isWidgetVisible('tasks')" />
    <SoundMachine v-if="isWidgetVisible('sound')" />
  </DesktopLayout>
</template>

<script setup lang="ts">
import DesktopLayout from './components/DesktopLayout.vue';
import TimerWidget from './components/TimerWidget.vue';
import DateTimerWidget from './components/DateTimerWidget.vue';
import TaskPlanner from './components/TaskPlanner.vue';
import SoundMachine from './components/SoundMachine.vue';
import { useSeo } from './composables/useSeo';
import { useI18n } from 'vue-i18n';
import { useWidgets } from './composables/useWidgets';

useSeo();
const { t } = useI18n();
const { widgets } = useWidgets();

const isWidgetVisible = (id: string) => {
  return widgets.value.find(w => w.id === id)?.visible ?? true;
};

const handleClearAll = () => {
  if (confirm(t('confirm_reset'))) {
    // Logic to clear cookies will be added later
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    location.reload();
  }
};
</script>

<style>
/* Global Reset */
body {
  margin: 0;
  padding: 0;
  background: #1e1e1e; /* Fallback */
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
}
</style>
