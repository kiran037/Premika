// Google Analytics utilities - Basic tracking only
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Basic interaction tracking - no product details
export const trackButtonClick = (buttonName: string) => {
  event({
    action: "click",
    category: "UI",
    label: buttonName,
  });
};

export const trackPageInteraction = (interactionType: string) => {
  event({
    action: interactionType,
    category: "Engagement",
    label: "user_interaction",
  });
};

// Contact form submission tracking
export const trackContactForm = () => {
  event({
    action: "contact_form_submit",
    category: "Lead",
    label: "contact_page",
  });
};

// Basic navigation tracking
export const trackNavigation = (destination: string) => {
  event({
    action: "navigate",
    category: "Navigation",
    label: destination,
  });
};
