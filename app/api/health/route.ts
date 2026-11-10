import { NextResponse } from "next/server";
import { PrismaService } from "@/lib/ai/providers/gnani/prisma";
import { TimbreService } from "@/lib/ai/providers/gnani/timbre";

export async function GET() {
  const hasApiKey = Boolean(process.env.GNANI_API_KEY_ID);
  const prisma = new PrismaService();
  const timbre = new TimbreService();

  return NextResponse.json({
    status: "online",
    timestamp: new Date().toISOString(),
    environmentVariables: {
      GNANI_API_KEY_ID: hasApiKey ? "configured" : "missing",
      GNANI_BASE_URL: process.env.GNANI_BASE_URL || "https://api.vachana.ai",
      GNANI_PRISMA_MODEL: process.env.GNANI_PRISMA_MODEL || "prisma-v3.0",
      GNANI_TIMBRE_MODEL: process.env.GNANI_TIMBRE_MODEL || "not-set",
    },
    integrations: {
      prismaStt: {
        endpoint: "https://api.vachana.ai/stt/v3",
        status: hasApiKey ? "ready" : "pending-credentials",
      },
      timbreTts: {
        inferenceEndpoint: "https://api.vachana.ai/api/v1/tts/inference",
        sseEndpoint: "https://api.vachana.ai/api/v1/tts/sse",
        status: hasApiKey ? "ready" : "pending-credentials",
      },
      reasoningEngine: {
        provider: "KisanSetu-Verified-Knowledge-Engine",
        status: "operational",
      }
    }
  });
}
