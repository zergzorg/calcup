import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'


const YANDEX_METRIKA_ID = Number(import.meta.env.VITE_YANDEX_METRIKA_ID || 105706802);
const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}

if (import.meta.env.PROD) {
  (function(m: Window & typeof globalThis, e: Document, t: 'script', r: string, i: 'ym', k?: HTMLScriptElement, a?: HTMLScriptElement){
    const ymFn = (m[i] as ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }) || function(this: unknown) {
      (ymFn.a = ymFn.a || []).push(arguments);
    };
    m[i] = ymFn;
    ymFn.l = Date.now();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=true,k.src=r,a.parentNode?.insertBefore(k,a)
  })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=' + YANDEX_METRIKA_ID, 'ym');

  window.ym?.(YANDEX_METRIKA_ID, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
}

createApp(App).use(i18n).mount('#app')
