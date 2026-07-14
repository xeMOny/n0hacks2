import { Router } from "express";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest } from "../../middleware/auth.js";

export const crmRouter = Router();
crmRouter.use(verifyToken, requireRole("admin", "comercial", "gestor_andorra"));

// GET /api/crm/leads?territory=malta|andorra
crmRouter.get("/leads", async (req: AuthedRequest, res) => {
  const { territory } = req.query;
  const rows = territory
    ? await query("SELECT * FROM leads WHERE territory = $1 ORDER BY created_at DESC", [territory])
    : await query("SELECT * FROM leads ORDER BY created_at DESC");
  res.json(rows);
});

// POST /api/crm/leads
crmRouter.post("/leads", async (req, res) => {
  const { name, email, phone, source, territory, assigned_to } = req.body;
  const rows = await query(
    `INSERT INTO leads (name, email, phone, source, territory, stage, assigned_to)
     VALUES ($1,$2,$3,$4,$5,'nuevo',$6) RETURNING *`,
    [name, email, phone, source, territory, assigned_to]
  );
  res.status(201).json(rows[0]);
});

// PATCH /api/crm/leads/:id - mover de etapa en el pipeline
crmRouter.patch("/leads/:id", async (req, res) => {
  const { stage } = req.body;
  const rows = await query(
    "UPDATE leads SET stage = $1, updated_at = now() WHERE id = $2 RETURNING *",
    [stage, req.params.id]
  );
  res.json(rows[0]);
});
