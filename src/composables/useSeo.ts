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
    metaDescription.setAttribute('content', `${t('title')} - Productivity Tools`);

    document.documentElement.lang = String(locale.value);
  });
}
