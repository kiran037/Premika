import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Admin | Premika",
    template: "%s | Admin | Premika",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {children}
    </div>
  );
}