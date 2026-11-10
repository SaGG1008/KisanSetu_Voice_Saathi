import { NextResponse } from "next/server";
import { processQueryOrchestration } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const lang = ["mr", "hi", "en"].includes(language) ? language : "mr";
    const result = await processQueryOrchestration(message, lang);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      source: result.source,
      provider: result.provider,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
