import React from "react";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Checkout",
    description:
      "Complete your purchase at Premika Store. Secure checkout with multiple payment options including UPI, cards, and net banking. Fast delivery across India.",
  };
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
