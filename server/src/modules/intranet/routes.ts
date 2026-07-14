import { Router } from "express";
import { query } from "../../db/pool.js";
import { verifyToken, AuthedRequest } from "../../middleware/auth.js";

export const intranetRouter = Router();
intranetRouter.use(verifyToken);

// GET /api/intranet/documents
intranetRouter.get("/documents", async (_req, res) => {
  const rows = await query("SELECT * FROM documents ORDER BY created_at DESC");
  res.json(rows);
});

// POST /api/intranet/documents
intranetRouter.post("/documents", async (req: AuthedRequest, res) => {
  const { title, file_path, folder, visibility_role } = req.body;
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
intranetRouter.post("/tasks", async (req, res) => {
  const { title, description, assigned_to, due_date } = req.body;
  const rows = await query(
    `INSERT INTO tasks (title, description, assigned_to, status, due_date)
     VALUES ($1,$2,$3,'pendiente',$4) RETURNING *`,
    [title, description, assigned_to, due_date]
  );
  res.status(201).json(rows[0]);
});
