import React from "react";

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#B67B5C] hover:bg-[#A06749] active:bg-[#8B5A3C] text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 focus:ring-[#B67B5C]/40",
    secondary:
      "bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 focus:ring-stone-900/40",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 focus:ring-rose-500/40",
    outline:
      "border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/80 active:bg-stone-100 text-stone-700 hover:text-stone-900 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 focus:ring-stone-400/30",
    ghost:
      "bg-transparent hover:bg-stone-100/80 active:bg-stone-200/60 text-stone-600 hover:text-stone-900 focus:ring-stone-300/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold rounded-2xl gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current fill-none shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default AdminButton;
