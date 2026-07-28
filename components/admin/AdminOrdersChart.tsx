import React from "react";
import { SalesTrendPoint } from "./AdminRevenueChart";

export interface AdminOrdersChartProps {
  data: SalesTrendPoint[];
}

export const AdminOrdersChart: React.FC<AdminOrdersChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No order data available for selected period
      </div>
    );
  }

  const maxOrders = Math.max(...data.map((d) => d.ordersCount), 5);

  return (
    <div className="space-y-4">
      <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-100">
        {data.map((point, idx) => {
          const heightPercent = Math.max(5, Math.min(100, Math.round((point.ordersCount / maxOrders) * 100)));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap mb-1">
                {point.ordersCount} orders (₹{point.revenue.toLocaleString()})
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full max-w-[36px] bg-emerald-500 group-hover:bg-emerald-600 rounded-t-md transition-all duration-300 min-h-[4px]"
              />

              {/* Label */}
              <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
          <span>Order Volume (Count)</span>
        </div>
        <span>Peak: {maxOrders} Orders</span>
      </div>
    </div>
  );
};
