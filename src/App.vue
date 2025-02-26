<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Состояние текущего времени
const currentTime = ref(new Date());

// Выбранный часовой пояс (по умолчанию 0 - Москва)
const selectedOffset = ref(0);

// Интервал обновления времени
let timeInterval;

// Форматирование времени с ведущими нулями
const formatTime = (date) => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// Форматирование только часов и минут
const formatTimeHM = (date) => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Получаем время с учетом выбранного смещения
const getTimeWithOffset = (offset) => {
  // Получаем местный часовой пояс в минутах
  const localOffset = currentTime.value.getTimezoneOffset();
  // Вычисляем базовое UTC время в миллисекундах
  const utcTime = currentTime.value.getTime() + localOffset * 60 * 1000;
  // Добавляем выбранное смещение в часах
  return new Date(utcTime + offset * 60 * 60 * 1000);
};

// Вычисляемое время с учетом выбранного смещения
const adjustedTime = computed(() => getTimeWithOffset(selectedOffset.value));

// Форматированное время с учетом выбранного смещения
const formattedTime = computed(() => formatTime(adjustedTime.value));

// Дата сегодня
const todayDate = computed(() => {
  return adjustedTime.value.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Полный список городов с полным набором часовых поясов
const allCities = [
  { name: "Бейкер", offset: -12, icon: "🏝️", region: "Тихий океан" },
  { name: "Гонолулу", offset: -11, icon: "🌺", region: "США" },
  { name: "Анкоридж", offset: -10, icon: "🌨️", region: "США" },
  { name: "Лос-Анджелес", offset: -9, icon: "🌴", region: "США" },
  { name: "Денвер", offset: -8, icon: "🏔️", region: "США" },
  { name: "Мехико", offset: -7, icon: "🌮", region: "Мексика" },
  { name: "Чикаго", offset: -6, icon: "🌆", region: "США" },
  { name: "Нью-Йорк", offset: -5, icon: "🗽", region: "США" },
  { name: "Сантьяго", offset: -4, icon: "🇨🇱", region: "Чили" },
  { name: "Сан-Паулу", offset: -3, icon: "🇧🇷", region: "Бразилия" },
  { name: "Фернандо-де-Норонья", offset: -2, icon: "🏝️", region: "Бразилия" },
  { name: "Азорские острова", offset: -1, icon: "🇵🇹", region: "Португалия" },
  { name: "Лондон", offset: 0, icon: "🇬🇧", region: "Великобритания" },
  { name: "Берлин", offset: 1, icon: "🇩🇪", region: "Германия" },
  { name: "Москва", offset: 2, icon: "🇷🇺", region: "Россия", isMain: true },
  { name: "Дубай", offset: 3, icon: "🇦🇪", region: "ОАЭ" },
  { name: "Тегеран", offset: 3.5, icon: "🇮🇷", region: "Иран" },
  { name: "Баку", offset: 4, icon: "🇦🇿", region: "Азербайджан" },
  { name: "Кабул", offset: 4.5, icon: "🇦🇫", region: "Афганистан" },
  { name: "Карачи", offset: 5, icon: "🇵🇰", region: "Пакистан" },
  { name: "Мумбаи", offset: 5.5, icon: "🇮🇳", region: "Индия" },
  { name: "Катманду", offset: 5.75, icon: "🇳🇵", region: "Непал" },
  { name: "Дакка", offset: 6, icon: "🇧🇩", region: "Бангладеш" },
  { name: "Янгон", offset: 6.5, icon: "🇲🇲", region: "Мьянма" },
  { name: "Бангкок", offset: 7, icon: "🇹🇭", region: "Таиланд" },
  { name: "Пекин", offset: 8, icon: "🇨🇳", region: "Китай" },
  { name: "Токио", offset: 9, icon: "🇯🇵", region: "Япония" },
  { name: "Аделаида", offset: 9.5, icon: "🇦🇺", region: "Австралия" },
  { name: "Сидней", offset: 10, icon: "🌉", region: "Австралия" },
  { name: "Нумеа", offset: 11, icon: "🇳🇨", region: "Новая Каледония" },
  { name: "Окленд", offset: 12, icon: "🇳🇿", region: "Новая Зеландия" }
];

// Получаем время для каждого города
const cities = computed(() => {
  return allCities.map(city => {
    // Вычисляем время с учетом смещения
    const cityTime = getTimeWithOffset(city.offset);
    return {
      ...city,
      time: formatTimeHM(cityTime),
      active: city.offset === selectedOffset.value
    };
  });
});

// Функция для изменения выбранного часового пояса
const setSelectedOffset = (offset) => {
  selectedOffset.value = offset;
};

// Вычисляем секунды для анимации
const seconds = computed(() => adjustedTime.value.getSeconds());
const secondsDegrees = computed(() => seconds.value * 6);

// Вычисляем минуты для анимации
const minutes = computed(() => adjustedTime.value.getMinutes());
const minutesDegrees = computed(() => minutes.value * 6 + seconds.value * 0.1);

// Вычисляем часы для анимации
const hours = computed(() => adjustedTime.value.getHours() % 12);
const hoursDegrees = computed(() => hours.value * 30 + minutes.value * 0.5);

// Фильтруем города по части имени или региона
const searchQuery = ref('');
const filteredCities = computed(() => {
  if (!searchQuery.value) return cities.value;

  const query = searchQuery.value.toLowerCase();
  return cities.value.filter(city =>
      city.name.toLowerCase().includes(query) ||
      city.region.toLowerCase().includes(query)
  );
});

// Запуск интервала при монтировании компонента
onMounted(() => {
  // Обновление времени каждую секунду
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// Очистка интервала перед удалением компонента
onBeforeUnmount(() => {
  clearInterval(timeInterval);
});
</script>

<template>
  <div class="clock-app">
    <header>
      <h1>Мировые часы</h1>
      <p class="today-date">{{ todayDate }}</p>
    </header>

    <main>
      <!-- Аналоговые часы -->
      <div class="analog-clock">
        <div class="clock-face">
          <div class="center-dot"></div>
          <div class="hour-marks">
            <div v-for="n in 12" :key="n" class="hour-mark"
                 :style="{ transform: `rotate(${n * 30}deg) translateY(-40px)` }">{{ n }}</div>
          </div>
          <div class="hand hour-hand" :style="{ transform: `rotate(${hoursDegrees}deg)` }"></div>
          <div class="hand minute-hand" :style="{ transform: `rotate(${minutesDegrees}deg)` }"></div>
          <div class="hand second-hand" :style="{ transform: `rotate(${secondsDegrees}deg)` }"></div>
        </div>
        <div class="digital-time">{{ formattedTime }}</div>
        <div class="selected-city">
          {{ cities.find(city => city.active)?.name }}
          <span v-if="selectedOffset > 0">UTC+{{ selectedOffset }}</span>
          <span v-else-if="selectedOffset < 0">UTC{{ selectedOffset }}</span>
          <span v-else>UTC</span>
        </div>
      </div>

      <!-- Поиск городов -->
      <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск городов..."
            class="search-input"
        />
      </div>

      <!-- Мировые часы -->
      <div class="world-clocks">
        <div
            v-for="city in filteredCities"
            :key="city.name"
            class="city-card"
            :class="{ 'active-city': city.active }"
            @click="setSelectedOffset(city.offset)"
        >
          <div class="city-icon">{{ city.icon }}</div>
          <div class="city-time">{{ city.time }}</div>
          <div class="city-name">{{ city.name }}</div>
          <div class="city-region">{{ city.region }}</div>
          <div class="city-offset">
            <span v-if="city.offset > 0">UTC+{{ city.offset }}</span>
            <span v-else-if="city.offset < 0">UTC{{ city.offset }}</span>
            <span v-else>UTC</span>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <p>© 2025 Мировые часы</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #3498db;
  --primary-light: #5dade2;
  --primary-dark: #2980b9;
  --secondary: #e74c3c;
  --dark: #2c3e50;
  --light: #ecf0f1;
  --gray: #95a5a6;
  --shadow: rgba(0, 0, 0, 0.1);
  --active: #27ae60;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', 'Arial', sans-serif;
  background-color: var(--light);
  color: var(--dark);
  line-height: 1.6;
}

.clock-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
}

header h1 {
  color: var(--primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.today-date {
  color: var(--gray);
  font-style: italic;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* Аналоговые часы */
.analog-clock {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.clock-face {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 4px 20px var(--shadow);
  display: flex;
  justify-content: center;
  align-items: center;
}

.hour-marks {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hour-mark {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-origin: center;
  font-weight: bold;
  font-size: 1rem;
  color: var(--dark);
}

.center-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--secondary);
  border-radius: 50%;
  z-index: 10;
}

.hand {
  position: absolute;
  transform-origin: bottom center;
  bottom: 50%;
  border-radius: 10px;
  z-index: 5;
  transition: transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44);
}

.hour-hand {
  width: 6px;
  height: 30%;
  background-color: var(--dark);
}

.minute-hand {
  width: 4px;
  height: 40%;
  background-color: var(--primary);
}

.second-hand {
  width: 2px;
  height: 45%;
  background-color: var(--secondary);
}

.digital-time {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 1rem;
  color: var(--primary);
}

.selected-city {
  margin-top: 0.5rem;
  color: var(--active);
  font-weight: bold;
}

/* Поиск */
.search-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 50px;
  border: 1px solid var(--gray);
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 2px 12px rgba(52, 152, 219, 0.2);
}

/* Мировые часы */
.world-clocks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.city-card {
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
  min-width: 150px;
  box-shadow: 0 4px 10px var(--shadow);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.city-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--shadow);
  background-color: rgba(52, 152, 219, 0.05);
}

.active-city {
  border: 2px solid var(--active);
  background-color: rgba(39, 174, 96, 0.05);
  transform: scale(1.05);
}

.active-city:hover {
  transform: scale(1.05) translateY(-5px);
}

.city-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.city-time {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.city-name {
  color: var(--dark);
  font-weight: bold;
}

.city-region {
  color: var(--gray);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.city-offset {
  color: var(--primary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--gray);
  font-size: 0.9rem;
  padding: 1rem;
}

/* Адаптивность для планшетов */
@media (min-width: 768px) {
  header h1 {
    font-size: 2.5rem;
  }

  .clock-face {
    width: 300px;
    height: 300px;
  }

  .digital-time {
    font-size: 2.5rem;
  }

  main {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .analog-clock {
    margin-right: 2rem;
  }

  .world-clocks {
    max-width: 700px;
  }
}

/* Адаптивность для десктопов */
@media (min-width: 1024px) {
  .clock-app {
    padding: 2rem;
  }

  header h1 {
    font-size: 3rem;
  }

  .clock-face {
    width: 350px;
    height: 350px;
  }

  .digital-time {
    font-size: 3rem;
  }

  .world-clocks {
    max-width: 900px;
  }

  .city-card {
    min-width: 180px;
  }
}
</style>