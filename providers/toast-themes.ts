import { ToasterProps } from "react-hot-toast";

/**
 * Storefront Toast Theme Options
 * Personality: Luxury, Fashion, Soft Organic Elegance
 * Surface: Warm Ivory Glass, Terracotta Borders, Rounded XL, Soft Ambient Shadows
 */
export const storeToastOptions: ToasterProps = {
  position: "bottom-right",
  gutter: 12,
  toastOptions: {
    duration: 4000,
    style: {
      background: "rgba(250, 249, 246, 0.96)",
      color: "#231F20",
      border: "1px solid rgba(182, 123, 92, 0.3)",
      borderRadius: "12px",
      boxShadow: "0 10px 30px -5px rgba(35, 31, 32, 0.08), 0 4px 12px -2px rgba(35, 31, 32, 0.04)",
      padding: "12px 18px",
      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "-0.01em",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    success: {
      duration: 4000,
      iconTheme: {
        primary: "#B67B5C",
        secondary: "#FAF9F6",
      },
      style: {
        background: "rgba(250, 249, 246, 0.98)",
        color: "#231F20",
        border: "1px solid rgba(182, 123, 92, 0.45)",
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: "#DC2626",
        secondary: "#FFF5F5",
      },
      style: {
        background: "rgba(254, 242, 242, 0.98)",
        color: "#991B1B",
        border: "1px solid rgba(220, 38, 38, 0.25)",
      },
    },
    loading: {
      iconTheme: {
        primary: "#B67B5C",
        secondary: "#FAF9F6",
      },
    },
  },
};

/**
 * Admin Dashboard Toast Theme Options
 * Personality: High-Contrast Enterprise SaaS Control Center
 * Surface: Slate-900 Dark Card, Crisp Slate Borders, Rounded LG, Mono Typography
 */
export const adminToastOptions: ToasterProps = {
  position: "top-right",
  gutter: 10,
  toastOptions: {
    duration: 3500,
    style: {
      background: "#0F172A",
      color: "#F8FAFC",
      border: "1px solid #334155",
      borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3), 0 8px 10px -6px rgba(15, 23, 42, 0.2)",
      padding: "10px 14px",
      fontSize: "13px",
      fontWeight: "500",
      letterSpacing: "0.01em",
    },
    success: {
      duration: 3500,
      iconTheme: {
        primary: "#10B981",
        secondary: "#0F172A",
      },
      style: {
        background: "#0F172A",
        color: "#F8FAFC",
        border: "1px solid rgba(16, 185, 129, 0.45)",
      },
    },
    error: {
      duration: 4500,
      iconTheme: {
        primary: "#EF4444",
        secondary: "#0F172A",
      },
      style: {
        background: "#0F172A",
        color: "#F8FAFC",
        border: "1px solid rgba(239, 68, 68, 0.45)",
      },
    },
    loading: {
      iconTheme: {
        primary: "#6366F1",
        secondary: "#0F172A",
      },
    },
  },
};
