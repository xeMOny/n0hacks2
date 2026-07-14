import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CourseCatalog from "./pages/CourseCatalog";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import CookieConsent from "./components/CookieConsent";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Inicio</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/mi-area">Mi área</Link>
        <Link to="/login">Acceder</Link>
      </nav>
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
      <CookieConsent />
    </div>
  );
}
