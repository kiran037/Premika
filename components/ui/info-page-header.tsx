import React from "react";
import Container from "@/components/ui/container";
import { LucideIcon } from "lucide-react";

interface InfoPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  className?: string;
}

export default function InfoPageHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  className = "",
}: InfoPageHeaderProps) {
  return (
    <div className={`bg-popover/30 border-b border-primary/20 py-8 sm:py-10 md:py-12 ${className}`.trim()}>
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-primary/20 text-xs font-semibold text-primary mb-3">
              <span>{badge}</span>
            </div>
          )}

          {Icon && (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
