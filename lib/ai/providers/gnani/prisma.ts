import { GnaniClient } from "./client";

export interface TranscribeOptions {
  audioBlob: Blob | Uint8Array;
  languageCode?: string; // e.g. hi-IN, mr-IN, en-IN
  model?: string;        // e.g. prisma-v3.0
  format?: string;       // transcribe, verbatim, codemix
}

export interface TranscribeResult {
  success: boolean;
  transcript?: string;
  detectedLanguageCode?: string;
  error?: string;
  demoMode?: boolean;
}

export class PrismaService extends GnaniClient {
  async transcribe(options: TranscribeOptions): Promise<TranscribeResult> {
    const apiKey = process.env.GNANI_API_KEY_ID;

    // If API key is missing or placeholder, provide clear DEMO MODE response as requested by specs
    if (!apiKey || apiKey === "your_gnani_api_key_id_here") {
      const langHint = options.languageCode || "hi-IN";
      let sampleText = "What remedy should be taken for yellow mosaic disease on soybean crop?";
      if (langHint.startsWith("mr")) {
        sampleText = "टोमॅटो पिकावर पांढरी माशीचा प्रादुर्भाव झाला आहे, काय उपाय करावा?";
      } else if (langHint.startsWith("hi")) {
        sampleText = "टमाटर की फसल पर सफेद मक्खी का प्रकोप हुआ है, क्या उपाय करना चाहिए?";
      }

      return {
        success: true,
        transcript: sampleText,
        detectedLanguageCode: langHint,
        demoMode: true,
      };
    }

    try {
      const endpoint = `${this.getBaseUrl()}/stt/v3`;
      const model = options.model || process.env.GNANI_PRISMA_MODEL || "prisma-v3.0";
      const languageCode = options.languageCode || "hi-IN";

      const formData = new FormData();
      if (options.audioBlob instanceof Blob) {
        formData.append("audio_file", options.audioBlob, "recording.webm");
      } else {
        const blob = new Blob([options.audioBlob as any], { type: "audio/webm" });
        formData.append("audio_file", blob, "recording.webm");
      }
      formData.append("model", model);
      formData.append("language_code", languageCode);
      formData.append("format", "transcribe");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.getTimeoutMs());

      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Prisma STT API error (${response.status}): ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        transcript: data.transcript || data.text || "",
        detectedLanguageCode: data.detected_language_code || languageCode,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        return { success: false, error: "Prisma STT request timed out." };
      }
      return { success: false, error: error.message || "Failed to connect to Prisma STT API." };
    }
  }
}
