import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "../multi-lingual/en/translation.json";
import translationHI from "../multi-lingual/hi/translation.json";
import translationBN from "../multi-lingual/bn/translation.json";

const resources = {
    en: {
        translation: translationEN,
    },
    hi: {
        translation: translationHI,
    },
    bn: {
        translation: translationBN,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: localStorage.getItem("lang") || "en",
        interpolation: { escapeValue: false },
        showSupportNotice: false,
    });

export default i18n;