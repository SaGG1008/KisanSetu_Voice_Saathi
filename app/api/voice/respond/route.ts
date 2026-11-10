import { NextResponse } from "next/server";
import { processQueryOrchestration } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript, language } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required." }, { status: 400 });
    }

    const lang = ["mr", "hi", "en"].includes(language) ? language : "mr";
    const result = await processQueryOrchestration(transcript, lang);

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
