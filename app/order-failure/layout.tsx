import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed - Premika",
  description:
    "Your payment could not be processed. Please try again or contact support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderFailureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
