import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";

export const crmRouter = Router();
crmRouter.use(verifyToken, requireRole("admin", "comercial", "gestor_andorra"));

const territorySchema = z.enum(["malta", "andorra"]);

const leadSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email().optional(),
  phone: z.string().trim().optional(),
  source: z.string().trim().optional(),
  territory: territorySchema,
  assigned_to: z.string().uuid().optional(),
});

const stageSchema = z.object({
  stage: z.enum(["nuevo", "info", "matricula_web", "contrato"]),
});

// GET /api/crm/leads?territory=malta|andorra
crmRouter.get("/leads", async (req: AuthedRequest, res) => {
  const parsed = territorySchema.optional().safeParse(req.query.territory);
  if (!parsed.success) {
    return res.status(400).json({ error: "territory debe ser 'malta' o 'andorra'" });
  }
  const territory = parsed.data;
  const rows = territory
    ? await query("SELECT * FROM leads WHERE territory = $1 ORDER BY created_at DESC", [territory])
    : await query("SELECT * FROM leads ORDER BY created_at DESC");
  res.json(rows);
});

// POST /api/crm/leads
crmRouter.post("/leads", validateBody(leadSchema), async (req, res) => {
  const { name, email, phone, source, territory, assigned_to } = req.body as z.infer<typeof leadSchema>;
  const rows = await query(
    `INSERT INTO leads (name, email, phone, source, territory, stage, assigned_to)
     VALUES ($1,$2,$3,$4,$5,'nuevo',$6) RETURNING *`,
    [name, email, phone, source, territory, assigned_to]
  );
  res.status(201).json(rows[0]);
});

// PATCH /api/crm/leads/:id - mover de etapa en el pipeline
crmRouter.patch("/leads/:id", validateBody(stageSchema), async (req, res) => {
  const idParsed = z.string().uuid().safeParse(req.params.id);
  if (!idParsed.success) {
    return res.status(400).json({ error: "id inválido" });
  }
  const { stage } = req.body as z.infer<typeof stageSchema>;
  const rows = await query(
    "UPDATE leads SET stage = $1, updated_at = now() WHERE id = $2 RETURNING *",
    [stage, idParsed.data]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: "Lead no encontrado" });
  }
  res.json(rows[0]);
});
