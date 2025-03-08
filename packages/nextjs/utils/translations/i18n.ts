import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          bestContent: "Best Content",
          upload: "Upload",
          aboutUs: "Our Mission",
          contactUs: "Contact Us",
          subscriptions: "Subscriptions",
          language: "Language",
        },
      },
      fr: {
        translation: {
          home: "Accueil",
          bestContent: "Meilleur Contenu",
          upload: "Télécharger",
          aboutUs: "Notre Mission",
          contactUs: "Contactez-nous",
          subscriptions: "Abonnements",
          language: "Langue",
        },
      },
      ua: {
        translation: {
          home: "Головна",
          bestContent: "Найкращий Контент",
          upload: "Завантажити",
          aboutUs: "Наша Місія",
          contactUs: "Зв'яжіться з нами",
          subscriptions: "Підписки",
          language: "Мова",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  })
  .then(() => {
    console.log("i18n initialized successfully");
  })
  .catch(error => {
    console.error("i18n initialization error:", error);
  });

export default i18n;
