"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Square, RefreshCw, Check, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BottomNav } from "@/components/BottomNav";
import { VoicePlayer } from "@/components/VoicePlayer";

export default function VoicePage() {
  const { t, language } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoModeNotice, setDemoModeNotice] = useState(false);
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState<any>(null);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize transcript default when language changes if not actively recording
  useEffect(() => {
    setTranscript(t("sampleTranscript"));
    setAssistantAnswer(null);
    setSourceInfo(null);
  }, [language, t]);

  const handleGetVoiceResponse = async () => {
    if (!transcript.trim()) return;
    setIsGeneratingAnswer(true);
    setErrorMsg(null);
    setAssistantAnswer(null);
    setSourceInfo(null);

    try {
      const res = await fetch("/api/voice/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate response.");
      }
      setAssistantAnswer(data.answer);
      setSourceInfo(data.source);

      // Save to conversation history in localStorage
      const historyItem = {
        title: transcript.slice(0, 40) + "...",
        date: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        preview: data.answer.slice(0, 80) + "...",
        mode: language === "mr" ? "आवाज (Voice)" : language === "hi" ? "आवाज़ (Voice)" : "Voice",
        transcript,
        answer: data.answer,
        language,
        timestamp: Date.now()
      };
      try {
        const existing = JSON.parse(localStorage.getItem("kisansetu_voice_history") || "[]");
        localStorage.setItem("kisansetu_voice_history", JSON.stringify([historyItem, ...existing]));
      } catch (e) {
        // ignore storage errors
      }
    } catch (err: any) {
      console.error("Voice response error:", err);
      setErrorMsg(err.message || "Failed to generate agricultural response.");
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setDemoModeNotice(false);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await submitAudioForTranscription(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimerSeconds(0);

      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMsg("Microphone permission denied or unavailable. Using demo transcription.");
      // Fallback to demo mode transcription if mic is unavailable
      setIsLoading(true);
      setTimeout(() => {
        setTranscript(t("sampleTranscript"));
        setIsLoading(false);
        setDemoModeNotice(true);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const submitAudioForTranscription = async (blob: Blob) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const langCodeMap: Record<string, string> = {
        mr: "mr-IN",
        hi: "hi-IN",
        en: "en-IN",
      };
      formData.append("languageCode", langCodeMap[language] || "mr-IN");

      const res = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Transcription failed.");
      }

      if (data.transcript) {
        setTranscript(data.transcript);
      }
      if (data.demoMode) {
        setDemoModeNotice(true);
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      setErrorMsg(err.message || "Network error during transcription.");
      setDemoModeNotice(true);
      setTranscript(t("sampleTranscript"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remSecs).padStart(2, "0")} / 00:30`;
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
            <h1 className="font-bold text-base leading-tight">{t("voiceHeading")}</h1>
            <p className="text-xs text-[#E8F5E9]">{t("voiceSubHeading")}</p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* Voice Assistant Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center space-y-6 pb-20 text-center">
        <div className="space-y-1">
          <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">
            {isRecording ? "🎙️ Recording..." : isLoading ? "⏳ Transcribing..." : t("listeningStatus")}
          </span>
          <p className="text-sm text-[#657367] mt-2">
            {isRecording ? "Speak clearly into your microphone..." : t("listeningInstructions")}
          </p>
        </div>

        {/* Pulsing Mic Visual / Control Button */}
        <div className="relative flex items-center justify-center my-4">
          {isRecording && (
            <>
              <div className="absolute w-40 h-40 bg-[#C8E6C9] rounded-full opacity-40 animate-ping"></div>
              <div className="absolute w-28 h-28 bg-[#A5D6A7] rounded-full opacity-60 animate-pulse"></div>
            </>
          )}
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="relative w-20 h-20 bg-[#2E7D32] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1B5E20] transition cursor-pointer"
              title="Start Recording"
            >
              {isLoading ? <Loader2 size={32} className="animate-spin" /> : <Mic size={32} />}
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="relative w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition cursor-pointer"
              title="Stop Recording"
            >
              <Square size={28} />
            </button>
          )}
        </div>

        {/* Waveform Simulation */}
        <div className="flex items-center space-x-1 h-8">
          {[12, 24, 18, 32, 28, 16, 22, 30, 20, 14, 26, 20].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-200 ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-[#2E7D32]"
              }`}
              style={{ height: `${isRecording ? h * 1.3 : h}px`, animationDelay: `${i * 100}ms` }}
            ></div>
          ))}
        </div>

        <p className="text-xs text-[#657367] font-mono">{formatTime(timerSeconds)}</p>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs w-full text-left">
            ⚠️ {errorMsg}
          </div>
        )}

        {demoModeNotice && (
          <div className="bg-[#FFF8E1] border border-[#FFE082] text-[#F57F17] px-3 py-1.5 rounded-lg text-[11px] w-full text-left font-medium">
            💡 <strong>DEMO MODE:</strong> Showing standard agricultural sample transcript (Configure GNANI_API_KEY_ID in .env.local for live Prisma STT).
          </div>
        )}

        {/* Transcript Preview Card */}
        <div className="w-full bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-xs text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#1B5E20]">{t("transcriptPreviewTitle")}</span>
            <span className="text-[10px] bg-[#FFF8E1] text-[#F57F17] px-2 py-0.5 rounded font-medium">{t("reviewCorrectBadge")}</span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-[#F8FAF6] border border-[#E0E0E0] rounded-lg p-2 text-sm text-[#202820] focus:outline-none focus:border-[#2E7D32]"
            rows={2}
          />
          <div className="flex space-x-2 pt-1">
            <button
              onClick={handleGetVoiceResponse}
              disabled={isGeneratingAnswer}
              className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-2 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              {isGeneratingAnswer ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              <span>{isGeneratingAnswer ? "Generating Answer..." : "Generate Voice Answer & Listen"}</span>
            </button>
            <Link
              href={`/chat?q=${encodeURIComponent(transcript)}`}
              className="bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1 text-center"
              title="Open in Full Chat"
            >
              <span>Open in Chat</span>
            </Link>
            <button
              onClick={() => {
                setTranscript(t("sampleTranscript"));
                setAssistantAnswer(null);
                setSourceInfo(null);
                setDemoModeNotice(false);
                setErrorMsg(null);
              }}
              className="bg-[#E0E0E0] hover:bg-[#D0D0D0] text-[#202820] px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
              title="Reset"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {assistantAnswer && (
            <div className="mt-3 p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wide">🌾 KisanSetu Voice Assistant Answer</span>
                {sourceInfo && (
                  <span className="text-[10px] text-[#657367]">📚 {sourceInfo.title}</span>
                )}
              </div>
              <p className="text-xs text-[#202820] whitespace-pre-line leading-relaxed">{assistantAnswer}</p>
              <div className="pt-2 border-t border-[#C8E6C9]">
                <p className="text-[10px] font-semibold text-[#1B5E20] mb-1">🔊 Gnani Timbre Spoken Audio Response:</p>
                <VoicePlayer text={assistantAnswer} language={language} />
              </div>
            </div>
          )}

          {!assistantAnswer && (
            <div className="mt-3 pt-3 border-t border-[#E0E0E0]">
              <p className="text-[11px] font-semibold text-[#1B5E20] mb-1">🔊 Gnani Timbre Spoken Response Preview:</p>
              <VoicePlayer text={transcript || t("sampleTranscript")} language={language} />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="voice" />
    </div>
  );
}
