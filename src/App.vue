<script setup>
import { ref, onMounted } from "vue";

const time = ref(new Date().toLocaleTimeString());

onMounted(() => {
  setInterval(() => {
    time.value = new Date().toLocaleTimeString();
  }, 1000);
});
</script>

<template>
  <div class="clock-container">
    <h1>{{ time }}</h1>
  </div>
</template>

<style>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 5rem;
  font-family: Arial, sans-serif;
}
</style>
