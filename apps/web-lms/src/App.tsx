import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import CookieConsent from "./components/CookieConsent";
import { PREFIXED_LANGUAGES, stripLangPrefix } from "./i18n/urlLang";
import type { SupportedLanguage } from "./i18n";

// Rutas secundarias cargadas bajo demanda: la mayoría de visitas solo ven "/",
// así que su código no debe formar parte del bundle inicial de la landing.
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const Login = lazy(() => import("./pages/Login"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const AccessibilityStatement = lazy(() => import("./pages/AccessibilityStatement"));

// Rutas que ya tienen su propia cabecera/navegación real (la home y las 4
// páginas legales, todas con LegalPageLayout y su enlace "volver al inicio").
// Este nav plano solo hace falta en las rutas que todavía no tienen chrome
// propio (catálogo, área alumno, login) — sin esto se veían dos cabeceras
// apiladas, una de ellas sin estilo, en cualquier página que ya tuviera la suya.
const ROUTES_WITH_OWN_CHROME = ["/", "/cookies", "/privacidad", "/aviso-legal", "/accesibilidad"];

function InternalNav() {
  const location = useLocation();
  // Normaliza antes de comparar: en producción las URLs llevan barra final
  // (GitHub Pages redirige /privacidad -> /privacidad/) y pueden llevar
  // prefijo de idioma (/en/privacidad/) — la comparación literal dejaba
  // pasar este nav de debug a las páginas legales prerenderizadas.
  const base = stripLangPrefix(location.pathname).replace(/(.)\/$/, "$1");
  if (ROUTES_WITH_OWN_CHROME.includes(base)) return null;
  return (
    <nav style={{ display: "flex", gap: 16, padding: 16 }}>
      <Link to="/">Inicio</Link>
      <Link to="/cursos">Cursos</Link>
      <Link to="/mi-area">Mi área</Link>
      <Link to="/login">Acceder</Link>
    </nav>
  );
}

// Fija el idioma que la URL declara (p.ej. /en/* siempre en inglés): la URL
// es el contrato con Google — cada variante hreflang tiene que renderizar
// SIEMPRE su idioma, gane lo que gane el detector (localStorage/navigator).
function ForceLang({ lang, children }: { lang: SupportedLanguage; children: ReactNode }) {
  const { i18n } = useTranslation();
  const mismatch = i18n.resolvedLanguage !== lang;
  useEffect(() => {
    if (i18n.resolvedLanguage !== lang) i18n.changeLanguage(lang);
    // Deps deliberadamente SIN el idioma activo: este efecto solo debe
    // dispararse al entrar en la ruta (o al cambiar de variante de idioma),
    // nunca re-forzar contra un cambio que acaba de iniciar el usuario en el
    // switcher — eso revertía la elección durante el desmontaje.
  }, [i18n, lang]);
  // No renderizar con el idioma equivocado ni un frame: el prerender captura
  // el primer pintado estable, y el flash del idioma anterior tampoco aporta
  // nada a un visitante real.
  if (mismatch) return null;
  return children;
}

function publicRoutes(lang?: SupportedLanguage) {
  const wrap = (el: ReactNode) => (lang ? <ForceLang lang={lang}>{el}</ForceLang> : el);
  return (
    <>
      <Route index element={wrap(<Home />)} />
      <Route path="cookies" element={wrap(<CookiePolicy />)} />
      <Route path="privacidad" element={wrap(<PrivacyPolicy />)} />
      <Route path="aviso-legal" element={wrap(<LegalNotice />)} />
      <Route path="accesibilidad" element={wrap(<AccessibilityStatement />)} />
    </>
  );
}

export default function App() {
  return (
    <div>
      <InternalNav />
      <main>
        <Suspense fallback={null}>
          <Routes>
            {/* Raíz: español por defecto (o el idioma ya elegido por el
                visitante vía localStorage) + rutas internas de la app */}
            <Route path="/">
              {publicRoutes()}
              <Route path="cursos" element={<CourseCatalog />} />
              <Route path="mi-area" element={<StudentDashboard />} />
              <Route path="login" element={<Login />} />
            </Route>
            {/* Variantes de idioma con URL propia: /en, /fr, /it */}
            {PREFIXED_LANGUAGES.map((lang) => (
              <Route key={lang} path={`/${lang}`}>
                {publicRoutes(lang)}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </main>
      <CookieConsent />
    </div>
  );
}
