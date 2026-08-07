"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminMediaGalleryProps {
  images?: Array<string | { id?: string; image: string }>;
  alt?: string;
  className?: string;
}

export function AdminMediaGallery({
  images = [],
  alt = "Product image",
  className = "",
}: AdminMediaGalleryProps) {
  // Extract string array of URLs safely
  const imageUrls = images
    .map((img) => (typeof img === "string" ? img : img?.image))
    .filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync index if images list updates
  useEffect(() => {
    if (currentIndex >= imageUrls.length) {
      setCurrentIndex(0);
    }
  }, [imageUrls.length, currentIndex]);

  const activeImage = imageUrls[currentIndex] || "/placeholder.svg";

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrls.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrls.length <= 1) return;
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`sticky top-24 space-y-3 ${className}`.trim()}>
      {/* Main Image Container */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-xs group">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />

        {/* Counter Badge */}
        {imageUrls.length > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wider shadow-xs select-none">
            {currentIndex + 1} / {imageUrls.length}
          </div>
        )}

        {/* Previous / Next Overlay Navigation */}
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm flex items-center justify-center backdrop-blur-xs opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm flex items-center justify-center backdrop-blur-xs opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Portrait Thumbnails Row */}
      {imageUrls.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {imageUrls.map((url, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Select thumbnail ${idx + 1}`}
                className={`relative w-16 h-20 sm:w-18 sm:h-24 aspect-[3/4] rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#B67B5C] ring-2 ring-[#B67B5C]/30 shadow-xs scale-102 opacity-100"
                    : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-300"
                }`}
              >
                <Image
                  src={url}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminMediaGallery;
