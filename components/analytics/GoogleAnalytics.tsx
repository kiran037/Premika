"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/analytics";

// Component that uses useSearchParams - needs to be wrapped in Suspense
const GoogleAnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url =
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
};

// Main component that wraps the tracker in Suspense
const GoogleAnalytics = () => {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker />
    </Suspense>
  );
};

export default GoogleAnalytics;
