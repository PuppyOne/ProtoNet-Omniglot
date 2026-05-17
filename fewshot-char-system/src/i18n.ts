import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';


const localeFiles = import.meta.glob<{ default: Record<string, string> }>(
  './locales/*.json',
  { eager: true }
);

const resources: Record<string, { translation: Record<string, string> }> = {};

for (const [path, module] of Object.entries(localeFiles)) {
  const { lng } = path.match(/\/(?<lng>[^/]+)\.json$/)?.groups ?? {};

  if (lng) resources[lng] = { translation: module.default };
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;
