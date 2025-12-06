import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


if (import.meta.env.PROD && import.meta.env.VITE_YANDEX_METRIKA_ID) {
  (function(m: any, e: any, t: any, r: any, i: any, k?: any, a?: any){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1 * (new Date() as any);
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=' + import.meta.env.VITE_YANDEX_METRIKA_ID, 'ym');

  (window as any).ym(parseInt(import.meta.env.VITE_YANDEX_METRIKA_ID), 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
}

createApp(App).mount('#app')
