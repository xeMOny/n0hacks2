import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }
  return value;
}

function requiredMinLength(name: string, minLength: number): string {
  const value = required(name);
  if (value.length < minLength) {
    throw new Error(`${name} debe tener al menos ${minLength} caracteres (tiene ${value.length})`);
  }
  return value;
}

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// JWT_SECRET nunca tiene fallback: firmar/verificar tokens con un secreto
// adivinable (p.ej. "changeme") permite forjar tokens de admin.
const JWT_SECRET = requiredMinLength("JWT_SECRET", 32);

const DATABASE_URL = required("DATABASE_URL");

const PORT = Number(process.env.PORT) || 4000;

// CORS_ORIGIN: lista separada por comas de orígenes permitidos.
// Sin esto en producción, fallamos al arrancar en vez de abrir CORS a "*"
// (que sería incompatible con cookies credentialed de todos modos).
const CORS_ORIGIN = isProduction
  ? required("CORS_ORIGIN").split(",").map((o) => o.trim())
  : (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
      .split(",")
      .map((o) => o.trim());

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

// Chatbot de la landing: a diferencia de JWT_SECRET/DATABASE_URL, esto NO es
// fail-fast. Es una feature opcional de cara al público, no un requisito de
// seguridad del resto de la API — si falta la clave, /api/chat responde 503
// en vez de tumbar login/CRM/intranet al arrancar.
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || undefined;
const CHAT_MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5";

export const env = {
  NODE_ENV,
  isProduction,
  JWT_SECRET,
  DATABASE_URL,
  PORT,
  CORS_ORIGIN,
  COOKIE_DOMAIN,
  ANTHROPIC_API_KEY,
  CHAT_MODEL,
};
