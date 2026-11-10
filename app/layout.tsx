import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { HtmlLangUpdater } from "@/components/HtmlLangUpdater";

export const metadata: Metadata = {
  title: "KisanSetu Voice Saathi",
  description: "Multilingual Agricultural Voice and Chat Assistant for Farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAF6] text-[#202820] antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <HtmlLangUpdater>
            <div className="max-w-md mx-auto w-full flex-1 flex flex-col bg-white shadow-md relative overflow-hidden">
              {children}
            </div>
          </HtmlLangUpdater>
        </LanguageProvider>
      </body>
    </html>
  );
}
