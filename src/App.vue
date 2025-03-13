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

// Города для отображения в ретро-стиле Apple
const allCities = [
  { name: "Cupertino", offset: -9, icon: "🍎", region: "California", color: "#ff6b6b" },
  { name: "New York", offset: -5, icon: "🗽", region: "USA", color: "#4ecdc4" },
  { name: "London", offset: 0, icon: "🇬🇧", region: "UK", color: "#1a535c" },
  { name: "Tokyo", offset: 9, icon: "🇯🇵", region: "Japan", color: "#ff9f1c" },
  { name: "Sydney", offset: 10, icon: "🌉", region: "Australia", color: "#2ec4b6" },
  { name: "Moscow", offset: 2, icon: "🇷🇺", region: "Russia", color: "#f45b69", isMain: true },
  { name: "Berlin", offset: 1, icon: "🇩🇪", region: "Germany", color: "#f6ae2d" },
  { name: "Dubai", offset: 3, icon: "🇦🇪", region: "UAE", color: "#33658a" },
  { name: "Paris", offset: 1, icon: "🇫🇷", region: "France", color: "#86bbd8" },
  { name: "Hong Kong", offset: 8, icon: "🇭🇰", region: "China", color: "#758e4f" },
  { name: "Barcelona", offset: 1, icon: "🇪🇸", region: "Spain", color: "#f26419" },
  { name: "Rome", offset: 1, icon: "🇮🇹", region: "Italy", color: "#9bc53d" }
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
  <div class="retro-apple">
    <!-- Верхняя навигационная панель в стиле старого macOS -->
    <div class="mac-menubar">
      <div class="apple-logo">🍎</div>
      <div class="menu-items">
        <div class="menu-item">File</div>
        <div class="menu-item">Edit</div>
        <div class="menu-item">View</div>
        <div class="menu-item">Window</div>
        <div class="menu-item">Help</div>
      </div>
    </div>

    <header class="retro-header">
      <div class="logo-container">
        <div class="apple-text">iWorld Clock</div>
      </div>
      <h1 class="retro-h1">World Clock</h1>
      <p class="tagline">Time. Different. Think.</p>
      <p class="today-date">{{ todayDate }}</p>
    </header>

    <main class="retro-main">
      <!-- Аналоговые часы в стиле Classic Mac -->
      <div class="retro-clock-container">
        <div class="retro-clock">
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
          <div class="digital-display">
            <div class="digital-time">{{ formattedTime }}</div>
            <div class="selected-city">
              {{ cities.find(city => city.active)?.name }}
              <span v-if="selectedOffset > 0">UTC+{{ selectedOffset }}</span>
              <span v-else-if="selectedOffset < 0">UTC{{ selectedOffset }}</span>
              <span v-else>UTC</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Мировые часы в аквастиле macOS -->
      <div class="world-clocks-container">
        <h2 class="section-title">One World. Many Times.</h2>
        <div class="world-clocks">
          <div
              v-for="city in cities"
              :key="city.name"
              class="aqua-city-card"
              :class="{ 'active-city': city.active }"
              @click="setSelectedOffset(city.offset)"
              :style="{'--city-color': city.color}"
          >
            <div class="city-icon">{{ city.icon }}</div>
            <div class="city-time">{{ city.time }}</div>
            <div class="city-name">{{ city.name }}</div>
            <div class="city-region">{{ city.region }}</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="retro-footer">
      <div class="footer-links">
        <a href="#" class="footer-link">Home</a>
        <a href="#" class="footer-link">Mac</a>
        <a href="#" class="footer-link">iPod</a>
        <a href="#" class="footer-link">iTunes</a>
        <a href="#" class="footer-link">Support</a>
      </div>
      <p class="copyright">Copyright © 2003 Apple Computer, Inc. All rights reserved.</p>
      <p class="small-text">Design inspired by Apple's classic website. Made with ♥</p>
    </footer>

  </div>
</template>

<style>
/* Ретро стиль Apple */
:root {
  --apple-blue: #0066cc;
  --apple-blue-gradient-start: #4d90fe;
  --apple-blue-gradient-end: #0055b8;
  --apple-light-gray: #f1f1f1;
  --apple-medium-gray: #bdbdbd;
  --apple-dark-gray: #444444;
  --apple-plastic: #e0e0e0;
  --apple-shadow: rgba(0, 0, 0, 0.3);
  --aqua-highlight: rgba(255, 255, 255, 0.3);
  --aqua-shadow: rgba(0, 0, 0, 0.2);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Lucida Grande', 'Lucida Sans Unicode', Helvetica, Arial, sans-serif;
  background-color: white;
  color: var(--apple-dark-gray);
  line-height: 1.6;
}

.retro-apple {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Верхняя навигационная панель в стиле macOS */
.mac-menubar {
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #cccccc, #999999);
  height: 24px;
  border-bottom: 1px solid #555;
  width: 100%;
  font-size: 13px;
  color: #000;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.apple-logo {
  padding: 0 15px;
  font-weight: bold;
  font-size: 16px;
}

.menu-items {
  display: flex;
}

.menu-item {
  padding: 0 15px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--apple-blue);
  color: white;
}

/* Header в стиле Apple ретро */
.retro-header {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="white" /><circle cx="20" cy="20" r="10" fill="rgb(230,230,230)" /><circle cx="50" cy="20" r="10" fill="rgb(230,230,230)" /><circle cx="80" cy="20" r="10" fill="rgb(230,230,230)" /><circle cx="20" cy="50" r="10" fill="rgb(230,230,230)" /><circle cx="50" cy="50" r="10" fill="rgb(230,230,230)" /><circle cx="80" cy="50" r="10" fill="rgb(230,230,230)" /><circle cx="20" cy="80" r="10" fill="rgb(230,230,230)" /><circle cx="50" cy="80" r="10" fill="rgb(230,230,230)" /><circle cx="80" cy="80" r="10" fill="rgb(230,230,230)" /></svg>');
  text-align: center;
  padding: 2rem 1rem;
  border-bottom: 1px solid var(--apple-medium-gray);
}

.logo-container {
  margin-bottom: 1rem;
}

.apple-text {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 1.5rem;
  background: linear-gradient(to bottom, var(--apple-blue-gradient-start), var(--apple-blue-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
}

.retro-h1 {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 200;
  font-size: 2.5rem;
  color: var(--apple-dark-gray);
  margin-bottom: 0.5rem;
}

.tagline {
  font-style: italic;
  color: var(--apple-blue);
  margin-bottom: 1rem;
}

.today-date {
  color: var(--apple-medium-gray);
  font-size: 0.9rem;
}

/* Main content */
.retro-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

/* Аналоговые часы в скевоморфическом дизайне */
.retro-clock-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.retro-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clock-face {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle at center, white, #e0e0e0);
  border: 15px solid #c0c0c0;
  box-shadow:
      0 0 0 5px rgba(0, 0, 0, 0.1),
      inset 0 0 20px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.3);
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
  color: #333;
  font-family: "Gill Sans", Helvetica, sans-serif;
}

.center-dot {
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at center, #666, #333);
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.hand {
  position: absolute;
  transform-origin: bottom center;
  bottom: 50%;
  border-radius: 10px;
  z-index: 5;
}

.hour-hand {
  width: 8px;
  height: 25%;
  background: linear-gradient(to right, #333 0%, #333 40%, #666 60%, #333 100%);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.minute-hand {
  width: 6px;
  height: 38%;
  background: linear-gradient(to right, #555 0%, #555 40%, #888 60%, #555 100%);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.second-hand {
  width: 2px;
  height: 45%;
  background-color: #cc0000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.digital-display {
  margin-top: 1.5rem;
  background: linear-gradient(to bottom, #e2e2e2, #b0b0b0);
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  text-align: center;
}

.digital-time {
  font-family: "Courier New", monospace;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--apple-dark-gray);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

.selected-city {
  font-size: 0.9rem;
  color: var(--apple-blue);
  margin-top: 0.2rem;
}

/* Секция с мировыми часами */
.world-clocks-container {
  width: 100%;
  margin-top: 1rem;
}

.section-title {
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 1.8rem;
  color: var(--apple-dark-gray);
  margin-bottom: 2rem;
}

.world-clocks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

/* Карточки городов в стиле aqua macOS */
.aqua-city-card {
  width: 160px;
  height: 160px;
  border-radius: 15px;
  background: linear-gradient(to bottom,
  color-mix(in srgb, var(--city-color, #0066cc) 85%, white),
  color-mix(in srgb, var(--city-color, #0066cc) 100%, black)
  );
  color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 5px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 var(--aqua-highlight);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.aqua-city-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom,
  var(--aqua-highlight),
  transparent
  );
  border-radius: 15px 15px 0 0;
  pointer-events: none;
}

.aqua-city-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow:
      0 10px 20px var(--aqua-shadow),
      inset 0 1px 0 var(--aqua-highlight);
}

.active-city {
  outline: 3px solid white;
  box-shadow:
      0 0 0 5px rgba(0, 102, 204, 0.5),
      0 5px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 var(--aqua-highlight);
}

.active-city:hover {
  transform: translateY(-5px);
  box-shadow:
      0 0 0 5px rgba(0, 102, 204, 0.5),
      0 10px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 var(--aqua-highlight);
}

.city-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.city-time {
  font-family: "Courier New", monospace;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.city-name {
  font-weight: bold;
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.city-region {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Footer */
.retro-footer {
  background-color: var(--apple-light-gray);
  padding: 2rem;
  text-align: center;
  border-top: 1px solid var(--apple-medium-gray);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--apple-blue);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-link:hover {
  text-decoration: underline;
}

.copyright {
  color: var(--apple-medium-gray);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.small-text {
  color: var(--apple-medium-gray);
  font-size: 0.7rem;
}

/* Адаптивность для планшетов */
@media (min-width: 768px) {
  .retro-h1 {
    font-size: 3rem;
  }

  .clock-face {
    width: 300px;
    height: 300px;
  }

  .digital-time {
    font-size: 2.2rem;
  }

  .retro-main {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .retro-clock-container {
    flex: 0 0 40%;
    margin-right: 2rem;
  }

  .world-clocks-container {
    flex: 0 0 50%;
  }
}

/* Адаптивность для десктопов */
@media (min-width: 1024px) {
  .retro-h1 {
    font-size: 3.5rem;
  }

  .clock-face {
    width: 350px;
    height: 350px;
    border-width: 20px;
  }

  .digital-time {
    font-size: 2.5rem;
  }

  .aqua-city-card {
    width: 180px;
    height: 180px;
  }
}
</style>