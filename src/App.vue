<script setup>
import { ref, onMounted, computed } from "vue";

// Храним "основное" время
const mainTime = ref(new Date());

// Каждую секунду обновляем
onMounted(() => {
  setInterval(() => {
    mainTime.value = new Date();
  }, 1000);
});

// Вычисляем время -2 часа
const minus2 = computed(() => {
  const date = new Date(mainTime.value.getTime() - 2 * 60 * 60 * 1000);
  return date.toLocaleTimeString();
});

// Время -1 час
const minus1 = computed(() => {
  const date = new Date(mainTime.value.getTime() - 60 * 60 * 1000);
  return date.toLocaleTimeString();
});

// Время +1 час
const plus1 = computed(() => {
  const date = new Date(mainTime.value.getTime() + 60 * 60 * 1000);
  return date.toLocaleTimeString();
});

// Время +2 часа
const plus2 = computed(() => {
  const date = new Date(mainTime.value.getTime() + 2 * 60 * 60 * 1000);
  return date.toLocaleTimeString();
});
</script>

<template>
  <div class="clock-container">
    <!-- Блок с 4 колонками (время -2, -1, +1, +2) -->
    <div class="time-row">
      <div class="time-column">
        <h2>{{ minus2 }}</h2>
        <p>Лондон (примерно -2 ч.)</p>
      </div>
      <div class="time-column">
        <h2>{{ minus1 }}</h2>
        <p>Берлин (примерно -1 ч.)</p>
      </div>
      <div class="time-column">
        <h2>{{ plus1 }}</h2>
        <p>Дубай (примерно +1 ч.)</p>
      </div>
      <div class="time-column">
        <h2>{{ plus2 }}</h2>
        <p>Тбилиси (примерно +2 ч.)</p>
      </div>
    </div>

    <!-- Основное текущее время -->
    <h1>{{ mainTime.value.toLocaleTimeString() }}</h1>
  </div>
</template>

<style>
.clock-container {
  /* Размещаем всё по центру, вертикально и горизонтально */
  display: flex;
  flex-direction: column; /* Столбик: сверху колонки, снизу основное время */
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  margin: 0;
}

/* Строка с 4 колонками */
.time-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;          /* Можно регулировать ширину блока */
  margin-bottom: 2rem; /* Отступ от основного времени */
}

/* Каждая колонка */
.time-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
}

.time-column h2 {
  font-size: 2rem;
  margin: 0;
}

.time-column p {
  font-size: 1rem;
  margin: 0.5rem 0 0;
}

/* Основное время (внизу) */
h1 {
  font-size: 5rem;
  margin: 0;
}
</style>
