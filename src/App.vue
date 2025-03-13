<script setup>
import { ref, computed, onMounted } from "vue";

// Текущая дата
const currentDate = ref(new Date());

// Форматирование даты
const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Фейковые данные для статистики
const productStatistics = ref([
  { name: "iMac", salesCount: 2475, rating: 4.8, icon: "🖥️", releaseYear: 2021, color: "#ff6b6b" },
  { name: "MacBook", salesCount: 3842, rating: 4.7, icon: "💻", releaseYear: 2022, color: "#4ecdc4" },
  { name: "iPhone", salesCount: 8754, rating: 4.9, icon: "📱", releaseYear: 2023, color: "#1a535c" },
  { name: "iPad", salesCount: 4231, rating: 4.6, icon: "📟", releaseYear: 2022, color: "#ff9f1c" },
  { name: "AirPods", salesCount: 6312, rating: 4.5, icon: "🎧", releaseYear: 2021, color: "#2ec4b6" },
  { name: "Apple Watch", salesCount: 3865, rating: 4.7, icon: "⌚", releaseYear: 2022, color: "#f45b69" },
  { name: "Apple TV", salesCount: 1523, rating: 4.4, icon: "📺", releaseYear: 2021, color: "#f6ae2d" },
  { name: "HomePod", salesCount: 982, rating: 4.3, icon: "🔊", releaseYear: 2023, color: "#33658a" },
  { name: "Mac mini", salesCount: 867, rating: 4.6, icon: "🧠", releaseYear: 2022, color: "#86bbd8" },
  { name: "Mac Pro", salesCount: 456, rating: 4.9, icon: "⚡", releaseYear: 2023, color: "#758e4f" },
  { name: "iPod", salesCount: 345, rating: 4.1, icon: "🎵", releaseYear: 2020, color: "#f26419" },
  { name: "Accessories", salesCount: 7245, rating: 4.5, icon: "🔌", releaseYear: 2023, color: "#9bc53d" }
]);

// Фейковые новости и объявления
const newsItems = ref([
  {
    title: "Новая разработка устройств",
    content: "Наша компания анонсирует прорывную технологию, которая изменит ваше представление о вычислительных устройствах. Готовьтесь к чему-то необычному в ближайшие месяцы.",
    date: "15 февраля 2023",
    important: true
  },
  {
    title: "Обновление программного обеспечения",
    content: "Выпущено обновление версии 12.3, включающее улучшения безопасности и новые функции для всех пользователей.",
    date: "3 марта 2023",
    important: false
  },
  {
    title: "Открытие нового кампуса",
    content: "Мы открываем новый инновационный кампус в Куперино, который станет домом для более 5000 инженеров и дизайнеров.",
    date: "21 апреля 2023",
    important: true
  },
  {
    title: "Экологическая инициатива",
    content: "Наша компания обязуется достичь углеродной нейтральности к 2030 году во всех аспектах деятельности, включая производство.",
    date: "5 июня 2023",
    important: false
  }
]);

// Фейковые образовательные ресурсы
const resources = ref([
  { title: "Руководство разработчика", type: "Документация", icon: "📝", downloads: 12458 },
  { title: "Видеокурсы для начинающих", type: "Видео", icon: "🎬", downloads: 8765 },
  { title: "Оптимизация производительности", type: "Руководство", icon: "⚡", downloads: 5432 },
  { title: "Основы дизайна интерфейсов", type: "Книга", icon: "📚", downloads: 7654 },
  { title: "Подкаст для разработчиков", type: "Аудио", icon: "🎙️", downloads: 3210 }
]);

// Выбранная категория для основной секции (продукты, новости или ресурсы)
const selectedCategory = ref("products");

