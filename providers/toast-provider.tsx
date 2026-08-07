"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { storeToastOptions, adminToastOptions } from "./toast-themes";

export const StoreToaster = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Toaster {...storeToastOptions} />;
};

export const AdminToaster = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Toaster {...adminToastOptions} />;
};

const ToastProvider = () => {
  return <StoreToaster />;
};

export default ToastProvider;
