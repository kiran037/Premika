import React from "react";

export interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: "gray" | "indigo" | "green" | "amber" | "red" | "blue";
  size?: "sm" | "md";
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = "gray",
  size = "md",
}) => {
  const variants = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} capitalize`}>
      {children}
    </span>
  );
};

export interface AdminStatusBadgeProps {
  status: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status }) => {
  const lower = status.toLowerCase();

  let variant: AdminBadgeProps["variant"] = "gray";
  if (["active", "paid", "confirmed", "delivered", "published"].includes(lower)) {
    variant = "green";
  } else if (["pending", "processing", "low_stock", "draft"].includes(lower)) {
    variant = "amber";
  } else if (["cancelled", "failed", "out_of_stock", "archived"].includes(lower)) {
    variant = "red";
  } else if (["shipped", "in_transit"].includes(lower)) {
    variant = "blue";
  }

  return <AdminBadge variant={variant}>{status.replace(/_/g, " ")}</AdminBadge>;
};
