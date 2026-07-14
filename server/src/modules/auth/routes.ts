import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest } from "../../middleware/auth.js";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const rows = await query<{ id: string; password_hash: string; role: string }>(
    "SELECT id, password_hash, role FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role, email },
    process.env.JWT_SECRET || "changeme",
    { expiresIn: "8h" }
  );
  res.json({ token });
});

// POST /api/auth/users (solo admin crea usuarios internos)
authRouter.post("/users", verifyToken, requireRole("admin"), async (req: AuthedRequest, res) => {
  const { email, password, role, full_name } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const rows = await query(
    "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1,$2,$3,$4) RETURNING id, email, role",
    [email, password_hash, role, full_name]
  );
  res.status(201).json(rows[0]);
});
