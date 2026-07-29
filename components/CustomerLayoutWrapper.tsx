"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import MainNavbar from "@/components/resize-navbar";
import type { StoreInformation } from "@/lib/store/get-store-information";

export default function CustomerLayoutWrapper({
  children,
  storeInfo,
}: {
  children: React.ReactNode;
  storeInfo?: StoreInformation;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        <ToastProvider />
        {children}
      </>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <div>
        <MainNavbar />
        <ModalProvider />
        <ToastProvider />
        {children}
      </div>
      <Footer storeInfo={storeInfo} />
    </div>
  );
}
