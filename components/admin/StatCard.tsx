import React from "react";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-[#B67B5C]/10",
  iconColor = "text-[#B67B5C]",
  isLoading = false,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between hover:border-[#B67B5C]/40 transition">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-stone-900">
          {isLoading ? (
            <span className="inline-block w-16 h-6 bg-stone-200 animate-pulse rounded" />
          ) : (
            value
          )}
        </p>
        {subtitle && <p className="text-[10px] text-stone-400 font-medium">{subtitle}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} />
      </div>
    </div>
  );
};
