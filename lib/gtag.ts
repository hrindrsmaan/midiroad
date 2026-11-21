declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_TRACKING_ID = "G-9HYPTS5VTB";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (
    typeof window !== "undefined" && 
    window.gtag &&
    process.env.NODE_ENV === "production"
  ) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (
    typeof window !== "undefined" && 
    window.gtag &&
    process.env.NODE_ENV === "production"
  ) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export type PurchaseItem = { item_id: string; item_name: string; price: number; quantity: number };

/**
 * GA4 ecommerce purchase, so revenue shows in reports. gtag.js loads after the
 * page is interactive, so this waits briefly for it; GA dedupes on transaction_id.
 */
export const purchase = (data: {
  transaction_id: string;
  value: number;
  currency: string;
  items: PurchaseItem[];
}) => {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  let tries = 0;
  const send = () => {
    if (window.gtag) {
      window.gtag("event", "purchase", data);
    } else if (++tries < 25) {
      setTimeout(send, 200);
    }
  };
  send();
};
