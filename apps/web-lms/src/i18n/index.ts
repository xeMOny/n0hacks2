import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./locales/es.json";
import en from "./locales/en.json";
import it from "./locales/it.json";
import fr from "./locales/fr.json";

export const SUPPORTED_LANGUAGES = ["es", "en", "fr", "it"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      it: { translation: it },
    },
    fallbackLng: "es",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "uclcampus_lang",
    },
  });

// El lang del <html> viene bakeado en es del index.html estático: si el
// visitante usa otro idioma, los lectores de pantalla pronunciarían la página
// entera con fonética española. Se sincroniza aquí en cada cambio de idioma.
document.documentElement.lang = i18n.resolvedLanguage || "es";
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
