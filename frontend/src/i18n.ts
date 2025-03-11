import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import authTranslations from './locales/en/auth.json';
import navTranslations from './locales/en/nav.json';
import dashboardTranslations from './locales/en/dashboard.json';
import hrTranslations from './locales/en/hr.json';

const resources = {
  en: {
    auth: authTranslations,
    nav: navTranslations,
    dashboard: dashboardTranslations,
    hr: hrTranslations,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      defaultNS: 'auth',
      ns: ['auth', 'nav', 'dashboard', 'hr'],
      interpolation: {
        escapeValue: false,
      },
      debug: false,
    });
}

export default i18n; 