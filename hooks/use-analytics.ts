import { useEffect } from "react";
import * as analytics from "@/lib/analytics";

export const useAnalytics = () => {
  return {
    // Basic interaction tracking
    trackButtonClick: analytics.trackButtonClick,
    trackPageInteraction: analytics.trackPageInteraction,
    trackContactForm: analytics.trackContactForm,
    trackNavigation: analytics.trackNavigation,

    // Generic event tracking
    trackEvent: analytics.event,
  };
};

// Hook for automatic page view tracking
export const usePageView = (pageName?: string) => {
  const { trackPageInteraction } = useAnalytics();

  useEffect(() => {
    if (pageName) {
      trackPageInteraction("page_view");
    }
  }, [pageName, trackPageInteraction]);
};
