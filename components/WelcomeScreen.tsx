"use client";

import React, { useState, useEffect } from "react";
import { Mic, Globe, Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Logo } from "@/components/Logo";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t, language, setLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#F8FAF6] text-[#202820] p-6 overflow-y-auto">
      {/* Top Bar with Language Selector */}
      <div className="w-full max-w-md flex justify-between items-center py-4">
        <div className="flex items-center space-x-1.5 text-xs text-[#2E7D32] font-semibold bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
          <Sparkles size={14} className="text-[#F57F17]" />
          <span>AI-Powered Agriculture</span>
        </div>
        <LanguageSelector />
      </div>

      {/* Center Hero / Logo Area with Animated Entrance */}
      <div
        className={`w-full max-w-md my-auto flex flex-col items-center text-center space-y-6 transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        {/* Large Logo with Pulse Animation */}
        <div className="relative flex items-center justify-center p-6 bg-white rounded-3xl shadow-md border border-[#E0E0E0] group">
          <div className="absolute inset-0 rounded-3xl bg-[#E8F5E9] opacity-40 animate-pulse"></div>
          <div className="relative transform transition group-hover:scale-105 duration-300">
            <Logo size={72} showText={false} />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#1B5E20] tracking-tight">
            Welcome to KisanSetu
          </h1>
          <p className="text-sm font-semibold text-[#2E7D32]">
            किसानसेतु वॉइस साथी • किसानसेतु व्हॉइस साथी
          </p>
          <p className="text-sm text-[#657367] max-w-xs mx-auto pt-1 leading-relaxed">
            Your intelligent multilingual farming companion for voice advice, crop protection, weather alerts, and government schemes.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-2xs flex flex-col items-center text-center">
            <span className="text-xl mb-1">🎙️</span>
            <span className="text-[11px] font-semibold text-[#202820]">Voice & Text</span>
            <span className="text-[9px] text-[#657367]">Push to talk</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-2xs flex flex-col items-center text-center">
            <span className="text-xl mb-1">🌾</span>
            <span className="text-[11px] font-semibold text-[#202820]">ICAR Verified</span>
            <span className="text-[9px] text-[#657367]">Trusted facts</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-2xs flex flex-col items-center text-center">
            <span className="text-xl mb-1">🔊</span>
            <span className="text-[11px] font-semibold text-[#202820]">Timbre TTS</span>
            <span className="text-[9px] text-[#657367]">Natural audio</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-md py-6 flex flex-col space-y-3">
        <button
          onClick={onGetStarted}
          className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer text-base"
        >
          <span>Get Started • शुरू करें • सुरू करा</span>
          <ArrowRight size={20} />
        </button>

        <p className="text-[11px] text-center text-[#657367]">
          By continuing, you agree to agricultural guidance terms. Powered by Gnani AI & ICAR data.
        </p>
      </div>
    </div>
  );
}
