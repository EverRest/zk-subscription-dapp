"use client";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
