"use client";

import React from "react";
import { FinishOption } from "@/lib/types";

interface PlaquePreviewProps {
  text: string;
  fontFamily: string;
  finish: FinishOption;
  imageUrl?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function PlaquePreview({
  text,
  fontFamily,
  finish,
  imageUrl,
  className = "",
  style = {},
}: PlaquePreviewProps) {
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${finish.startColor}, ${finish.endColor})`,
    ...style,
  };

  return (
    <div
      className={`plaque ${className}`}
      style={backgroundStyle}
      aria-label={`Custom engraving preview with ${finish.name} finish`}
    >
      <div className="flex flex-col items-center justify-center w-full z-10 px-4">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Customer submitted reference engraving"
            className="w-[84px] h-[84px] object-cover rounded-full border-[3px] border-[rgba(50,24,5,0.5)] mb-2.5 filter sepia-[0.7] contrast-[0.9] shadow-sm"
          />
        ) : null}
        <span
          style={{ fontFamily }}
          className="text-center font-normal tracking-wide transition-all"
        >
          {text || "Your message here"}
        </span>
      </div>
    </div>
  );
}
