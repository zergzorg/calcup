import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'


// Яндекс.Метрика - ID захардкожен для работы на GitHub Pages
const YANDEX_METRIKA_ID = 105706802;

if (import.meta.env.PROD) {
  (function(m: any, e: any, t: any, r: any, i: any, k?: any, a?: any){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1 * (new Date() as any);
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=' + YANDEX_METRIKA_ID, 'ym');

  (window as any).ym(YANDEX_METRIKA_ID, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
}

createApp(App).use(i18n).mount('#app')
