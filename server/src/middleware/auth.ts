import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type Role = "admin" | "profesor" | "comercial" | "gestor_andorra";

export interface AuthedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

export const AUTH_COOKIE_NAME = "malta_session";

function extractToken(req: Request): string | undefined {
  // Cookie httpOnly primero (flujo normal del navegador).
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[AUTH_COOKIE_NAME];
  if (cookieToken) return cookieToken;

  // Authorization: Bearer como fallback para clientes no-navegador (scripts, health checks, integraciones).
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);

  return undefined;
}

export function verifyToken(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    // Pinear el algoritmo evita ataques de confusión de algoritmo (alg=none,
    // o forzar RS256->HS256 usando la clave pública como secreto HMAC).
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] }) as AuthedRequest["user"];
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
