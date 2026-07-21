import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "../i18n";
import { DEFAULT_LANGUAGE, isPublicPath, langFromPath, localizedPath } from "../i18n/urlLang";

const ORIGIN = "https://uclcampus.com";

/**
 * Antes cada ruta se quedaba con el <title> y el <link rel="canonical"> fijos
 * del index.html estático (siempre los de la home) — daba igual porque las
 * páginas legales devolvían 404 real. Ahora que scripts/prerender.mjs las
 * convierte en HTML estático real con 200, un canonical apuntando siempre a
 * la home le diría a Google "no indexes esta página, indexa la home en su
 * lugar" — justo lo contrario de lo que se busca. Este hook actualiza ambos
 * por ruta, tanto en el snapshot del prerender como en la navegación normal
 * dentro de la SPA.
 *
 * Con las URLs por idioma (/en, /fr, /it) además:
 * - el canonical apunta a la variante de idioma de la URL actual (derivada
 *   del pathname, no del idioma activo: es lo que un bot debe ver), y
 * - cada ruta pública declara sus alternates hreflang (uno por idioma más
 *   x-default apuntando al español, el idioma de la raíz).
 */
export function useDocumentMeta(title: string, canonicalPath: string, description?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title;

    const urlLang = langFromPath(pathname);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${ORIGIN}${localizedPath(canonicalPath, urlLang)}`);

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    if (isPublicPath(canonicalPath)) {
      for (const lang of [...SUPPORTED_LANGUAGES, "x-default"] as const) {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = lang;
        link.href = `${ORIGIN}${localizedPath(canonicalPath, lang === "x-default" ? DEFAULT_LANGUAGE : lang)}`;
        document.head.appendChild(link);
      }
    }

    if (description) {
      document.head.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, canonicalPath, description, pathname]);
}
