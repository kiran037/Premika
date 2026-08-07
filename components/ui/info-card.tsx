import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string; size?: number }>;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  borderAccent?: boolean;
}

export default function InfoCard({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  borderAccent = false,
}: InfoCardProps) {
  return (
    <div
      id={id}
      className={`rounded-xl border border-primary/20 bg-card shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden scroll-mt-24 ${
        borderAccent ? "border-l-4 border-l-primary" : ""
      } ${className}`.trim()}
    >
      {(title || Icon || badge) && (
        <div
          className={`bg-popover/30 border-b border-primary/10 px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 ${headerClassName}`.trim()}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
      )}

      <div className={`p-5 sm:p-6 md:p-8 ${contentClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
}
