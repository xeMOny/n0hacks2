export type ConsentCategory = "analytics" | "marketing";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = "malta_cookie_consent";
const OPEN_SETTINGS_EVENT = "cookie-settings:open";
const CHANGE_EVENT = "cookie-consent:change";

export function getConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): void {
  const consent: CookieConsent = {
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage no disponible (modo privado, cuota llena, etc.). El
    // banner reaparecerá en la siguiente visita, comportamiento aceptable.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: consent }));
}

// Comprueba si una categoría concreta tiene consentimiento. Cualquier script
// de terceros (analítica, marketing) debe consultarlo ANTES de cargarse.
// Hoy no hay ninguno integrado, pero el mecanismo debe existir antes de
// añadir el primero, no después.
export function hasConsent(category: ConsentCategory): boolean {
  return getConsent()?.[category] === true;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(handler: () => void): () => void {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
}

export function onConsentChange(handler: (consent: CookieConsent) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<CookieConsent>).detail);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
