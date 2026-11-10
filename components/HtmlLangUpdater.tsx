"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export function HtmlLangUpdater({ children }: { children: React.ReactNode }) {
  const { language } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}
