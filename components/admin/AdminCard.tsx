import React from "react";

export interface AdminCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  action,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {(title || description || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
