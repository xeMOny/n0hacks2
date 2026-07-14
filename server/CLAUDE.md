# server/ · API Malta Campus

Backend único (Node.js + Express + TypeScript) que sirve a los 3 frontends (LMS, CRM, Intranet) sobre una sola base PostgreSQL.

- `src/modules/{lms,crm,intranet,auth}` — rutas por dominio, montadas en `/api/<modulo>`
- `src/middleware/auth.ts` — JWT + control de acceso por rol (admin, profesor, comercial, gestor_andorra, alumno)
- `src/db/pool.ts` — conexión pg (node-postgres), sin ORM
- `postgres/schema.sql` — schema inicial, placeholder. Pendiente cerrar con el usuario: campos exactos del CRM y estructura de roles de la Intranet (ver "Próximos pasos" en CLAUDE.md raíz)

Arrancar local: `npm install && cp .env.example .env && npm run dev` (requiere Postgres corriendo, ver `infra/docker-compose.yml`).
