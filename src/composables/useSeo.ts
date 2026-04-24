import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSeo() {
const { t, locale } = useI18n();

watchEffect(() => {
document.title = t('title');

let metaDescription = document.querySelector('meta[name="description"]');
if (!metaDescription) {
metaDescription = document.createElement('meta');
metaDescription.setAttribute('name', 'description');
document.head.appendChild(metaDescription);
}
metaDescription.setAttribute('content', `${t('title')} - Productivity tools for focus, tasks and time management`);

let metaKeywords = document.querySelector('meta[name="keywords"]');
if (!metaKeywords) {
metaKeywords = document.createElement('meta');
metaKeywords.setAttribute('name', 'keywords');
document.head.appendChild(metaKeywords);
}
metaKeywords.setAttribute('content', 'pomodoro, task planner, countdown timer, focus tool, productivity, retro desk, time management');

document.documentElement.lang = String(locale.value);

// Open Graph / Social Meta
let ogTitle = document.querySelector('meta[property="og:title"]');
if (!ogTitle) {
ogTitle = document.createElement('meta');
ogTitle.setAttribute('property', 'og:title');
document.head.appendChild(ogTitle);
}
ogTitle.setAttribute('content', t('title'));

let ogDescription = document.querySelector('meta[property="og:description"]');
if (!ogDescription) {
ogDescription = document.createElement('meta');
ogDescription.setAttribute('property', 'og:description');
document.head.appendChild(ogDescription);
}
ogDescription.setAttribute('content', `${t('title')} - Productivity tools for focus, tasks and time management`);

let ogType = document.querySelector('meta[property="og:type"]');
if (!ogType) {
ogType = document.createElement('meta');
ogType.setAttribute('property', 'og:type');
document.head.appendChild(ogType);
}
ogType.setAttribute('content', 'website');

let ogUrl = document.querySelector('meta[property="og:url"]');
if (!ogUrl) {
ogUrl = document.createElement('meta');
ogUrl.setAttribute('property', 'og:url');
document.head.appendChild(ogUrl);
}
ogUrl.setAttribute('content', 'https://calcup.ru');

let ogImage = document.querySelector('meta[property="og:image"]');
if (!ogImage) {
ogImage = document.createElement('meta');
ogImage.setAttribute('property', 'og:image');
document.head.appendChild(ogImage);
}
ogImage.setAttribute('content', 'https://calcup.ru/calcup.svg');

let twitterCard = document.querySelector('meta[name="twitter:card"]');
if (!twitterCard) {
twitterCard = document.createElement('meta');
twitterCard.setAttribute('name', 'twitter:card');
document.head.appendChild(twitterCard);
}
twitterCard.setAttribute('content', 'summary_large_image');

let twitterTitle = document.querySelector('meta[name="twitter:title"]');
if (!twitterTitle) {
twitterTitle = document.createElement('meta');
twitterTitle.setAttribute('name', 'twitter:title');
document.head.appendChild(twitterTitle);
}
twitterTitle.setAttribute('content', t('title'));

let twitterDescription = document.querySelector('meta[name="twitter:description"]');
if (!twitterDescription) {
twitterDescription = document.createElement('meta');
twitterDescription.setAttribute('name', 'twitter:description');
document.head.appendChild(twitterDescription);
}
twitterDescription.setAttribute('content', `${t('title')} - Productivity tools for focus, tasks and time management`);

let twitterImage = document.querySelector('meta[name="twitter:image"]');
if (!twitterImage) {
twitterImage = document.createElement('meta');
twitterImage.setAttribute('name', 'twitter:image');
document.head.appendChild(twitterImage);
}
twitterImage.setAttribute('content', 'https://calcup.ru/calcup.svg');
});
}
