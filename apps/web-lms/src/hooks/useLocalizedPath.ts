import { useLocation } from "react-router-dom";
import { langFromPath, localizedPath } from "../i18n/urlLang";

/**
 * Devuelve un helper que añade a una ruta pública el prefijo de idioma de la
 * URL actual: en /en/privacidad/, lp("/") -> "/en/". Así los enlaces internos
 * entre páginas públicas no sacan al visitante de su variante de idioma (ni
 * al bot que sigue los enlaces del HTML prerenderizado).
 */
export function useLocalizedPath() {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return (basePath: string) => localizedPath(basePath, lang);
}
