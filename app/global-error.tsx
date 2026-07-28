"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global System Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Application Error</h1>
            <p className="text-sm text-gray-500">
              A critical error occurred. Please refresh the page to restore full service.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <RefreshCw size={16} />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
