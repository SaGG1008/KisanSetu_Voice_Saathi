"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-[#1B5E20] text-white text-xs px-2.5 py-1 rounded border border-[#2E7D32] focus:outline-none cursor-pointer"
      aria-label={t("selectLanguageLabel")}
    >
      <option value="mr">मराठी</option>
      <option value="hi">हिंदी</option>
      <option value="en">English</option>
    </select>
  );
}
