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
        <p>Лондон</p>
      </div>
      <div class="time-column">
        <h2>{{ minus1 }}</h2>
        <p>Берлин</p>
      </div>
      <div class="time-column">
        <h2>{{ plus1 }}</h2>
        <p>Дубай</p>
      </div>
      <div class="time-column">
        <h2>{{ plus2 }}</h2>
        <p>Тбилиси</p>
      </div>
    </div>

    <!-- Основное текущее время -->
    <h1>{{ mainTime.toLocaleTimeString() }}</h1>
  </div>
</template>

<style>
.clock-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 1rem;
}

/* Базовые стили (Mobile First – для телефонов) */
.time-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
}
.time-column {
  margin: 0.5rem 0;
  text-align: center;
}
.time-column h2 {
  font-size: 1.5rem;
  margin: 0;
}
.time-column p {
  font-size: 0.9rem;
  margin: 0.3rem 0 0;
}
h1 {
  font-size: 3rem;
  margin: 0;
}

/* Для планшетов */
@media (min-width: 768px) {
  .time-row {
    flex-direction: row;
    justify-content: space-around;
    width: 80%;
    margin-bottom: 2rem;
  }
  .time-column h2 {
    font-size: 2rem;
  }
  .time-column p {
    font-size: 1rem;
  }
  h1 {
    font-size: 4rem;
  }
}

/* Для десктопов */
@media (min-width: 1024px) {
  h1 {
    font-size: 5rem;
  }
}

</style>
