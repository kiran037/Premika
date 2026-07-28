import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Successful - Premika",
  description:
    "Your order has been successfully placed. You will receive confirmation email shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
