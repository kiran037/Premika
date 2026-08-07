import React from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

interface InfoPageFooterProps {
  storeName?: string;
  lastUpdated?: string;
  message?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function InfoPageFooter({
  storeName = "Premika",
  lastUpdated,
  message = "We are committed to making your shopping experience exceptional. Don't hesitate to reach out if you have any questions.",
  ctaText,
  ctaHref,
  className = "",
}: InfoPageFooterProps) {
  const formattedDate =
    lastUpdated ||
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      className={`bg-popover/30 border border-primary/20 rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-xs ${className}`.trim()}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
        <Heart className="w-5 h-5 text-primary fill-primary/20" />
      </div>

      <div className="max-w-xl mx-auto space-y-2">
        <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
          {message}
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
          <span>Thank you for choosing</span>
          <span className="font-semibold text-primary">{storeName}</span>
        </p>
      </div>

      {ctaText && ctaHref && (
        <div className="pt-2">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-background bg-foreground rounded-md shadow-xs hover:bg-secondary transition-colors"
          >
            <span>{ctaText}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <p className="text-xs text-muted-foreground/70 pt-2 border-t border-primary/10 max-w-xs mx-auto">
        Last updated: {formattedDate}
      </p>
    </div>
  );
}
