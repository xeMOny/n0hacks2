import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./index";

// El español vive en la raíz (dominio .com con público principal español);
// el resto de idiomas tienen prefijo de URL propio (/en, /fr, /it) para que
// cada versión sea una URL real indexable con su propio hreflang. Sin esto,
// Google solo ve UNA versión por página — y además la que bakea el prerender
// del CI, cuyo Chrome es en-US (así acabó la home indexada en inglés).
export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const PREFIXED_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (l): l is SupportedLanguage => l !== DEFAULT_LANGUAGE,
);

// Rutas públicas que existen en los 4 idiomas (con barra final: es la URL
// que responde 200 directa en GitHub Pages). Las rutas internas de la app
// (login, mi-area, cursos) no se localizan: dependen del backend y están
// bloqueadas en robots.txt.
export const PUBLIC_PATHS = ["/", "/privacidad/", "/aviso-legal/", "/cookies/", "/accesibilidad/"];

export function langFromPath(pathname: string): SupportedLanguage {
  const seg = pathname.split("/")[1];
  return (PREFIXED_LANGUAGES as string[]).includes(seg)
    ? (seg as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/** Quita el prefijo de idioma si lo hay: "/en/privacidad" -> "/privacidad" */
export function stripLangPrefix(pathname: string): string {
  const lang = langFromPath(pathname);
  if (lang === DEFAULT_LANGUAGE) return pathname;
  const rest = pathname.slice(lang.length + 1);
  return rest === "" ? "/" : rest;
}

/** "/privacidad/" + "en" -> "/en/privacidad/"; el español queda sin prefijo */
export function localizedPath(basePath: string, lang: SupportedLanguage): string {
  if (lang === DEFAULT_LANGUAGE) return basePath;
  return basePath === "/" ? `/${lang}/` : `/${lang}${basePath}`;
}

export function isPublicPath(basePath: string): boolean {
  const normalized = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return PUBLIC_PATHS.includes(normalized);
}
