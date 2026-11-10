"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, getTranslation } from "./index";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("mr");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("kisansetu_lang") as Language;
      if (savedLang && (savedLang === "mr" || savedLang === "hi" || savedLang === "en")) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch (e) {
      console.error("Failed to read language from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("kisansetu_lang", lang);
    } catch (e) {
      console.error("Failed to save language to localStorage", e);
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
