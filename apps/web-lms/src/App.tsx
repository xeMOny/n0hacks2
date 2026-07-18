import { Suspense, lazy } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CookieConsent from "./components/CookieConsent";

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
  if (ROUTES_WITH_OWN_CHROME.includes(location.pathname)) return null;
  return (
    <nav style={{ display: "flex", gap: 16, padding: 16 }}>
      <Link to="/">Inicio</Link>
      <Link to="/cursos">Cursos</Link>
      <Link to="/mi-area">Mi área</Link>
      <Link to="/login">Acceder</Link>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <InternalNav />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<CourseCatalog />} />
            <Route path="/mi-area" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/aviso-legal" element={<LegalNotice />} />
            <Route path="/accesibilidad" element={<AccessibilityStatement />} />
          </Routes>
        </Suspense>
      </main>
      <CookieConsent />
    </div>
  );
}
