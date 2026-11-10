import { mr } from "./translations/mr";
import { hi } from "./translations/hi";
import { en } from "./translations/en";

export type Language = "mr" | "hi" | "en";

export const translations: Record<Language, Record<string, string>> = {
  mr,
  hi,
  en,
};

export function getTranslation(lang: Language, key: string): string {
  const dict = translations[lang] || translations.mr;
  return dict[key] || translations.en[key] || key;
}
