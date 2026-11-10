import { NextResponse } from "next/server";
import { TimbreService } from "@/lib/ai/providers/gnani/timbre";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, language } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required for speech synthesis." }, { status: 400 });
    }

    const timbre = new TimbreService();
    const result = await timbre.synthesizeInference({
      text,
      language: language || "mr",
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.error,
        fallbackText: text,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
