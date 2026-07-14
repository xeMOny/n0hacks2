import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: "malta" | "andorra";
  stage: string;
  source: string;
  marketing_consent: boolean;
}

// Etapas reales del proceso de venta (respuesta del cliente): contacto
// inicial -> se da información -> matrícula por la web -> administración
// envía el contrato. Deben coincidir exactamente con el enum del backend
// (server/src/modules/crm/routes.ts) o el PATCH de etapa se rechaza.
const STAGES: { value: string; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "info", label: "Información dada" },
  { value: "matricula_web", label: "Matrícula (web)" },
  { value: "contrato", label: "Contrato enviado" },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [territory, setTerritory] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    territory: "malta",
    marketing_consent: false,
  });
  const [saving, setSaving] = useState(false);

  function load() {
    const qs = territory ? `?territory=${territory}` : "";
    apiFetch(`/crm/leads${qs}`).then(setLeads).catch(() => setLeads([]));
  }

  useEffect(load, [territory]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/crm/leads", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", email: "", phone: "", source: "", territory: "malta", marketing_consent: false });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleStageChange(id: string, stage: string) {
    await apiFetch(`/crm/leads/${id}`, { method: "PATCH", body: JSON.stringify({ stage }) });
    load();
  }

  return (
    <main className="page">
      <h2>Leads</h2>

      <form className="card form-inline" onSubmit={handleCreate}>
        <input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Origen (ads, referido...)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <select value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })}>
          <option value="malta">Malta</option>
          <option value="andorra">Andorra</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={form.marketing_consent}
            onChange={(e) => setForm({ ...form, marketing_consent: e.target.checked })}
          />
          Consiente email marketing (RGPD)
        </label>
        <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Añadir lead"}</button>
      </form>

      <div className="toolbar">
        <select value={territory} onChange={(e) => setTerritory(e.target.value)}>
          <option value="">Todos los territorios</option>
          <option value="malta">Malta</option>
          <option value="andorra">Andorra</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Territorio</th><th>Origen</th><th>Marketing</th><th>Etapa</th></tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.phone}</td>
              <td>{l.territory}</td>
              <td>{l.source}</td>
              <td>{l.marketing_consent ? "Sí" : "No"}</td>
              <td>
                <select value={l.stage} onChange={(e) => handleStageChange(l.id, e.target.value)}>
                  {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan={7} className="empty">Sin leads todavía.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
