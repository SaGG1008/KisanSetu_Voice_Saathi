import { GnaniClient } from "./client";

export interface TTSOptions {
  text: string;
  language: string; // e.g. mr, hi, en
  model?: string;    // e.g. timbre-v3.0
  voiceId?: string;  // e.g. anand, meera, rajesh
}

export interface TTSResult {
  success: boolean;
  audioBuffer?: Buffer;
  audioBase64?: string;
  contentType?: string;
  error?: string;
  demoMode?: boolean;
}

export class TimbreService extends GnaniClient {
  /**
   * Synthesize text to speech using Gnani Timbre TTS API or Demo Mode.
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const apiKey = process.env.GNANI_API_KEY_ID;
    const isDemo = !apiKey || apiKey === "your_gnani_api_key_id_here";

    if (!options.text || typeof options.text !== "string") {
      return {
        success: false,
        error: "Text is required for speech synthesis.",
      };
    }

    const languageCodeMap: Record<string, string> = {
      mr: "mr-IN",
      hi: "hi-IN",
      en: "en-IN",
    };
    const langCode = languageCodeMap[options.language] || options.language || "mr-IN";

    // Demo mode response
    if (isDemo) {
      // Generate a small valid base64 WAV (silent 0.5s or tone) as placeholder audio buffer,
      // and flag demoMode so frontend can also utilize browser Web Speech Synthesis as fallback.
      const sampleWavBase64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      const buffer = Buffer.from(sampleWavBase64, "base64");
      return {
        success: true,
        audioBuffer: buffer,
        audioBase64: sampleWavBase64,
        contentType: "audio/wav",
        demoMode: true,
      };
    }

    try {
      const endpoint = `${this.getBaseUrl()}/api/v1/tts/inference`;
      const model = options.model || process.env.GNANI_TIMBRE_MODEL || "timbre-v3.0";

      const payload = {
        text: options.text,
        language_code: langCode,
        model: model,
        voice_id: options.voiceId || (langCode.startsWith("mr") ? "meera-mr" : langCode.startsWith("hi") ? "rajesh-hi" : "anand-en"),
        audio_format: "mp3",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.getTimeoutMs());

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...this.getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Timbre TTS API error (${response.status}): ${errorText}`,
        };
      }

      // Check content type (audio/mp3 or json with base64)
      const contentType = response.headers.get("content-type") || "audio/mp3";
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        success: true,
        audioBuffer: buffer,
        audioBase64: buffer.toString("base64"),
        contentType,
        demoMode: false,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        return { success: false, error: "Timbre TTS request timed out." };
      }
      return { success: false, error: error.message || "Failed to connect to Timbre TTS API." };
    }
  }

  // Backward compatibility alias for synthesizeInference
  async synthesizeInference(options: TTSOptions): Promise<TTSResult> {
    return this.synthesize(options);
  }

  async synthesizeSSE(options: TTSOptions): Promise<TTSResult> {
    return this.synthesize(options);
  }
}
