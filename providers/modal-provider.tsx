"use client";

import { SizeChartModal } from "@/components/product/size-chart-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SizeChartModal />
    </>
  );
};

export default ModalProvider;
