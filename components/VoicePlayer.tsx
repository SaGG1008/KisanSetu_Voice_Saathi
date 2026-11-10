"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, Play, Pause, Square, RotateCcw, Loader2 } from "lucide-react";

interface VoicePlayerProps {
  text: string;
  language: string; // mr, hi, en
}

export function VoicePlayer({ text, language }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoActive, setDemoActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayVoice = async () => {
    if (!text) return;

    // If already playing, pause
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
        return;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          setIsPlaying(false);
          setIsPaused(true);
          return;
        }
      }
    }

    // If paused, resume
    if (isPaused) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsPlaying(true);
          setIsPaused(false);
          return;
        }
      }
    }

    // Start new playback
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Fallback to browser SpeechSynthesis if API fails or demo mode
        throw new Error(data.message || data.error || "TTS API error");
      }

      if (data.demoMode || !data.audioBase64) {
        setDemoActive(true);
        playBrowserSpeech(text, language);
        return;
      }

      // Play audio from base64 buffer
      const audioSrc = `data:${data.contentType || "audio/mp3"};base64,${data.audioBase64}`;
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      audio.onerror = () => {
        // Fallback to browser speech if audio element playback fails
        playBrowserSpeech(text, language);
      };

      await audio.play();
    } catch (err: any) {
      console.warn("Timbre API TTS fallback to browser speech:", err.message);
      setDemoActive(true);
      playBrowserSpeech(text, language);
    } finally {
      setIsLoading(false);
    }
  };

  const playBrowserSpeech = (speechText: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Speech synthesis not supported in this browser.");
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(speechText);
    utteranceRef.current = utterance;

    const langMap: Record<string, string> = {
      mr: "mr-IN",
      hi: "hi-IN",
      en: "en-IN",
    };
    utterance.lang = langMap[lang] || "mr-IN";
    utterance.rate = 0.95; // Natural agricultural reading speed

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setError("Audio playback error.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-[#E8F5E9] text-xs">
      <button
        onClick={handlePlayVoice}
        disabled={isLoading}
        className="flex items-center space-x-1.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] px-2.5 py-1 rounded-full font-medium transition cursor-pointer"
        title="Listen to spoken response (Gnani Timbre TTS)"
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin text-[#2E7D32]" />
        ) : isPlaying ? (
          <Pause size={14} />
        ) : (
          <Volume2 size={14} />
        )}
        <span>
          {isLoading
            ? "Generating voice..."
            : isPlaying
            ? "Pause Audio"
            : isPaused
            ? "Resume"
            : "Listen (Timbre TTS)"}
        </span>
      </button>

      {(isPlaying || isPaused) && (
        <button
          onClick={handleStop}
          className="p-1 text-[#657367] hover:text-red-600 transition"
          title="Stop Audio"
        >
          <Square size={14} />
        </button>
      )}

      {demoActive && (
        <span className="text-[10px] text-[#F57F17] bg-[#FFF8E1] px-1.5 py-0.5 rounded font-medium">
          Timbre Demo
        </span>
      )}

      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
