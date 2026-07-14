import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../api/client";

interface Lead {
  id: string;
  name: string;
  territory: "malta" | "andorra";
  stage: string;
}

// Pendiente de confirmar con el cliente (ver cuestionario CRM, pregunta 1).
// Etapas provisionales basadas en un flujo de venta educativo típico.
const STAGES = [
  { key: "nuevo", label: "Nuevo" },
  { key: "contactado", label: "Contactado" },
  { key: "cualificado", label: "Cualificado" },
  { key: "propuesta", label: "Propuesta enviada" },
  { key: "matriculado", label: "Matriculado" },
  { key: "perdido", label: "Perdido" },
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    apiFetch("/crm/leads").then(setLeads).catch(() => setLeads([]));
  }, []);

  async function move(id: string, stage: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    await apiFetch(`/crm/leads/${id}`, { method: "PATCH", body: JSON.stringify({ stage }) });
  }

  return (
    <main className="page">
      <h2>Pipeline</h2>
      <p className="hint">Etapas provisionales. Se ajustan al cerrar el cuestionario con el cliente.</p>
      <div className="kanban">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.key);
          return (
            <div key={stage.key} className="kanban-column">
              <h3>{stage.label} <span className="count">{stageLeads.length}</span></h3>
              {stageLeads.map((l) => (
                <motion.div
                  key={l.id}
                  layout
                  className="kanban-card"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <strong>{l.name}</strong>
                  <span className="badge">{l.territory}</span>
                  <select value={stage.key} onChange={(e) => move(l.id, e.target.value)}>
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}
