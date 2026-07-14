import { Pool, PoolClient } from "pg";
import { env } from "../config/env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Managed Postgres (RDS, Neon, DigitalOcean, etc.) suelen exigir TLS con
  // certificado no verificado por la CA del sistema; en un VPS propio con
  // Postgres en la misma red docker esto no aplica y se puede desactivar
  // vía DATABASE_SSL=false.
  ssl: env.isProduction && process.env.DATABASE_SSL !== "false" ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Sin este handler, un error en un cliente idle del pool (p.ej. la DB
// reinicia la conexión) es una excepción no capturada que tumba el proceso
// entero de Node. Con esto, se loguea y el pool sigue sirviendo.
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de Postgres:", err);
});

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

// Para operaciones multi-insert que deben ser atómicas (p.ej. crear una
// tarea + insertar sus varios asignados): sin esto, un fallo a mitad de
// camino deja una tarea sin asignados, o asignados de una tarea inexistente.
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
