import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSeo() {
  const { t } = useI18n();

  watchEffect(() => {
    document.title = t('title');
    
    // Update basic meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    // We can add a description key to locales later if needed, for now sticking to title or generic description
    metaDescription.setAttribute('content', t('title') + ' - Productivity Tools');
      
    // Update HTML lang attribute
    document.documentElement.lang = (window as any).i18n?.global?.locale?.value || 'en';
  });
}
