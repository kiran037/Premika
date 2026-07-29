"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HomeProductSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  children: React.ReactNode;
}

export default function HomeProductSection({
  title,
  subtitle,
  viewAllLink,
  viewAllText = "View All",
  children,
}: HomeProductSectionProps) {
  return (
    <section className="py-10 sm:py-16 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors group w-fit"
            >
              <span>{viewAllText}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </section>
  );
}
