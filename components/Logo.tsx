import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 36, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        {/* Background rounded badge */}
        <rect width="48" height="48" rx="12" fill="#2E7D32" />

        {/* Agricultural Leaf / Sprout symbol */}
        <path
          d="M24 10C17 10 14 17 14 22C14 29 20 36 24 38C28 36 34 29 34 22C34 17 31 10 24 10Z"
          fill="#4CAF50"
        />
        <path
          d="M24 14V34"
          fill="none"
          stroke="#1B5E20"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 20C21 19 18 21 17 23"
          fill="none"
          stroke="#C8E6C9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 26C27 25 30 27 31 29"
          fill="none"
          stroke="#C8E6C9"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Conversational / Voice Sound Wave Overlay */}
        <path
          d="M10 22C8 22 7 24 7 26V30C7 32 8 34 10 34"
          fill="none"
          stroke="#F57F17"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M38 22C40 22 41 24 41 26V30C41 32 40 34 38 34"
          fill="none"
          stroke="#F57F17"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-base leading-tight text-[#202820] tracking-tight">
            KisanSetu
          </span>
          <span className="text-[10px] font-medium text-[#2E7D32] tracking-wider uppercase">
            Voice Saathi
          </span>
        </div>
      )}
    </div>
  );
}
