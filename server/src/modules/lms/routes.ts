import { Router } from "express";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest } from "../../middleware/auth.js";

export const lmsRouter = Router();

// GET /api/lms/courses - catálogo público
lmsRouter.get("/courses", async (_req, res) => {
  const rows = await query("SELECT id, title, description, price FROM courses WHERE published = true");
  res.json(rows);
});

// POST /api/lms/courses - admin/profesor
lmsRouter.post("/courses", verifyToken, requireRole("admin", "profesor"), async (req, res) => {
  const { title, description, price } = req.body;
  const rows = await query(
    "INSERT INTO courses (title, description, price, published) VALUES ($1,$2,$3,false) RETURNING *",
    [title, description, price]
  );
  res.status(201).json(rows[0]);
});

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
lmsRouter.post("/enrollments", verifyToken, async (req: AuthedRequest, res) => {
  const { course_id } = req.body;
  const rows = await query(
    "INSERT INTO enrollments (user_id, course_id, status) VALUES ($1,$2,'active') RETURNING *",
    [req.user!.id, course_id]
  );
  res.status(201).json(rows[0]);
});