// Функция для изменения выбранной категории
const setSelectedCategory = (category) => {
  selectedCategory.value = category;
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  // Имитация загрузки данных с сервера
  setTimeout(() => {
    console.log("Данные загружены");
  }, 1000);
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
        <div class="apple-text">iProduct Dashboard</div>
      </div>
      <h1 class="retro-h1">Innovation Data</h1>
      <p class="tagline">Information. Simplified. Visualized.</p>
      <p class="today-date">{{ formattedDate }}</p>
    </header>

    <div class="category-selector">
      <button
          @click="setSelectedCategory('products')"
          :class="{ active: selectedCategory === 'products' }"
          class="category-button"
      >
        Products
      </button>
      <button
          @click="setSelectedCategory('news')"
          :class="{ active: selectedCategory === 'news' }"
          class="category-button"
      >
        News
      </button>
      <button
          @click="setSelectedCategory('resources')"
          :class="{ active: selectedCategory === 'resources' }"
          class="category-button"
      >
        Resources
      </button>
    </div>

    <main class="retro-main">
      <!-- Продукты -->
      <div v-if="selectedCategory === 'products'" class="info-container">
        <div class="info-header">
          <h2 class="section-title">Our Products. Incredible Results.</h2>
          <p class="info-description">A comprehensive overview of our product line performance. Innovation at every level.</p>
        </div>

        <div class="product-statistics">
          <div
              v-for="product in productStatistics"
              :key="product.name"
              class="aqua-card"
              :style="{'--card-color': product.color}"
          >
            <div class="product-icon">{{ product.icon }}</div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-year">{{ product.releaseYear }}</div>
            <div class="product-stats">
              <div class="stat-item">
                <span class="stat-label">Sales</span>
                <span class="stat-value">{{ product.salesCount.toLocaleString() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Rating</span>
                <span class="stat-value">{{ product.rating }}/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Новости -->
      <div v-if="selectedCategory === 'news'" class="info-container">
        <div class="info-header">
          <h2 class="section-title">Latest News. Fresh Insights.</h2>
          <p class="info-description">Stay informed with the latest announcements and developments from our company.</p>
        </div>

        <div class="news-container">
          <div
              v-for="(news, index) in newsItems"
              :key="index"
              class="news-card"
              :class="{ 'important-news': news.important }"
          >
            <div class="news-header">
              <h3 class="news-title">{{ news.title }}</h3>
              <span class="news-date">{{ news.date }}</span>
            </div>
            <p class="news-content">{{ news.content }}</p>
            <div v-if="news.important" class="important-tag">Important</div>
          </div>
        </div>
      </div>

      <!-- Ресурсы -->
      <div v-if="selectedCategory === 'resources'" class="info-container">
        <div class="info-header">
          <h2 class="section-title">Educational Resources. Knowledge Power.</h2>
          <p class="info-description">Expand your skills and knowledge with our comprehensive educational materials.</p>
        </div>

        <div class="resources-container">
          <div
              v-for="(resource, index) in resources"
              :key="index"
              class="resource-card"
          >
            <div class="resource-icon">{{ resource.icon }}</div>
            <div class="resource-content">
              <h3 class="resource-title">{{ resource.title }}</h3>
              <span class="resource-type">{{ resource.type }}</span>
              <div class="resource-downloads">
                <span class="download-icon">⬇️</span>
                <span class="download-count">{{ resource.downloads.toLocaleString() }}</span>
              </div>
            </div>
            <button class="download-button">Download</button>
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

/* Селектор категорий */
.category-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 0 1rem;
}

.category-button {
  background: linear-gradient(to bottom, #f5f5f5, #e0e0e0);
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-family: 'Lucida Grande', sans-serif;
  font-size: 0.9rem;
  color: var(--apple-dark-gray);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.category-button:hover {
  background: linear-gradient(to bottom, #e0e0e0, #d0d0d0);
}

.category-button.active {
  background: linear-gradient(to bottom, var(--apple-blue-gradient-start), var(--apple-blue-gradient-end));
  color: white;
  border-color: var(--apple-blue);
  box-shadow: 0 1px 3px rgba(0, 102, 204, 0.3);
}

/* Main content */
.retro-main {
  flex: 1;
  padding: 0 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.info-container {
  width: 100%;
}

.info-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 1.8rem;
  color: var(--apple-dark-gray);
  margin-bottom: 0.5rem;
}

.info-description {
  color: var(--apple-dark-gray);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Продукты */
.product-statistics {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.aqua-card {
  width: 160px;
  height: 180px;
  border-radius: 15px;
  background: linear-gradient(to bottom,
  color-mix(in srgb, var(--card-color, #0066cc) 85%, white),
  color-mix(in srgb, var(--card-color, #0066cc) 100%, black)
  );
  color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

.aqua-card::after {
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

.aqua-card:hover {
  transform: translateY(-5px);
  box-shadow:
      0 10px 20px var(--aqua-shadow),
      inset 0 1px 0 var(--aqua-highlight);
}

.product-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.product-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.product-year {
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
  opacity: 0.8;
}

.product-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.stat-label {
  opacity: 0.8;
}

.stat-value {
  font-weight: bold;
}

/* Новости */
.news-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.news-card {
  background: linear-gradient(to bottom, #f5f5f5, #e0e0e0);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #ccc;
}

.important-news {
  background: linear-gradient(to bottom, #fff8e1, #ffe0b2);
  border: 1px solid #ffcc80;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.news-title {
  font-size: 1.2rem;
  color: var(--apple-dark-gray);
  margin: 0;
}

.news-date {
  font-size: 0.8rem;
  color: var(--apple-medium-gray);
}

.news-content {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--apple-dark-gray);
}

.important-tag {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.8rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Ресурсы */
.resources-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.resource-card {
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff, #f5f5f5);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  border: 1px solid #e0e0e0;
}

.resource-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.resource-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: var(--apple-blue);
}

.resource-content {
  flex: 1;
}

.resource-title {
  font-size: 1.1rem;
  margin: 0 0 0.2rem 0;
  color: var(--apple-dark-gray);
}

.resource-type {
  font-size: 0.8rem;
  color: var(--apple-medium-gray);
  display: block;
  margin-bottom: 0.5rem;
}

.resource-downloads {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--apple-dark-gray);
}

.download-icon {
  margin-right: 0.3rem;
}

.download-button {
  background: linear-gradient(to bottom, var(--apple-blue-gradient-start), var(--apple-blue-gradient-end));
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.download-button:hover {
  background: linear-gradient(to bottom, #1a75ff, #0055cc);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
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
@media (max-width: 768px) {
  .retro-h1 {
    font-size: 2rem;
  }

  .category-selector {
    flex-direction: column;
    align-items: center;
  }

  .category-button {
    width: 100%;
    max-width: 300px;
  }

  .product-statistics {
    gap: 1rem;
  }

  .aqua-card {
    width: 140px;
    height: 160px;
  }
}

/* Адаптивность для десктопов */
@media (min-width: 1024px) {
  .retro-h1 {
    font-size: 3.5rem;
  }

  .aqua-card {
    width: 180px;
    height: 200px;
  }
}
</style>