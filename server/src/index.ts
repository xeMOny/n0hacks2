import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/routes.js";
import { lmsRouter } from "./modules/lms/routes.js";
import { crmRouter } from "./modules/crm/routes.js";
import { intranetRouter } from "./modules/intranet/routes.js";
import { chatRouter } from "./modules/chat/routes.js";

const app = express();

// Detrás de nginx (reverse proxy): sin esto, req.ip y X-Forwarded-For
// siempre serían los del contenedor de nginx, rompiendo el rate limiting
// y cualquier log/auditoría por IP real del cliente.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limiting específico para auth: son los endpoints objetivo de fuerza
// bruta / credential stuffing / enumeración de usuarios.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, inténtalo más tarde" },
});
app.use("/api/auth", authLimiter);

// Límite más laxo para el resto de la API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Rate limiting específico para el chat: es un endpoint público sin login
// que llama a la API de Anthropic, así que cada request tiene coste real en
// tokens. Más estricto que el límite general para acotar el gasto ante abuso
// o un bot haciendo scraping del formulario.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados mensajes, inténtalo de nuevo más tarde" },
});
app.use("/api/chat", chatLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/lms", lmsRouter);
app.use("/api/crm", crmRouter);
app.use("/api/intranet", intranetRouter);
app.use("/api/chat", chatRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "No encontrado" });
});

// Manejador de errores global: sin esto, una excepción en cualquier ruta
// async devuelve una respuesta colgada o el stack trace crudo de Express en
// vez de un 500 limpio. Nunca exponer err.stack/err.message al cliente.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(env.PORT, () => console.log(`Malta API escuchando en :${env.PORT} (${env.NODE_ENV})`));
