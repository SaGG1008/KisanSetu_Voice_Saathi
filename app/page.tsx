"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mic, MessageSquare, HelpCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BottomNav } from "@/components/BottomNav";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Logo } from "@/components/Logo";

export default function Home() {
  const { t } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem("kisansetu_onboarded");
      if (!onboarded) {
        setShowWelcome(true);
      }
    } catch (e) {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    try {
      localStorage.setItem("kisansetu_onboarded", "true");
    } catch (e) {
      // ignore
    }
    setShowWelcome(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAF6] text-[#202820]">
      {isLoaded && showWelcome && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}

      {/* Header */}
      <header className="bg-[#2E7D32] text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded-xl shadow-xs">
            <Logo size={28} showText={false} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white">{t("appName")}</h1>
            <p className="text-[11px] text-[#E8F5E9]">{t("appSubtitle")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWelcome(true)}
            className="p-1.5 bg-[#1B5E20] hover:bg-[#236b28] text-white rounded-full transition cursor-pointer"
            title="Show Welcome Guide"
          >
            <HelpCircle size={18} />
          </button>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4 pb-20">
        {/* Greeting Banner */}
        <div className="bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] p-4 rounded-xl border border-[#C8E6C9] shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">👨‍🌾</span>
            <div>
              <h2 className="font-bold text-[#1B5E20] text-base">{t("homeGreeting")}</h2>
              <p className="text-sm text-[#657367] mt-1">
                {t("homeGreetingDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Voice Assistant CTA */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0E0E0] shadow-sm text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] relative shadow-inner animate-pulse">
            <Mic size={36} />
          </div>
          <h3 className="font-bold text-lg text-[#202820]">{t("voiceCtaTitle")}</h3>
          <p className="text-xs text-[#657367] max-w-xs">
            {t("voiceCtaDesc")}
          </p>
          <Link
            href="/voice"
            className="mt-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium px-6 py-2.5 rounded-full shadow transition flex items-center space-x-2"
          >
            <Mic size={18} />
            <span>{t("voiceCtaButton")}</span>
          </Link>
        </div>

        {/* Quick Shortcuts */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#657367] mb-2">
            {t("quickShortcutsTitle")}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: t("shortcutCrop"), icon: "🌱", q: t("shortcutCropQ") },
              { title: t("shortcutWeather"), icon: "🌤️", q: t("shortcutWeatherQ") },
              { title: t("shortcutFertilizer"), icon: "🧪", q: t("shortcutFertilizerQ") },
              { title: t("shortcutSchemes"), icon: "📋", q: t("shortcutSchemesQ") },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={`/chat?q=${encodeURIComponent(item.q)}`}
                className="bg-white p-3 rounded-xl border border-[#E0E0E0] hover:border-[#2E7D32] transition flex items-center space-x-2.5 text-left shadow-2xs"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-[#202820] leading-tight">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Text Chat Entry Card */}
        <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#FFF8E1] text-[#F57F17] p-2 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#202820]">{t("textChatCardTitle")}</h5>
              <p className="text-xs text-[#657367]">{t("textChatCardDesc")}</p>
            </div>
          </div>
          <Link
            href="/chat"
            className="text-xs bg-[#F57F17] hover:bg-[#E65100] text-white px-3 py-1.5 rounded-lg font-medium transition"
          >
            {t("textChatOpen")}
          </Link>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="home" />
    </div>
  );
}
