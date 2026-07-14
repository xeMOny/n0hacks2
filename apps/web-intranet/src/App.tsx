import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/documentos">Documentos</Link>
        <Link to="/tareas">Tareas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/tareas" element={<Tasks />} />
      </Routes>
    </div>
  );
}
