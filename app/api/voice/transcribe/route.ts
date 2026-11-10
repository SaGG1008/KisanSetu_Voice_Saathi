import { NextResponse } from "next/server";
import { PrismaService } from "@/lib/ai/providers/gnani/prisma";
import { validateAudioFile } from "@/lib/audio/validation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const languageCode = (formData.get("languageCode") as string) || "mr-IN";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    const validation = validateAudioFile({ size: audioFile.size, type: audioFile.type });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const prisma = new PrismaService();
    const result = await prisma.transcribe({
      audioBlob: audioFile as any,
      languageCode,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
