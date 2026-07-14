# apps/web-lms

Frontend público + área privada de alumnos. Catálogo de cursos, login, matriculación, evaluaciones.

Stack: Vite + React + TypeScript + react-router-dom + framer-motion (instalado por defecto).
Consume la API en `server/` vía `src/api/client.ts` (`VITE_API_BASE`, por defecto `/api`).

Arrancar local: `npm install && npm run dev`
