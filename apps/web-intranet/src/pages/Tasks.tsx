import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });
  const [saving, setSaving] = useState(false);

  function load() {
    apiFetch("/intranet/tasks").then(setTasks).catch(() => setTasks([]));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // assigned_to debería salir del usuario logueado (JWT); de momento se auto-asigna en el backend.
      await apiFetch("/intranet/tasks", { method: "POST", body: JSON.stringify(form) });
      setForm({ title: "", description: "", due_date: "" });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(t: Task) {
    const status = t.status === "completada" ? "pendiente" : "completada";
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
    // TODO: exponer PATCH /api/intranet/tasks/:id en el backend cuando se cierre el flujo de tareas
  }

  return (
    <main className="page">
      <h2>Mis tareas</h2>

      <form className="card form-inline" onSubmit={handleCreate}>
        <input required placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Añadir tarea"}</button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.status === "completada" ? "done" : ""}>
            <label>
              <input type="checkbox" checked={t.status === "completada"} onChange={() => toggleDone(t)} />
              <span>{t.title}</span>
            </label>
            {t.due_date && <span className="due">vence {t.due_date}</span>}
          </li>
        ))}
        {tasks.length === 0 && <li className="empty">Sin tareas todavía.</li>}
      </ul>
    </main>
  );
}
