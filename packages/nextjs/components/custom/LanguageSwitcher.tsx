"use client";

import { useState } from "react";
import i18n from "i18next";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(i18n.language);
  const changeLanguage = (lng: string) => {
    console.log(i18n, lng);
    i18n.changeLanguage(lng).then(() => setLanguage(lng));
  };

  return (
    <div className="relative">
      <select
        className="bg-base-100 border rounded-md px-3 py-1"
        value={language}
        onChange={e => changeLanguage(e.target.value)}
      >
        <option value="en"> 🇬🇧 </option>
        <option value="ua"> 🇺🇦 </option>
        <option value="fr"> 🇫🇷 </option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
