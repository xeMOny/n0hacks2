import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";

export const lmsRouter = Router();

const courseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  price: z.number().nonnegative(),
  // "Cada título tiene un precio distinto y unas características distintas"
  // (respuesta del cliente): de momento modalidad + nivel.
  mode: z.enum(["online", "hybrid"]),
  level: z.enum(["degree", "postgrad"]),
});

const enrollmentSchema = z.object({
  course_id: z.string().uuid(),
});

// GET /api/lms/courses - catálogo público
lmsRouter.get("/courses", async (_req, res) => {
  const rows = await query(
    "SELECT id, title, description, price, mode, level FROM courses WHERE published = true"
  );
  res.json(rows);
});

// POST /api/lms/courses - admin/profesor/dirección
lmsRouter.post(
  "/courses",
  verifyToken,
  requireRole("admin", "direccion", "profesor"),
  validateBody(courseSchema),
  async (req, res) => {
    const { title, description, price, mode, level } = req.body as z.infer<typeof courseSchema>;
    const rows = await query(
      "INSERT INTO courses (title, description, price, mode, level, published) VALUES ($1,$2,$3,$4,$5,false) RETURNING *",
      [title, description, price, mode, level]
    );
    res.status(201).json(rows[0]);
  }
);

// GET /api/lms/me/courses - área privada del alumno
lmsRouter.get("/me/courses", verifyToken, async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT c.id, c.title, e.status
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1`,
    [req.user!.id]
  );
  res.json(rows);
});

// POST /api/lms/enrollments
lmsRouter.post("/enrollments", verifyToken, validateBody(enrollmentSchema), async (req: AuthedRequest, res) => {
  const { course_id } = req.body as z.infer<typeof enrollmentSchema>;
  const rows = await query(
    "INSERT INTO enrollments (user_id, course_id, status) VALUES ($1,$2,'active') RETURNING *",
    [req.user!.id, course_id]
  );
  res.status(201).json(rows[0]);
});
