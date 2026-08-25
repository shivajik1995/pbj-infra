// Privacy-conscious analytics wrapper.
//
// - No-ops entirely if PUBLIC_GA_MEASUREMENT_ID is unset (dev/preview
//   environments never send data anywhere).
// - Gated behind a simple localStorage consent flag (`pbj_consent`) that a
//   cookie-consent banner would set — until then, events are dispatched as
//   DOM CustomEvents only (visible in devtools, useful for QA) and never
//   forwarded to gtag. Wire your consent banner to
//   `localStorage.setItem('pbj_consent', 'granted')` and call
//   `initAnalytics()` again (or just reload) once consent is granted.
// - Named events match docs/seo-architecture.md's "Analytics" section:
//   view_service, view_project, click_start_project, click_whatsapp,
//   form_start, form_submit, form_abandon, click_google_reviews,
//   click_phone, click_email, filter_projects.

type EventName =
  | 'view_service'
  | 'view_project'
  | 'view_location'
  | 'click_start_project'
  | 'click_whatsapp'
  | 'click_phone'
  | 'click_email'
  | 'click_google_reviews'
  | 'form_start'
  | 'form_submit'
  | 'form_abandon'
  | 'filter_projects';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID as string | undefined;

function hasConsent(): boolean {
  try {
    return localStorage.getItem('pbj_consent') === 'granted';
  } catch {
    return false;
  }
}

export function track(event: EventName, params: Record<string, string | number | boolean> = {}) {
  // Always dispatch locally so any future listener (or QA in devtools) can see it.
  document.dispatchEvent(new CustomEvent(`pbj:${event}`, { detail: params }));

  if (!GA_ID || !hasConsent() || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

export function initAnalytics() {
  if (!GA_ID || !hasConsent()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

/** Delegated click tracking for any element carrying data-analytics-event. */
export function bindDelegatedTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-analytics-event]');
    if (!el) return;
    const event = el.dataset.analyticsEvent as EventName | undefined;
    if (!event) return;
    const params = el.dataset.analyticsParams ? JSON.parse(el.dataset.analyticsParams) : {};
    track(event, params);
  });
}
