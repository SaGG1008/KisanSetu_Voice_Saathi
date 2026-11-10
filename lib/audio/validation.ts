export interface AudioValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAudioFile(file: { size: number; type: string }): AudioValidationResult {
  if (!file) {
    return { valid: false, error: "No audio file provided." };
  }

  if (file.size === 0) {
    return { valid: false, error: "Audio file is empty." };
  }

  // Max size: 10MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Audio file exceeds 10MB size limit." };
  }

  const validTypes = [
    "audio/webm",
    "audio/wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/flac",
    "audio/aac",
    "audio/m4a",
  ];

  if (file.type && !validTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: `Unsupported audio format: ${file.type}` };
  }

  return { valid: true };
}
