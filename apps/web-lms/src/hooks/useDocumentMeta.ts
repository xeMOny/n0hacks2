import { useEffect } from "react";

/**
 * Antes cada ruta se quedaba con el <title> y el <link rel="canonical"> fijos
 * del index.html estático (siempre los de la home) — daba igual porque las
 * páginas legales devolvían 404 real. Ahora que scripts/prerender.mjs las
 * convierte en HTML estático real con 200, un canonical apuntando siempre a
 * la home le diría a Google "no indexes esta página, indexa la home en su
 * lugar" — justo lo contrario de lo que se busca. Este hook actualiza ambos
 * por ruta, tanto en el snapshot del prerender como en la navegación normal
 * dentro de la SPA.
 */
export function useDocumentMeta(title: string, canonicalPath: string) {
  useEffect(() => {
    document.title = title;

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `https://uclcampus.com${canonicalPath}`);
  }, [title, canonicalPath]);
}
