// Crea el primer usuario admin si todavía no existe ninguno.
// Sin esto, POST /api/auth/users (que requiere rol admin) no se puede llamar nunca
// en una base de datos nueva: nadie podría crear el primer usuario. Idempotente:
// si ya hay un admin, no hace nada (seguro de re-ejecutar).
//
// Uso:
//   ADMIN_EMAIL=admin@uclcampus.com ADMIN_PASSWORD=xxxx npm run seed:admin
//
// En Docker (una vez desplegado):
//   docker compose run --rm -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... api npm run seed:admin

import bcrypt from "bcryptjs";
import "dotenv/config";

export interface DbLike {
  query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
}

export async function ensureAdmin(
  db: DbLike,
  opts: { email: string; password: string; fullName?: string }
): Promise<{ created: boolean; email: string }> {
  if (!opts.email || !opts.password) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios");
  }
  if (opts.password.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
  }

  const existing = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (existing.rows.length > 0) {
    return { created: false, email: opts.email };
  }

  const password_hash = await bcrypt.hash(opts.password, 10);
  await db.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [opts.email, password_hash, opts.fullName || "Administrador"]
  );

  return { created: true, email: opts.email };
}

// Entrypoint CLI — solo se ejecuta si el archivo se llama directamente (no al importarlo en tests)
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const { pool } = await import("../db/pool.js");
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || "";
  const fullName = process.env.ADMIN_NAME || "Administrador";

  try {
    const result = await ensureAdmin(pool, { email, password, fullName });
    if (result.created) {
      console.log(`Admin creado: ${result.email}`);
    } else {
      console.log("Ya existe un admin — no se ha creado ninguno nuevo.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error creando admin:", (err as Error).message);
    process.exit(1);
  }
}
