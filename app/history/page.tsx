"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BottomNav } from "@/components/BottomNav";

export default function HistoryPage() {
  const { t } = useTranslation();
  const [savedHistory, setSavedHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("kisansetu_voice_history") || "[]");
      setSavedHistory(items);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDeleteItem = (index: number) => {
    const updated = savedHistory.filter((_, i) => i !== index);
    setSavedHistory(updated);
    try {
      localStorage.setItem("kisansetu_voice_history", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const staticItems = [
    {
      title: t("historyItem1Title"),
      date: t("historyItem1Date"),
      preview: t("historyItem1Preview"),
      mode: t("modeText")
    },
    {
      title: t("historyItem2Title"),
      date: t("historyItem2Date"),
      preview: t("historyItem2Preview"),
      mode: t("modeVoice")
    },
    {
      title: t("historyItem3Title"),
      date: t("historyItem3Date"),
      preview: t("historyItem3Preview"),
      mode: t("modeText")
    }
  ];

  const allItems = [...savedHistory, ...staticItems];

  return (
    <div className="flex flex-col h-full bg-[#F8FAF6] text-[#202820]">
      {/* Header */}
      <header className="bg-[#2E7D32] text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/" className="hover:bg-[#1B5E20] p-1.5 rounded-full transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-base leading-tight">{t("historyHeading")}</h1>
            <p className="text-xs text-[#E8F5E9]">{t("historySubHeading")}</p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* History List */}
      <main className="flex-1 p-4 overflow-y-auto space-y-3 pb-20">
        {allItems.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-2xs hover:border-[#2E7D32] transition flex justify-between items-start">
            <Link href={`/chat?q=${encodeURIComponent(item.transcript || item.preview)}`} className="flex-1 pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded font-medium">
                  {item.mode}
                </span>
                <span className="text-[11px] text-[#657367]">{item.date}</span>
              </div>
              <h3 className="font-bold text-sm text-[#202820] mt-1.5">{item.title}</h3>
              <p className="text-xs text-[#657367] mt-1 line-clamp-1">{item.preview}</p>
            </Link>
            {idx < savedHistory.length && (
              <button
                onClick={() => handleDeleteItem(idx)}
                className="text-[#657367] hover:text-red-600 p-1.5 transition cursor-pointer"
                title={t("deleteTooltip")}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="history" />
    </div>
  );
}
