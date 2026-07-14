import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

interface Assignee {
  id: string;
  full_name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  assignees: Assignee[];
}

interface Person {
  id: string;
  full_name: string;
  role: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState<{ title: string; description: string; due_date: string; assigned_to: string[] }>({
    title: "",
    description: "",
    due_date: "",
    assigned_to: [],
  });
  const [saving, setSaving] = useState(false);

  function load() {
    apiFetch("/intranet/tasks").then(setTasks).catch(() => setTasks([]));
  }

  useEffect(load, []);
  useEffect(() => {
    apiFetch("/auth/users").then(setPeople).catch(() => setPeople([]));
  }, []);

  function toggleAssignee(id: string) {
    setForm((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(id)
        ? prev.assigned_to.filter((x) => x !== id)
        : [...prev.assigned_to, id],
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (form.assigned_to.length === 0) return;
    setSaving(true);
    try {
      await apiFetch("/intranet/tasks", { method: "POST", body: JSON.stringify(form) });
      setForm({ title: "", description: "", due_date: "", assigned_to: [] });
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

      <form className="card" onSubmit={handleCreate}>
        <div className="form-inline">
          <input required placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        </div>

        <div style={{ marginTop: 10 }}>
          <p className="hint" style={{ marginBottom: 6 }}>
            Asignar a (individual o conjunta, elige una o varias personas):
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {people.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={form.assigned_to.includes(p.id)}
                  onChange={() => toggleAssignee(p.id)}
                />
                {p.full_name}
              </label>
            ))}
            {people.length === 0 && <span className="empty">Sin usuarios disponibles.</span>}
          </div>
        </div>

        <button type="submit" disabled={saving || form.assigned_to.length === 0} style={{ marginTop: 10 }}>
          {saving ? "Guardando..." : "Añadir tarea"}
        </button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.status === "completada" ? "done" : ""}>
            <label>
              <input type="checkbox" checked={t.status === "completada"} onChange={() => toggleDone(t)} />
              <span>{t.title}</span>
            </label>
            <span className="due">
              {t.assignees?.map((a) => a.full_name).join(", ")}
              {t.due_date && ` · vence ${t.due_date}`}
            </span>
          </li>
        ))}
        {tasks.length === 0 && <li className="empty">Sin tareas todavía.</li>}
      </ul>
    </main>
  );
}
