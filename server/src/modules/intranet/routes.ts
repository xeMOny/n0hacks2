import { Router } from "express";
import { z } from "zod";
import { query, withTransaction } from "../../db/pool.js";
import { verifyToken, AuthedRequest } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";

export const intranetRouter = Router();
intranetRouter.use(verifyToken);

const roleSchema = z.enum(["admin", "direccion", "profesor", "comercial", "gestor_andorra"]);

const documentSchema = z.object({
  title: z.string().trim().min(1),
  file_path: z.string().trim().min(1),
  folder: z.string().trim().optional(),
  visibility_role: roleSchema.optional(),
});

const taskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  // Antes una sola persona (columna assigned_to). El cliente confirmó que
  // las tareas pueden ser individuales O conjuntas ("depende de la tarea"),
  // así que ahora es siempre una lista (mínimo 1 persona).
  assigned_to: z.array(z.string().uuid()).min(1, "La tarea necesita al menos un asignado"),
  due_date: z.string().date().optional(),
});

// GET /api/intranet/documents
// El campo visibility_role existe para restringir por rol (algunos roles
// solo ven ciertas carpetas, admin/dirección ven todo).
intranetRouter.get("/documents", async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT * FROM documents
     WHERE visibility_role IS NULL OR visibility_role = $1 OR $1 IN ('admin', 'direccion')
     ORDER BY created_at DESC`,
    [req.user!.role]
  );
  res.json(rows);
});

// POST /api/intranet/documents
intranetRouter.post("/documents", validateBody(documentSchema), async (req: AuthedRequest, res) => {
  const { title, file_path, folder, visibility_role } = req.body as z.infer<typeof documentSchema>;
  const rows = await query(
    `INSERT INTO documents (title, file_path, folder, visibility_role, uploaded_by)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, file_path, folder, visibility_role, req.user!.id]
  );
  res.status(201).json(rows[0]);
});

// GET /api/intranet/tasks - tareas donde el usuario actual es uno de los asignados
intranetRouter.get("/tasks", async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT t.*, COALESCE(
       (SELECT json_agg(json_build_object('id', u.id, 'full_name', u.full_name))
        FROM task_assignees ta2 JOIN users u ON u.id = ta2.user_id
        WHERE ta2.task_id = t.id),
       '[]'
     ) AS assignees
     FROM tasks t
     JOIN task_assignees ta ON ta.task_id = t.id
     WHERE ta.user_id = $1
     ORDER BY t.due_date`,
    [req.user!.id]
  );
  res.json(rows);
});

// POST /api/intranet/tasks
intranetRouter.post("/tasks", validateBody(taskSchema), async (req, res) => {
  const { title, description, assigned_to, due_date } = req.body as z.infer<typeof taskSchema>;
  const task = await withTransaction(async (client) => {
    const taskRows = await client.query(
      `INSERT INTO tasks (title, description, status, due_date)
       VALUES ($1,$2,'pendiente',$3) RETURNING *`,
      [title, description, due_date]
    );
    const created = taskRows.rows[0];
    for (const userId of assigned_to) {
      await client.query("INSERT INTO task_assignees (task_id, user_id) VALUES ($1,$2)", [created.id, userId]);
    }
    return { ...created, assignees: assigned_to };
  });
  res.status(201).json(task);
});
