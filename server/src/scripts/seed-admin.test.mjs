// Test manual del script de bootstrap, sin Postgres real (mock de db.query).
// Se ejecuta contra el JS compilado en dist/.
import assert from "node:assert/strict";
import { ensureAdmin } from "../../dist/scripts/seed-admin.js";

async function run() {
  // Caso 1: no hay admin todavía -> debe crear uno
  {
    const inserted = [];
    const db = {
      query: async (text, params) => {
        if (text.includes("SELECT id FROM users")) return { rows: [] };
        if (text.includes("INSERT INTO users")) {
          inserted.push(params);
          return { rows: [] };
        }
        throw new Error("query inesperada: " + text);
      },
    };
    const result = await ensureAdmin(db, { email: "admin@uclcampus.com", password: "supersecreta" });
    assert.equal(result.created, true);
    assert.equal(inserted.length, 1);
    assert.equal(inserted[0][0], "admin@uclcampus.com");
    assert.equal(inserted[0][2], "Administrador");
    console.log("OK: crea admin cuando no existe ninguno");
  }

  // Caso 2: ya existe un admin -> no debe insertar nada (idempotente)
  {
    let insertCalled = false;
    const db = {
      query: async (text) => {
        if (text.includes("SELECT id FROM users")) return { rows: [{ id: "existing-id" }] };
        if (text.includes("INSERT INTO users")) { insertCalled = true; return { rows: [] }; }
        throw new Error("query inesperada: " + text);
      },
    };
    const result = await ensureAdmin(db, { email: "otro@uclcampus.com", password: "supersecreta" });
    assert.equal(result.created, false);
    assert.equal(insertCalled, false);
    console.log("OK: no crea un segundo admin si ya existe uno (idempotente)");
  }

  // Caso 3: password demasiado corta -> debe rechazar antes de tocar la DB
  {
    let dbTouched = false;
    const db = { query: async () => { dbTouched = true; return { rows: [] }; } };
    await assert.rejects(() => ensureAdmin(db, { email: "a@b.com", password: "corta" }));
    assert.equal(dbTouched, false);
    console.log("OK: rechaza password < 8 caracteres sin tocar la DB");
  }

  // Caso 4: falta email -> debe rechazar
  {
    const db = { query: async () => ({ rows: [] }) };
    await assert.rejects(() => ensureAdmin(db, { email: "", password: "supersecreta" }));
    console.log("OK: rechaza email vacío");
  }

  console.log("\nTodos los casos pasaron.");
}

run().catch((err) => {
  console.error("FALLO:", err);
  process.exit(1);
});
