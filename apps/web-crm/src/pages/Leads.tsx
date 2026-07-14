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
}

const STAGES = ["nuevo", "contactado", "cualificado", "propuesta", "matriculado", "perdido"];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [territory, setTerritory] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "", territory: "malta" });
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
      setForm({ name: "", email: "", phone: "", source: "", territory: "malta" });
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
          <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Territorio</th><th>Origen</th><th>Etapa</th></tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.phone}</td>
              <td>{l.territory}</td>
              <td>{l.source}</td>
              <td>
                <select value={l.stage} onChange={(e) => handleStageChange(l.id, e.target.value)}>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan={6} className="empty">Sin leads todavía.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
