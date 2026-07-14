import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { verifyToken, AuthedRequest } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";

export const intranetRouter = Router();
intranetRouter.use(verifyToken);

const roleSchema = z.enum(["admin", "profesor", "comercial", "gestor_andorra"]);

const documentSchema = z.object({
  title: z.string().trim().min(1),
  file_path: z.string().trim().min(1),
  folder: z.string().trim().optional(),
  visibility_role: roleSchema.optional(),
});

const taskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  assigned_to: z.string().uuid(),
  due_date: z.string().date().optional(),
});

// GET /api/intranet/documents
// El campo visibility_role existe para restringir por rol (algunos roles
// solo ven ciertas carpetas, admin ve todo) — antes la query lo ignoraba
// por completo y devolvía todos los documentos a cualquier usuario autenticado.
intranetRouter.get("/documents", async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT * FROM documents
     WHERE visibility_role IS NULL OR visibility_role = $1 OR $1 = 'admin'
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

// GET /api/intranet/tasks
intranetRouter.get("/tasks", async (req: AuthedRequest, res) => {
  const rows = await query("SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY due_date", [req.user!.id]);
  res.json(rows);
});

// POST /api/intranet/tasks
intranetRouter.post("/tasks", validateBody(taskSchema), async (req, res) => {
  const { title, description, assigned_to, due_date } = req.body as z.infer<typeof taskSchema>;
  const rows = await query(
    `INSERT INTO tasks (title, description, assigned_to, status, due_date)
     VALUES ($1,$2,$3,'pendiente',$4) RETURNING *`,
    [title, description, assigned_to, due_date]
  );
  res.status(201).json(rows[0]);
});
