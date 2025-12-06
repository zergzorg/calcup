<template>
  <DesktopLayout @clearAll="handleClearAll" @contextmenu.prevent>
    <TimerWidget />
    <TaskPlanner />
    <SoundMachine />
  </DesktopLayout>
</template>

<script setup lang="ts">
import DesktopLayout from './components/DesktopLayout.vue';
import TimerWidget from './components/TimerWidget.vue';
import TaskPlanner from './components/TaskPlanner.vue';
import SoundMachine from './components/SoundMachine.vue';

const handleClearAll = () => {
  if (confirm('Вы уверены, что хотите сбросить все данные и настройки?')) {
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
