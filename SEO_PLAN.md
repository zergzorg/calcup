# SEO-план Calcup — calcup.ru

> Дата составления: 2026-04-24  
> Статус: в работе

---

## Текущее состояние (baseline)

### Что уже работает
- ✅ GA4 (G-MFRK5JJVYZ) на всех 5 страницах
- ✅ `robots.txt` + `sitemap.xml` (5 URL, приоритеты расставлены)
- ✅ Canonical + hreflang (ru/en/x-default) на каждой странице
- ✅ JSON-LD: WebApplication (главная), WebPage + BreadcrumbList + FAQPage (подстраницы)
- ✅ OG/Twitter meta на всех страницах, `og:image:alt` добавлен
- ✅ FAQ-секции с `<details>`/`<summary>` на всех 4 лендингах
- ✅ Семантический HTML: `<main>`, `<h1>`, `<h2>`, `<nav>`
- ✅ PWA manifest с категориями productivity/utilities
- ✅ Статические лендинги под ключевые запросы (timer-pomodoro, pomodoro-timer, task-planner, focus-sounds)
- ✅ Двуязычный контент (RU + EN)

### Критические проблемы (блокируют рост)
| # | Проблема | Влияние |
|---|---|---|
| 1 | `og:image` = SVG | Нет превью в Telegram, Facebook, WhatsApp, Discord |
| 2 | Manifest содержит только SVG иконку | PWA не устанавливается на Android/iOS |
| 3 | Google Search Console не настроен | Нет данных о crawl, нет отправки sitemap |
| 4 | Нет бэклинков | Без внешних ссылок не ранжируются конкурентные запросы |

### Структурные ограничения
- `.ru` TLD — геотаргетинг на Россию, снижает EN-ранжирование в global SERP
- SPA-архитектура: Googlebot рендерит страницу, но статические лендинги — основная ставка
- Нет английских лендингов для focus-sounds и task-planner (только root-fallback)

---

## Приоритеты

```
P0 — блокирует (делать немедленно)
P1 — высокое влияние (1-2 недели)
P2 — среднее влияние (1 месяц)
P3 — долгосрочная стратегия (1-3 месяца)
```

---

## P0 — Немедленно (технические блокеры)

### 1. OG-изображение PNG 1200×630

**Файлы для создания:**
- `/public/og-image.png` — 1200×630, RU версия
- `/public/og-image-en.png` — 1200×630, EN версия (или один универсальный)

**Содержание баннера:**
- Логотип Calcup слева
- Скриншот интерфейса или виджеты в ретро-стиле
- Подпись: "Pomodoro · Задачи · Звуки · Ретро стол"
- Фон: `#213f59` (blueprint) с паттерном grid

**После создания — обновить везде:**
```html
<!-- index.html и все 4 лендинга -->
<meta property="og:image" content="https://calcup.ru/og-image.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://calcup.ru/og-image.png" />
```

**Обновить в `src/composables/useSeo.ts`:**
```ts
upsertMetaByProperty('og:image', `${SITE_URL}/og-image.png`);
upsertMetaByProperty('og:image:type', 'image/png');
upsertMetaByProperty('og:image:width', '1200');
upsertMetaByProperty('og:image:height', '630');
upsertMetaByName('twitter:image', `${SITE_URL}/og-image.png`);
```

---

### 2. PNG-иконки для PWA Manifest

**Файлы для создания:**
- `/public/icon-192.png` — 192×192 PNG
- `/public/icon-512.png` — 512×512 PNG
- `/public/icon-512-maskable.png` — 512×512, safe zone для Android adaptive icons

**Обновить `/public/manifest.webmanifest`:**
```json
{
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/calcup.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any" }
  ]
}
```

---

### 3. Google Search Console

