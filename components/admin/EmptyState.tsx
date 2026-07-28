import React from "react";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Available",
  description = "There are no records found for this view.",
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50 my-4 space-y-3">
      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
        {icon || <FolderOpen size={24} />}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
        <p className="text-xs text-stone-500 max-w-sm mt-0.5">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
