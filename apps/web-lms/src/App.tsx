import { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Inicio</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/mi-area">Mi área</Link>
        <Link to="/login">Acceder</Link>
      </nav>
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
      <CookieConsent />
    </div>
  );
}