**Шаги:**
1. Открыть [search.google.com/search-console](https://search.google.com/search-console)
2. Добавить ресурс: `https://calcup.ru/`
3. Подтвердить через DNS TXT-запись (рекомендуется для GitHub Pages) или HTML-файл
4. Отправить sitemap: `https://calcup.ru/sitemap.xml`
5. Запросить индексацию главной страницы через "URL Inspection"

**Что отслеживать в GSC:**
- Coverage report — ошибки индексации
- Performance — запросы, клики, позиции
- Core Web Vitals — LCP, CLS, FID

---

## P1 — Высокое влияние (1-2 недели)

### 4. Английские лендинги для focus-sounds и task-planner

**Создать файлы:**
- `/public/focus-sounds-en/index.html` — по образцу `/public/focus-sounds/` с EN контентом
- `/public/task-planner-en/index.html` — по образцу `/public/task-planner/`

**Обновить hreflang:**
```html
<!-- в focus-sounds/index.html -->
<link rel="alternate" hreflang="en" href="https://calcup.ru/focus-sounds-en/" />

<!-- в focus-sounds-en/index.html -->
<link rel="alternate" hreflang="ru" href="https://calcup.ru/focus-sounds/" />
<link rel="alternate" hreflang="en" href="https://calcup.ru/focus-sounds-en/" />
```

**Добавить в `sitemap.xml`:**
```xml
<url>
  <loc>https://calcup.ru/focus-sounds-en/</loc>
  <lastmod>2026-04-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
<url>
  <loc>https://calcup.ru/task-planner-en/</loc>
  <lastmod>2026-04-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
```

---

### 5. Добавить `screenshots` в manifest (PWA)

Google Play и магазины PWA показывают скриншоты при установке.

**Создать:** `/public/screenshot-wide.png` (1280×720) и `/public/screenshot-narrow.png` (390×844)

**Добавить в manifest:**
```json
{
  "screenshots": [
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Calcup — рабочий стол с виджетами"
    },
    {
      "src": "/screenshot-narrow.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Calcup на мобильном"
    }
  ]
}
```

---

### 6. Расширить контент лендингов (глубина)

Текущие FAQ-секции — хороший старт, но контент ещё тонкий. Добавить:

**На каждый лендинг:**
- Секция "Как начать работу" (нумерованный список из 3-4 шагов) — это targets "как пользоваться помодоро"
- Секция "Советы" (3-4 bullet points) — targets "советы по продуктивности"

**Пример для `timer-pomodoro`:**
```html
<section>
  <h2>Как начать первую сессию</h2>
  <ol>
    <li>Откройте Calcup и добавьте задачу в планировщик.</li>
    <li>Нажмите «Начать работу» — таймер запустится автоматически.</li>
    <li>Работайте 25 минут, затем сделайте 5-минутный перерыв.</li>
    <li>После 4 сессий — длинный перерыв 15–30 минут.</li>
  </ol>
</section>
```

---

## P2 — Среднее влияние (1 месяц)

### 7. Ссылочная масса — приоритетные площадки

Без бэклинков конкурентные запросы практически недостижимы.

| Площадка | Тип | Ссылка | Примечание |
|---|---|---|---|
| **Product Hunt** | Do-follow, авторитетный | После запуска | Пост "Calcup — retro productivity desk" |
| **alternativeto.net** | Do-follow | Сразу | Добавить как альтернативу Pomofocus, TomatoTimer |
| **vc.ru / tjournal** | Nofollow, RU-трафик | Статья | "Как я сделал ретро рабочий стол для продуктивности" |
| **Reddit** r/productivity | Nofollow, EN-трафик | Пост | Показать продукт, получить обратную связь |
| **Hacker News** Show HN | Nofollow, авторитет | Пост | "Show HN: Calcup – retro desk with Pomodoro, tasks, ambient sounds" |
| **GitHub Awesome lists** | Do-follow | PR | awesome-productivity, awesome-selfhosted |
| **Google Play / PWA Store** | Do-follow | После добавки PNG иконок | |

---

### 8. Structured Data — дополнения

**Добавить `SoftwareApplication` schema на главную (расширяет WebApplication):**
```json
{
  "@type": "SoftwareApplication",
  "name": "Calcup",
  "operatingSystem": "Web Browser",
  "applicationCategory": "ProductivityApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "24"
  }
}
```
*Примечание: AggregateRating добавлять только если есть реальные отзывы/оценки.*

**Добавить `HowTo` schema на timer-pomodoro:**
```json
{
  "@type": "HowTo",
  "name": "Как использовать таймер Помодоро",
  "step": [
    { "@type": "HowToStep", "text": "Добавьте задачу в список планировщика." },
    { "@type": "HowToStep", "text": "Нажмите «Начать работу» для запуска таймера." },
    { "@type": "HowToStep", "text": "Работайте 25 минут, затем сделайте перерыв." }
  ]
}
```

---

### 9. Core Web Vitals — оптимизация

**Проверить через PageSpeed Insights:**
- LCP (Largest Contentful Paint) — цель < 2.5s
- CLS (Cumulative Layout Shift) — цель < 0.1
- FID/INP — цель < 200ms

**Потенциальные проблемы:**
- SVG favicon загружается синхронно — некритично
- GA4 загружается `async` — хорошо
- Vendor chunk (vue + vue-i18n) — единственный тяжёлый ресурс

**Если LCP > 2.5s:** добавить `<link rel="preload">` для критических ресурсов:
```html
<link rel="preload" as="script" href="/src/main.ts" />
```

---

## P3 — Долгосрочная стратегия (1-3 месяца)

### 10. Блог / микростатьи

Контент — единственный способ привлекать органику без бюджета.

**Темы под RU long-tail запросы:**
- "Метод Помодоро: полное руководство для начинающих" → `/blog/metod-pomodoro/`
- "25 минут работы: почему Помодоро действительно работает" → `/blog/25-minut/`
- "Фоновые звуки для работы: что выбрать" → `/blog/fonovye-zvuki/`

**Реализация:** статические HTML-файлы в `/public/blog/` — так же, как текущие лендинги. Без CMS, без сложности.

---

### 11. Yandex Webmaster

Для ru-аудитории Яндекс важнее Google в ряде категорий.

**Шаги:**
1. Зарегистрировать сайт в [webmaster.yandex.ru](https://webmaster.yandex.ru)
2. Подтвердить через HTML-файл или DNS
3. Отправить sitemap
4. Настроить "Региональность" → Россия

---

### 12. Bing Webmaster Tools

Microsoft/Bing индексирует отдельно от Google.

1. Зарегистрировать на [bing.com/webmasters](https://bing.com/webmasters)
2. Импортировать настройки из Google Search Console (автоматический импорт)
3. Отправить sitemap

---

## Ключевые запросы и ожидания

### Русскоязычные (высокий потенциал)
| Запрос | Сложность | Ожидание |
|---|---|---|
| `calcup` | Низкая | Топ-1–3 сразу после индексации |
| `помодоро таймер без регистрации` | Средняя | 2–4 месяца |
| `таймер помодоро онлайн бесплатно` | Высокая | 4–8 месяцев + бэклинки |
| `фоновые звуки для работы` | Средняя | 2–4 месяца |
| `планировщик задач онлайн бесплатно` | Высокая | 6+ месяцев |

### Английские (низкий приоритет из-за .ru TLD)
| Запрос | Сложность | Ожидание |
|---|---|---|
| `calcup` | Низкая | Топ-5 после индексации |
| `retro pomodoro timer` | Низкая | 2–4 месяца |
| `pomodoro timer free no signup` | Высокая | 6+ месяцев + бэклинки |

---

## Чеклист выполнения

### P0 — Немедленно
- [ ] Создать `og-image.png` 1200×630
- [ ] Обновить все `og:image` ссылки (5 HTML файлов + useSeo.ts)
- [ ] Создать иконки `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`
- [ ] Обновить `manifest.webmanifest`
- [ ] Зарегистрировать calcup.ru в Google Search Console
- [ ] Отправить sitemap в GSC

### P1 — 1-2 недели
- [ ] Создать `/public/focus-sounds-en/index.html`
- [ ] Создать `/public/task-planner-en/index.html`
- [ ] Обновить hreflang на focus-sounds и task-planner
- [ ] Добавить URL в sitemap.xml
- [ ] Создать `screenshot-wide.png` и `screenshot-narrow.png`
- [ ] Добавить `screenshots` в manifest
- [ ] Добавить секции "Как начать" на лендинги

### P2 — 1 месяц
- [ ] Запуск на Product Hunt
- [ ] Добавить на alternativeto.net
- [ ] Написать пост на vc.ru / tjournal
- [ ] Публикация в Reddit r/productivity
- [ ] Show HN на Hacker News
- [ ] Добавить HowTo schema на timer-pomodoro
- [ ] Проверить Core Web Vitals через PageSpeed Insights

### P3 — 1-3 месяца
- [ ] Зарегистрировать в Yandex Webmaster
- [ ] Зарегистрировать в Bing Webmaster Tools
- [ ] Написать первую статью блога

---

## Метрики успеха (KPI)

| Метрика | Сейчас | Цель (3 мес) | Цель (6 мес) |
|---|---|---|---|
| Organic clicks/месяц | ~0 (новый домен) | 200+ | 1000+ |
| Брендовые позиции "calcup" | нет данных | Топ-3 | Топ-1 |
| Индексировано страниц | ? | 7 | 10+ |
| Core Web Vitals | ? | Всё зелёное | Всё зелёное |
| Бэклинки | 0 | 5+ | 20+ |

---

*Последнее обновление: 2026-04-24*
