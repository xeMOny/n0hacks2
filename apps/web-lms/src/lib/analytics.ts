import { hasConsent, onConsentChange } from "./cookieConsent";

// Google Analytics 4. Cargado bajo demanda, nunca de golpe al entrar en la
// web: el banner de cookies de este sitio ya distingue necesarias/analítica/
// marketing (ver cookieConsent.ts), así que GA4 solo se activa si el usuario
// ya dio consentimiento de "analítica", o en el momento en que lo da desde
// el banner — nunca antes.
const MEASUREMENT_ID = "G-B9SSG7JGC5";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

function loadGoogleAnalytics(): void {
  if (loaded) return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);
}

export function initAnalytics(): void {
  if (hasConsent("analytics")) {
    loadGoogleAnalytics();
  }
  onConsentChange((consent) => {
    if (consent.analytics) {
      loadGoogleAnalytics();
    }
  });
}
