import React from "react";

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            error ? "border-red-300 bg-red-50 focus:ring-red-500" : "border-gray-300 bg-white"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";
