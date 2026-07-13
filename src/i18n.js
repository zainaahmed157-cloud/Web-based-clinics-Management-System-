import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../en";
import ar from "../ar";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources: {
    en: {
        translation: en,
    },
    ar: {
    translation: ar,
    },
    },

    detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    },

    fallbackLng: "ar",

    interpolation: {
    escapeValue: false,
    },
});

export const t = i18n.t.bind(i18n);
export default i18n;