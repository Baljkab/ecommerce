"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
};

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src.trim() || imageFailed) {
    return (
      <div
        role="img"
        aria-label={`${alt}: зураг оруулаагүй байна`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(251,146,60,0.12),transparent_45%),linear-gradient(145deg,#f8fafc,#fff7ed)] text-slate-400"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          fill="none"
          className="h-12 w-12 text-orange-400/70"
        >
          <path
            d="m12 20 20-10 20 10v24L32 55 12 44V20Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="m12 20 20 11 20-11M32 31v24M22 15l20 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] font-semibold tracking-wide">
          Зураг оруулаагүй байна
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
      className="object-contain p-5 transition-transform duration-700 group-hover:scale-105 sm:p-6"
      onError={() => setImageFailed(true)}
    />
  );
}
