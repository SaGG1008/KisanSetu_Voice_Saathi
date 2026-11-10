"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Mic, BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export function BottomNav({ activeTab }: { activeTab: "home" | "chat" | "voice" | "history" }) {
  const { t } = useTranslation();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] py-2 px-4 flex justify-around items-center text-xs text-[#657367]">
      <Link
        href="/"
        className={`flex flex-col items-center transition ${
          activeTab === "home" ? "text-[#2E7D32] font-semibold" : "hover:text-[#2E7D32]"
        }`}
      >
        <Sparkles size={20} />
        <span className="mt-0.5">{t("navHome")}</span>
      </Link>
      <Link
        href="/chat"
        className={`flex flex-col items-center transition ${
          activeTab === "chat" ? "text-[#2E7D32] font-semibold" : "hover:text-[#2E7D32]"
        }`}
      >
        <MessageSquare size={20} />
        <span className="mt-0.5">{t("navChat")}</span>
      </Link>
      <Link
        href="/voice"
        className={`flex flex-col items-center transition ${
          activeTab === "voice" ? "text-[#2E7D32] font-semibold" : "hover:text-[#2E7D32]"
        }`}
      >
        <Mic size={20} />
        <span className="mt-0.5">{t("navVoice")}</span>
      </Link>
      <Link
        href="/history"
        className={`flex flex-col items-center transition ${
          activeTab === "history" ? "text-[#2E7D32] font-semibold" : "hover:text-[#2E7D32]"
        }`}
      >
        <BookOpen size={20} />
        <span className="mt-0.5">{t("navHistory")}</span>
      </Link>
    </nav>
  );
}
