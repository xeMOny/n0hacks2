import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../db/pool.js";
import { verifyToken, requireRole, AuthedRequest, AUTH_COOKIE_NAME } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { env } from "../../config/env.js";

export const authRouter = Router();

const BCRYPT_ROUNDS = 12;
const SESSION_TTL = "8h";
const SESSION_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "direccion", "profesor", "comercial", "gestor_andorra"]),
  full_name: z.string().trim().min(1),
});

function setSessionCookie(res: import("express").Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "strict",
    maxAge: SESSION_COOKIE_MAX_AGE_MS,
    domain: env.COOKIE_DOMAIN,
    path: "/",
  });
}

// POST /api/auth/login
authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const rows = await query<{ id: string; password_hash: string; role: string }>(
    "SELECT id, password_hash, role FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];
  // Comparación siempre contra un hash (real o dummy) para no filtrar por
  // temporización si el email existe o no.
  const hashToCompare = user?.password_hash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv.";
  const valid = await bcrypt.compare(password, hashToCompare);
  if (!user || !valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: user.id, role: user.role, email }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: SESSION_TTL,
  });
  setSessionCookie(res, token);
  res.json({ user: { id: user.id, role: user.role, email } });
});

// POST /api/auth/logout
authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/", domain: env.COOKIE_DOMAIN });
  res.status(204).end();
});

// GET /api/auth/me
authRouter.get("/me", verifyToken, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/users - listado mínimo (id/nombre/rol) para selectores de
// asignación (p.ej. elegir a quién asignar una tarea de la Intranet).
// Nunca expone email ni password_hash: solo lo necesario para un selector.
authRouter.get("/users", verifyToken, async (_req, res) => {
  const rows = await query("SELECT id, full_name, role FROM users ORDER BY full_name");
  res.json(rows);
});

// POST /api/auth/users (solo admin crea usuarios internos)
authRouter.post(
  "/users",
  verifyToken,
  requireRole("admin"),
  validateBody(createUserSchema),
  async (req: AuthedRequest, res) => {
    const { email, password, role, full_name } = req.body as z.infer<typeof createUserSchema>;
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    try {
      const rows = await query(
        "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1,$2,$3,$4) RETURNING id, email, role",
        [email, password_hash, role, full_name]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      if ((err as { code?: string }).code === "23505") {
        return res.status(409).json({ error: "Ya existe un usuario con ese email" });
      }
      throw err;
    }
  }
);
