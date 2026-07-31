import React from "react";
import Image from "next/image";
import { Carattere } from "next/font/google";
import { Sparkles, Heart } from "lucide-react";

const carattere = Carattere({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-carattere",
});

export const metadata = {
  title: "Under Maintenance | Premika - Premium Fashion Store",
  description:
    "We are currently performing scheduled maintenance to improve your shopping experience. Thank you for your patience.",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#B67B5C]/20 selection:text-[#B67B5C]">
      {/* Top Store Header Strip */}
      <header className="border-b border-[#B67B5C]/20 bg-background/95 backdrop-blur-xs py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="relative w-36 sm:w-44 h-10 sm:h-12 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Premika Logo"
              width={180}
              height={50}
              className="object-contain max-h-10 sm:max-h-12 w-auto"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Hero Section - Identical Styling to Premika Homepage Hero */}
      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center">
          {/* Small Luxury Branding Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#B67B5C]/10 text-primary rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-5 border border-[#B67B5C]/20">
            <Sparkles className="size-3 text-[#B67B5C]" />
            <span>Scheduled Maintenance</span>
          </div>

          {/* Handwritten Tagline */}
          <p
            className={`text-xl sm:text-3xl text-primary font-medium mb-3 sm:mb-4 ${carattere.className}`}
          >
            &quot;Prem se bana, Premika ke liye.&quot;
          </p>

          {/* Elegant Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.2] mb-3 sm:mb-4 font-serif">
            We&apos;ll be back soon.
          </h1>

          {/* One Short Supporting Sentence */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mb-8">
            We&apos;re making a few improvements to give you an even better shopping experience. Thank you for your patience.
          </p>

          {/* Delicate Decorative Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B67B5C]/50 to-transparent mb-8" />

          {/* Friendly Closing Note */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary">
            <span>See you again soon</span>
            <Heart className="size-3.5 fill-[#B67B5C] text-[#B67B5C]" />
          </div>
        </div>
      </main>

      {/* Footer Matching Premika Storefront Footer Style */}
      <footer className="bg-foreground text-background py-8 sm:py-10 border-t border-[#B67B5C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#E0BCA2] uppercase">
            Thank you for your patience.
          </p>
          <p className="text-[11px] text-[#E0BCA2]/80 font-normal">
            &copy; {new Date().getFullYear()} Premika Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
