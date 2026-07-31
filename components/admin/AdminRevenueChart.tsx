"use client";

import React, { useState } from "react";

export interface SalesTrendPoint {
  label: string;
  revenue: number;
  ordersCount: number;
}

export interface AdminRevenueChartProps {
  data: SalesTrendPoint[];
}

export const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-stone-400 text-xs bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
        <p className="font-semibold">No revenue data available</p>
        <p className="text-[11px] text-stone-400 mt-0.5">Select a different date range</p>
      </div>
    );
  }

  const rawMax = Math.max(...data.map((d) => d.revenue));
  const maxRevenue = rawMax > 0 ? Math.ceil(rawMax * 1.1) : 10000;
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  // Generate 4 Y-axis grid ticks
  const yTicks = [1, 0.75, 0.5, 0.25, 0];

  const formatYValue = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  // Determine container width for horizontal scrolling when data length is large
  const isScrollable = data.length > 14;

  return (
    <div className="space-y-4">
      {/* Top Legend & Metrics Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-md shadow-xs" />
          <span className="font-semibold text-stone-700">Revenue (INR)</span>
        </div>
        <div className="flex items-center gap-4 text-stone-500 font-medium text-[11px]">
          <span>Total: <strong className="text-indigo-600">₹{totalRevenue.toLocaleString("en-IN")}</strong></span>
          <span>Peak: <strong className="text-stone-800">₹{rawMax.toLocaleString("en-IN")}</strong></span>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="relative bg-stone-50/40 border border-stone-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex h-72 gap-3">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[10px] font-mono font-medium text-stone-400 select-none pb-7 shrink-0 pr-1 border-r border-stone-200/60">
            {yTicks.map((tickRatio, i) => (
              <span key={i} className="text-right">
                {formatYValue(Math.round(maxRevenue * tickRatio))}
              </span>
            ))}
          </div>

          {/* Horizontal Gridlines & Bar Container Area */}
          <div className="relative flex-1 h-full overflow-x-auto scrollbar-thin scrollbar-thumb-stone-300">
            {/* Background Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-7 pointer-events-none">
              {yTicks.map((_, i) => (
                <div
                  key={i}
                  className={`w-full border-b ${
                    i === yTicks.length - 1
                      ? "border-stone-300"
                      : "border-stone-200/70 border-dashed"
                  }`}
                />
              ))}
            </div>

            {/* Bars Flex Container */}
            <div
              className={`relative h-full flex items-end justify-between gap-1.5 sm:gap-2 pb-7 ${
                isScrollable ? "min-w-[640px]" : "w-full"
              }`}
            >
              {data.map((point, idx) => {
                const heightPercent = Math.max(
                  4,
                  Math.min(100, Math.round((point.revenue / maxRevenue) * 100))
                );

                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="relative flex-1 flex flex-col items-center group h-full justify-end"
                  >
                    {/* Floating Tooltip Above Bar */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-3 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="bg-stone-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap space-y-0.5 border border-stone-800">
                          <p className="font-semibold text-stone-300 border-b border-stone-800 pb-0.5 mb-1 text-[10px]">
                            {point.label}
                          </p>
                          <p className="font-bold text-indigo-300">
                            ₹{point.revenue.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-stone-400 font-medium">
                            {point.ordersCount} {point.ordersCount === 1 ? "order" : "orders"}
                          </p>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mt-1" />
                      </div>
                    )}

                    {/* Interactive Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] min-h-[4px] rounded-t-lg transition-all duration-200 cursor-pointer ${
                        isHovered
                          ? "bg-gradient-to-t from-indigo-700 via-indigo-600 to-indigo-500 shadow-md scale-y-[1.02] origin-bottom"
                          : "bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-90 group-hover:opacity-100"
                      }`}
                    />

                    {/* X-Axis Label */}
                    <div className="absolute top-full pt-1.5 w-full text-center">
                      <span className="text-[10px] text-stone-500 font-semibold truncate block transition-colors group-hover:text-stone-900">
                        {point.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueChart;
