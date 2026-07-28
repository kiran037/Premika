"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { AdminButton } from "@/components/admin";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Admin Error Encountered</h2>
          <p className="text-xs text-gray-500">
            An unexpected error occurred while rendering this administrative view.
          </p>
        </div>

        <AdminButton onClick={() => reset()} className="w-full flex items-center justify-center gap-2">
          <RefreshCw size={16} />
          <span>Retry Action</span>
        </AdminButton>
      </div>
    </div>
  );
}
