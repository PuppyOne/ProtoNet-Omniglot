import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';


const localeImports = import.meta.glob<NestedTranslation>('./locales/*.json');

const lngToImport: typeof localeImports = {};

for (const [path, importer] of Object.entries(localeImports)) {
  const { lng } = /\/(?<lng>[^/]+)\.json$/.exec(path)?.groups ?? {};

  if (lng) lngToImport[lng] = importer;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(async (language: string) => {
      const importer = lngToImport[language];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!importer) throw new Error(`Unsupported language: ${language}`);

      return await importer();
    })
  )
  .init({
    fallbackLng: 'zh-CN',
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;

interface NestedTranslation {
  [key: string]: string | NestedTranslation;
}
