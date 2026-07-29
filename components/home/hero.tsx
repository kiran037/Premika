"use client";

import Image from "next/image";
import Link from "next/link";
import { Carattere } from "next/font/google";

const carattere = Carattere({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-carattere",
});

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background border-b border-[#B67B5C]/25 py-8 sm:py-12 lg:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* 1. Small Luxury Branding Label */}
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-primary/80 uppercase mb-2.5 sm:mb-3">
          PREMIUM ETHNIC WEAR
        </span>

        {/* 2. Premika Logo */}
        <div className="mb-2.5">
          <Image
            src="/text-logo.png"
            alt="Premika Logo"
            width={200}
            height={64}
            className="mx-auto max-h-14 sm:max-h-20 w-auto"
            priority
          />
        </div>

        {/* 3. Handwritten Tagline */}
        <p
          className={`text-lg sm:text-2xl text-primary font-medium mb-3 sm:mb-4 ${carattere.className}`}
        >
          &quot;Prem se bana, Premika ke liye.&quot;
        </p>

        {/* 4. Elegant Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-[1.2] mb-2 sm:mb-3">
          Elegant Ethnic Wear for Every Occasion
        </h1>

        {/* 5. One Short Supporting Sentence */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
          Thoughtfully crafted styles designed for timeless elegance.
        </p>

        {/* 6. Single Primary CTA Button */}
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-bold text-background bg-foreground rounded-md shadow-xs hover:bg-secondary transition-colors duration-200"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
