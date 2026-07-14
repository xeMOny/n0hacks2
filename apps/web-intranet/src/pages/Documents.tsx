import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

interface Doc {
  id: string;
  title: string;
  folder: string;
  file_path: string;
}

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [form, setForm] = useState({ title: "", folder: "", file_path: "", visibility_role: "" });
  const [saving, setSaving] = useState(false);

  function load() {
    apiFetch("/intranet/documents").then(setDocs).catch(() => setDocs([]));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Nota: sin almacenamiento de ficheros real todavía — file_path es un campo de texto
      // (ruta o URL) hasta que se decida el proveedor de storage (S3/VPS local).
      await apiFetch("/intranet/documents", { method: "POST", body: JSON.stringify(form) });
      setForm({ title: "", folder: "", file_path: "", visibility_role: "" });
      load();
    } finally {
      setSaving(false);
    }
  }

  const byFolder = docs.reduce<Record<string, Doc[]>>((acc, d) => {
    const key = d.folder || "Sin carpeta";
    (acc[key] ||= []).push(d);
    return acc;
  }, {});

  return (
    <main className="page">
      <h2>Documentos</h2>

      <form className="card form-inline" onSubmit={handleCreate}>
        <input required placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Carpeta" value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} />
        <input required placeholder="Ruta / URL del archivo" value={form.file_path} onChange={(e) => setForm({ ...form, file_path: e.target.value })} />
        <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Añadir documento"}</button>
      </form>

      {Object.keys(byFolder).length === 0 && <p className="empty">Sin documentos todavía.</p>}
      {Object.entries(byFolder).map(([folder, items]) => (
        <div key={folder} className="card">
          <h3>{folder}</h3>
          <ul>
            {items.map((d) => (
              <li key={d.id}><a href={d.file_path} target="_blank" rel="noreferrer">{d.title}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
