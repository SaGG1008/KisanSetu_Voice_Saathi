"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Send, Mic, Loader2, BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BottomNav } from "@/components/BottomNav";
import { VoicePlayer } from "@/components/VoicePlayer";

interface Message {
  sender: "user" | "assistant";
  text: string;
  source?: { title: string; publisher: string; verified: boolean };
}

function ChatContent() {
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: `${t("assistantWelcomeMsg")}\n\n📌 Note: This information is for guidance. Consult agricultural officers as needed.`,
      source: { title: "KisanSetu Assistant Welcome", publisher: "KisanSetu", verified: true }
    },
    {
      sender: "user",
      text: t("sampleUserQ"),
    },
    {
      sender: "assistant",
      text: `${t("tomatoControlTitle")}\n• ${t("historyItem1Preview")}\n• ${t("tomatoTip2")}\n• ${t("tomatoTip3")}`,
      source: { title: "ICAR-National Centre for Integrated Pest Management", publisher: "ICAR", verified: true }
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasHandledQuery = useRef(false);

  // Handle URL query parameter q if present
  useEffect(() => {
    if (initialQuery && !hasHandledQuery.current) {
      hasHandledQuery.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const newMsg: Message = { sender: "user", text: query };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response.");
      }

      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: data.answer,
          source: data.source,
        }
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: "⚠️ Sorry, we encountered a temporary connection issue. Please check your network or try again.",
          source: { title: "System Error Fallback", publisher: "KisanSetu", verified: false }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAF6] text-[#202820]">
      {/* Header */}
      <header className="bg-[#2E7D32] text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/" className="hover:bg-[#1B5E20] p-1.5 rounded-full transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-base leading-tight">{t("chatHeading")}</h1>
            <p className="text-xs text-[#E8F5E9]">{t("chatSubHeading")}</p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* Messages Area */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4 pb-24">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "assistant" && (
              <div className="bg-[#2E7D32] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                🌾
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl shadow-xs max-w-[85%] text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-[#E8F5E9] text-[#202820] rounded-tr-none border border-[#C8E6C9]"
                  : "bg-white text-[#202820] rounded-tl-none border border-[#E0E0E0]"
              }`}
            >
              {msg.sender === "assistant" && (
                <p className="font-medium text-[#1B5E20] mb-1 text-xs uppercase tracking-wide">
                  {t("assistantWelcomeTitle")}
                </p>
              )}
              <p className="leading-relaxed">{msg.text}</p>

              {msg.source && (
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[11px] text-[#657367] flex flex-col space-y-1">
                  <span className="flex items-center space-x-1 font-medium text-[#2E7D32]">
                    <BookOpen size={12} />
                    <span>📚 Source: {msg.source.title} ({msg.source.publisher})</span>
                  </span>
                </div>
              )}

              {msg.sender === "assistant" && (
                <VoicePlayer text={msg.text} language={language} />
              )}
            </div>
            {msg.sender === "user" && (
              <div className="bg-[#1B5E20] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                👨‍🌾
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="bg-[#2E7D32] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">
              🌾
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-[#E0E0E0] shadow-xs text-sm flex items-center space-x-2 text-[#657367]">
              <Loader2 size={16} className="animate-spin text-[#2E7D32]" />
              <span>Consulting ICAR / KVK knowledge base...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <div className="absolute bottom-14 left-0 right-0 bg-white border-t border-[#E0E0E0] p-3 flex items-center space-x-2 shadow-md">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={t("inputPlaceholder")}
          className="flex-1 bg-[#F8FAF6] border border-[#E0E0E0] rounded-full px-4 py-2.5 text-sm text-[#202820] focus:outline-none focus:border-[#2E7D32]"
        />
        <Link
          href="/voice"
          className="bg-[#E8F5E9] text-[#2E7D32] p-2.5 rounded-full hover:opacity-80 transition flex items-center justify-center"
          title={t("voiceInputTitle")}
        >
          <Mic size={20} />
        </Link>
        <button
          onClick={() => handleSendMessage()}
          className="bg-[#2E7D32] text-white p-2.5 rounded-full hover:bg-[#1B5E20] transition flex items-center justify-center cursor-pointer"
          title={t("sendButton")}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="chat" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-[#657367]">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
